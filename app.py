from flask import Flask, render_template, request, session, url_for, redirect
from flask_socketio import SocketIO, join_room, leave_room, emit, send

app = Flask(__name__)
socketio = SocketIO(app)

rooms = {}

@app.route("/")
def root():
    return render_template("index.html", guest='user' not in session)

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
    guest = 'user' not in session
    return render_template("base.html", guest = guest)

@app.route("/lobby")
def lobby():
    guest = 'user' not in session
    return render_template("lobby.html", guest=guest)

@app.route("/user")
def user():
    guest = 'user' not in session
    if 'user' not in session:
        pass
    return render_template("user.html", guest=guest, user = session['ser'])

@app.route("/login")
def login():
    guest = 'user' not in session
    if 'user' in session:
        return redirect(url_for('user'))
    return render_template("login.html", guest=guest)
                        

@app.route("/signup")
def signup():
    guest = 'user' not in session
    return render_template("signup.html", guest=guest)
    
@app.route("/logout", methods = ['GET'])
def logout():
    if 'user' in session:
        session.pop('user')
    return redirect(url_for('/'))
                        

if __name__ == '__main__':
    socketio.run(app, debug = True)
