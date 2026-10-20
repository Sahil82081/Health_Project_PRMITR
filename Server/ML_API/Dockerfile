# ==============================================================================
# Health Project - ML API Dockerfile
# Random Forest (Symptom Disease Prediction) + EfficientNet-B0 (Skin Disease)
# ==============================================================================

FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=5000 \
    HOST=0.0.0.0

# Set working directory inside container
WORKDIR /app

# Install system dependencies (OpenMP for PyTorch/scikit-learn, curl for healthcheck)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file first to leverage Docker layer caching
COPY requirements.txt .

# Install dependencies (use PyTorch CPU wheel to keep the image slim and fast)
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu && \
    pip install --no-cache-dir -r requirements.txt

# Copy source code, models, and scripts into container
COPY app/ ./app/
COPY skin_model/ ./skin_model/
COPY predictor.py ./
COPY main.py ./
COPY app.py ./
COPY random_forest.pkl ./
COPY label_encoder.pkl ./
COPY symptom_columns.pkl ./

# Create temporary upload directory for image inference
RUN mkdir -p temp

# Expose port (default 5000, configurable via PORT env var)
EXPOSE 5000

# Container healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:${PORT}/ || exit 1

# Start ML API server
CMD ["python", "main.py"]
