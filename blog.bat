@echo off
chcp 65001 >nul
echo ========================================
echo   Syaoran Tech Blog
echo ========================================
echo.
echo   http://127.0.0.1:8080
echo.
echo ========================================
echo.

npx hexo server -p 8080 -i 127.0.0.1
