import sqlite3
from pathlib import Path


TEST_DB_PATH = Path(__file__).parent / "test_db.db"

# 1) Function to initialize a clean test database
def init_test_db() -> str:


    # 2) If the test DB already exists from a previous run, delete it
    if TEST_DB_PATH.exists():
        TEST_DB_PATH.unlink()

    with sqlite3.connect(TEST_DB_PATH) as conn:
        #Turn on foreign key constraints (SQLite default is OFF)
        conn.execute("PRAGMA foreign_keys = ON;")

        # Create a cursor so we can execute SQL commands
        cur = conn.cursor()

        #  Create currencies table
        cur.execute("""
        CREATE TABLE IF NOT EXISTS currencies (
            code TEXT PRIMARY KEY,
            rate REAL NOT NULL
        )
        """)

        #  Create users table
        cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL
        )
        """)

        #  Create wallets table (depends on users + currencies)
        cur.execute("""
        CREATE TABLE IF NOT EXISTS wallets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            currency_code TEXT NOT NULL,
            currency_amount REAL NOT NULL DEFAULT 0,
    
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (currency_code) REFERENCES currencies(code),
    
            UNIQUE(user_id, currency_code)
        )
        """)
    return str(TEST_DB_PATH)
