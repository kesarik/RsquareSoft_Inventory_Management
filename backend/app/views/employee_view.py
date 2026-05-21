from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from ..controllers import employee_controller
from ..database import get_db
from ..schemas.employee import EmployeeResponse

router = APIRouter(prefix="/employees", tags=["employees"])


@router.get("", response_model=list[EmployeeResponse])
async def list_employees(db: AsyncSession = Depends(get_db)):
    return await employee_controller.get_employees(db)


@router.get("/{employee_id}", response_model=EmployeeResponse)
async def get_employee(employee_id: int, db: AsyncSession = Depends(get_db)):
    emp = await employee_controller.get_employee(db, employee_id)
    if emp is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return emp
