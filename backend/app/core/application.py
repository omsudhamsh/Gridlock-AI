from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import get_settings


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title="Gridlock AI - Bengaluru Traffic Intelligence Engine",
        description="Decision support APIs for traffic monitoring, prediction, and recommendations.",
        version="1.0.0",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router, prefix=settings.api_prefix)

    @app.get("/", tags=["System"])
    def root() -> dict[str, str]:
        return {"message": "Gridlock AI systems status: online"}

    @app.get("/health", tags=["System"])
    def health() -> dict[str, str]:
        return {"status": "healthy", "service": settings.app_name}

    return app

