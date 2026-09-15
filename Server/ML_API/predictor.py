import numpy as np
import joblib

# ==========================================================
# LOAD MODEL
# ==========================================================

model = joblib.load("random_forest.pkl")
encoder = joblib.load("label_encoder.pkl")
symptom_columns = joblib.load("symptom_columns.pkl")


# ==========================================================
# SYMPTOM INDEX
# ==========================================================

symptom_index = {
    symptom: idx
    for idx, symptom in enumerate(symptom_columns)
}


# ==========================================================
# PREDICT DISEASE
# ==========================================================

def predict_disease(symptoms):

    feature_vector = np.zeros(
        len(symptom_columns),
        dtype=np.uint8
    )

    # Convert symptoms into feature vector
    for symptom in symptoms:

        symptom = symptom.strip().lower()

        if symptom in symptom_index:

            feature_vector[
                symptom_index[symptom]
            ] = 1

    # Predict probabilities
    probabilities = model.predict_proba(
        [feature_vector]
    )[0]

    # Get Top 3
    top3_idx = np.argsort(
        probabilities
    )[-3:][::-1]

    # Convert encoded labels to disease names
    diseases = encoder.inverse_transform(
        top3_idx
    )

    # Create result
    result = []

    for i in range(3):

        result.append({

            "disease": diseases[i],

            "confidence": round(
                float(
                    probabilities[top3_idx[i]]
                ) * 100,
                2
            )

        })

    return result