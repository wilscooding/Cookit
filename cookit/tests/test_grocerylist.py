from fastapi.testclient import TestClient
from main import app

from db import GroceryListItemIn

client = TestClient(app)


def test_get_grocery_list():
    user_id = 1

    response = client.get(f"/api/grocerylist/?user_id={user_id}")

    assert response.status_code == 200
    response_data = response.json()
    assert isinstance(response_data, list)


def test_add_to_grocery_list():
    info = GroceryListItemIn(
        user_id=1,
        ingredient_name="Tomato",
        measurement_id=1,
        measurement_qty_id=2,
        notes="Some notes",
    )

    response = client.post("/api/grocerylist/", json=info.dict())

    assert response.status_code == 200
    assert response.json()["ingredient_name"] == "Tomato"


def test_remove_from_grocery_list():
    item_id = 1

    response = client.delete(f"/api/grocerylist/{item_id}")

    assert response.status_code == 200
    assert response.json() == True


def test_update_grocery_list_item():
    item_id = 2
    info = GroceryListItemIn(
        user_id=1,
        ingredient_name="Updated Tomato",
        measurement_id=2,
        measurement_qty_id=3,
        notes="Updated notes",
    )

    response = client.put(f"/api/grocerylist/{item_id}", json=info.dict())

    assert response.status_code == 200
    assert response.json()["ingredient_name"] == "Updated Tomato"


def test_get_grocery_list_item():
    item_id = 8

    response = client.get(f"/api/grocerylist/{item_id}")

    assert response.status_code == 200
    assert response.json()["id"] == item_id
