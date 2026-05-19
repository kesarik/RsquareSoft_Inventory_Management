from pydantic import BaseModel


class CategoryResponse(BaseModel):
    id: int
    name: str
    type: str
    description: str | None = None
    is_active: bool

    model_config = {"from_attributes": True}
