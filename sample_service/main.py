from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import requests
from fastapi import APIRouter

app = FastAPI()
router = APIRouter()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.environ.get("CORS_HOST", "http://localhost:3000")
    ],
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
            "min": "00"
        }
    }


@router.get('/recipes')
async def search_recipes(query: str):
    api_url = 'https://api.edamam.com/search'
    api_key = '38cffb7fafa2f827a7426b8beb6970c3'
    api_id = '7e9a5bb7'
    params = {
        'q': query,
        'app_id': api_id,
        'app_key': api_key,
    }
    response = requests.get(api_url, params=params)
    data = response.json()
    recipes = data.get('hits')
    return {'recipes': recipes}


@router.get('/recipes/{id}')
async def get_recipe(id: str):
    api_url = f'https://api.edamam.com/api/recipes/v2/{id}'
    api_key = '38cffb7fafa2f827a7426b8beb6970c3'
    api_id = '7e9a5bb7'
    params = {
        'type': 'public',
        'app_id': api_id,
        'app_key': api_key,
    }
    response = requests.get(api_url, params=params)
    data = response.json()
    recipe = data.get('recipe')
    return {'recipe': recipe}


app.include_router(router)
