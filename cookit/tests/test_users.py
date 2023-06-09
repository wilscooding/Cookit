from fastapi.testclient import TestClient
from main import app
from queries import UserQueries
from db import UserOut

client = TestClient(app)


class EmptyUsersQueries:
    def get_all_users(self):
        return []


class TwoUsersQueries:
    def get_all_users(self):
        return [
            UserOut(id=1, email="abc@gmail.com"),
            UserOut(id=2, email="def@gmail.com"),
        ]


def test_list_users_empty():
    app.dependency_overrides[UserQueries] = EmptyUsersQueries
    response = client.get("/api/users")

    assert response.status_code == 200
    assert len(response.json()["users"]) == 0

    app.dependency_overrides[UserQueries] = UserQueries


def test_list_users_full():
    app.dependency_overrides[UserQueries] = TwoUsersQueries
    response = client.get("/api/users")

    assert response.status_code == 200
    assert len(response.json()["users"]) == 2
    assert response.json()["users"][0] == {"id": 1, "email": "abc@gmail.com"}

    app.dependency_overrides[UserQueries] = UserQueries
