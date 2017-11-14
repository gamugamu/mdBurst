# -*- coding: utf-8 -*-
from flask import Flask, redirect, url_for, render_template, flash
from flask_login import LoginManager, UserMixin, login_user, logout_user,\
    current_user
from oauth import OAuthSignIn
import traceback
from services import Dbb
import services.ConfigLoader as ConfigLoader


class User(UserMixin):
    def __init__(self, redis_key, redis_values):
        self.social_id  = redis_key
        self.name       = redis_values.get("name")
        self.email      = redis_values.get("email")
        self.id         = 0

    def get_id(self):
        return self.social_id

def Login(app):

    app.config['OAUTH_CREDENTIALS'] = {
    'facebook': {
        'id':      ConfigLoader.get("facebook_app_id"),
        'secret':  ConfigLoader.get("facebook_app_secret")
    },
    'twitter': {
            'id': ConfigLoader.get("twitter_app_id"),
        'secret': ConfigLoader.get("twitter_app_secret")
    }
    }

    lm              = LoginManager(app)
    lm.login_view   = 'homepage'

    @lm.user_loader
    def load_user(social_id):
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
