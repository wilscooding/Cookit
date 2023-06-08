from queries import RecipeQueries
from fastapi import APIRouter, Depends
from db import RecipesOut, RecipeIn, RecipeOut, HttpError
from keys import SPOONACULAR_API_KEY
import requests



router = APIRouter()


@router.get("/api/myrecipes/", response_model=RecipesOut)
def recipe_list(user_id: int, queries: RecipeQueries = Depends()):
    return {
        "recipes": queries.get_all_recipes(user_id),
    }


@router.post("/api/myrecipes/", response_model=RecipeOut)
def add_recipe(
    info: RecipeIn,
    accounts: RecipeQueries = Depends(),
) -> RecipeOut:
    new_recipe = accounts.create_recipes(info)
    return RecipeOut(**new_recipe.dict())


@router.delete("/api/myrecipes/{recipe_id}", response_model=bool)
def delete__my_recipe(
    recipe_id: int,
    accounts: RecipeQueries = Depends(),
):
    record = accounts.delete_recipe(recipe_id)
    return True


@router.put("/api/myrecipes/{recipe_id}", response_model=RecipeOut)
def update__my_recipe(
    recipe_id: int,
    info: RecipeIn,
    accounts: RecipeQueries = Depends(),
) -> RecipeOut:
    updated_recipe = accounts.update_recipe(recipe_id, info)
    return RecipeOut(**updated_recipe.dict())


@router.get("/api/myrecipes/{recipe_id}", response_model=RecipeOut)
def get_recipe(
    recipe_id: int,
    queries: RecipeQueries = Depends(),
) -> RecipeOut:
    recipe = queries.get_recipe_by_id(recipe_id)
    if recipe:
        return RecipeOut(**recipe.dict())
    else:
        return RecipeOut(**{"message": "Recipe not found"})


@router.get("/recipes")
async def search_recipes(query: str):
    api_url = "https://api.spoonacular.com/recipes/complexSearch"
    api_key = SPOONACULAR_API_KEY
    headers = {"Content-Type": "application/json"}
    params = {"apiKey": api_key, "query": query}
    response = requests.get(api_url, params=params, headers=headers)
    data = response.json()
    recipes = data.get("results")
    return {"recipes": recipes}


@router.get("/recipes/{id}")
async def get_recipe_info(id: str):
    api_url = f"https://api.spoonacular.com/recipes/{id}/information"
    api_key = SPOONACULAR_API_KEY
    headers = {"Content-Type": "application/json"}
    params = {
        "apiKey": api_key,
        "includeNutrition": False,
    }
    response = requests.get(api_url, params=params, headers=headers)
    data = response.json()
    return {"recipe": data}



