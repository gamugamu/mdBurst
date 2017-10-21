from flask import Flask
from flask import render_template

from flask_bootstrap import Bootstrap
from flask_bower import Bower

app = Flask(__name__)
Bootstrap(app)
Bower(app)

@app.route('/')
def hello_world():
    return render_template('base.html')
