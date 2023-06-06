from pydantic import BaseModel
from jwtdown_fastapi.authentication import Token
from typing import Optional, Union


class DuplicateUserError(ValueError):
    pass


class UserIn(BaseModel):
    email: str
    password: str


class User(BaseModel):
    first: str | None
    last: str | None
    avatar: str | None
    email: str | None
    username: str | None


class UserOut(BaseModel):
    id: int
    email: str


class UserOutWithPassword(UserOut):
    hashed_password: str


class UsersOut(BaseModel):
    users: list[UserOut]


class RecipeIn(BaseModel):
    creator_id: int
    recipe_name: str
    diet: Optional[str]
    img: Optional[str]
    description: str
    steps: str


class RecipeOut(BaseModel):
    id: int
    recipe_name: str
    diet: str
    img: str | None
    description: str
    steps: str
    creator_id: int


class RecipesOut(BaseModel):
    recipes: list[RecipeOut]


class UserToken(Token):
    user: UserOut


class UserForm(BaseModel):
    username: str
    password: str


class HttpError(BaseModel):
    detail: str

class IngredientIn(BaseModel):
    ingredient_name: str

class IngredientOut(BaseModel):
    id: int
    ingredient_name: str

class MeasurementQtyIn(BaseModel):
    qty_amount: Union[float, str]

class MeasurementQtyOut(BaseModel):
    id: int
    qty_amount: Union[float, str]

class MeasurementUnitIn(BaseModel):
    measurement_description: str

class MeasurementUnitOut(BaseModel):
    id: int
    measurement_description: str

class RecipeIngredientIn(BaseModel):
    recipe_id: int
    measurement_id: int
    measurement_qty_id: int
    ingredient_id: int
    
class RecipeIngredientOut(BaseModel):
    id: int
    recipe_id: int
    measurement_id: int
    measurement_qty_id: int
    ingredient_id: int

class MyIngredientIn(BaseModel):
    user_id: int
    ingredient_name: str
    measurement_id: int
    measurement_qty_id: int
    notes: Optional[str] = None

class MyIngredientOut(BaseModel):
    id: int
    user_id: int
    ingredient_name: str
    measurement_id: int
    measurement_qty_id: int
    notes: Optional[str] = None


class GroceryListItemIn(BaseModel):
    user_id: int
    ingredient_name: str
    measurement_id: int
    measurement_qty_id: int
    notes: Optional[str] = None

class GroceryListItemOut(BaseModel):
    id: int
    user_id: int
    ingredient_name: str
    measurement_id: int
    measurement_qty_id: int
    notes: Optional[str] = None
