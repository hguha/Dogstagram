from flask import Flask, render_template, request, Response, redirect, session, url_for, g, send_file, jsonify, flash
from glob import glob
import os.path
import json
import hashlib
from UserInfo import AddUser, CheckCredentials, UserExists, upload_blob, download_blobs, delete_blob, addFollow, getUserNewsfeed, isFollowed, delete_user
from werkzeug.utils import secure_filename
from dog_detector import is_dog


app = Flask(__name__)
app.secret_key = os.urandom(24)


@app.route('/', methods=['GET'])
def main():
    """Loads basic frontward facing login page

    Returns:
        html: The rendered index.html template
    """
    return render_template('index.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    """Logs a user in if valid login is provided

    Returns:
        html: The rendered index.html template
    """
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
    """Creates a new user if the user signs up for Dogstagram

    Returns:
        html: The rendered index.html template
    """
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
    """Loads landing page to see photos

    Returns:
        html: The landing.html template if logged in, login page otherwise
    """
    if g.user:
        return render_template('landing.html', user=g.user)
    return redirect(url_for('login'))

@app.route('/profile', methods=['GET', 'POST'])
def profile():
    """Loads landing page to see photos

    Returns:
        html: The landing.html template if logged in, login page otherwise
    """
    if g.user:
        return render_template('profile.html', user=g.user)
    return redirect(url_for('login'))

@app.before_request
def before_request():
    """Assigns the username if the user is logged in
    """
    g.user = None
    if 'user' in session:
        g.user = session['user']


@app.route('/dropsession')
def dropsession():
    """Remotes a user from session data (logging them out)

    Returns:
        redirect: Redirects logged out user to login page
    """
    session.pop('user', None)
    return redirect(url_for('login'))

@app.route('/upload', methods=["GET", "POST"])
def upload_page():
    """Uploads a posted image to the user's profile

    Returns:
        redirect: Redirects user to profile page regardless
    """
    if not g.user:
        return redirect(url_for('login'))
    if request.method == "GET":
        return redirect(url_for('landing'))
    elif request.method == "POST":
        if 'image' not in request.files:
            return redirect(url_for('landing'))
        file = request.files['image']
        if file.filename == '':
            return redirect(url_for('landing'))
        if file:
            filename = secure_filename(file.filename)
            if is_dog(file):
                file.seek(0)
                upload_blob(file,g.user)
                flash("Image uploaded successfully!")
            else:
                flash("You can only upload dog pictures!")
            #file.save(os.path.join('static', 'UserPictures', g.user, filename))
            return redirect(url_for('landing'))

@app.route('/user/<username>/images')
def getUserImages(username):
    """Gets all images that belong to a user

    Args:
        username (str): The username to use to find images

    Returns:
        str: JSON list of image URLs
    """

    if not UserExists(username):
        print ('Got here!')
        return "False"
    elif not g.user:
        return redirect(url_for('login'))

    return download_blobs(username)
    #files = glob(os.path.join('static', 'UserPictures', username, '*'))
    #return json.dumps(files)

@app.route('/user/images')
def getCurrentUserImages():
    """Gets all images that belong to current user

    Returns:
        str: JSON list of image URLs
    """
    if not g.user:
        return redirect(url_for('login'))
    return getUserImages(g.user)

@app.route('/user/newsfeed')
def getCurrentUserNewsfeed():
    """Gets all images that belong to current user

    Returns:
        str: JSON list of image URLs
    """
    if not g.user:
        return redirect(url_for('login'))
    return getUserNewsfeed(g.user)


@app.route('/search/<username>', methods=["GET", "POST"])
def search(username):
    """Searchs for user account and redirects to page for user.

    Args:
        username (str): The username to use to find images

    Returns:
        bool: Returns false if username not found
        template: Renders search.html template if valid user
        redirect: Redirects user to login page if not logged in
    """
    if not UserExists(username):
        return "False"
    if g.user:
        return render_template('search.html',user=username)
    return redirect(url_for('login'))

@app.route('/follow/<user>', methods=["POST"])
def follow(user):
    """Follows passed user
    
    Args:
        user (str): Username to follow
    """
    addFollow(g.user,user)
    return "None"

@app.route('/delete/<username>/<imagename>', methods=["POST"])
def deleteImage(username,imagename):
    """Deletes image from user
    
    Args:
        username (str): User to delete image from
        imagename (str): Name of image to delete

    Returns:
        redirect: Redirects to the landing page always
    """
    if g.user == username:
        delete_blob(username,imagename)
    return redirect(url_for('landing'))

@app.route('/currentuser', methods=["GET"])
def getCurrentUser():
    """Gets current logged in user

    Returns:
        str: JSON object containing the current user
    """
    return jsonify({
        'username': g.user
    })

@app.route('/doesfollow/<user>', methods=["POST"])
def doesfollow(user):
    """Checks if user is following passed username
    
    Args:
        user (str): Username to check if they are following

    Returns:
        str: JSON object containing bool if the current user is following passed user
    """
    return jsonify({
        'follows': isFollowed(g.user,user)
    })

@app.route('/deleteUser/<user>',methods=["GET","POST"])
def deleteUser(user):
    """Deletes the passed user
    
    Args:
        user (str): Username to delete
    """
    delete_user(user)
    return redirect(url_for('login'))

@app.route('/toLanding',methods=["GET","POST"])
def toLanding():
    """Redirects user to landing page
    """
    return redirect(url_for('landingurl'))
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
