from flask import Flask, render_template, request
from flask_socketio import SocketIO, join_room, leave_room, emit, send

app = Flask(__name__)
socketio = SocketIO(app)

rooms = {}

@app.route("/")
def root():
    return render_template("index.html")

@socketio.on('joinRoom')
def joinRoom(roomInfo):
    if len(roomInfo) == 0:
        return
    join_room(roomInfo)
    rooms[request.sid] = roomInfo

@socketio.on('message')
def message(msg):
    if len(msg) != 0:
        send(msg, room = rooms[request.sid])

@app.route("/base")
def base():
    return render_template("base.html")

@app.route("/lobby")
def lobby():
    return render_template("lobby.html")

@app.route("/user")
def user():
    return render_template("user.html")

@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/signup")
def signup():
    return render_template("signup.html")


if __name__ == '__main__':
    socketio.run(app, debug = True)
