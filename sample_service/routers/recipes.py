from queries import RecipeQueries
from fastapi import APIRouter, Depends
from db import RecipesOut
from keys import SPOONACULAR_API_KEY
import requests


router = APIRouter()




@router.get("/api/myrecipes/", response_model=RecipesOut)
def recipe_list(user_id: int, queries: RecipeQueries = Depends()):
    return {
        "recipes": queries.get_all_recipes(user_id),
    }


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
