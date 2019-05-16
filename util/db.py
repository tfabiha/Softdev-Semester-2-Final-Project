import os, sqlite3

if os.environ['PWD'] == '/var/www/ccereal/ccereal':
    DIR = os.path.dirname(__file__) or '.'
    DIR += '/'
else: DIR = ""
DB_FILE = DIR + "data/database.db"

def create_table():
    db = sqlite3.connect(DB_FILE)
    c = db.cursor()
    command = "CREATE TABLE IF NOT EXISTS users(username TEXT, password TEXT, wins INT, losses INT)"
    c.execute(command)

    db.commit()
    db.close()
