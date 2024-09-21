@echo off
setlocal enabledelayedexpansion
echo Fixing mjs files...

for %%f in (.\dist\mjs\*.js) do (
    echo Updating %%f contents...
    powershell -Command "(Get-Content -path %%f) -replace '\.js''', '.mjs''' | Set-Content -path %%f"
    echo Renaming %%f to %%~nf.mjs...
    ren "%%f" "%%~nf.mjs"
)

echo Done.

endlocal