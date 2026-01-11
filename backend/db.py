import sqlite3

def connect():
    db = db or os.getenv("DB_PATH", "currencies.db")
    with sqlite3.connect(db) as conn:
        cur = conn.cursor()
        # Create the currencies table:
        cur.execute("""
        CREATE TABLE IF NOT EXISTS currencies (
            code TEXT PRIMARY KEY,
            rate REAL NOT NULL
        )
        """)
        # Create the user table:
        cur.execute("""CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL, 
            last_name TEXT NOT NULL
        )""")
        # Crate the wallets table:
        cur.execute("""CREATE TABLE IF NOT EXISTS wallets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            currency_code TEXT NOT NULL,
            currency_amount REAL NOT NULL DEFAULT 0,
        
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (currency_code) REFERENCES currencies(code),
        
            UNIQUE(user_id, currency_code)
        
        )""")
# helper:
def user_exists(db: str, user_id: int) -> bool:
    with sqlite3.connect(db) as conn:
        cur = conn.cursor()
        cur.execute("SELECT 1 FROM users WHERE id = ?", (user_id,))
        return cur.fetchone() is not None

# add currency to the DB
def add_currency_to_db(code: str, rate: float, db: str):
    try:
        with sqlite3.connect(db) as conn:
            cur = conn.cursor()
            cur.execute(
                "INSERT INTO currencies (code, rate) VALUES (?, ?)",
                (code, rate)
            )
        return True
    except sqlite3.IntegrityError:
        # This happens if the code (PRIMARY KEY) already exists
        return False

# delete currency from DB
def delete_currency(db: str, currency_code: str):
    try:
        with sqlite3.connect(db) as conn:
            cur = conn.cursor()

            cur.execute(
                "DELETE FROM currencies WHERE code = (?)",
                (currency_code,)
            )

        return cur.rowcount > 0

    except sqlite3.Error:
        return False

# get all currencies from DB
def get_all_currencies(db: str):
    try:
        with sqlite3.connect(db) as conn:
            cur = conn.cursor()
            cur.execute(
                "select * from currencies"
            )
            rows = cur.fetchall()
        return rows

    except sqlite3.IntegrityError:
        return False

# update a currency
def update_currency(db: str, currency_to_update: str, rate: float):
    try:
        with sqlite3.connect(db) as conn:
            cur = conn.cursor()

            cur.execute("UPDATE currencies SET rate = ? WHERE code = ?",
                        (rate, currency_to_update)
                        )
        return cur.rowcount > 0
    except sqlite3.Error:
        return False

# get all exchange rate for a currency
def get_exchange_rates(db: str):
    try:
        with sqlite3.connect(db) as conn:
            cur = conn.cursor()

            cur.execute("SELECT code, rate FROM currencies")
            rows = cur.fetchall()
            rates = {}
            for code, rate in rows:
                rates[code] = rate
        return rates
    except sqlite3.IntegrityError:
        return False

# get the rate of a single currency
def get_rate(db: str, currency_code: str):
    try:
        with sqlite3.connect(db) as conn:
            cur = conn.cursor()
            cur.execute("SELECT rate FROM currencies WHERE code = ?",
                        (currency_code,))
            rate = cur.fetchone()

        if rate is None:
            return None
        return rate[0]
    except sqlite3.Error:
        return False

# create a new user:
def create_user(db: str, first_name: str, last_name: str):
    try:
        with sqlite3.connect(db) as conn:
            cur = conn.cursor()
            cur.execute("INSERT INTO users (first_name, last_name) VALUES (?, ?)",
                (first_name, last_name))
            new_user_id = cur.lastrowid
        return new_user_id
    except sqlite3.Error as e:
        print("DB error in create_user:", e)
        return None

# get a user:
def get_user(db: str, user_id: int):
    try:
        with sqlite3.connect(db) as conn:
            cur = conn.cursor()
            cur.execute("SELECT * FROM users WHERE id = ?",
                        (user_id,))
            user = cur.fetchone()
        return user
    except sqlite3.Error as e:
        print("DB error in get_user:", e)
        return None

# get all user:
def get_all_users(db: str):
    try:
        with sqlite3.connect(db) as conn:
            cur = conn.cursor()
            cur.execute("SELECT * FROM users")
        rows = cur.fetchall()
        return rows
    except sqlite3.Error as e:
        print("DB error in get_all_user:", e)
        return None

# get a user's wallet:
def get_wallet(db: str, user_id: int):
    try:
        with sqlite3.connect(db) as conn:
            conn.execute("PRAGMA foreign_keys = ON;")
            cur = conn.cursor()
            cur.execute("SELECT * FROM wallets WHERE user_id = ?",
                        (user_id, ))
            rows = cur.fetchall()
        return rows
    except sqlite3.Error as e:
        print("DB error in get_wallet:", e)
        return None

# add a currency to a wallet - deposit:
def deposit_to_wallet(db: str, user_id: int, currency: str, amount: float):
    try:
        with sqlite3.connect(db) as conn:
            conn.execute("PRAGMA foreign_keys = ON;")
            cur = conn.cursor()
            # update row and count the number of row updated
            cur.execute("UPDATE wallets SET currency_amount = currency_amount + ? WHERE user_id = ? AND currency_code = ?",
                        (amount, user_id, currency))
            if cur.rowcount == 0:
                cur.execute("INSERT INTO wallets (user_id, currency_code, currency_amount) VALUES (?, ?, ?)",
                            (user_id, currency, amount))
        return True
    except sqlite3.Error as e:
        print("DB error in deposit_to_wallet:", e)
        return False

# withdrawal currency from wallet:
def withdrawal_from_wallet(db: str, user_id: int, currency: str, amount: float):
    try:
        with sqlite3.connect(db) as conn:
            conn.execute("PRAGMA foreign_keys = ON;")
            cur = conn.cursor()
            cur.execute(
                "UPDATE wallets SET currency_amount = currency_amount - ? WHERE user_id = ? AND currency_code = ?",
                (amount, user_id, currency))
            if cur.rowcount == 0:
                amount = 0-amount
                cur.execute("INSERT INTO wallets (user_id, currency_code, currency_amount) VALUES (?, ?, ?)",
                            (user_id, currency, amount))
        return True
    except sqlite3.Error as e:
        print("DB error in withdrawal_to_wallet:", e)
        return False

