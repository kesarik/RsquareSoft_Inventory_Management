from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.category import Category
from ..schemas.category import CategoryResponse


async def get_categories(
    db: AsyncSession, type: Optional[str] = None
) -> list[CategoryResponse]:
    stmt = select(Category).where(Category.is_active == True).order_by(Category.name)
    if type:
        stmt = stmt.where(Category.type == type)
    result = await db.execute(stmt)
    return [CategoryResponse.model_validate(c) for c in result.scalars().all()]
