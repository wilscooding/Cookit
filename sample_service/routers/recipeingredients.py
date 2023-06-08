from typing import List
from fastapi import APIRouter, Depends, HTTPException
from db import RecipeIngredientIn, RecipeIngredientOut, IngredientIn
from queries import IngredientQueries, RecipeIngredientQueries


router = APIRouter()


@router.post("/api/recipe-ingredients/", response_model=RecipeIngredientOut)
def create_recipe_ingredient(
    recipe_ingredient: RecipeIngredientIn,
    # ingredient_queries: IngredientQueries = Depends(),
    recipe_ingredient_queries: RecipeIngredientQueries = Depends(),
) -> RecipeIngredientOut:
    existing_recipe_ingredient = (
        recipe_ingredient_queries.get_recipe_ingredient(
            recipe_ingredient.recipe_id,
            recipe_ingredient.ingredient_id,
            recipe_ingredient.measurement_id,
            recipe_ingredient.ingredient_id,
        )
    )
    if existing_recipe_ingredient:
        raise HTTPException(
            status_code=400,
            detail="Recipe ingredient already exists",
        )

    # ingredient = ingredient_queries.create_ingredients(recipe_ingredient.ingredient)

    new_recipe_ingredient = recipe_ingredient_queries.create_recipe_ingredient(
        recipe_ingredient.recipe_id,
        recipe_ingredient.measurement_id,
        recipe_ingredient.measurement_qty_id,
        recipe_ingredient.ingredient_id,
    )
    return new_recipe_ingredient


# @router.get("/api/recipe-ingredients/", response_model=list[RecipeIngredientOut])
# def get_recipe_ingredients(
#     recipe_ingredient_queries: RecipeIngredientQueries = Depends(),
# ) -> list[RecipeIngredientOut]:
#     return recipe_ingredient_queries.get_recipe_ingredients()


@router.get(
    "/api/recipe-ingredients/", response_model=List[RecipeIngredientOut]
)
def get_recipe_ingredients(
    recipe_id: int,
    recipe_ingredient_queries: RecipeIngredientQueries = Depends(),
    ingredient_queries: IngredientQueries = Depends(),
) -> List[RecipeIngredientOut]:
    recipe_ingredients = recipe_ingredient_queries.get_recipe_ingredients(
        recipe_id
    )
    for recipe_ingredient in recipe_ingredients:
        ingredient_id = recipe_ingredient.ingredient_id
        ingredient = ingredient_queries.get_ingredient_by_id(ingredient_id)
        recipe_ingredient.ingredient = ingredient
    return recipe_ingredients


@router.get("/api/recipe-ingredients/{id}", response_model=RecipeIngredientOut)
def get_recipe_ingredient_by_id(
    id: int,
    recipe_ingredient_queries: RecipeIngredientQueries = Depends(),
) -> RecipeIngredientOut:
    return recipe_ingredient_queries.get_recipe_ingredient(id)


@router.put("/api/recipe-ingredients/{id}", response_model=RecipeIngredientOut)
def update_recipe_ingredient_by_id(
    id: int,
    recipe_ingredient: RecipeIngredientIn,
    ingredient_queries: IngredientQueries = Depends(),
    recipe_ingredient_queries: RecipeIngredientQueries = Depends(),
) -> RecipeIngredientOut:
    if recipe_ingredient.ingredient:
        ingredient = ingredient_queries.update_ingredient(
            recipe_ingredient.ingredient.id, recipe_ingredient.ingredient
        )

    updated_recipe_ingredient = (
        recipe_ingredient_queries.update_recipe_ingredient(
            id,
            recipe_ingredient.recipe_id,
            recipe_ingredient.measurement_id,
            recipe_ingredient.measurement_qty_id,
            ingredient.id if ingredient else None,
        )
    )
    return updated_recipe_ingredient


@router.delete("/api/recipe-ingredients/{id}", response_model=bool)
def delete_recipe_ingredient_by_id(
    id: int,
    recipe_ingredient_queries: RecipeIngredientQueries = Depends(),
) -> bool:
    return recipe_ingredient_queries.delete_recipe_ingredient(id)
