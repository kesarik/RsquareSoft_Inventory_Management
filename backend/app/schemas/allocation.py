from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class AllocationCreate(BaseModel):
    asset_id: int
    employee_id: int
    remarks: Optional[str] = None


class AllocationResponse(BaseModel):
    id: int
    asset_id: int
    asset_tag: str
    model_name: str
    category: str
    employee_id: int
    employee_name: str
    emp_id: str
    department: Optional[str] = None
    allocation_date: datetime
    actual_return_date: Optional[datetime] = None
    digital_ack_status: bool
    remarks: Optional[str] = None

    model_config = {"from_attributes": True}
