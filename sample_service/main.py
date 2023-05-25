from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from fastapi import APIRouter
# from keys import SPOONACULAR_API_KEY
from routers import recipes, users
import requests
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
