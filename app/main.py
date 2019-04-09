from flask import Flask, render_template, request, Response, redirect, session, url_for, g
import os.path
import json
import hashlib
from UserInfo import AddUser
from UserInfo import CheckCredentials
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = os.urandom(24)

@app.route('/', methods=['GET'])
def main():
    return render_template('index.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        s = request.form.to_dict()['json_string']
        json_acceptable_string = s.replace("'", "\"")
        d = json.loads(json_acceptable_string)

        ##hashes password
        h = hashlib.md5(d['password'].encode())
        hashed_password = h.hexdigest()
        print(hashed_password)

        ##this if statement should check user and hashed_password against db
        if (CheckCredentials(d['username'],hashed_password)): 
            ##starts session with this user
            session['user'] = d['username']
        else:
            return ("False")
    ##returns template if its not a POST
    return render_template('index.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    s = request.form.to_dict()['json_string']
    json_acceptable_string = s.replace("'", "\"")
    d = json.loads(json_acceptable_string) 

    ## this if shuold check to make sure that the username is not in the db
    if (True):
        ##hashes password
        h = hashlib.md5(d['password'].encode())
        hashed_password = h.hexdigest()
        print(hashed_password)
        if AddUser(d['username'],hashed_password):
        ##starts session with this user
            session['user'] = d['username']
        else:
            return "False"

    return render_template('index.html')

@app.route('/landing')
def landing():
    if g.user:
        return render_template('landing.html')
    return redirect(url_for('login'))

@app.before_request
def before_request():
    g.user = None
    if 'user' in session:
        g.user = session['user']


@app.route('/dropsession')
def dropsession():
    session.pop('user', None)
    return redirect(url_for('login'))

def upload_file():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # if user does not select file, browser also
        # submit a empty part without filename
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)

