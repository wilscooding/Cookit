from fastapi.testclient import TestClient
from main import app
from queries import IngredientQueries
from db import MyIngredientOut, MyIngredientIn

client = TestClient(app)

def test_get_myinventory():
    # Arrange
    user_id = 1

    # Act
    response = client.get(f"/api/myingredients/?user_id={user_id}")

    # Assert
    assert response.status_code == 200
    response_data = response.json()
    assert isinstance(response_data, list)


def test_add_to_myinventory():
    # Arrange
    info = MyIngredientIn (
        user_id = 1,
        ingredient_name = "Pancakes",
        measurement_id = 1,
        measurement_qty_id = 2,
        notes = "Some notes"
        )



    # Act
    response = client.post("/api/myingredients/", json=info.dict())

    # Assert
    assert response.status_code == 200
    assert response.json()["ingredient_name"] == "Pancakes"

def test_remove_from_myinventory():
    # Arrange
    ingredient_id = 1

    # Act
    response = client.delete(f"/api/myingredients/{ingredient_id}")

    # Assert
    assert response.status_code == 200
    assert response.json() == True

def test_update_myinventory():
    # Arrange
    ingredient_id = 8
    info = {
        "user_id": 1,
        "ingredient_name": "Updated Pancakes",
        "measurement_id": 2,
        "measurement_qty_id": 3,
        "notes": "updated notes"
    }


    # Act
    response = client.put(f"/api/myingredients/{ingredient_id}", json=info)

    # Assert
    assert response.status_code == 200
    assert response.json()["ingredient_name"] == "Updated Pancakes"

def test_get_myinventory_list_ingredient():
    # Arrange
    ingredient_id = 8

    # Act
    response = client.get(f"/api/myingredients/{ingredient_id}")

    # Assert
    assert response.status_code == 200
    assert response.json()["id"] == ingredient_id
