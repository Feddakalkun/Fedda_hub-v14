@echo off
setlocal EnableExtensions

set "ROOT_DIR=%~dp0"
if "%ROOT_DIR:~-1%"=="\" set "ROOT_DIR=%ROOT_DIR:~0,-1%"
set "BOOTSTRAP_DIR=%ROOT_DIR%\_fedda_hub_v14_repo"
set "INSTALL_SCRIPT=%BOOTSTRAP_DIR%\scripts\install_base.ps1"
set "INSTALL_ROOT=%ROOT_DIR%\comfyuifeddafront"
set "BOOTSTRAP_REMOTE=https://github.com/Feddakalkun/Fedda_hub-v14.git"

if not exist "%BOOTSTRAP_DIR%\.git" (
  echo [ERROR] Missing bootstrap git repo:
  echo         %BOOTSTRAP_DIR%
  echo [INFO] Run FEDDA_OneClick_Installer-v14.bat once to bootstrap.
  pause
  exit /b 1
)

echo [INFO] Updating v14 bootstrap repo...
git -C "%BOOTSTRAP_DIR%" remote set-url origin "%BOOTSTRAP_REMOTE%" >nul 2>nul
git -C "%BOOTSTRAP_DIR%" fetch origin main || goto :err
git -C "%BOOTSTRAP_DIR%" checkout main || goto :err
git -C "%BOOTSTRAP_DIR%" reset --hard origin/main || goto :err
git -C "%BOOTSTRAP_DIR%" clean -fd || goto :err

if not exist "%INSTALL_SCRIPT%" (
  echo [ERROR] Missing installer script:
  echo         %INSTALL_SCRIPT%
  pause
  exit /b 1
)

powershell -ExecutionPolicy Bypass -File "%INSTALL_SCRIPT%" -InstallRoot "%INSTALL_ROOT%"
exit /b %ERRORLEVEL%

:err
echo [ERROR] Failed to sync v14 bootstrap repo.
pause
exit /b 1
