from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import requests
from fastapi import APIRouter
from keys import SPOONACULAR_API_KEY
from authenticator import authenticator
from routers import users, recipes


app = FastAPI()
router = APIRouter()
app.include_router(authenticator.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get("CORS_HOST", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/launch-details")
def launch_details():
    return {
        "launch_details": {
            "module": 3,
            "week": 17,
            "day": 5,
            "hour": 19,
            "min": "00",
        }
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


app.include_router(router)
app.include_router(users.router)
app.include_router(recipes.router)
