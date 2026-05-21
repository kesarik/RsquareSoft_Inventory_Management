from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from ..models.allocation import AssetAllocation
from ..models.asset import ITAsset
from ..schemas.allocation import AllocationCreate, AllocationResponse


def _asset_tag(asset: ITAsset) -> str:
    year = asset.purchase_date.year if asset.purchase_date else 2024
    return f"IT-{year}-{asset.id:03d}"


def _to_response(alloc: AssetAllocation) -> AllocationResponse:
    asset = alloc.asset
    emp = alloc.employee
    return AllocationResponse(
        id=alloc.id,
        asset_id=alloc.asset_id,
        asset_tag=_asset_tag(asset) if asset else "",
        model_name=asset.model_name if asset else "",
        category=asset.category.name if asset and asset.category else "",
        employee_id=alloc.employee_id,
        employee_name=emp.full_name if emp else "",
        emp_id=emp.emp_id if emp else "",
        department=emp.department if emp else None,
        allocation_date=alloc.allocation_date,
        actual_return_date=alloc.actual_return_date,
        digital_ack_status=alloc.digital_ack_status,
        remarks=alloc.remarks,
    )


def _load_options():
    return [
        selectinload(AssetAllocation.asset).selectinload(ITAsset.category),
        selectinload(AssetAllocation.employee),
    ]


async def get_allocations(
    db: AsyncSession, active_only: bool = False
) -> list[AllocationResponse]:
    stmt = select(AssetAllocation).options(*_load_options())
    if active_only:
        stmt = stmt.where(AssetAllocation.actual_return_date == None)
    result = await db.execute(stmt)
    return [_to_response(a) for a in result.scalars().all()]


async def create_allocation(
    db: AsyncSession, data: AllocationCreate
) -> AllocationResponse:
    asset_res = await db.execute(select(ITAsset).where(ITAsset.id == data.asset_id))
    asset = asset_res.scalar_one_or_none()
    if asset is None:
        raise ValueError("Asset not found")
    if asset.status != "Available":
        raise ValueError(f"Asset is not available (status: {asset.status})")

    alloc = AssetAllocation(
        asset_id=data.asset_id,
        employee_id=data.employee_id,
        remarks=data.remarks,
    )
    db.add(alloc)
    asset.status = "Allocated"
    await db.commit()
    await db.refresh(alloc)

    result = await db.execute(
        select(AssetAllocation)
        .where(AssetAllocation.id == alloc.id)
        .options(*_load_options())
    )
    return _to_response(result.scalar_one())


async def return_allocation(
    db: AsyncSession, allocation_id: int
) -> Optional[AllocationResponse]:
    result = await db.execute(
        select(AssetAllocation)
        .where(AssetAllocation.id == allocation_id)
        .options(*_load_options())
    )
    alloc = result.scalar_one_or_none()
    if alloc is None:
        return None
    if alloc.actual_return_date is not None:
        raise ValueError("Asset already returned")

    alloc.actual_return_date = datetime.now(timezone.utc)
    if alloc.asset:
        alloc.asset.status = "Available"

    await db.commit()
    # expire_on_commit=False keeps all loaded relationships intact after commit
    return _to_response(alloc)


async def get_allocations_by_employee(
    db: AsyncSession, employee_id: int
) -> list[AllocationResponse]:
    stmt = (
        select(AssetAllocation)
        .where(AssetAllocation.employee_id == employee_id)
        .options(*_load_options())
    )
    result = await db.execute(stmt)
    return [_to_response(a) for a in result.scalars().all()]
