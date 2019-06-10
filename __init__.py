
import os, random
from flask import Flask, render_template, request, session, url_for, redirect, flash
from flask_socketio import SocketIO, join_room, leave_room, emit, send

from util import config, db, leaderboard

app = Flask(__name__) #create instance of class flask

app.secret_key = os.urandom(32)
socketio = SocketIO(app)

rooms = {}
room_id = {}

config.create_table()

@app.route('/')
def root():
    guest = 'user' not in session
    user = None
    if not guest: user = session['user']
    return render_template("lobby.html", guest=guest, user = user, users = leaderboard.get_wins_losses())

@app.route('/leaderboard')
def leader():
    '''
    leaderboard testing
    '''
    guest = 'user' not in session
    user = None
    if not guest: user = session['user']
    return render_template("leaderboard.html", guest=guest, user = user, users = leaderboard.get_wins_losses())

@app.route('/wins')
def wins():
    '''
    leaderboard testing
    '''
    guest = 'user' not in session
    user = None
    if not guest: user = session['user']
    if not guest: leaderboard.add_wins(user)
    return render_template("leaderboard.html", guest=guest, user = user, users = leaderboard.get_wins_losses())

@app.route('/losses')
def losses():
    '''
    leaderboard testing
    '''
    guest = 'user' not in session
    user = None
    if not guest: user = session['user']
    if not guest: leaderboard.add_losses(user)
    return render_template("leaderboard.html", guest=guest, user = user, users = leaderboard.get_wins_losses())

@socketio.on('joinRoom')
def joinRoom(roomInfo):
    '''
    websockets -- make client join room, save room info based on the id of the socket
    '''
    if len(roomInfo) == 0:
        return
    #join_room(roomInfo)
    join_room(request.sid)
    rooms[request.sid] = roomInfo

    if roomInfo in room_id:
        room_id[roomInfo].append(request.sid)
    else:
        room_id[roomInfo] = [request.sid]
        emit('myturn', "hi", room = request.sid)

@socketio.on('disconnect')
def disconn():
    roomInfo = rooms[request.sid]
    room_id[roomInfo].pop(request.sid)
        
@socketio.on('message')
def message(msg):
    '''
    websockets -- send message to room that the client who sent it is in
    '''
    if len(msg) != 0:
        send(msg, room = rooms[request.sid])

@socketio.on('drawn')
def drawn(msg):
    print('msg received: card drawn')
    print(room_id[ rooms[request.sid] ])
    
    for client in room_id[ rooms[request.sid] ]:
        if client != request.sid:
            emit('drawn', msg, room = client);

@socketio.on('removed')
def removed(msg):
    print('msg received: card removed')
    print(room_id[ rooms[request.sid] ])
    
    for client in room_id[ rooms[request.sid] ]:
        if client != request.sid:
            emit('removed', msg, room = client);

@socketio.on('discarded')
def discarded(msg):
    print('msg received: card added to discard pile')
    print(room_id[ rooms[request.sid] ])
    
    for client in room_id[ rooms[request.sid] ]:
        emit('discarded', msg, room = client);

@socketio.on('myturn')
def myturn(msg):
    print('msg received: must change turn')
    print(room_id[ rooms[request.sid] ])

    players = room_id[ rooms[request.sid] ]
    currentPlayer = players.index( request.sid )
    print(currentPlayer)
    nextPlayer = (currentPlayer + 1 ) % ( len(players) )
    print(nextPlayer)
    
    emit('myturn', msg, room = players[nextPlayer])

@app.route('/base')
def base():
    '''
    base template
    '''
    guest = 'user' not in session
    user = None
    if not guest: user = session['user']
    return render_template("base.html", guest = guest, user = user)

@app.route('/lobby')
def lobby():
    '''
    game lobby -- people can join and create games
    '''
    guest = 'user' not in session
    user = None
    if not guest: user = session['user']
    return render_template("lobby.html", guest=guest, user = user)

@app.route('/game/<code>')
def game(code):
    '''
    game template -- unfinished
    '''
    guest = 'user' not in session
    user = None
    if not guest: user = session['user']
    return render_template("index.html")

@app.route('/join_game', methods = ['POST'])
def join_game():
    '''
    for joining games
    '''
    inv_code = request.form['inv_code']
    return redirect('/game/{code}'.format(code=inv_code))


@app.route('/create_game', methods = ['POST'])
def create_game():
    '''
    for creating games
    '''
    print(request.form)
    game_name = request.form['game_name']
    max_players = int(request.form['max_players'])
    private_game = 'private_game' in request.form
    if game_name == "":
        flash("Enter a name",category="create_game_error")
        return redirect(url_for('lobby'))
    inv_code = ''.join([random.choice("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")for n in range(32)])
    if max_players == 0:
        max_players = 2
        flash("Max players has defaulted to " + str(max_players))
        return redirect('/game/{code}'.format(code=inv_code))
    return redirect('/game/{code}'.format(code=inv_code))

@app.route('/winner')
def winner():
    '''
    game template -- unfinished
    '''
    return render_template("win.html")

@app.route('/user')
def user():
    '''
    user page with wins / losses
    '''
    guest = 'user' not in session
    if guest:
        return redirect("/login")
    user = None
    if not guest: user = session['user']
    return render_template("user.html", guest=guest, user = user)

@app.route('/login')
def login():
    '''
    login page
    '''
    guest = 'user' not in session
    if not guest:
        return redirect(url_for('user'))
    return render_template('login.html', guest=guest)

@app.route('/login_auth', methods = ['POST'])
def login_auth():
    '''
    login authorization
    '''
    username = request.form['username']
    password = request.form['password']
    if db.auth_user(username, password):
        session['user'] = username
        flash("You have logged in")
        return redirect('/')
    else:
        flash("Invalid username and password combination")
        return render_template('login.html')

@app.route('/signup')
def signup():
    '''
    signup page
    '''
    guest = 'user' not in session
    return render_template("signup.html", guest=guest)

@app.route('/signup_auth', methods = ['POST'])
def register_auth():
    '''
    signup authorization
    '''
    username = request.form['username']
    password = request.form['password']
    retyped_pass = request.form['repass']
    if username == "":
        flash("Enter a username")
        return redirect(url_for('signup'))
    elif password == "":
        flash("Enter a password")
        return redirect(url_for('signup'))
    elif password != retyped_pass:
        flash("Passwords do not match")
        return redirect(url_for('signup'))
    else:
        if db.add_user(username, password):
            flash("You have successfully registered")
        else:
            flash("This username is already in use")
            return redirect(url_for('signup'))
    db.auth_user(username, password)
    session['user'] = username
    return redirect('/')    

@app.route('/logout', methods = ['GET'])
def logout():
    '''
    logout
    '''
    if 'user' in session:
        session.pop('user')
    return redirect(url_for('/'))


if __name__ == '__main__':
    socketio.run(app, debug = True)
