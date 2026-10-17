print("========== STARTING AEROAI ML API ==========")
import os
import uvicorn
from app import app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    host = os.environ.get("HOST", "0.0.0.0")
    print(f"Starting ML API on {host}:{port}")
    uvicorn.run(app, host=host, port=port)
