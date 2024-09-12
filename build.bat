@echo off
echo Building...
tsc -p tsconfig.cjs.json && tsc -p tsconfig.mjs.json && tsc -p tsconfig.base.json && (
    echo Done.
) || (
    echo Failed.
    exit /b 1
)