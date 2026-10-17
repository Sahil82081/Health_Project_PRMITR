import os
import shutil
from pathlib import Path

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from predictor import predict_disease
from skin_model.predict import predict as predict_skin_image


app = FastAPI(title="Health Project ML API")

# Enable CORS for ML API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    return {
        "status": "healthy",
        "service": "Health Project ML API"
    }


# =========================================================
# RANDOM FOREST - SYMPTOM PREDICTION
# =========================================================

class PredictionRequest(BaseModel):
    symptoms: list[str]


@app.post("/predict")
def predict_symptoms(request: PredictionRequest):

    predictions = predict_disease(
        request.symptoms
    )

    return {
        "success": True,
        "predictions": predictions
    }


# =========================================================
# EFFICIENTNET - IMAGE PREDICTION
# =========================================================

BASE_DIR = Path(__file__).resolve().parent

TEMP_DIR = BASE_DIR / "temp"

TEMP_DIR.mkdir(
    exist_ok=True
)


@app.post("/predict-image")
async def predict_image(
    file: UploadFile = File(...)
):

    # Generate a safe temporary filename
    filename = Path(file.filename).name

    image_path = TEMP_DIR / filename

    try:

        # Save uploaded image
        with open(
            image_path,
            "wb"
        ) as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )

        # Run EfficientNet
        result = predict_skin_image(
            str(image_path)
        )

        return {

            "success": True,

            "prediction": result

        }

    except Exception as e:

        return {

            "success": False,

            "error": str(e)

        }

    finally:

        # Remove temporary image
        if image_path.exists():

            image_path.unlink()


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 5000))
    host = os.environ.get("HOST", "0.0.0.0")
    uvicorn.run("app:app", host=host, port=port, reload=True)