@echo off
REM Build backend and frontend test images
docker compose build backend-test
docker compose build frontend-test

REM Run backend tests
docker compose run --rm backend-test

REM Run frontend tests
docker compose run --rm frontend-test

REM Prevent terminal from closing
echo.
echo All tests finished. Press any key to exit.
pause >nul