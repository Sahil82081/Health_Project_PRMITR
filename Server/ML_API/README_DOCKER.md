# ML API - Docker Setup & Docker Hub Guide

This Dockerfile is built **specifically for the ML_API service** (Random Forest disease prediction & EfficientNet-B0 skin disease prediction) without including the rest of the project.

---

## 📁 Files Included

- `Dockerfile`: Multi-stage, slim Python 3.11 image with PyTorch CPU wheel (lightweight & fast)
- `.dockerignore`: Excludes local virtual environments (`venv/`), pycache, temporary files, and obsolete models
- `build_and_push.ps1`: Automated build & push script for Windows PowerShell
- `.github/workflows/docker-build-push.yml`: Automated CI/CD pipeline to build and push to Docker Hub directly via GitHub Actions

---

## 🚀 Option 1: Automated Push via GitHub Actions (Recommended)

Since Docker is not installed on this local Windows machine, you can let GitHub build and push to Docker Hub automatically:

1. Open your GitHub repository in your browser:  
   **[https://github.com/Sahil82081/Health_Project_PRMITR](https://github.com/Sahil82081/Health_Project_PRMITR)**
2. Go to **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.
3. Add the following two secrets:
   - `DOCKERHUB_USERNAME`: Your Docker Hub username (e.g., `sahil82081`)
   - `DOCKERHUB_TOKEN`: A Personal Access Token from Docker Hub ([Create one here](https://hub.docker.com/settings/security))
4. That's it! Every time changes are pushed to `Server/ML_API`, GitHub will automatically build and push the image `<username>/health-ml-api:latest` to Docker Hub. You can also trigger it manually from the **Actions** tab.

---

## 💻 Option 2: Build & Push Locally via Terminal

If you have Docker Desktop installed, run these commands inside the `Server/ML_API` directory:

```bash
# 1. Navigate to ML_API directory
cd Server/ML_API

# 2. Log in to Docker Hub
docker login

# 3. Build the Docker image (replace <your-dockerhub-username> with your username)
docker build -t <your-dockerhub-username>/health-ml-api:latest -f Dockerfile .

# 4. Push to Docker Hub
docker push <your-dockerhub-username>/health-ml-api:latest
```

Or run the helper script in PowerShell:
```powershell
.\build_and_push.ps1 -DockerUser <your-dockerhub-username>
```

---

## 🏃 Running the Docker Container Locally

To run the container locally on port 5000:

```bash
docker run -d -p 5000:5000 --name ml-api <your-dockerhub-username>/health-ml-api:latest
```

Test the health check:
```bash
curl http://localhost:5000/
# Expected: {"status": "healthy", "service": "Health Project ML API"}
```
