# from fastapi.testclient import TestClient
# from main import app
# from queries import GroceryListQueries
# from db import GroceryListItemIn, GroceryListItemOut

# client = TestClient(app)


# class EmptyGroceryQueries:
#     def get_all_recipes(self, user_id):
#         return []


# class TwoGroceryQueries:
#     def get_all_recipes(self, user_id):
#         return [
#             GroceryListItemOut(
#                 user_id=1,
#                 ingredient_name="garlic",
#                 measurement_id=1,
#                 measurement_qty_id=2,
#                 notes="Some notes",
#             ),
#             GroceryListItemOut(
#                 user_id=1,
#                 ingredient_name="onion",
#                 measurement_id=1,
#                 measurement_qty_id=2,
#                 notes="Some notes",
#             ),
#         ]


# def test_list_grocery_full():
#     app.dependency_overrides[GroceryListQueries] = GroceryListQueries
#     response = client.get("/api/myrecipes/?user_id=1")

#     assert response.status_code == 200
#     assert len(response.json()["g"]) == 2
#     assert response.json()["recipes"][0] == {
#         "id": 1,
#         "recipe_name": "pancakes",
#         "diet": "glutenFree",
#         "img":
#         "Pancakes-mfs_001.jpg",
#         "description": "Super yummy!",
#         "steps": "1. Make batter. 2. Cook batter in pan. 3. Enjoy!",
#         "creator_id": 1,
#     }
#     app.dependency_overrides[GroceryListQueries] = GroceryListQueries

# def test_get_grocery_list():
#     user_id = 1

#     response = client.get(f"/api/grocerylist/?user_id={user_id}")

#     assert response.status_code == 200
#     response_data = response.json()
#     assert isinstance(response_data, list)


# def test_add_to_grocery_list():
#     info = GroceryListItemIn(
#         user_id=1,
#         ingredient_name="Tomato",
#         measurement_id=1,
#         measurement_qty_id=2,
#         notes="Some notes",
#     )

#     response = client.post("/api/grocerylist/", json=info.dict())

#     assert response.status_code == 200
#     assert response.json()["ingredient_name"] == "Tomato"


# def test_update_grocery_list_item():
#     item_id = 1
#     info = GroceryListItemIn(
#         user_id=1,
#         ingredient_name="Updated Tomato",
#         measurement_id=2,
#         measurement_qty_id=3,
#         notes="Updated notes",
#     )

#     response = client.put(f"/api/grocerylist/{item_id}", json=info.dict())

#     assert response.status_code == 200
#     assert response.json()["ingredient_name"] == "Updated Tomato"


# def test_get_grocery_list_item():
#     item_id = 1

#     response = client.get(f"/api/grocerylist/{item_id}")

#     assert response.status_code == 200
#     assert response.json()["id"] == item_id
