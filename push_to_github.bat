@echo off
setlocal
echo ======================================================================
echo   Marshall Lawn and Landscape - Push to GitHub Utility
echo ======================================================================
echo.

set GIT_EXE="C:\Users\Admin\.gemini\antigravity\scratch\git\cmd\git.exe"
if not exist %GIT_EXE% (
    set GIT_EXE=git
)

set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/USERNAME/marshall-lawn-and-landscape.git): "

if "%REPO_URL%"=="" (
    echo [ERROR] No GitHub URL provided. Exiting.
    pause
    exit /b 1
)

echo.
echo [1/3] Setting remote origin to %REPO_URL%...
%GIT_EXE% remote remove origin >nul 2>&1
%GIT_EXE% remote add origin %REPO_URL%

echo [2/3] Setting main branch...
%GIT_EXE% branch -M main

echo [3/3] Pushing all files and commits to GitHub...
%GIT_EXE% push -u origin main

echo.
echo ======================================================================
echo   Push Complete! Your site is on GitHub.
echo   Now go to: Repository Settings -^> Pages -^> Select 'main' branch to go LIVE!
echo ======================================================================
pause
