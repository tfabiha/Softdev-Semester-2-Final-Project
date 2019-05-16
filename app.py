import os
from flask import Flask, render_template, request, session, url_for, redirect, flash
from flask_socketio import SocketIO, join_room, leave_room, emit, send

from util import db, commands

app = Flask(__name__) #create instance of class flask

app.secret_key = os.urandom(32)
socketio = SocketIO(app)

rooms = {}

db.create_table()

@app.route('/')
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

@app.route('/base')
def base():
    guest = 'user' not in session
    user = None
    if not guest: user = session['user']
    return render_template("base.html", guest = guest, user = user)

@app.route('/lobby')
def lobby():
    guest = 'user' not in session
    user = None
    if not guest: user = session['user']
    return render_template("lobby.html", guest=guest, user = user)

@app.route('/user')
def user():
    guest = 'user' not in session
    if guest:
        pass
    user = None
    if not guest: user = session['user']
    return render_template("user.html", guest=guest, user = user)

@app.route('/login')
def login():
    guest = 'user' not in session
    if not guest:
        return redirect(url_for('user'))
    return render_template('login.html', guest=guest)

@app.route('/login_auth', methods = ['POST'])
def login_auth():
    username = request.form['username']
    password = request.form['password']
    print(username,password)
    print(commands.auth_user(username, password))
    if commands.auth_user(username, password):
        session['user'] = username
        flash("You have successfully logged in.")
        return redirect('/')
    else:
        flash("Invalid username and password combination")
        return render_template('login.html')



@app.route('/signup')
def signup():
    guest = 'user' not in session
    return render_template("signup.html", guest=guest)

@app.route('/signup_auth', methods = ['POST'])
def register_auth():
    username = request.form['username']
    password = request.form['password']
    confirmed_pass = request.form['repass']
    if username == "":
        flash("Please make sure to enter a username!")
        return redirect(url_for('signup'))
    elif password == "":
        flash("Please make sure to enter a password!")
        return redirect(url_for('signup'))
    elif password != confirmed_pass: # checks to make sure two passwords entered are the same
        flash("Please make sure the passwords you enter are the same.")
        return redirect(url_for('signup'))
    else:
        if commands.add_user(username, password):
            flash("You have successfully registered.")
        else:
            flash("Please enter another username. The one you entered is already in the database.")
            return redirect(url_for('signup'))
    return redirect('/login')


@app.route('/logout', methods = ['GET'])
def logout():
    if 'user' in session:
        session.pop('user')
    return redirect(url_for('/'))
                        

if __name__ == '__main__':
    socketio.run(app, debug = True)
