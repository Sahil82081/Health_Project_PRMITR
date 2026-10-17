import json
import re
import sys
from collections import defaultdict
from pathlib import Path

import torch
import torch.nn as nn
import torchvision.models as tv_models
from PIL import Image
from torchvision import transforms


# ---------------------------------------------------------
# Paths / defaults
# ---------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "best_model.pth"
CLASSES_PATH = BASE_DIR / "classes.json"  # optional fallback

DEFAULT_IMG_SIZE = 224  # used only if the checkpoint has no "img_size"

# Blocks per stage for torchvision EfficientNet variants (used to auto-detect)
TV_SIGNATURES = {
    "efficientnet_b0": (1, 2, 2, 3, 3, 4, 1),
    "efficientnet_b1": (2, 3, 3, 4, 4, 5, 2),
    "efficientnet_b2": (2, 3, 3, 4, 4, 5, 2),
    "efficientnet_b3": (2, 3, 3, 5, 5, 6, 2),
    "efficientnet_b4": (2, 4, 4, 6, 6, 8, 2),
    "efficientnet_v2_s": (2, 4, 4, 6, 9, 15),
    "efficientnet_v2_m": (3, 5, 5, 7, 14, 18, 5),
    "efficientnet_v2_l": (4, 7, 7, 10, 19, 25, 7),
}


def log(msg):
    print(msg, file=sys.stderr)


# ---------------------------------------------------------
# Model building (supports torchvision AND timm checkpoints)
# ---------------------------------------------------------

def strip_prefix(state_dict, prefix):
    if all(k.startswith(prefix) for k in state_dict):
        return {k[len(prefix):]: v for k, v in state_dict.items()}
    return state_dict


def block_signature(state_dict):
    """Blocks per stage for a torchvision-style state_dict."""
    stages = defaultdict(set)
    pattern = re.compile(r"^features\.(\d+)\.(\d+)\.block\.")
    for key in state_dict:
        m = pattern.match(key)
        if m:
            stages[int(m.group(1))].add(int(m.group(2)))
    return tuple(len(stages[s]) for s in sorted(stages))


def build_torchvision(arch, num_classes):
    model = getattr(tv_models, arch)(weights=None)
    in_features = model.classifier[1].in_features
    model.classifier[1] = nn.Linear(in_features, num_classes)
    return model


def build_torchvision_from_state(state_dict, num_classes, arch_hint=None):
    sig = block_signature(state_dict)
    log(f"Detected blocks per stage: {sig}")

    candidates = []
    if arch_hint in TV_SIGNATURES:
        candidates.append(arch_hint)
    candidates += [a for a, s in TV_SIGNATURES.items() if s == sig and a not in candidates]
    candidates += [a for a in TV_SIGNATURES if a not in candidates]  # last resort

    errors = {}
    for arch in candidates:
        try:
            model = build_torchvision(arch, num_classes)
            model.load_state_dict(state_dict)
            log(f"Architecture: torchvision {arch}")
            return model
        except Exception as e:  # try the next candidate
            errors[arch] = str(e).splitlines()[0]

    raise RuntimeError(f"No matching torchvision architecture found: {errors}")


def build_timm(arch, state_dict, num_classes):
    import timm  # imported lazily so torchvision checkpoints don't need timm

    model = timm.create_model(arch, pretrained=False, num_classes=num_classes)
    model.load_state_dict(state_dict)
    log(f"Architecture: timm {arch}")
    return model


def load_model():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    log(f"Using device: {device}")
    log(f"Loading model from: {MODEL_PATH}")

    # weights_only=False: checkpoint holds class names / optimizer state.
    # Only load checkpoints you trained yourself.
    checkpoint = torch.load(MODEL_PATH, map_location=device, weights_only=False)

    state_dict = checkpoint["model"] if "model" in checkpoint else checkpoint
    state_dict = strip_prefix(state_dict, "module.")

    # Class names
    class_names = checkpoint.get("classes") if isinstance(checkpoint, dict) else None
    if class_names is None and CLASSES_PATH.exists():
        class_names = json.loads(CLASSES_PATH.read_text(encoding="utf-8"))
    if class_names is None:
        raise KeyError(
            "Class names not found. Save 'classes' in the checkpoint "
            "or place a classes.json next to predict.py."
        )

    num_classes = len(class_names)
    img_size = checkpoint.get("img_size", DEFAULT_IMG_SIZE)
    arch_hint = checkpoint.get("arch")

    log(f"Number of classes: {num_classes}")
    log(f"Image size: {img_size}")

    # torchvision keys start with "features." ; timm keys with "conv_stem"/"blocks."
    if any(k.startswith("features.") for k in state_dict):
        model = build_torchvision_from_state(state_dict, num_classes, arch_hint)
    else:
        model = build_timm(arch_hint or "efficientnet_b0", state_dict, num_classes)

    model = model.to(device)
    model.eval()
    log("Model loaded successfully.")
    return model, class_names, img_size, device


# ---------------------------------------------------------
# Image preprocessing
# ---------------------------------------------------------

def create_transform(img_size):
    return transforms.Compose([
        transforms.Resize((img_size, img_size)),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225],
        ),
    ])


# ---------------------------------------------------------
# Prediction
# ---------------------------------------------------------

def predict(image_path):
    image_path = Path(image_path)
    if not image_path.exists():
        raise FileNotFoundError(f"Image not found: {image_path}")

    model, class_names, img_size, device = load_model()
    transform = create_transform(img_size)

    log(f"Loading image: {image_path}")
    image = Image.open(image_path).convert("RGB")
    image_tensor = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        probabilities = torch.softmax(model(image_tensor), dim=1)[0]

    top_k = min(3, len(class_names))
    top_probs, top_idx = torch.topk(probabilities, top_k)

    top_predictions = [
        {"condition": class_names[i.item()], "confidence": round(p.item() * 100, 2)}
        for p, i in zip(top_probs, top_idx)
    ]

    return {
        "condition": top_predictions[0]["condition"],
        "confidence": top_predictions[0]["confidence"],
        "top_predictions": top_predictions,
    }


# ---------------------------------------------------------
# Main
# ---------------------------------------------------------

if __name__ == "__main__":
    if len(sys.argv) < 2:
        log("Usage: python predict.py <image_path>")
        sys.exit(1)

    try:
        print(json.dumps(predict(sys.argv[1])))  # only JSON on stdout
    except Exception as e:
        log(f"Prediction error: {e}")
        sys.exit(1)