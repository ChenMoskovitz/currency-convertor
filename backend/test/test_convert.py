from http.client import responses
from numbers import Number
#TODO add a var that will catch a currency that exist, and one that catch deleted currency so
# that I can test the response for one that does exist and the response for what it doesn't
import sys
from pathlib import Path

from test.tests.conftest import adding_user, adding_currency

ROOT_DIR = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT_DIR))

import os
from fastapi.testclient import TestClient
from test.tests.test_db import init_test_db

DB_PATH = init_test_db()
os.environ["DB_PATH"] = "test/tests/test_db.db"
from main import app

client = TestClient(app)

VALID_CURRENCY = "TST"
INVALID_CURRENCY = "INVAL"

# setup
def ensure_currency(code="TST", rate=3):
    client.post("/add_currency", params={"currency": code, "rate": rate})

# USER
# get all users
def test_get_all_users():
    response = client.get("/get_all_users")
    data = response.json()

    assert response.status_code == 200
    assert data is not None
    assert isinstance(data, list)
    if data:
        assert len(data[0]) == 3
        user_id, first_name, last_name = data[0]
        assert isinstance(user_id, int)
        assert isinstance(first_name, str)
        assert isinstance(last_name, str)
# get a user
def test_get_user():
    # first, ensure that user with ID 1 exists
    ret = client.post("/add_user", params={"first_name": "First", "last_name":"Last"})
    assert ret.status_code == 200
    new_user_id = ret.json()["User Id"]
    # get the id of the new user
    response = client.get("/get_user", params={"user_id": new_user_id})
    data = response.json()

    assert response.status_code == 200
    assert data is not None
    assert isinstance(data, dict)
    assert data["id"] == new_user_id
    assert isinstance(data["first_name"], str)
    assert isinstance(data["last_name"], str)
# add a user
def test_add_user():
    response = client.post("/add_user", params={"first_name": "test", "last_name":"test"})
    data = response.json()

    assert response.status_code == 200
    assert isinstance(data, dict)

    assert "Message" in data
    assert "User Id" in data
    assert "First Name" in data
    assert "Last Name" in data
    assert isinstance(data["Message"], str)
    assert isinstance(data["User Id"], int)
    assert isinstance(data["First Name"], str)
    assert isinstance(data["Last Name"], str)

# BANK
# convert
def test_get_convert_valid_to_valid():
    # make shure the currency exists
    res = client.post("/add_currency", params={"currency": VALID_CURRENCY, "rate": 3})
    assert res.status_code in(200, 400)  # 400 if already exists
    response = client.get("/convert",
                          params={"from_currency": VALID_CURRENCY,
                                  "to_currency": VALID_CURRENCY,
                                  "amount": 100})
    data = response.json()

    assert response.status_code == 200
    assert data is not None
    assert isinstance(data, dict)
    assert "from currency" in data
    assert "to currency" in data
    assert "amount" in data
    assert "converted_amount" in data
    assert isinstance(data["from currency"], str)
    assert isinstance(data["to currency"], str)
    assert isinstance(data["amount"], (int, float))
    assert isinstance(data["converted_amount"], (int, float))

def test_get_convert_invalid_to_valid():
    response = client.get("/convert",
                          params={"from_currency": INVALID_CURRENCY,
                                  "to_currency": VALID_CURRENCY,
                                  "amount": 100})
    data = response.json()

    assert response.status_code == 400
    assert data is not None
    assert isinstance(data, dict)
    assert "detail" in data

def test_get_convert_valid_to_invalid():
    response = client.get("/convert",
                          params={"from_currency": VALID_CURRENCY,
                                  "to_currency": INVALID_CURRENCY,
                                  "amount": 100})
    data = response.json()

    assert response.status_code == 400
    assert data is not None
    assert isinstance(data, dict)
    assert "detail" in data

def test_get_convert_invalid_to_invalid():
    response = client.get("/convert",
                          params={"from_currency": INVALID_CURRENCY,
                                  "to_currency": INVALID_CURRENCY,
                                  "amount": 100})
    data = response.json()

    assert response.status_code == 400
    assert data is not None
    assert isinstance(data, dict)
    assert "detail" in data

# get all currencies
def test_get_currencies():
    response = client.get("/currencies")
    data = response.json()

    assert response.status_code == 200
    assert data is not None
    assert isinstance(data, dict)
    assert "currencies" in data
    assert isinstance(data["currencies"], list)
    if data["currencies"]:
        assert len(data["currencies"][0]) == 2
        currency_code, rate = data["currencies"][0]
        assert isinstance(currency_code, str)
        assert isinstance(rate, (int, float))
# add a currency
def test_add_currency():
    currency_to_add = "TEST_ADD"
    response = client.post("/add_currency", params={"currency": currency_to_add, "rate": 3})
    data = response.json()

    assert response.status_code in (200, 400)  # 400 if already exists
    if response.status_code == 200:
        assert data is not None
        assert isinstance(data, dict)
        assert "All currencies" in data
        assert isinstance(data["All currencies"], list)
        if data["All currencies"]:
            currency, rate = data["All currencies"][0]
            isinstance(currency, str)
            isinstance(rate, float)
    else:
        assert data is not None
        assert isinstance(data, dict)
        assert "detail" in data
# rates
def test_get_rates_valid():
    response = client.get("/rates", params={"main_currency": VALID_CURRENCY})
    data = response.json()

    assert response.status_code == 200
    assert data is not None
    assert isinstance(data, dict)
    assert "rates" in data
    assert isinstance(data["rates"], dict)
    if data["rates"]:
        pair, rate = next(iter(data["rates"].items()))
        assert isinstance(pair, str)
        assert isinstance(rate, (int, float))

def test_get_rates_invalid():
    response = client.get("/rates", params={"main_currency": INVALID_CURRENCY})
    data = response.json()

    assert response.status_code == 400
    assert data is not None
    assert isinstance(data, dict)
    assert "detail" in data
    assert data["detail"] == "Invalid main currency"

# update currency
def test_update_currency_valid():
    response = client.put("/update_currency", params={"currency": VALID_CURRENCY, "new_rate": 5})
    data = response.json()

    assert response.status_code == 200
    assert data is not None
    assert isinstance(data, dict)
    assert "message" in data
    assert "All currencies" in data
    assert isinstance(data["message"], str)
    assert isinstance(data["All currencies"], list)

def test_update_currency_invalid():
    response = client.put("/update_currency", params={"currency": INVALID_CURRENCY, "new_rate": 5})
    data = response.json()

    assert response.status_code == 400
    assert data is not None
    assert isinstance(data, dict)
    assert "detail" in data

# delete currency
def test_delete_currency_valid():
    response = client.delete("/delete_currency", params={"currency": VALID_CURRENCY})
    data = response.json()

    assert response.status_code == 200
    assert data is not None
    assert isinstance(data, dict)
    assert "message" in data
    assert "All currencies" in data
    assert isinstance(data["message"], str)
    assert isinstance(data["All currencies"], list)
    for currency_code, _ in data["All currencies"]:
        assert currency_code != VALID_CURRENCY

def test_delete_currency_invalid():
    response = client.delete("/delete_currency", params={"currency": INVALID_CURRENCY})
    data = response.json()

    assert response.status_code == 400
    assert data is not None
    assert isinstance(data, dict)
    assert "detail" in data
    assert data["detail"] == "DB error"

# WALLET
# get wallet
def test_get_wallet(adding_user):
    user = adding_user
    response = client.get("/wallet", params={"user_id": user})
    data = response.json()

    assert response.status_code == 200
    assert data is not None
    assert isinstance(data, dict)
    assert "user_id" in data
    assert "wallet" in data
    assert isinstance(data["wallet"], list)
# deposit
def test_deposit_valid():
    # make user the currency exists
    res_user = client.post("/add_user", params={"first_name": "Dep", "last_name":"User"})
    assert res_user.status_code == 200
    user_id = res_user.json()["User Id"]
    # make shure the currency exists
    res_currency = client.post("/add_currency", params={"currency": VALID_CURRENCY, "rate": 3})
    assert res_currency.status_code in (200, 400)  # 400 if already exists

    response = client.post("/deposit", params={"user_id": 1, "currency": VALID_CURRENCY, "amount": 100})
    data = response.json()

    assert response.status_code == 200
    assert isinstance(data, dict)
    assert "user's wallet" in data
    assert isinstance(data["user's wallet"], list)

def test_deposit_invalid():
    response = client.post("/deposit", params={"user_id": 1, "currency": INVALID_CURRENCY, "amount": 100})
    data = response.json()

    assert response.status_code == 400
    assert isinstance(data, dict)
    assert "detail" in data
# withdrawal
def test_withdrawal_valid():
    response = client.post("/withdrawal", params={"user_id": 1, "currency": VALID_CURRENCY, "amount": 100})
    data = response.json()

    assert response.status_code == 200
    assert isinstance(data, dict)
    assert "user's wallet" in data
    assert isinstance(data["user's wallet"], list)

def test_withdrawal_invalid():
    response = client.post("/withdrawal", params={"user_id": 1, "currency": INVALID_CURRENCY, "amount": 100})
    data = response.json()

    assert response.status_code == 400
    assert isinstance(data, dict)
    assert "detail" in data
# convert in wallet
def test_convert_in_wallet_valid_valid(adding_user, adding_currency):
    # make shure the user and currency exists using the fixtures
    user = adding_user
    currency = adding_currency
    # adding currency b:
    b = client.post("/add_currency", params={"currency": "VALID_CURRENCY_B", "rate": 4})
    assert b.status_code in (200, 400)
    # deposit some funds to convert
    deposit = client.post("/deposit", params={"user_id": user, "currency": currency, "amount": 500})
    assert deposit.status_code == 200

    response = client.post("/convert_in_wallet",
               params={"user_id": user,
                       "from_currency": currency,
                       "to_currency": "VALID_CURRENCY_B",
                       "amount": 100})
    data = response.json()

    assert response.status_code == 200
    assert isinstance(data, dict)
    assert "user_id" in data
    assert "wallet" in data
    assert isinstance(data["wallet"], list)

def test_convert_in_wallet_valid_different_valid(adding_user, adding_currency):
    VALID_CURRENCY_B = "BBB"
    # ensure user exists
    user = adding_user
    # ensure currencies exist
    currency_a = adding_currency
    client.post("/add_currency", params={"currency": VALID_CURRENCY_B, "rate": 4})
    # deposit first currency
    client.post("/deposit", params={
        "user_id": user,
        "currency": currency_a,
        "amount": 100
    })
    # convert in wallet
    response = client.post("/convert_in_wallet", params={
        "user_id": user,
        "from_currency": currency_a,
        "to_currency": VALID_CURRENCY_B,
        "amount": 50
    })
    assert response.status_code == 200

def test_convert_in_wallet_invalid_valid(adding_user, adding_currency):
    user = adding_user
    currency_b = adding_currency
    response = client.post("/convert_in_wallet",
                           params={"user_id": user,
                                   "from_currency": INVALID_CURRENCY,
                                   "to_currency": currency_b,
                                   "amount": 100})
    data = response.json()

    assert response.status_code == 400
    assert isinstance(data, dict)
    assert "detail" in data

def test_convert_in_wallet_valid_invalid(adding_user, adding_currency):
    user = adding_user
    currency_a = adding_currency
    response = client.post("/convert_in_wallet",
                           params={"user_id": user,
                                   "from_currency": currency_a,
                                   "to_currency": INVALID_CURRENCY,
                                   "amount": 100})
    data = response.json()

    assert response.status_code == 400
    assert isinstance(data, dict)
    assert "detail" in data

def test_convert_in_wallet_invalid_invalid(adding_user):
    user = adding_user
    response = client.post("/convert_in_wallet",
                           params={"user_id": user,
                                   "from_currency": INVALID_CURRENCY,
                                   "to_currency": INVALID_CURRENCY,
                                   "amount": 100})
    data = response.json()

    assert response.status_code == 400
    assert isinstance(data, dict)
    assert "detail" in data

