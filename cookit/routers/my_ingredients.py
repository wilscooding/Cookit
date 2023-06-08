from db import MyIngredientOut, MyIngredientIn
from queries import MyIngredientQueries
from fastapi import Depends, HTTPException, APIRouter
from typing import List


router = APIRouter()






@router.get("/api/myingredients/", response_model=List[MyIngredientOut])
def my_ingredient_list(user_id: int, queries: MyIngredientQueries = Depends()):
    return queries.get_all_my_ingredients(user_id)


@router.post("/api/myingredients/", response_model=MyIngredientOut)
def add_my_ingredient(
    info: MyIngredientIn,
    accounts: MyIngredientQueries = Depends(),
) -> MyIngredientOut:
    new_ingredient = accounts.create_my_ingredient(info)
    return MyIngredientOut(**new_ingredient.dict())


@router.delete("/api/myingredients/{ingredient_id}", response_model=bool)
def delete_my_ingredient(
    ingredient_id: int,
    accounts: MyIngredientQueries = Depends(),
):
    accounts.delete_my_ingredient(ingredient_id)
    return True


@router.put("/api/myingredients/{ingredient_id}", response_model=MyIngredientOut)
def update_my_ingredient(
    ingredient_id: int,
    info: MyIngredientIn,
    accounts: MyIngredientQueries = Depends(),
) -> MyIngredientOut:
    updated_ingredient = accounts.update_my_ingredient(ingredient_id, info)
    return MyIngredientOut(**updated_ingredient.dict())


@router.get("/api/myingredients/{ingredient_id}", response_model=MyIngredientOut)
def get_my_ingredient(
    ingredient_id: int,
    queries: MyIngredientQueries = Depends(),
) -> MyIngredientOut:
    ingredient = queries.get_my_ingredient_by_id(ingredient_id)
    if ingredient:
        return MyIngredientOut(**ingredient.dict())
    else:
        raise HTTPException(status_code=404, detail="Ingredient not found")
