@echo off
REM ============================================================================
REM  🚀 AGORA YALE - Complete Startup Script (Windows)
REM 
REM  This script sets up and runs the complete Agora application
REM  Usage: START.bat [option]
REM  Options: start, backend, frontend, db-setup, clean, help
REM ============================================================================

setlocal enabledelayedexpansion

REM Colors (using colorama in output)
cls
echo.
echo ╔════════════════════════════════════════════════════╗
echo ║     🔥 AGORA YALE - Community Discussion App 🔥     ║
echo ╚════════════════════════════════════════════════════╝
echo.

REM Project paths
set PROJECT_ROOT=%~dp0
set BACKEND_DIR=%PROJECT_ROOT%backend
set FRONTEND_DIR=%PROJECT_ROOT%backend\agora_frontend
set VENV_DIR=%PROJECT_ROOT%venv
set VENV_ACTIVATE=%VENV_DIR%\Scripts\activate.bat

if "%1"=="" (
    set OPTION=start
) else (
    set OPTION=%1
)

REM ============================================================================
REM Helper Functions
REM ============================================================================

:check_python
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Python is not installed
    exit /b 1
)
for /f "tokens=2" %%i in ('python --version 2^>^&1') do set PYTHON_VERSION=%%i
echo ✅ Python %PYTHON_VERSION% found
goto :eof

:check_node
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  Node.js is not installed - React frontend won't work
    echo ℹ️  Install Node.js from https://nodejs.org/
    exit /b 1
)
for /f "tokens=1" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% found
goto :eof

:setup_venv
if not exist "%VENV_DIR%" (
    echo ℹ️  Creating virtual environment...
    python -m venv "%VENV_DIR%"
    echo ✅ Virtual environment created
) else (
    echo ✅ Virtual environment exists
)
call "%VENV_ACTIVATE%"
echo ✅ Virtual environment activated
goto :eof

:install_dependencies
echo ℹ️  Installing Python dependencies...
pip install --upgrade pip setuptools wheel >nul 2>nul
pip install -r "%PROJECT_ROOT%requirements.txt" >nul 2>nul
echo ✅ Python dependencies installed
goto :eof

:setup_env_file
if not exist "%PROJECT_ROOT%.env" (
    echo ℹ️  Creating .env file from template...
    copy "%PROJECT_ROOT%.env.example" "%PROJECT_ROOT%.env" >nul
    echo ✅ .env file created
    echo ⚠️  Please edit .env to configure email settings if needed
) else (
    echo ✅ .env file exists
)
goto :eof

:setup_database
echo ℹ️  Setting up database...
cd /d "%BACKEND_DIR%"
python manage.py makemigrations --noinput >nul 2>nul
python manage.py migrate --noinput >nul 2>nul
echo ✅ Database migrations completed

echo ℹ️  Creating superuser...
python manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin')
    print('✅ Superuser created: admin/admin')
else:
    print('✅ Superuser already exists')
EOF
goto :eof

:start_backend
echo.
echo ════════════════════════════════════════════════════════════════
echo 🔧 Django Backend Running
echo ════════════════════════════════════════════════════════════════
echo.
echo 📍 Backend URL: http://localhost:8000
echo 📍 Admin Panel: http://localhost:8000/admin
echo 📍 Profile: http://localhost:8000/profile
echo 📍 Email Verify: http://localhost:8000/email-verify
echo.
echo Credentials:
echo   Username: admin
echo   Password: admin
echo.
echo Press Ctrl+C to stop
echo.

cd /d "%BACKEND_DIR%"
python manage.py runserver 0.0.0.0:8000
goto :eof

:start_frontend
echo ℹ️  Starting React frontend...

if not exist "%FRONTEND_DIR%\node_modules" (
    echo ℹ️  Installing Node.js dependencies...
    cd /d "%FRONTEND_DIR%"
    call npm install >nul 2>nul
    echo ✅ Node.js dependencies installed
)

echo.
echo ════════════════════════════════════════════════════════════════
echo ⚛️  React Frontend Running
echo ════════════════════════════════════════════════════════════════
echo.
echo 📍 Frontend URL: http://localhost:3000
echo.
echo Press Ctrl+C to stop
echo.

cd /d "%FRONTEND_DIR%"
call npm start
goto :eof

:start_both
echo ℹ️  Starting backend in new command prompt...
start cmd /k "cd /d %PROJECT_ROOT% && call %VENV_ACTIVATE% && START.bat backend"
timeout /t 3 /nobreak

call :start_frontend
goto :eof

:clean_files
echo ℹ️  Cleaning temporary files...
for /d /r "%PROJECT_ROOT%" %%i in (__pycache__) do (
    if exist "%%i" rmdir /s /q "%%i" >nul 2>nul
)
del /s /q "%PROJECT_ROOT%*.pyc" >nul 2>nul
if exist "%BACKEND_DIR%\db.sqlite3" del "%BACKEND_DIR%\db.sqlite3"
if exist "%FRONTEND_DIR%\node_modules" rmdir /s /q "%FRONTEND_DIR%\node_modules" >nul 2>nul
if exist "%FRONTEND_DIR%\build" rmdir /s /q "%FRONTEND_DIR%\build" >nul 2>nul
echo ✅ Temporary files cleaned
goto :eof

:show_help
cls
echo.
echo ═══════════════════════════════════════════════════════════
echo   AGORA YALE - Startup Script Help (Windows)
echo ═══════════════════════════════════════════════════════════
echo.
echo Usage:
echo     START.bat [option]
echo.
echo Options:
echo     start       Start both backend and frontend (default)
echo     backend     Start only Django backend (port 8000)
echo     frontend    Start only React frontend (port 3000)
echo     db-setup    Initialize and setup database
echo     setup       Run full setup (venv, deps, db)
echo     clean       Remove temporary files
echo     help        Show this help message
echo.
echo Examples:
echo     START.bat                  - Start both services
echo     START.bat backend          - Backend only
echo     START.bat frontend         - Frontend only
echo     START.bat db-setup         - Setup database
echo     START.bat clean            - Clean temp files
echo.
echo Default Ports:
echo     Backend (Django):    http://localhost:8000
echo     Frontend (React):    http://localhost:3000
echo     Admin Panel:         http://localhost:8000/admin
echo.
echo Admin Credentials:
echo     Username: admin
echo     Password: admin
echo.
echo Key Endpoints:
echo     /                          - Home page
echo     /profile/                  - User profile
echo     /email-verify/             - Email verification
echo     /admin/                    - Django admin panel
echo     /api/profile/              - Profile API
echo     /api/email-verify/         - Email verification API
echo.
echo Documentation:
echo     EMAIL_VERIFICATION_SETUP.md       - Email configuration
echo     EMAIL_VERIFICATION_QUICK_START.md - Quick reference
echo     PROFILE_IMPLEMENTATION_GUIDE.md   - Profile documentation
echo.
echo Troubleshooting:
echo     Port already in use?
echo         netstat -ano ^| findstr :8000
echo         taskkill /PID [PID] /F
echo.
echo     Reset database?
echo         del backend\db.sqlite3
echo         START.bat db-setup
echo.
echo ═══════════════════════════════════════════════════════════
echo.
goto :eof

REM ============================================================================
REM Main Script
REM ============================================================================

if /i "%OPTION%"=="start" (
    call :check_python
    if errorlevel 1 exit /b 1
    
    call :check_node
    if errorlevel 1 (
        echo ⚠️  Continuing without Node.js...
    )
    
    call :setup_venv
    call :install_dependencies
    call :setup_env_file
    call :setup_database
    call :start_both
) else if /i "%OPTION%"=="backend" (
    call :check_python
    if errorlevel 1 exit /b 1
    
    call :setup_venv
    call :install_dependencies
    call :setup_env_file
    call :setup_database
    call :start_backend
) else if /i "%OPTION%"=="frontend" (
    call :check_node
    if errorlevel 1 exit /b 1
    
    call :start_frontend
) else if /i "%OPTION%"=="db-setup" (
    call :check_python
    if errorlevel 1 exit /b 1
    
    call :setup_venv
    call :install_dependencies
    call :setup_env_file
    call :setup_database
    echo ✅ Database setup complete!
) else if /i "%OPTION%"=="setup" (
    call :check_python
    if errorlevel 1 exit /b 1
    
    call :setup_venv
    call :install_dependencies
    call :setup_env_file
    call :setup_database
    echo ✅ Full setup complete!
) else if /i "%OPTION%"=="clean" (
    call :clean_files
) else if /i "%OPTION%"=="help" (
    call :show_help
) else (
    echo ❌ Unknown option: %OPTION%
    echo.
    call :show_help
    exit /b 1
)

endlocal
