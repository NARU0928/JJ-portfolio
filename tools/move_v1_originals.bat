@echo off
REM ============================================================
REM  JJ-portfolio : v1(2025.06) leftover files -> _private\v1_originals
REM  - Nothing is deleted. Files are only MOVED.
REM  - _private\ is listed in .gitignore, so it will NOT be uploaded.
REM  - The archived v1 site already lives in versions\v1_2025-06\
REM ============================================================
setlocal
cd /d "%~dp0.."
if not exist "versions\v1_2025-06\index.html" (
  echo [STOP] versions\v1_2025-06 not found. Run this inside the JJ-portfolio folder.
  pause & exit /b 1
)
set DEST=_private\v1_originals
if not exist "%DEST%\data" mkdir "%DEST%\data"
if not exist "%DEST%\assets" mkdir "%DEST%\assets"

for %%F in (script.js style.css) do if exist "%%F" move /Y "%%F" "%DEST%\" >nul && echo moved %%F
for %%F in (data-ko.json data-en.json timeline-ko.json timeline-en.json) do if exist "data\%%F" move /Y "data\%%F" "%DEST%\data\" >nul && echo moved data\%%F
if exist "data\old" move /Y "data\old" "%DEST%\data\old" >nul && echo moved data\old
if exist "images" move /Y "images" "%DEST%\images" >nul && echo moved images
for %%Y in (2008 2009 2010 2012 2013 2019 2020 2021 2022 2023 2024 2025 images) do if exist "assets\%%Y" move /Y "assets\%%Y" "%DEST%\assets\%%Y" >nul && echo moved assets\%%Y

echo.
echo Done. Original certificate PDFs are now in %DEST% (local only).
echo Next: commit and push with GitHub Desktop.
pause
