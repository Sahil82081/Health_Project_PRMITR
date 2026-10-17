"""
predictor.py

Loads the trained model + supporting files and exposes predict_disease()
for use in app.py (or anywhere else in the web app backend).
"""

import os
import pickle

import pandas as pd

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(BASE_DIR, "random_forest.pkl"), "rb") as f:
    model = pickle.load(f)

with open(os.path.join(BASE_DIR, "label_encoder.pkl"), "rb") as f:
    label_encoder = pickle.load(f)

with open(os.path.join(BASE_DIR, "symptom_columns.pkl"), "rb") as f:
    symptom_columns = pickle.load(f)


def predict_disease(symptoms, top_n: int = 3) -> dict:
    """
    Parameters
    ----------
    symptoms : list[str] or dict
        - list[str]: names of symptoms that are PRESENT, e.g.
          ["fever", "cough", "sore_throat"]. All other symptoms are
          treated as absent (0). This is what the FastAPI /predict
          endpoint sends.
        - dict: mapping symptom_name -> 0/1 (or True/False), for callers
          that already have a full feature vector.
        Unknown symptom names (not in symptom_columns) are ignored.
    top_n : int
        How many top predictions to return (default 3).

    Returns
    -------
    dict:
        {
          "prediction": "common cold",
          "confidence": "87.00%",
          "top_predictions": [
              {"disease": "common cold", "confidence": "87.00%"},
              {"disease": "acute bronchitis", "confidence": "6.00%"},
              {"disease": "pneumonia", "confidence": "3.50%"}
          ],
          "probabilities": {"common cold": 0.87, "acute bronchitis": 0.06, ...}
        }
    """
    # Normalize input into a dict of symptom_name -> 0/1
    if isinstance(symptoms, dict):
        symptom_dict = symptoms
    else:
        # Treat as an iterable of present-symptom names
        present = set(symptoms)
        symptom_dict = {name: 1 for name in present}

    row = {col: int(bool(symptom_dict.get(col, 0))) for col in symptom_columns}
    X = pd.DataFrame([row], columns=symptom_columns)

    proba = model.predict_proba(X)[0]
    disease_names = label_encoder.inverse_transform(range(len(proba)))

    proba_dict = dict(zip(disease_names, proba))
    proba_dict = dict(sorted(proba_dict.items(), key=lambda kv: kv[1], reverse=True))

    top_disease, top_prob = next(iter(proba_dict.items()))

    top_predictions = [
        {"disease": str(name), "confidence": f"{prob * 100:.2f}%"}
        for name, prob in list(proba_dict.items())[:top_n]
    ]

    return {
        "prediction": str(top_disease),
        "confidence": f"{top_prob * 100:.2f}%",
        "top_predictions": top_predictions,
        "probabilities": {str(k): round(float(v), 4) for k, v in proba_dict.items()},
    }


def get_symptom_list() -> list:
    """Ordered list of symptom names the model expects -- use this to
    build the checkbox/form UI on the frontend."""
    return symptom_columns


if __name__ == "__main__":
    # Example matching the FastAPI contract: a plain list of present symptoms
    example = ["fever", "cough", "sore_throat", "nasal_congestion"]
    result = predict_disease(example)

    print(f"Prediction: {result['prediction']} ({result['confidence']})\n")
    print("Top 3 predictions:")
    for i, item in enumerate(result["top_predictions"], start=1):
        print(f"  {i}. {item['disease']} - {item['confidence']}")