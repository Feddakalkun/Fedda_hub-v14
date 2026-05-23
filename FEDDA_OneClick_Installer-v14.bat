@echo off
setlocal EnableExtensions
title FEDDA Hub v14 - One Click Installer

set "REPO_URL=https://github.com/Feddakalkun/Fedda_hub-v14.git"
if not "%FEDDA_REPO_URL%"=="" set "REPO_URL=%FEDDA_REPO_URL%"

set "REPO_BRANCH=main"
if not "%FEDDA_REPO_BRANCH%"=="" set "REPO_BRANCH=%FEDDA_REPO_BRANCH%"

set "ROOT=%~dp0"
if "%ROOT:~-1%"=="\" set "ROOT=%ROOT:~0,-1%"
set "BOOTSTRAP_DIR=%ROOT%\_fedda_hub_v14_repo"
set "INSTALL_ROOT=%ROOT%\comfyuifeddafront"
set "INSTALL_SCRIPT=%BOOTSTRAP_DIR%\scripts\install_base.ps1"
set "UPDATE_BAT=%ROOT%\FEDDA_Update-v14.bat"
set "RUN_BAT=%ROOT%\FEDDA_run-v14.bat"

echo.
echo  =============================================================
echo   FEDDA Hub v14 - One Click Installer
echo   Clean baseline: ComfyUI + app runtime, no custom nodes yet
echo  =============================================================
echo.
echo   Install folder: %INSTALL_ROOT%
echo   Bootstrap repo: %BOOTSTRAP_DIR%
echo.

where git >nul 2>nul || goto :err_git
where node >nul 2>nul || goto :err_node
where npm >nul 2>nul || goto :err_npm
where powershell >nul 2>nul || goto :err_ps

if exist "%BOOTSTRAP_DIR%\.git" (
  echo  [INFO] Updating bootstrap repo...
  pushd "%BOOTSTRAP_DIR%" || goto :err_pushd
  git fetch origin %REPO_BRANCH% || goto :err_bootstrap_update
  git checkout %REPO_BRANCH% || goto :err_bootstrap_update
  git pull --ff-only origin %REPO_BRANCH% || goto :err_bootstrap_update
  popd
) else (
  echo  [INFO] Cloning bootstrap repo...
  git clone --branch %REPO_BRANCH% %REPO_URL% "%BOOTSTRAP_DIR%" || goto :err_bootstrap_clone
)

attrib +h "%BOOTSTRAP_DIR%" >nul 2>nul

if not exist "%INSTALL_SCRIPT%" goto :err_install_script

echo  [INFO] Running v14 base installer...
powershell -ExecutionPolicy Bypass -File "%INSTALL_SCRIPT%" -InstallRoot "%INSTALL_ROOT%"
if not "%ERRORLEVEL%"=="0" goto :err_base_install

echo  [INFO] Creating run/update launchers...
call :write_update_launcher
call :write_run_launcher

echo.
echo  [OK] FEDDA Hub v14 base install finished.
echo.
echo  Next:
echo   1^) Run: %RUN_BAT%
echo   2^) Open: http://localhost:5173
echo.
echo  Custom nodes are intentionally not installed yet.
echo  Add them one by one after the baseline is verified.
echo.
pause
exit /b 0

:write_update_launcher
(
echo @echo off
echo setlocal EnableExtensions
echo set "ROOT_DIR=%%~dp0"
echo if "%%ROOT_DIR:~-1%%"=="\" set "ROOT_DIR=%%ROOT_DIR:~0,-1%%"
echo set "BOOTSTRAP_DIR=%%ROOT_DIR%%\_fedda_hub_v14_repo"
echo set "INSTALL_SCRIPT=%%BOOTSTRAP_DIR%%\scripts\install_base.ps1"
echo set "INSTALL_ROOT=%%ROOT_DIR%%\comfyuifeddafront"
echo set "BOOTSTRAP_REMOTE=https://github.com/Feddakalkun/Fedda_hub-v14.git"
echo if not exist "%%BOOTSTRAP_DIR%%\.git" ^(
echo   echo [ERROR] Missing bootstrap git repo:
echo   echo         %%BOOTSTRAP_DIR%%
echo   echo [INFO] Run FEDDA_OneClick_Installer-v14.bat once to bootstrap.
echo   pause
echo   exit /b 1
echo ^)
echo echo [INFO] Updating bootstrap repo...
echo git -C "%%BOOTSTRAP_DIR%%" remote set-url origin "%%BOOTSTRAP_REMOTE%%" ^>nul 2^>nul
echo git -C "%%BOOTSTRAP_DIR%%" fetch origin main
echo if not "%%ERRORLEVEL%%"=="0" ^(
echo   echo [ERROR] Failed to fetch bootstrap repo.
echo   pause
echo   exit /b 1
echo ^)
echo git -C "%%BOOTSTRAP_DIR%%" checkout main
echo if not "%%ERRORLEVEL%%"=="0" ^(
echo   echo [ERROR] Failed to checkout bootstrap main.
echo   pause
echo   exit /b 1
echo ^)
echo git -C "%%BOOTSTRAP_DIR%%" reset --hard origin/main
echo if not "%%ERRORLEVEL%%"=="0" ^(
echo   echo [ERROR] Failed to sync bootstrap to origin/main.
echo   pause
echo   exit /b 1
echo ^)
echo git -C "%%BOOTSTRAP_DIR%%" clean -fd
echo if not "%%ERRORLEVEL%%"=="0" ^(
echo   echo [ERROR] Failed to clean bootstrap working tree.
echo   pause
echo   exit /b 1
echo ^)
echo if not exist "%%INSTALL_SCRIPT%%" ^(
echo   echo [ERROR] Missing bootstrap installer script:
echo   echo         %%INSTALL_SCRIPT%%
echo   pause
echo   exit /b 1
echo ^)
echo powershell -ExecutionPolicy Bypass -File "%%INSTALL_SCRIPT%%" -InstallRoot "%%INSTALL_ROOT%%"
echo exit /b %%ERRORLEVEL%%
) > "%UPDATE_BAT%"
exit /b 0

:write_run_launcher
(
echo @echo off
echo setlocal EnableExtensions
echo set "ROOT_DIR=%%~dp0"
echo if "%%ROOT_DIR:~-1%%"=="\" set "ROOT_DIR=%%ROOT_DIR:~0,-1%%"
echo set "INSTALL_ROOT=%%ROOT_DIR%%\comfyuifeddafront"
echo set "COMFY_DIR=%%INSTALL_ROOT%%\ComfyUI"
echo set "EMBED_PY=%%INSTALL_ROOT%%\python_embeded\python.exe"
echo set "APP_DIR=%%ROOT_DIR%%\_fedda_hub_v14_repo"
echo set "FRONTEND_DIR=%%APP_DIR%%\frontend"
echo if exist "%%EMBED_PY%%" if exist "%%COMFY_DIR%%\main.py" ^(
echo   echo [INFO] Starting ComfyUI on port 8199...
echo   start "FEDDA v14 ComfyUI" cmd /k ""%%EMBED_PY%%" "%%COMFY_DIR%%\main.py" --windows-standalone-build --port 8199"
echo ^) else ^(
echo   echo [WARN] ComfyUI runtime not found yet:
echo   echo        %%COMFY_DIR%%
echo ^)
echo if not exist "%%FRONTEND_DIR%%\package.json" ^(
echo   echo [ERROR] Missing frontend package.json at:
echo   echo         %%FRONTEND_DIR%%
echo   pause
echo   exit /b 1
echo ^)
echo pushd "%%FRONTEND_DIR%%" ^|^| ^(
echo   echo [ERROR] Could not enter frontend folder.
echo   pause
echo   exit /b 1
echo ^)
echo if not exist "%%FRONTEND_DIR%%\node_modules\.bin\vite.cmd" ^(
echo   echo [INFO] Frontend dependencies missing. Installing...
echo   call npm install
echo   if not "%%ERRORLEVEL%%"=="0" ^(
echo     echo [ERROR] npm install failed.
echo     set "EXITCODE=%%ERRORLEVEL%%"
echo     popd
echo     exit /b %%EXITCODE%%
echo   ^)
echo ^)
echo call npm run dev
echo set "EXITCODE=%%ERRORLEVEL%%"
echo popd
echo exit /b %%EXITCODE%%
) > "%RUN_BAT%"
exit /b 0

:err_git
echo  [ERROR] Git not found. Install: https://git-scm.com/downloads
pause
exit /b 1

:err_node
echo  [ERROR] Node.js not found. Install Node.js 18+ from https://nodejs.org/
pause
exit /b 1

:err_npm
echo  [ERROR] npm not found. Reinstall Node.js.
pause
exit /b 1

:err_ps
echo  [ERROR] PowerShell not found.
pause
exit /b 1

:err_pushd
echo  [ERROR] Could not enter bootstrap repo folder.
pause
exit /b 1

:err_bootstrap_update
echo  [ERROR] Failed to update bootstrap repo.
popd
pause
exit /b 1

:err_bootstrap_clone
echo  [ERROR] Failed to clone bootstrap repo.
pause
exit /b 1

:err_install_script
echo  [ERROR] Missing installer script:
echo          %INSTALL_SCRIPT%
pause
exit /b 1

:err_base_install
echo  [ERROR] Base install failed.
pause
exit /b 1
