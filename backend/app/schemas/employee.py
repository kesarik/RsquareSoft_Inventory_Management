from datetime import date
from typing import Optional

from pydantic import BaseModel


class EmployeeResponse(BaseModel):
    id: int
    emp_id: str
    full_name: str
    email: str
    department: Optional[str] = None
    designation: Optional[str] = None
    join_date: Optional[date] = None
    is_active: bool

    model_config = {"from_attributes": True}
