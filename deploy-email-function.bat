@echo off
echo 📧 Deploying Khadum Email Notification Function...

REM Check if Supabase CLI is installed
supabase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Supabase CLI not found! Please install it first:
    echo    npm install -g supabase
    pause
    exit /b 1
)

echo ✅ Supabase CLI found

REM Check if function file exists
if not exist "supabase\functions\send-review-notification\index.ts" (
    echo ❌ Function file not found! Make sure you're in the project root directory.
    pause
    exit /b 1
)

echo 🔗 Linking to your Supabase project...
echo Your project URL: https://fegxpfdvrqywmwiobuer.supabase.co

REM Link to the project
supabase link --project-ref fegxpfdvrqywmwiobuer
if %errorlevel% neq 0 (
    echo ❌ Failed to link to project. Please check your project reference.
    pause
    exit /b 1
)

echo ✅ Successfully linked to project

echo 🚀 Deploying send-review-notification function...
supabase functions deploy send-review-notification
if %errorlevel% neq 0 (
    echo ❌ Deployment failed. Please check the error messages above.
    pause
    exit /b 1
)

echo.
echo 🎉 Deployment Complete!
echo.
echo 📋 Next Steps:
echo 1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/fegxpfdvrqywmwiobuer
echo 2. Navigate to: Settings ^> Edge Functions
echo 3. Add environment variable:
echo    Key: RESEND_API_KEY
echo    Value: re_UqDC7zJw_MRjALuSiNQJZ2AiZrBVvLZZ6
echo.
echo 🔗 Function URL:
echo    https://fegxpfdvrqywmwiobuer.supabase.co/functions/v1/send-review-notification
echo.
echo 🧪 Test the function using the admin dashboard test buttons!
pause

