@echo off
type nul > items.txt
for /r %%i in (*) do (
    if not "%%~nxi"=="items.bat" if not "%%~nxi"=="items.txt" echo %%~pi%%~nxi >> items.txt
)
