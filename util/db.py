import os, sqlite3

DB_FILE = "/data/database.db"
if os.environ['PWD'] == '/var/www/ccereal/ccereal':
    DB_FILE = "/var/www/ccereal/ccereal/data/database.db"

def create_table():
    db = sqlite3.connect(DB_FILE)
    c = db.cursor()
    command = "CREATE TABLE IF NOT EXISTS users(username TEXT, password TEXT, wins INT, losses INT)"
    c.execute(command)

    db.commit()
    db.close()
