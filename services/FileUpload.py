import os
from flask import Flask, request, redirect, url_for
from werkzeug import secure_filename
from flask import send_from_directory

APP_ROOT            = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER       = os.path.join(APP_ROOT, '../static/img')
ALLOWED_EXTENSIONS  = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])


def FileUpload(app):
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

    def allowed_file(filename):
        return '.' in filename and \
            filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

    @app.route('/upload2', methods=['POST'])
    def upload_file2():
        file = request.files['file']

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return url_for('uploaded_file', filename=filename)

    @app.route('/uploads/<filename>')
    def uploaded_file(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
