from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from ..controllers import allocation_controller
from ..database import get_db
from ..schemas.allocation import AllocationCreate, AllocationResponse

router = APIRouter(prefix="/allocations", tags=["allocations"])


@router.get("", response_model=list[AllocationResponse])
async def list_allocations(
    active_only: bool = False, db: AsyncSession = Depends(get_db)
):
    return await allocation_controller.get_allocations(db, active_only=active_only)


@router.post("", response_model=AllocationResponse, status_code=201)
async def create_allocation(
    data: AllocationCreate, db: AsyncSession = Depends(get_db)
):
    try:
        return await allocation_controller.create_allocation(db, data)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))


@router.put("/{allocation_id}/return", response_model=AllocationResponse)
async def return_allocation(
    allocation_id: int, db: AsyncSession = Depends(get_db)
):
    try:
        alloc = await allocation_controller.return_allocation(db, allocation_id)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Return failed: {type(e).__name__}: {e}")
    if alloc is None:
        raise HTTPException(status_code=404, detail="Allocation not found")
    return alloc


@router.get("/employee/{employee_id}", response_model=list[AllocationResponse])
async def get_employee_allocations(
    employee_id: int, db: AsyncSession = Depends(get_db)
):
    return await allocation_controller.get_allocations_by_employee(db, employee_id)
