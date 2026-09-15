import sys
import json
from pathlib import Path
import torch
import timm

from PIL import Image
from torchvision import transforms
from timm.data import resolve_data_config


BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "best_model.pth"


def predict(image_path):

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    # -----------------------------
    # Load checkpoint
    # -----------------------------
    checkpoint = torch.load(
        MODEL_PATH,
        map_location=device
    )

    class_names = checkpoint["class_names"]
    model_name = checkpoint["model_name"]

    # -----------------------------
    # Create model
    # -----------------------------
    model = timm.create_model(
        model_name,
        pretrained=False,
        num_classes=len(class_names)
    )

    # Your training code saves EMA weights when available
    if checkpoint.get("ema_model") is not None:
        model.load_state_dict(checkpoint["ema_model"])
    else:
        model.load_state_dict(checkpoint["model"])

    model = model.to(device)
    model.eval()

    # -----------------------------
    # Same preprocessing
    # -----------------------------
    data_cfg = resolve_data_config({}, model=model)

    mean = data_cfg["mean"]
    std = data_cfg["std"]

    transform = transforms.Compose([
        transforms.Resize(
            (224, 224),
            interpolation=transforms.InterpolationMode.BICUBIC
        ),
        transforms.ToTensor(),
        transforms.Normalize(mean, std)
    ])

    # -----------------------------
    # Load image
    # -----------------------------
    image = Image.open(image_path).convert("RGB")

    image = transform(image)

    # Add batch dimension
    image = image.unsqueeze(0).to(device)

    # -----------------------------
    # Prediction
    # -----------------------------
    with torch.no_grad():

        outputs = model(image)

        probabilities = torch.softmax(outputs, dim=1)

        confidence, predicted = torch.max(probabilities, dim=1)

    predicted_class = class_names[predicted.item()]

    confidence_value = confidence.item() * 100

    return {
        "condition": predicted_class,
        "confidence": round(confidence_value, 2)
    }


if __name__ == "__main__":

    image_path = sys.argv[1]

    try:

        result = predict(image_path)

        print(json.dumps(result))

    except Exception as e:

        print(json.dumps({
            "error": str(e)
        }))

        sys.exit(1)