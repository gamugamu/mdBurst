# -*- coding: utf-8 -*-

from flask import Flask
from flask import render_template

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
    html = render_template('base.html').decode( "utf-8" )
    return html
