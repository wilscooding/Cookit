from fastapi import APIRouter, Depends
from db import IngredientIn, IngredientOut
from queries import IngredientQueries


router = APIRouter()

@router.post("/api/ingredients/", response_model=IngredientOut)
def create_ingredient(
    ingredient: IngredientIn,
    queries: IngredientQueries = Depends(),
    ) -> IngredientOut:
    new_ingredient = queries.create_ingredients(ingredient)
    return new_ingredient

@router.get("/api/ingredients/", response_model=list[IngredientOut])
def get_ingredients(
    queries: IngredientQueries = Depends(),
    ) -> list[IngredientOut]:
    return queries.get_ingredients()

@router.get("/api/ingredients/{id}", response_model=IngredientOut)
def get_ingredient_by_id(
    id: int,
    queries: IngredientQueries = Depends(),
    ) -> IngredientOut:
    return queries.get_ingredient_by_id(id)

@router.put("/api/ingredients/{id}", response_model=IngredientOut)
def update_ingredient_by_id(
    id: int,
    ingredient: IngredientIn,
    queries: IngredientQueries = Depends(),
    ) -> IngredientOut:
    return queries.update_ingredient(id, ingredient)

@router.delete("/api/ingredients/{id}", response_model=bool)
def delete_ingredient_by_id(
    id: int,
    queries: IngredientQueries = Depends(),
    ):
    return queries.delete_ingredient(id)

# @router.get("/api/ingredients/{id}/recipes", response_model=list[IngredientOut])
# def get_ingredient_by_id_recipes(
#     id: int,
#     queries: IngredientQueries = Depends(),
#     ) -> list[IngredientOut]:
#     return queries.get_ingredient_by_id_recipes(id)

# @router.get("/api/ingredients/{id}/recipes/{recipe_id}", response_model=IngredientOut)
# def get_ingredient_by_id_recipes_by_id(
#     id: int,
#     recipe_id: int,
#     queries: IngredientQueries = Depends(),
#     ) -> IngredientOut:
#     return queries.get_ingredient_by_id_recipes_by_id(id, recipe_id)
