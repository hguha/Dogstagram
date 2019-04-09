from flask import Flask, render_template, request, Response, redirect, session, url_for, g
import os.path
import json
import hashlib
<<<<<<< HEAD
=======
from UserInfo import AddUser
from UserInfo import CheckCredentials
>>>>>>> 491cfe6654feaf0b9916b4c1d3dda9bd568e0c42
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

@app.route('/upload', methods=["GET", "POST"])
def upload_page():
    if not g.user:
        return redirect(url_for('login'))
    if request.method == "GET":
        return render_template('upload.html')
    elif request.method == "POST":
        if 'image' not in request.files:
            return redirect(url_for('landing'))
        file = request.files['image']
        if file.filename == '':
            flash('No selected filename.')
            return redirect(url_for('landing'))
        if file:
            filename = secure_filename(file.filename)
            file.save(os.path.join('app/img', filename))    
            return redirect(url_for('landing'))
        

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)

