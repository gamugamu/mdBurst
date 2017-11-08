# -*- coding: utf-8 -*-

from flask import Flask
from flask import render_template
from flask import make_response

from flask_bootstrap import Bootstrap
from flask_bower import Bower
from flask_triangle import Triangle
from services import FileUpload
from services import DirectoryClient

app = Flask(__name__)

FileUpload.FileUpload(app)
Bootstrap(app)
Bower(app)
Triangle(app)
DirectoryClient.DirectoryClient(app)

@app.route('/')
def hello_world():
    return make_response(render_template('homepage.html').decode( "utf-8" ))
