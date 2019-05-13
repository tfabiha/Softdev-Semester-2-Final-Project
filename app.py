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

if __name__ == '__main__':
    socketio.run(app, debug = True)
