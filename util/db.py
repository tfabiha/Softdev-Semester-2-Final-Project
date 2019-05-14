import sqlite3

db = sqlite3.connect("database.db")
c = db.cursor()
command = "CREATE TABLE users(usernmae TEXT, password TEXT, wins INT, losses INT)"
c.execute(command)

db.commit()
db.close()
