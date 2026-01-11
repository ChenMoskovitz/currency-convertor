import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

@pytest.fixture(scope="function")
def adding_user():
    response = client.post(
        "/add_user",
        params={"first_name": "Test", "last_name": "User"}
    )
    assert response.status_code in [200, 400]
    return response.json()["User Id"]

@pytest.fixture(scope="function")
def adding_currency():
    response = client.post(
        "/add_currency",
        params={"currency": "TST", "rate": 3}
    )
    assert response.status_code in [200, 400]
    return "TST"
