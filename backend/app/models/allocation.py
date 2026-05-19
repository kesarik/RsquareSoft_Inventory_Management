from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..database import Base


class AssetAllocation(Base):
    __tablename__ = "asset_allocations"

    id = Column(Integer, primary_key=True)
    asset_id = Column(
        Integer, ForeignKey("it_assets.id", ondelete="RESTRICT"), nullable=False
    )
    employee_id = Column(
        Integer, ForeignKey("employees.id", ondelete="RESTRICT"), nullable=False
    )
    allocation_date = Column(DateTime(timezone=True), server_default=func.now())
    actual_return_date = Column(DateTime(timezone=True), nullable=True)
    digital_ack_status = Column(Boolean, default=False)
    remarks = Column(Text)

    asset = relationship("ITAsset", back_populates="allocations")
    employee = relationship("Employee", back_populates="allocations")
