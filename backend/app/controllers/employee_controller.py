from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.employee import Employee
from ..schemas.employee import EmployeeResponse


async def get_employees(db: AsyncSession) -> list[EmployeeResponse]:
    stmt = select(Employee).order_by(Employee.full_name)
    result = await db.execute(stmt)
    return [EmployeeResponse.model_validate(e) for e in result.scalars().all()]


async def get_employee(db: AsyncSession, employee_id: int) -> Optional[EmployeeResponse]:
    result = await db.execute(select(Employee).where(Employee.id == employee_id))
    emp = result.scalar_one_or_none()
    return EmployeeResponse.model_validate(emp) if emp else None
