from sqlalchemy import Boolean, Column, Date, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from ..database import Base


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True)
    emp_id = Column(String(50), unique=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    department = Column(String(100))
    designation = Column(String(100))
    join_date = Column(Date)
    role_id = Column(Integer, ForeignKey("roles.id", ondelete="SET NULL"), nullable=True)
    is_active = Column(Boolean, default=True)

    allocations = relationship("AssetAllocation", back_populates="employee")
