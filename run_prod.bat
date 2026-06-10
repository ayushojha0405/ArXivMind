@echo off
echo Starting ArXivMind in Production Mode...

:: Start the FastAPI backend with 4 workers and no --reload
echo Starting backend...
cd backend
start cmd /k "uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4"

:: Serve the frontend
echo Starting frontend...
cd ../frontend
start cmd /k "npm run build && npm run preview"

echo Both services are running in production mode!
