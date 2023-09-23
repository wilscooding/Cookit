from fastapi.testclient import TestClient
from main import app
from queries import GroceryListQueries
from db import GroceryListItemIn, GroceryListItemOut

client = TestClient(app)


class EmptyGroceryQueries:
    def get_all_grocery(self, user_id):
        return []

    def get_grocery_list(self, user_id):
        return []

    def get_grocery_list_item_by_id(self, item_id):
        return None


class TwoGroceryQueries:
    def get_grocery_list(self, user_id):
        return [
            GroceryListItemOut(
                id=1,
                user_id=1,
                ingredient_name="garlic",
                measurement_id=1,
                measurement_qty_id=2,
                notes="Some notes",
            ),
            GroceryListItemOut(
                id=2,
                user_id=1,
                ingredient_name="onion",
                measurement_id=1,
                measurement_qty_id=2,
                notes="Some notes",
            ),
        ]

    def get_grocery_list_item_by_id(self, item_id):
        return GroceryListItemOut(
            id=1,
            user_id=1,
            ingredient_name="garlic",
            measurement_id=1,
            measurement_qty_id=2,
            notes="Some notes",
        )


def test_get_grocery_list():
    app.dependency_overrides[GroceryListQueries] = TwoGroceryQueries
    user_id = 1

    response = client.get(f"/api/grocerylist/?user_id={user_id}")

    assert response.status_code == 200
    response_data = response.json()
    assert isinstance(response_data, list)
    assert len(response_data) == 2
    assert response_data[0] == {
        "id": 1,
        "user_id": 1,
        "ingredient_name": "garlic",
        "measurement_id": 1,
        "measurement_qty_id": 2,
        "notes": "Some notes",
    }
    app.dependency_overrides[GroceryListQueries] = EmptyGroceryQueries


def test_add_to_grocery_list():
    app.dependency_overrides[GroceryListQueries] = GroceryListQueries
    info = GroceryListItemIn(
        id=1,
        user_id=1,
        ingredient_name="Tomato",
        measurement_id=1,
        measurement_qty_id=2,
        notes="Some notes",
    )

    response = client.post("/api/grocerylist/", json=info.dict())

    assert response.status_code == 200
    assert response.json()["ingredient_name"] == "Tomato"
    app.dependency_overrides[GroceryListQueries] = GroceryListQueries


def test_update_grocery_list_item():
    app.dependency_overrides[GroceryListQueries] = GroceryListQueries
    item_id = 1
    info = GroceryListItemIn(
        id=1,
        user_id=1,
        ingredient_name="Updated Tomato",
        measurement_id=2,
        measurement_qty_id=3,
        notes="Updated notes",
    )

    response = client.put(f"/api/grocerylist/{item_id}", json=info.dict())

    assert response.status_code == 200
    assert response.json()["ingredient_name"] == "Updated Tomato"
    app.dependency_overrides[GroceryListQueries] = GroceryListQueries


def test_get_grocery_list_item():
    app.dependency_overrides[GroceryListQueries] = TwoGroceryQueries
    item_id = 1

    response = client.get(f"/api/grocerylist/{item_id}")

    assert response.status_code == 200
    assert response.json() == {
        "id": 1,
        "user_id": 1,
        "ingredient_name": "garlic",
        "measurement_id": 1,
        "measurement_qty_id": 2,
        "notes": "Some notes"
    }
    app.dependency_overrides[GroceryListQueries] = EmptyGroceryQueries
