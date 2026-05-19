from sqlalchemy import Column, Date, Enum, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from ..database import Base


class ITAsset(Base):
    __tablename__ = "it_assets"

    id = Column(Integer, primary_key=True)
    category_id = Column(
        Integer, ForeignKey("categories.id", ondelete="RESTRICT"), nullable=False
    )
    vendor_id = Column(
        Integer, ForeignKey("vendors.id", ondelete="RESTRICT"), nullable=False
    )
    model_name = Column(String(255), nullable=False)
    serial_number = Column(String(100), unique=True, nullable=False)
    purchase_date = Column(Date)
    warranty_expiry = Column(Date)
    status = Column(
        Enum(
            "Available",
            "Allocated",
            "Under Maintenance",
            "Damaged",
            "Scrap",
            "Replaced",
            name="asset_status",
            create_type=False,
        ),
        nullable=False,
        default="Available",
    )
    condition = Column(
        Enum("New", "Good", "Fair", "Poor", name="asset_condition", create_type=False),
        nullable=False,
        default="New",
    )
    specifications = Column(JSONB)

    category = relationship("Category", back_populates="assets")
    vendor = relationship("Vendor", back_populates="assets")
    allocations = relationship("AssetAllocation", back_populates="asset")
