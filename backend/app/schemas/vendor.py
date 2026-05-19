from pydantic import BaseModel


class VendorResponse(BaseModel):
    id: int
    name: str
    contact_person: str | None = None
    email: str | None = None
    phone: str | None = None
    is_active: bool

    model_config = {"from_attributes": True}
