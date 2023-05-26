from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import APIRouter
from routers import recipes, users, ingredients
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
