from sqlalchemy import Boolean, Column, DateTime, Enum, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    type = Column(Enum("IT", "Facility", name="category_type", create_type=False), nullable=False)
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Boolean, default=True)

    assets = relationship("ITAsset", back_populates="category")
