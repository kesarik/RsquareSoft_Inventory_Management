from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..controllers import vendor_controller
from ..database import get_db
from ..schemas.vendor import VendorResponse

router = APIRouter(prefix="/vendors", tags=["vendors"])


@router.get("", response_model=list[VendorResponse])
async def list_vendors(db: AsyncSession = Depends(get_db)):
    return await vendor_controller.get_vendors(db)
