import os, sqlite3
from passlib.hash import sha256_crypt

from util import config

config.create_table()

def add_user(username, password, wins=0, losses=0):
    db, c = config.start_db()
    data = c.execute("SELECT * FROM users;")
    for row in data:
        if username == row[1]:
            return False
    command = "INSERT INTO users(username,password,wins,losses)VALUES(?,?,?,?);"
    c.execute(command,(username,sha256_crypt.hash(password),wins,losses))
    config.end_db(db)
    return True

def auth_user(username, password):
    db, c = config.start_db()
    data = c.execute("SELECT * FROM users")
    for row in data:
        if row[0] == username and sha256_crypt.verify(password, row[1]):
            db.close()
            return True
    config.end_db(db)
    return False


def registered(username):
    db, c = config.start_db()
    command = "SELECT * FROM users;"
    c.execute(command)
    data = c.fetchall()
    print(data)
    for row in data:
        if username == row[0]:
            return False
    config.end_db(db)
    return True

def all_users():
    db, c = config.start_db()
    command = "SELECT username, password FROM users;"
    c.execute(command)
    all = c.fetchall()
    config.end_db(db)
    dict = {}
    for item in all:
        dict[item[0]] = item[1]
    return dict
