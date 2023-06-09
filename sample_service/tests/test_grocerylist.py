from fastapi.testclient import TestClient
from main import app
from queries import GroceryListQueries
from db import GroceryListItemOut, GroceryListItemIn

client = TestClient(app)


def test_get_grocery_list():
    # Arrange
    user_id = 1

    # Act
    response = client.get(f"/api/grocerylist/?user_id={user_id}")

    # Assert
    assert response.status_code == 200
    response_data = response.json()
    assert isinstance(response_data, list)


def test_add_to_grocery_list():
    # Arrange
    info = GroceryListItemIn(
        user_id=1,
        ingredient_name="Tomato",
        measurement_id=1,
        measurement_qty_id=2,
        notes="Some notes",
    )

    # Act
    response = client.post("/api/grocerylist/", json=info.dict())

    # Assert
    assert response.status_code == 200
    assert response.json()["ingredient_name"] == "Tomato"


def test_remove_from_grocery_list():
    # Arrange
    item_id = 1

    # Act
    response = client.delete(f"/api/grocerylist/{item_id}")

    # Assert
    assert response.status_code == 200
    assert response.json() == True


def test_get_grocery_list_item():
    # Arrange
    item_id = 2

    # Act
    response = client.get(f"/api/grocerylist/{item_id}")

    # Assert
    assert response.status_code == 200
    assert response.json()["id"] == item_id


def test_update_grocery_list_item():
    # Arrange
    item_id = 8
    info = {
        "user_id": 1,
        "ingredient_name": "Updated Tomato",
        "measurement_id": 2,
        "measurement_qty_id": 3,
        "notes": "Updated notes",
    }

    # Act
    response = client.put(f"/api/grocerylist/{item_id}", json=info)

    # Assert
    assert response.status_code == 200
    if response.json() is not None:
        assert response.json()["ingredient_name"] == "Updated Tomato"


def test_get_grocery_list_invalid_user_id():
    # Arrange
    user_id = "invalid id"

    # Act
    response = client.get(f"/api/grocerylist/?user_id={user_id}")

    # Assert
    assert response.status_code == 422
    assert "value is not a valid integer" in response.json()["detail"][0]["msg"]


