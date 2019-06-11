import os, random
from flask import Flask, render_template, request, session, url_for, redirect, flash
from flask_socketio import SocketIO, join_room, leave_room, emit, send

from util import config, db, leaderboard

app = Flask(__name__, static_url_path='/static') #create instance of class flask

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
    leaderboard
    '''
    guest = 'user' not in session
    user = None
    if not guest: user = session['user']
    return render_template("leaderboard.html", guest=guest, user = user, users = leaderboard.get_wins_losses())

@app.route('/winner')
def won():
    '''
    leaderboard testing
    '''
    guest = 'user' not in session
    user = None
    if not guest: user = session['user']
    if not guest: leaderboard.add_wins(user)
    return render_template("win.html", guest=guest, user = user, users = leaderboard.get_wins_losses())

@app.route('/loser')
def lost():
    '''
    leaderboard testing
    '''
    guest = 'user' not in session
    user = None
    if not guest: user = session['user']
    if not guest: leaderboard.add_losses(user)
    return render_template("lost.html", guest=guest, user = user, users = leaderboard.get_wins_losses())

@app.route('/game/<code>')
def game(code):
    '''
    game template -- unfinished
    '''
    guest = 'user' not in session
    user = None
    if not guest: user = session['user']
    return render_template("index.html", guest=guest, user = user)

@app.route('/join_game', methods = ['POST'])
def join_game():
    '''
    for joining games
    '''
    inv_code = request.form['inv_code']
    return redirect('/game/{code}'.format(code=inv_code))


@app.route('/create_game')
def create_game():
    '''
    for creating games
    '''
    print(request.form)
    inv_code = ''.join([random.choice("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")for n in range(32)])
    return redirect('/game/{code}'.format(code=inv_code))

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

@app.route('/logout')
def logout():
    '''
    logout
    '''
    if 'user' in session:
        session.pop('user')
    return redirect('/')


if __name__ == '__main__':
    socketio.run(app, debug = True)
