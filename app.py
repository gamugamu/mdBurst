# -*- coding: utf-8 -*-

from flask import Flask
from flask import render_template, redirect, url_for
from flask import make_response
from flask_login import LoginManager, UserMixin, login_user, logout_user,\
current_user

from services.oauth import OAuthSignIn

from flask_bootstrap import Bootstrap
from flask_bower import Bower
from flask_triangle import Triangle
from services import FileUpload
from services import DirectoryClient
from services import Dbb

app = Flask(__name__)

app.config['SECRET_KEY']                = 'top secret!'
app.config['PROPAGATE_EXCEPTIONS']      = True
app.config['SQLALCHEMY_DATABASE_URI']   = 'sqlite:///db.sqlite'
app.config['OAUTH_CREDENTIALS'] = {
    'facebook': {
        'id': '470154729788964',
        'secret': '010cc08bd4f51e34f3f3e684fbdea8a7'
    },
    'twitter': {
        'id': 'ywEbFbMQIA9xpdQWAzIQnzS9G',
        'secret': 'IwLH4lEbWYj73LQyzZY4pnf6mKwGSeizTDken2bzwQ0PxoJF5R'
    }
}


FileUpload.FileUpload(app)
Bootstrap(app)
Bower(app)
Triangle(app)
DirectoryClient.DirectoryClient(app)
lm              = LoginManager(app)
lm.login_view   = 'homepage'

class User(UserMixin):
    def __init__(self, redis_key, redis_values):
        self.social_id  = redis_key
        self.name       = redis_values.get("name")
        self.email      = redis_values.get("email")
        self.id         = 0

    def get_id(self):
        return self.social_id

@lm.user_loader
def load_user(social_id):
    print "---------askedUser", social_id
    user_redis = Dbb.collection_for_Key("dumb_user", social_id)

    if not user_redis:
        return None
    else:
        return User(social_id, user_redis)

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/authorize/<provider>')
def oauth_authorize(provider):
    if not current_user.is_anonymous:
        return redirect(url_for('index'))

    oauth = OAuthSignIn.get_provider(provider)
    return oauth.authorize()

@app.route('/callback/<provider>')
def oauth_callback(provider):
    if not current_user.is_anonymous:
        return redirect(url_for('index'))

    oauth = OAuthSignIn.get_provider(provider)
    social_id, username, email = oauth.callback()

    if social_id is None:
        flash('Authentication failed.')
        return redirect(url_for('index'))

    print "social ID", social_id
    user_redis  =  Dbb.collection_for_Key("dumb_user", social_id)
    user_data   = {"name": username, "email": email}

    if not user_redis:
        user = User(social_id, user_data)
        Dbb.store_collection("dumb_user", social_id, user_data)
    else:
        user = User(social_id, user_redis)

    login_user(user, True)
    return redirect(url_for('index'))

@app.route('/')
def index():
    return make_response(render_template('homepage.html').decode( "utf-8" ))
