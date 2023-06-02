from fastapi.testclient import TestClient

from ..main import app

client = TestClient(app)


def test_list_users():
    response = client.get("/api/users")
    print(response)
    assert response.status_code == 200
