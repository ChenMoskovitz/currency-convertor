from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import db
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


DB_PATH = os.getenv("DB_PATH", "currencies.db")

# convert one currency to another one
@app.get("/convert", tags=["bank"])
def exchange(from_currency: str, to_currency: str, amount: float):
    from_currency = from_currency.upper()
    to_currency = to_currency.upper()

    if amount < 0:
        raise HTTPException(
            status_code=400,
            detail="Invalid amount"
        )

    from_rate = db.get_rate(DB_PATH, from_currency)
    to_rate = db.get_rate(DB_PATH, to_currency)

    if from_rate is None:
        raise HTTPException(
            status_code=400,
            detail="Invalid from_currency"
        )

    if to_rate is None:
        raise HTTPException(
            status_code=400,
            detail="Invalid to_currency"
        )

    converted_amount = (to_rate / from_rate) * amount

    return {
        "from currency": from_currency,
        "to currency": to_currency,
        "amount": amount,
        "converted_amount": converted_amount,
    }

# get all currencies from DB
@app.get("/currencies", tags=["bank"])
def currencies():
    return {"currencies": db.get_all_currencies(DB_PATH)}

# get all exchange rate for a currency
@app.get("/rates", tags=["bank"])
def exchange_rates(main_currency: str):
    main_currency = main_currency.upper()
    rates_dic = {}
    rates_dic = db.get_exchange_rates(DB_PATH)
    if main_currency not in rates_dic:
        raise HTTPException(
            status_code=400,
            detail="Invalid main currency"
        )
    rates = {}
    for k in rates_dic:
        if k != main_currency:
            rates[f"{main_currency} to {k}"] = rates_dic[main_currency]/rates_dic[k]
    return {"rates": rates}

# add currency to the DB
@app.post("/add_currency", tags=["bank"])
def add_currencies(currency: str, rate:float):
    currency = currency.upper()
    if rate <= 0:
        raise  HTTPException(
            status_code=400,
            detail="Invalid rate"
        )

    if (db.add_currency_to_db(currency, rate, DB_PATH)):
        return {
            "All currencies": db.get_all_currencies(DB_PATH)
        }
    raise HTTPException(
        status_code=400,
        detail="DB error"
    )

# delete currency from DB
@app.delete("/delete_currency", tags=["bank"])
def delete_currency(currency: str):

    currency = currency.upper()

    if (db.delete_currency(DB_PATH, currency)):
        return {
            "message": f"Currency '{currency}' deleted successfully",
            "All currencies" : db.get_all_currencies(DB_PATH)
        }

    raise HTTPException(
        status_code=400,
        detail="DB error"
    )

# update a currency
@app.put("/update_currency", tags=["bank"])
def update_currency(currency: str, new_rate: float):
    currency = currency.upper()

    if (db.update_currency(DB_PATH, currency, new_rate)):
        return {
            "message": f"Currency {currency} updated successfully",
            "All currencies": db.get_all_currencies(DB_PATH)
        }
    raise HTTPException(
        status_code=400,
        detail="DB Error"
    )

# add a user
@app.post("/add_user", tags=["users"])
def add_user(first_name: str, last_name: str):
    first_name = first_name.title()
    last_name = last_name.title()

    user_id = db.create_user(DB_PATH, first_name, last_name)

    if user_id is not None:
        return {"Message": "new user added",
                "User Id": user_id,
                "First Name": first_name,
                "Last Name": last_name
                }
    raise HTTPException(
        status_code=500,
        detail="DB error"
    )

# get a user
@app.get("/get_user", tags=["users"])
def get_user_by_id(user_id: int):
    user = db.get_user(DB_PATH, user_id)

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="no user found"
        )
    return {
        "id": user[0],
        "first_name": user[1],
        "last_name": user[2]
    }

# get all user
@app.get("/get_all_users", tags=["users"])
def get_all_users():
    return db.get_all_users(DB_PATH)

# # get user's wallet
@app.get("/wallet", tags=["wallets"])
def get_wallet(user_id):
    data =  db.get_wallet(DB_PATH, user_id)
    if data is None:
        raise HTTPException(
            status_code=500,
            detail="db error"
        )
    if len(data) == 0:
        return {
            "user_id": user_id,
            "wallet": []
        }

    user_wallet = []
    for line in data:
        currency_code = line[2]
        amount = line[3]

        user_wallet.append({
            "currency": currency_code,
            "amount": amount
        })
    return {
        "user_id": user_id,
        "wallet": user_wallet
    }

# deposit to wallet
@app.post("/deposit", tags=["wallets"])
def deposit(user_id: int, currency: str, amount: float):
    currency = currency.upper()
    if not db.user_exists(DB_PATH, user_id):
        raise HTTPException(
            status_code=404,
            detail="User does not exist"
        )
    if amount <= 0:
        raise HTTPException(
            status_code=400,
            detail="Invalid amount"
        )
    if db.deposit_to_wallet(DB_PATH, user_id, currency, amount):
        return {"user's wallet": db.get_wallet(DB_PATH, user_id)}

    raise HTTPException(
        status_code=400,
        detail="DB error"
    )

# withdrawal from wallet
@app.post("/withdrawal", tags=["wallets"])
def withdrawal(user_id: int, currency: str, amount: float):
    currency = currency.upper()
    if db.withdrawal_from_wallet(DB_PATH, user_id, currency, amount):
        return {"user's wallet": db.get_wallet(DB_PATH, user_id)}

    raise HTTPException(
        status_code=400,
        detail="DB error"
    )

# convert in wallet
@app.post("/convert_in_wallet", tags=["wallets"])
def convert_in_wallet(user_id: int, from_currency: str, to_currency: str, amount: float):
    from_currency = from_currency.upper()
    to_currency = to_currency.upper()
    if amount <= 0:
        raise HTTPException(
            status_code=400,
            detail="Invalid rate"
        )
    if from_currency == to_currency:
        raise HTTPException(
            status_code=400,
            detail="Invalid convertion"
        )
    currencies = db.get_all_currencies(DB_PATH)
    currency_codes = [row[0] for row in currencies]
    if from_currency not in currency_codes:
        raise HTTPException(status_code=400, detail="invalid from_currency")
    if to_currency not in currency_codes:
        raise HTTPException(status_code=400, detail="invalid to_currency")

    # withdrawal the amount from from_currency from the wallet
    db.withdrawal_from_wallet(DB_PATH, user_id, from_currency, amount)
    # convert the from_currency to to_currency
    from_rate = db.get_rate(DB_PATH, from_currency)
    to_rate = db.get_rate(DB_PATH, to_currency)
    converted_amount = (to_rate / from_rate) * amount
    # deposit the converted amount to to_currency
    db.deposit_to_wallet(DB_PATH, user_id, to_currency, converted_amount)
    # return the get_wallet of this user
    return {
        "user_id": user_id,
        "wallet": db.get_wallet(DB_PATH, user_id)
    }

