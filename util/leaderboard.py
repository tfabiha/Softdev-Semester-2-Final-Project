import os, sqlite3

from util import config

def get_wins_losses():
    db, c = config.start_db()
    command = "SELECT username,wins,losses FROM users;"
    c.execute(command)
    all = c.fetchall()
    config.end_db(db)
    users = []
    for item in all:
        #dict[item[0]] = [item[1],item[2]]
        users.append({'username':item[0],'wins':item[1],'losses':item[2]})
    return users

def get_wins_losses_user(username):
    db, c = config.start_db()
    command = "SELECT username,wins,losses FROM users WHERE username = ?;"
    c.execute(command,(username,))
    all = c.fetchall()
    config.end_db(db)
    users = []
    for item in all:
        users.append({'username':item[0],'wins':item[1],'losses':item[2]})
    return users[0]

def get_wins(username):
    db, c = config.start_db()
    command = "SELECT wins FROM users WHERE username = ?;"
    c.execute(command,(username,))
    wins = c.fetchone()[0]
    config.end_db(db)
    return wins

def add_wins(username):
    db, c = config.start_db()
    wins = get_wins(username)
    wins += 1
    command = "UPDATE users SET wins = ? WHERE username = ?;"
    c.execute(command, (wins, username))
    config.end_db(db)

def get_losses(username):
    db, c = config.start_db()
    command = "SELECT losses FROM users WHERE username = ?;"
    c.execute(command,(username,))
    losses = c.fetchone()[0]
    config.end_db(db)
    return losses

def add_losses(username):
    db, c = config.start_db()
    losses = get_losses(username)
    losses += 1
    command = "UPDATE users SET losses = ? WHERE username = ?;"
    c.execute(command, (losses, username))
    config.end_db(db)
