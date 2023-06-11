from fastapi.testclient import TestClient
from main import app
from db import MyIngredientIn, MyIngredientOut
from queries import MyIngredientQueries

client = TestClient(app)


class EmptyIngredientQueries:
    def get_all_my_ingredients(self, user_id):
        return []

    def get_my_ingredient_list(self, ingredient):
        # Create new ingredient based on the input data
        return []

    def get_my_ingredient_by_id(self, ingredient_id):
        # Retrieve ingredient based on the given ID
        return None


class TwoIngredientQueries:
    def get_all_my_ingredients(self, user_id):
        return [
            MyIngredientOut(
                id=1,
                user_id=1,
                ingredient_name="Pancakes",
                measurement_id=1,
                measurement_qty_id=2,
                notes="Some notes",
            ),
            MyIngredientOut(
                id=2,
                user_id=1,
                ingredient_name="Strawberry Pancakes",
                measurement_id=1,
                measurement_qty_id=2,
                notes="Some notes",
            ),
        ]

    def get_my_ingredient_by_id(self, item_id):
        return MyIngredientQueries(
            id=1,
            user_id=1,
            ingredient_name="Pancakes",
            measurement_id=1,
            measurement_qty_id=2,
            notes="Some notes",
        )


def test_add_to_myingredients():
    app.dependency_overrides[MyIngredientQueries] = MyIngredientQueries
    info = MyIngredientIn(
        id=1,
        user_id=1,
        ingredient_name="Pancakes",
        measurement_id=1,
        measurement_qty_id=2,
        notes="Some notes",
    )

    response = client.post("/api/myingredients/", json=info.dict())

    assert response.status_code == 200
    assert response.json()["ingredient_name"] == "Pancakes"

    app.dependency_overrides[MyIngredientQueries] = MyIngredientQueries


def test_update_myingredient():
    app.dependency_overrides[MyIngredientQueries] = MyIngredientQueries
    ingredient_id = 1
    info = MyIngredientIn(
        id=1,
        user_id=1,
        ingredient_name="Updated Pancakes",
        measurement_id=2,
        measurement_qty_id=3,
        notes="Updated notes",
    )

    response = client.put(
        f"/api/myingredients/{ingredient_id}", json=info.dict()
    )

    assert response.status_code == 200
    assert response.json()["ingredient_name"] == "Updated Pancakes"

    app.dependency_overrides[MyIngredientQueries] = MyIngredientQueries
