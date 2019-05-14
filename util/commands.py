import sqlite3

DB_FILE = "database.db"
def add_user(username, password_hash):
    db = sqlite3.connect(DB_FILE)
    c = db.cursor()
    command = "INSERT INTO users(username,password,wins,losses)VALUES(?,?,0,0);"
    c.execute(command,(username,password_hash,wins,losses))
    db.commit()
    db.close()

def get_id(username):
    db = sqlite3.connect(DB_FILE)
    c = db.cursor()
    command = "SELECT id FROM users WHERE username = ?;"
    c.execute(command,(username))
    id = c.fetchall()
    db.close()
    return id[0]
