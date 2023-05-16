from db import RecipeQueries
from fastapi import APIRouter, Depends, Response
from pydantic import BaseModel
from .users import UserOut


router = APIRouter()

class RecipeIn(BaseModel):
  creator_id: UserOut
  recipe_name: str
  diet: str
  img: str

class RecipeOut(BaseModel):
  id: int
  recipe_name: str
  diet: str
  img: str | None

class RecipesOut(BaseModel):
  recipes: list[RecipeOut]



@router.get("/api/myrecipes/", response_model=RecipesOut)
def recipe_list(user_id: int, queries: RecipeQueries = Depends()):
    return {
        "recipes": queries.get_all_recipes(user_id),
    }
