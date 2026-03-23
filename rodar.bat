@echo off
title FoursysPortal - Dev Server
echo.
echo  ==========================================
echo   FoursysPortal - Iniciando servidor...
echo  ==========================================
echo.

cd /d "%~dp0"

if not exist "node_modules" (
    echo  Dependencias nao encontradas. Instalando...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo  ERRO ao instalar dependencias. Verifique se o Node.js esta instalado.
        pause
        exit /b 1
    )
    echo.
)

echo  Iniciando servidor de desenvolvimento...
echo  Acesse: http://localhost:5173
echo.
call npm run dev

pause
