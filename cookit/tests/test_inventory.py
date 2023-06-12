# from fastapi.testclient import TestClient
# from main import app
# from db import MyIngredientIn

# client = TestClient(app)


# def test_get_myinventory():
#     user_id = 1

#     response = client.get(f"/api/myingredients/?user_id={user_id}")

#     assert response.status_code == 200
#     response_data = response.json()
#     assert isinstance(response_data, list)


# def test_add_to_myinventory():
#     info = MyIngredientIn(
#         user_id=1,
#         ingredient_name="Pancakes",
#         measurement_id=1,
#         measurement_qty_id=2,
#         notes="Some notes",
#     )

#     response = client.post("/api/myingredients/", json=info.dict())

#     assert response.status_code == 200
#     assert response.json()["ingredient_name"] == "Pancakes"


# def test_update_myinventory():
#     ingredient_id = 1
#     info = {
#         "user_id": 1,
#         "ingredient_name": "Updated Pancakes",
#         "measurement_id": 2,
#         "measurement_qty_id": 3,
#         "notes": "updated notes",
#     }

#     response = client.put(f"/api/myingredients/{ingredient_id}", json=info)

#     assert response.status_code == 200
#     assert response.json()["ingredient_name"] == "Updated Pancakes"


# def test_get_myinventory_list_ingredient():
#     ingredient_id = 1

#     response = client.get(f"/api/myingredients/{ingredient_id}")

#     assert response.status_code == 200
#     assert response.json()["id"] == ingredient_id
