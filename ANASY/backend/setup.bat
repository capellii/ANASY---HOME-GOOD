@echo off
setlocal enabledelayedexpansion

REM Script para inicializar ANASY Backend com Docker Compose

cd /d "c:\Users\capel\OneDrive\Desktop\ANASY---HOME-GOOD\ANASY\backend"

echo ========================================
echo ANASY Backend - Inicializacao
echo ========================================
echo.

echo [1/4] Parando containers e limpando volumes...
docker compose down -v
timeout /t 2 /nobreak

echo.
echo [2/4] Construindo e iniciando containers...
docker compose up -d

echo.
echo [3/4] Aguardando inicializacao (30 segundos)...
timeout /t 30 /nobreak

echo.
echo [4/4] Verificando status dos containers...
docker compose ps

echo.
echo ========================================
echo Verificando logs...
echo ========================================
docker compose logs backend --tail 20

echo.
echo ========================================
echo Status: COMPLETO
echo ========================================
echo.
echo Backend disponivel em: http://localhost:3000
echo Database: PostgreSQL em localhost:5432
echo Usuario: postgres
echo Senha: 102030
echo Database: anasy_db
echo.
pause
