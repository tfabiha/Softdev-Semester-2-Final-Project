import os, sqlite3

def create_table():
    db = sqlite3.connect('/var/www/ccereal/ccereal/data/data.db')
    c = db.cursor()
    command = "CREATE TABLE IF NOT EXISTS users(username TEXT, password TEXT, wins INT, losses INT)"
    c.execute(command)

    db.commit()
    db.close()
