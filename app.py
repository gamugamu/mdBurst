from flask import Flask
from flask import render_template

from flask_bootstrap import Bootstrap

app = Flask(__name__)
Bootstrap(app)

@app.route('/')
def hello_world():
    return render_template('base.html')
