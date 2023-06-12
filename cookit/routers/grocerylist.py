from queries import GroceryListQueries
from db import GroceryListItemIn, GroceryListItemOut
from fastapi import APIRouter, Depends, HTTPException
from typing import List

router = APIRouter()


@router.get("/api/grocerylist/", response_model=List[GroceryListItemOut])
def grocery_list(user_id: int, queries: GroceryListQueries = Depends()):
    return queries.get_grocery_list(user_id)


@router.post("/api/grocerylist/", response_model=GroceryListItemOut)
def add_to_grocery_list(
    info: GroceryListItemIn,
    queries: GroceryListQueries = Depends(),
) -> GroceryListItemOut:
    new_item = queries.add_to_grocery_list(info)
    return GroceryListItemOut(**new_item.dict())


@router.delete("/api/grocerylist/{item_id}", response_model=bool)
def remove_from_grocery_list(
    item_id: int,
    queries: GroceryListQueries = Depends(),
):
    queries.remove_from_grocery_list(item_id)
    return True


@router.put("/api/grocerylist/{item_id}", response_model=GroceryListItemOut)
def update_grocery_list_item(
    item_id: int,
    info: GroceryListItemIn,
    queries: GroceryListQueries = Depends(),
) -> GroceryListItemOut:
    updated_item = queries.update_grocery_list_item(item_id, info)
    if updated_item:
        return GroceryListItemOut(**updated_item.dict())
    else:
        raise HTTPException(
            status_code=404, detail="Grocery list item not found"
        )


@router.get("/api/grocerylist/{item_id}", response_model=GroceryListItemOut)
def get_grocery_list_item(
    item_id: int,
    queries: GroceryListQueries = Depends(),
) -> GroceryListItemOut:
    item = queries.get_grocery_list_item_by_id(item_id)
    if item:
        return GroceryListItemOut(**item.dict())
    else:
        raise HTTPException(
            status_code=404, detail="Grocery list item not found"
        )
