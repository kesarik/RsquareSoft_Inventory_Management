from datetime import date
from typing import Any, Optional

from pydantic import BaseModel


class AssetCreate(BaseModel):
    category_id: int
    vendor_id: int
    model_name: str
    serial_number: str
    purchase_date: Optional[date] = None
    warranty_expiry: Optional[date] = None
    status: str = "Available"
    condition: str = "New"
    specifications: Optional[dict[str, Any]] = None


class AssetUpdate(BaseModel):
    category_id: Optional[int] = None
    vendor_id: Optional[int] = None
    model_name: Optional[str] = None
    serial_number: Optional[str] = None
    purchase_date: Optional[date] = None
    warranty_expiry: Optional[date] = None
    status: Optional[str] = None
    condition: Optional[str] = None
    specifications: Optional[dict[str, Any]] = None


class AssetResponse(BaseModel):
    id: int
    asset_tag: str
    model_name: str
    serial_number: str
    category_id: int
    category: str
    vendor_id: int
    vendor: str
    status: str
    condition: str
    purchase_date: Optional[date] = None
    warranty_expiry: Optional[date] = None
    assigned_to: Optional[str] = None
    specifications: Optional[dict[str, Any]] = None

    model_config = {"from_attributes": True}
