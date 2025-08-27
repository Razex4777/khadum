@echo off
echo ========================================
echo   KHADUM WHATSAPP BOT STARTUP
echo ========================================
echo.
echo Killing any existing processes...
taskkill /IM node.exe /F >nul 2>&1

echo Starting Node.js server...
start "Khadum Bot Server" cmd /k "npm start"

echo Waiting for server to start...
timeout /t 3 /nobreak >nul

echo Starting ngrok tunnel...
echo.
echo ========================================
echo   YOUR WEBHOOK URL WILL APPEAR BELOW
echo ========================================
npx ngrok http 3000








