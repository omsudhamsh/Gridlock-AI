# Deployment Guide

## Backend on Render

1. Create a new Render web service from this repository.
2. Set the root directory to `backend`.
3. Use `pip install -r requirements.txt` as the build command.
4. Use `uvicorn main:app --host 0.0.0.0 --port $PORT` as the start command.
5. Add environment variables with the `GRIDLOCK_` prefix as needed.

## Frontend on Vercel

1. Create a new Vercel project from this repository.
2. Set the root directory to `frontend`.
3. Use `npm run build` as the build command.
4. Set `VITE_API_BASE_URL` to the deployed backend URL.

