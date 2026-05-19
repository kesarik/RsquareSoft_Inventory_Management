from typing import Optional

from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from ..models.allocation import AssetAllocation
from ..models.asset import ITAsset
from ..schemas.asset import AssetCreate, AssetResponse, AssetUpdate


def _asset_tag(asset: ITAsset) -> str:
    year = asset.purchase_date.year if asset.purchase_date else 2024
    return f"IT-{year}-{asset.id:03d}"


def _to_response(asset: ITAsset) -> AssetResponse:
    assigned_to = None
    if asset.allocations:
        active = next(
            (a for a in asset.allocations if a.actual_return_date is None), None
        )
        if active and active.employee:
            assigned_to = active.employee.full_name

    return AssetResponse(
        id=asset.id,
        asset_tag=_asset_tag(asset),
        model_name=asset.model_name,
        serial_number=asset.serial_number,
        category_id=asset.category_id,
        category=asset.category.name if asset.category else "",
        vendor_id=asset.vendor_id,
        vendor=asset.vendor.name if asset.vendor else "",
        status=asset.status,
        condition=asset.condition,
        purchase_date=asset.purchase_date,
        warranty_expiry=asset.warranty_expiry,
        assigned_to=assigned_to,
        specifications=asset.specifications,
    )


def _full_load():
    return [
        selectinload(ITAsset.category),
        selectinload(ITAsset.vendor),
        selectinload(ITAsset.allocations).selectinload(AssetAllocation.employee),
    ]


async def get_assets(
    db: AsyncSession,
    status: Optional[str] = None,
    category_id: Optional[int] = None,
    search: Optional[str] = None,
) -> list[AssetResponse]:
    stmt = select(ITAsset).options(*_full_load())
    if status:
        stmt = stmt.where(ITAsset.status == status)
    if category_id:
        stmt = stmt.where(ITAsset.category_id == category_id)

    result = await db.execute(stmt)
    assets = list(result.scalars().all())

    if search:
        q = search.lower()
        assets = [
            a
            for a in assets
            if q in a.model_name.lower()
            or q in a.serial_number.lower()
            or (a.category and q in a.category.name.lower())
        ]

    return [_to_response(a) for a in assets]


async def get_asset(db: AsyncSession, asset_id: int) -> Optional[AssetResponse]:
    result = await db.execute(
        select(ITAsset).where(ITAsset.id == asset_id).options(*_full_load())
    )
    asset = result.scalar_one_or_none()
    return _to_response(asset) if asset else None


async def create_asset(db: AsyncSession, data: AssetCreate) -> AssetResponse:
    dup = await db.execute(
        select(ITAsset).where(ITAsset.serial_number == data.serial_number)
    )
    if dup.scalar_one_or_none():
        raise ValueError(f"Serial number '{data.serial_number}' already exists")

    asset = ITAsset(**data.model_dump())
    db.add(asset)
    await db.commit()
    await db.refresh(asset)

    result = await db.execute(
        select(ITAsset).where(ITAsset.id == asset.id).options(*_full_load())
    )
    return _to_response(result.scalar_one())


async def update_asset(
    db: AsyncSession, asset_id: int, data: AssetUpdate
) -> Optional[AssetResponse]:
    result = await db.execute(
        select(ITAsset).where(ITAsset.id == asset_id).options(*_full_load())
    )
    asset = result.scalar_one_or_none()
    if asset is None:
        return None

    update_data = data.model_dump(exclude_unset=True)

    if "serial_number" in update_data:
        dup = await db.execute(
            select(ITAsset).where(
                and_(
                    ITAsset.serial_number == update_data["serial_number"],
                    ITAsset.id != asset_id,
                )
            )
        )
        if dup.scalar_one_or_none():
            raise ValueError(
                f"Serial number '{update_data['serial_number']}' already exists"
            )

    for key, value in update_data.items():
        setattr(asset, key, value)

    await db.commit()

    result = await db.execute(
        select(ITAsset).where(ITAsset.id == asset_id).options(*_full_load())
    )
    return _to_response(result.scalar_one())


async def delete_asset(db: AsyncSession, asset_id: int) -> bool:
    result = await db.execute(
        select(ITAsset)
        .where(ITAsset.id == asset_id)
        .options(selectinload(ITAsset.allocations))
    )
    asset = result.scalar_one_or_none()
    if asset is None:
        return False

    active = next(
        (a for a in asset.allocations if a.actual_return_date is None), None
    )
    if active:
        raise ValueError("Cannot delete an asset that is currently allocated")

    await db.delete(asset)
    await db.commit()
    return True
