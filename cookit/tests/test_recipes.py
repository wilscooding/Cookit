from fastapi.testclient import TestClient
from main import app
from queries import RecipeQueries
from db import RecipeOut

# Run tests with:
# docker exec module3-project-gamma-fastapi-1 python -m pytest
client = TestClient(app)


class EmptyRecipeQueries:
    def get_all_recipes(self, user_id):
        return []


class TwoRecipesQueries:
    def get_all_recipes(self, user_id):
        return [
            RecipeOut(
                id=1,
                recipe_name="pancakes",
                diet="glutenFree",
                img="https://static.onecms.io/wp-content/uploads/sites/43/2022/02/16/21014-Good-old-Fashioned-Pancakes-mfs_001.jpg",
                description="Super yummy!",
                steps="1. Make batter. 2. Cook batter in pan. 3. Enjoy!",
                creator_id=1,
            ),
            RecipeOut(
                id=2,
                recipe_name="Eggs Benedict",
                diet="",
                img="https://natashaskitchen.com/wp-content/uploads/2022/04/Egg-Benedict-SQ.jpg",
                description="Super yummy!",
                steps="Kinda complicated, just go out to eat.",
                creator_id=1,
            ),
        ]


def test_list_recipes_empty():
    app.dependency_overrides[RecipeQueries] = EmptyRecipeQueries
    response = client.get("/api/myrecipes/?user_id=1")

    assert response.status_code == 200
    assert len(response.json()["recipes"]) == 0

    app.dependency_overrides[RecipeQueries] = RecipeQueries


def test_list_recipes_full():
    app.dependency_overrides[RecipeQueries] = TwoRecipesQueries
    response = client.get("/api/myrecipes/?user_id=1")

    assert response.status_code == 200
    assert len(response.json()["recipes"]) == 2
    assert response.json()["recipes"][0] == {
        "id": 1,
        "recipe_name": "pancakes",
        "diet": "glutenFree",
        "img": "https://static.onecms.io/wp-content/uploads/sites/43/2022/02/16/21014-Good-old-Fashioned-Pancakes-mfs_001.jpg",
        "description": "Super yummy!",
        "steps": "1. Make batter. 2. Cook batter in pan. 3. Enjoy!",
        "creator_id": 1,
    }
    app.dependency_overrides[RecipeQueries] = RecipeQueries
