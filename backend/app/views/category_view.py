from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ..controllers import category_controller
from ..database import get_db
from ..schemas.category import CategoryResponse

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=list[CategoryResponse])
async def list_categories(
    type: Optional[str] = Query(None, description="Filter by type: IT or Facility"),
    db: AsyncSession = Depends(get_db),
):
    return await category_controller.get_categories(db, type=type)
