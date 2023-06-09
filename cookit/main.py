from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import APIRouter
from routers import (
    recipes,
    grocerylist,
    users,
    ingredients,
    measurementqty,
    measurementunits,
    recipeingredients,
    my_ingredients,
)
import os
from authenticator import authenticator


app = FastAPI()
router = APIRouter()

origins = [
    "http://localhost:3000",
    os.environ.get("CORS_HOST", None),
    os.environ.get("REACT_APP_COOKIT_API_HOST", None),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(users.router)
app.include_router(recipes.router)
app.include_router(authenticator.router)
app.include_router(ingredients.router)
app.include_router(measurementqty.router)
app.include_router(measurementunits.router)
app.include_router(recipeingredients.router)
app.include_router(my_ingredients.router)
app.include_router(grocerylist.router)
