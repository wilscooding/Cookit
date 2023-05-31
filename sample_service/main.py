from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import APIRouter
<<<<<<< HEAD
# from keys import SPOONACULAR_API_KEY
from routers import recipes, users
=======
from routers import recipes, grocerylist, users, ingredients, measurementqty, measurementunits, recipeingredients, my_ingredients

>>>>>>> main
from authenticator import authenticator


app = FastAPI()
router = APIRouter()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
