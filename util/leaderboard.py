import os, sqlite3

from util import config

def all_users():
    db, c = config.start_db()
    command = "SELECT username, password FROM users;"
    c.execute(command)
    all = c.fetchall()
    db.close()
    dict = {}
    for item in all:
        dict[item[0]] = item[1]
    return dict

def get_wins_losses():
    db, c = config.start_db()
    command = "SELECT username,wins,losses FROM users;"
    c.execute(command)
    all = c.fetchall()
    db.close()
    dict = {}
    for item in all:
        dict[item[0]] = [item[1],item[2]]
    return dict
