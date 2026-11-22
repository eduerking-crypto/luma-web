@echo off
setlocal
cd /d "%~dp0"
where node.exe >nul 2>nul
if errorlevel 1 goto lectura
node.exe -e "process.exit(Number(process.versions.node.split('.')[0]) >= 24 ? 0 : 1)"
if errorlevel 1 goto lectura
node.exe scripts\abrir.mjs
if errorlevel 1 pause
exit /b
:lectura
start "" "%~dp0public\index.html"

