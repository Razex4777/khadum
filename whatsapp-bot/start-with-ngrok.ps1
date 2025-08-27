# Khadum WhatsApp Bot Startup Script
# This script starts the Node.js server and ngrok tunnel

Write-Host "Starting Khadum WhatsApp Bot..." -ForegroundColor Green
Write-Host "Location: whatsapp-bot directory" -ForegroundColor Yellow

# Start the Node.js server in background
Write-Host "Starting Node.js server on port 3000..." -ForegroundColor Cyan
Start-Process -FilePath "npm" -ArgumentList "start" -WindowStyle Minimized

# Wait a moment for server to start
Start-Sleep -Seconds 3

# Start ngrok tunnel
Write-Host "Starting ngrok tunnel..." -ForegroundColor Magenta
Write-Host "Your webhook URL will be displayed below!" -ForegroundColor Yellow
Write-Host "Copy the HTTPS URL and use it as your WhatsApp webhook URL" -ForegroundColor Yellow
Write-Host "Verify Token: khadum_webhook_verify_token_2024" -ForegroundColor Green
Write-Host "" 

npx ngrok http 3000
