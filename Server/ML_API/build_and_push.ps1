# PowerShell script to build and push ML_API Docker image to Docker Hub
param(
    [Parameter(Mandatory=$false)]
    [string]$DockerUser = "",
    
    [Parameter(Mandatory=$false)]
    [string]$ImageName = "health-ml-api",
    
    [Parameter(Mandatory=$false)]
    [string]$Tag = "latest"
)

if (-not $DockerUser) {
    $DockerUser = Read-Host "Enter your Docker Hub username"
}

if (-not $DockerUser) {
    Write-Error "Docker Hub username is required!"
    exit 1
}

$FullImage = "$DockerUser/$ImageName`:$Tag"

Write-Host "==> Logging in to Docker Hub..." -ForegroundColor Cyan
docker login

Write-Host "==> Building Docker image: $FullImage..." -ForegroundColor Cyan
docker build -t $FullImage -f Dockerfile .

if ($LASTEXITCODE -ne 0) {
    Write-Error "Docker build failed!"
    exit 1
}

Write-Host "==> Pushing $FullImage to Docker Hub..." -ForegroundColor Cyan
docker push $FullImage

if ($LASTEXITCODE -eq 0) {
    Write-Host " Successfully pushed $FullImage to Docker Hub!" -ForegroundColor Green
} else {
    Write-Error "Docker push failed!"
}
