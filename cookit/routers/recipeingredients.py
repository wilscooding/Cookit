from typing import List
from fastapi import APIRouter, HTTPException
from db import RecipeIngredientIn, RecipeIngredientOut
from queries import RecipeIngredientQueries


router = APIRouter()
queries = RecipeIngredientQueries()


@router.post("/api/recipe_ingredients/", response_model=RecipeIngredientOut)
def create_recipe_ingredient(
    recipe_ingredient: RecipeIngredientIn
) -> RecipeIngredientOut:
    created_ingredient = queries.create_recipe_ingredient(
        recipe_ingredient.recipe_id,
        recipe_ingredient.measurement_id,
        recipe_ingredient.measurement_qty_id,
        recipe_ingredient.ingredient_id,
    )
    if created_ingredient:
        return created_ingredient
    raise HTTPException(status_code=500, detail="Failed to create recipe ingredient")


@router.get("/api/recipe_ingredients/{id}", response_model=RecipeIngredientOut)
def get_recipe_ingredient(id: int) -> RecipeIngredientOut:
    ingredient = queries.get_recipe_ingredient_by_id(id)
    if ingredient:
        return ingredient
    raise HTTPException(status_code=404, detail="Recipe ingredient not found")


@router.get("/api/recipe_ingredients/recipe/{recipe_id}", response_model=List[RecipeIngredientOut])
def get_recipe_ingredients(recipe_id: int) -> List[RecipeIngredientOut]:
    ingredients = queries.get_recipe_ingredients_by_recipe_id(recipe_id)
    if ingredients:
        return ingredients
    raise HTTPException(status_code=404, detail="No recipe ingredients found for the recipe")


@router.delete("/api/recipe_ingredients/{id}")
def delete_recipe_ingredient(id: int) -> None:
    ingredient = queries.get_recipe_ingredient_by_id(id)
    if ingredient:
        queries.delete_recipe_ingredient(id)
        return
    raise HTTPException(status_code=404, detail="Recipe ingredient not found")


@router.put("/api/recipe_ingredients/{id}", response_model=RecipeIngredientOut)
def update_recipe_ingredient(
    id: int, recipe_ingredient: RecipeIngredientIn
) -> RecipeIngredientOut:
    existing_ingredient = queries.get_recipe_ingredient_by_id(id)
    if existing_ingredient:
        updated_ingredient = queries.update_recipe_ingredient(
            id,
            recipe_ingredient.recipe_id,
            recipe_ingredient.measurement_id,
            recipe_ingredient.measurement_qty_id,
            recipe_ingredient.ingredient_id,
        )
        return updated_ingredient
    raise HTTPException(status_code=404, detail="Recipe ingredient not found")
