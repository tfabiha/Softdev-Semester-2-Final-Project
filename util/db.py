import os, sqlite3

from util import config

def create_table():
    db, c = config.start_db()
    command = "CREATE TABLE IF NOT EXISTS users(username TEXT, password TEXT, wins INT, losses INT)"
    c.execute(command)

    config.end_db(db)
    #db.commit()
    #db.close()
