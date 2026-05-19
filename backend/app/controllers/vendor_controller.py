from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.vendor import Vendor
from ..schemas.vendor import VendorResponse


async def get_vendors(db: AsyncSession) -> list[VendorResponse]:
    result = await db.execute(
        select(Vendor).where(Vendor.is_active == True).order_by(Vendor.name)
    )
    return [VendorResponse.model_validate(v) for v in result.scalars().all()]
