# AI Model Placeholders

This directory is reserved for lightweight model adapters.

Recommended approach:

- Keep pretrained weights out of Git.
- Store model paths in environment variables.
- Use YOLOv11 Nano for demo inference.
- Cache inference outputs before exposing them through FastAPI.

