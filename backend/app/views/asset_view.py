from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ..controllers import asset_controller
from ..database import get_db
from ..schemas.asset import AssetCreate, AssetResponse, AssetUpdate

router = APIRouter(prefix="/assets", tags=["assets"])


@router.get("", response_model=list[AssetResponse])
async def list_assets(
    status: Optional[str] = Query(None),
    category_id: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    return await asset_controller.get_assets(
        db, status=status, category_id=category_id, search=search
    )


@router.get("/{asset_id}", response_model=AssetResponse)
async def get_asset(asset_id: int, db: AsyncSession = Depends(get_db)):
    asset = await asset_controller.get_asset(db, asset_id)
    if asset is None:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset


@router.post("", response_model=AssetResponse, status_code=201)
async def create_asset(data: AssetCreate, db: AsyncSession = Depends(get_db)):
    try:
        return await asset_controller.create_asset(db, data)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))


@router.put("/{asset_id}", response_model=AssetResponse)
async def update_asset(
    asset_id: int, data: AssetUpdate, db: AsyncSession = Depends(get_db)
):
    try:
        asset = await asset_controller.update_asset(db, asset_id, data)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))
    if asset is None:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset


@router.delete("/{asset_id}", status_code=204)
async def delete_asset(asset_id: int, db: AsyncSession = Depends(get_db)):
    try:
        deleted = await asset_controller.delete_asset(db, asset_id)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))
    if not deleted:
        raise HTTPException(status_code=404, detail="Asset not found")
