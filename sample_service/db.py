from pydantic import BaseModel
from jwtdown_fastapi.authentication import Token
from typing import Optional


class DuplicateUserError(ValueError):
    pass


class UserIn(BaseModel):
    email: str
    password: str


class User(BaseModel):
    id: int
    first: str | None
    last: str | None
    avatar: str | None
    email: str
    username: str | None


class UserOut(BaseModel):
    id: int
    email: str


class UserOutWithPassword(UserOut):
    hashed_password: str


class UsersOut(BaseModel):
    users: list[UserOut]


class RecipeIn(BaseModel):
    creator_id: Optional[int]
    recipe_name: Optional[str]
    diet: Optional[str]
    img: Optional[str]

class RecipeOut(BaseModel):
    id: int
    recipe_name: str
    diet: str
    img: str | None

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
