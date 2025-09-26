# setup.ps1
# Run with: powershell -ExecutionPolicy Bypass -File setup.ps1

function Test-Command {
    param([string]$cmd)
    $exists = Get-Command $cmd -ErrorAction SilentlyContinue
    return $null -ne $exists
}

Write-Host "=== Starting backend setup ==="

# Step 0: Generate .env file if it doesn't exist
$envFile = ".env"
if (-Not (Test-Path $envFile)) {
    Write-Host "-> Creating .env file..."
    @"
# MariaDB connection config
MARIADB_HOST=localhost
MARIADB_PORT=3306
MARIADB_USER=devuser
MARIADB_PASSWORD=devpass
MARIADB_DATABASE=laika
"@ | Out-File -Encoding UTF8 $envFile
} else {
    Write-Host "-> .env file already exists, skipping creation."
}

# Step 1: Check dependencies
if (-Not (Test-Command "docker")) {
    Write-Error "Docker is not installed or not in PATH."
    exit 1
}

if (-Not (Test-Command "node")) {
    Write-Error "Node.js is not installed or not in PATH. Please install Node.js from https://nodejs.org/"
    exit 1
}

if (-Not (Test-Command "npm")) {
    Write-Error "npm is not installed or not in PATH."
    exit 1
}

if (-Not (Test-Command "ngrok")) {
    Write-Error "ngrok is not installed or not in PATH."
    exit 1
}

if (-Not (Test-Command "openssl")) {
    Write-Error "OpenSSL is not installed or not in PATH."
    exit 1
}

# Step 2: Start MariaDB with existing compose
Write-Host "-> Starting MariaDB with Docker Compose..."
Push-Location mariadb
docker compose up -d
Pop-Location

# Step 3: Install backend dependencies
Write-Host "-> Installing backend dependencies..."
if (-Not (Test-Path "node_modules")) {
    npm install
} else {
    Write-Host "-> node_modules exists, skipping npm install."
}

# Step 4: Start backend natively in new window
Write-Host "-> Starting backend natively in separate window..."
Start-Process powershell -ArgumentList '-NoExit', '-Command', "cd '$PWD'; npm start"

# Step 5: Launch ngrok in new window
Write-Host "-> Launching ngrok in separate window..."
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'ngrok http --hostname TU.HOST.NAME 3001'

Write-Host "=== Setup complete ==="
Write-Host "Backend: http://localhost:3001"
Write-Host "MariaDB: localhost:3306"
Write-Host "ngrok tunnel will show in its own window."
Write-Host ""
Write-Host "Backend and ngrok are running in separate PowerShell windows."
Write-Host "Close those windows to stop the services."
