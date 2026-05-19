from sqlalchemy import Boolean, Column, Integer, String, Text
from sqlalchemy.orm import relationship

from ..database import Base


class Vendor(Base):
    __tablename__ = "vendors"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    contact_person = Column(String(255))
    email = Column(String(255))
    phone = Column(String(50))
    address = Column(Text)
    gst_no = Column(String(50))
    is_active = Column(Boolean, default=True)

    assets = relationship("ITAsset", back_populates="vendor")
