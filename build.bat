@echo off
echo Cleaning Up...
rmdir /s /q dist

echo Building...

tsc -p tsconfig.cjs.json && tsc -p tsconfig.mjs.json && tsc -p tsconfig.base.json && (
    echo Build done.
    call fix-mjs.bat
) || (
    echo Failed.
    goto :eof
)
