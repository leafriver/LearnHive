@echo off
echo ========================================
echo LearnHive 数据库初始化脚本
echo ========================================

echo.
echo 正在初始化数据库...

REM 检查MySQL是否安装
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误：未找到 MySQL，请先安装 MySQL
    pause
    exit /b 1
)

echo ✅ MySQL 已安装

REM 执行数据库初始化SQL
echo 📦 正在创建数据库和表...
mysql -u root -p2021615 < SQL_Files/init-database.sql

if %errorlevel% equ 0 (
    echo ✅ 数据库初始化成功！
    echo.
    echo 📊 数据库信息：
    echo    数据库名：learn_hive
    echo    用户表：users
    echo.
) else (
    echo ❌ 数据库初始化失败！
    echo 请检查：
    echo 1. MySQL 服务是否启动
    echo 2. 用户名和密码是否正确
    echo 3. 是否有创建数据库的权限
)

pause 