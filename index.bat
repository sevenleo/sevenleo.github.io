@echo off
type nul > index.txt
for /r %%i in (*.txt,*.json,*.pdf) do (
    if not "%%~nxi"=="items.bat" if not "%%~nxi"=="items.txt" (
        echo %%~pi%%~nxi | findstr /i /v "\\\.git\\" >> index.txt
    )
)
