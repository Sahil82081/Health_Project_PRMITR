import sys
from pathlib import Path

# Add Server/ML_API to sys.path
ROOT_DIR = Path(__file__).resolve().parent.parent
ML_DIR = ROOT_DIR / "Server" / "ML_API"

if str(ML_DIR) not in sys.path:
    sys.path.insert(0, str(ML_DIR))

from app.main import app

if __name__ == "__main__":
    import os
    import uvicorn
    port = int(os.environ.get("PORT", 10000))
    host = os.environ.get("HOST", "0.0.0.0")
    print(f"Starting ML API on {host}:{port}")
    uvicorn.run(app, host=host, port=port)
