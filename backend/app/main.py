from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .views.asset_view import router as asset_router
from .views.category_view import router as category_router
from .views.vendor_view import router as vendor_router

app = FastAPI(title="RsquareSoft Inventory API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(asset_router)
app.include_router(category_router)
app.include_router(vendor_router)


@app.get("/health")
async def health():
    return {"status": "ok"}
