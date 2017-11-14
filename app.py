# -*- coding: utf-8 -*-

from flask import Flask
from flask import render_template, redirect, url_for
from flask import make_response
from flask_login import LoginManager, UserMixin, login_user, logout_user,\
current_user

from flask_bootstrap import Bootstrap
from flask_bower import Bower
from flask_triangle import Triangle
from services.FileUpload import FileUpload
from services import DirectoryClient
from services.Login import Login

app = Flask(__name__)
app.config['SECRET_KEY']                = 'top secret!'
app.config['PROPAGATE_EXCEPTIONS']      = True

FileUpload(app)
Bootstrap(app)
Bower(app)
Triangle(app)
DirectoryClient.DirectoryClient(app)
Login(app)

@app.route('/')
def index():
    return make_response(render_template('homepage.html').decode( "utf-8" ))
