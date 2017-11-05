# -*- coding: utf-8 -*-

from flask import Flask
from flask import render_template
from flask import make_response

from flask_bootstrap import Bootstrap
from flask_bower import Bower
from flask_triangle import Triangle
from services import FileUpload


app = Flask(__name__)

FileUpload.FileUpload(app)
Bootstrap(app)
Bower(app)
Triangle(app)

@app.route('/')
def hello_world():
    r = make_response(render_template('homepage.html').decode( "utf-8" ))
    r.headers.add('Access-Control-Allow-Origin', '*')

    return r
