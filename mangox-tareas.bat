@echo off
setlocal
cd /d "%~dp0"
:menu
cls
echo MangoX - Tareas
echo.
echo 1^) Desarrollo
echo 2^) Lint
echo 3^) Typecheck
echo 4^) Build
echo 5^) Vista previa
echo 0^) Salir
echo.
set /p opt=Selecciona opcion: 
if "%opt%"=="1" start "MangoX Dev" cmd /k npm run dev & goto menu
if "%opt%"=="2" call npm run lint & pause & goto menu
if "%opt%"=="3" call npm run typecheck & pause & goto menu
if "%opt%"=="4" call npm run build & pause & goto menu
if "%opt%"=="5" call npm run preview & pause & goto menu
if "%opt%"=="0" goto fin
goto menu
:fin
endlocal
exit /b 0
