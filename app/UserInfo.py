import datetime
import os
import json
from werkzeug.utils import secure_filename

import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from firebase_admin import storage

cred = credentials.Certificate("./dogstagram-jm-firebase-adminsdk-pj2mb-d026c3839a.json")
default_app = firebase_admin.initialize_app(cred, {
    'databaseURL' : 'https://dogstagram-jm.firebaseio.com',
    'storageBucket': 'dogstagram-jm.appspot.com'
})
root = db.reference()
users_ref = root.child('users')


def AddUser(username, password):
    """Adds a new user to the database

    Args:
        username (str): The username of the new user
        password (str): The password of the new user

    Returns:
        bool: Returns false if user already exists, true otherwise
    """
    if UserExists(username):
        return False
    AddFolder(username)
    newEntry = username + " " + password + "\n"
    print(newEntry)

    users_ref.push({
        'username': username,
        'password': password
    })
    return True

def UserExists(username):
    """Checks whether user still exists

    Args:
        username (str): The username to check

    Returns:
        bool: Returns true if user with username exists already
    """

    users = users_ref.get()
    if (users == None):
        return False
    for key, val in users.items():
        if username == val['username']:
            return True
    return False

def CheckCredentials(username,password):
    """Checks if the username and password are valid

    Args:
        username (str): The username of the user to check
        password (str): The password of the user to check

    Returns:
        bool: Returns true if username and password match database
    """
    users = users_ref.get()
    if (users == None):
        return False
    for key, val in users.items():
        if username == val['username'] and password == val['password']:
            return True
    return False

def upload_blob(file,username):
    """Uploads a file to the bucket."""
    bucket = storage.bucket()
    blob = bucket.blob(username+"/"+secure_filename(file.filename))
    blob.upload_from_file(file)

def download_blobs(username):
    """Downloads a file from the bucket."""
    bucket = storage.bucket()
    blobs = bucket.list_blobs(prefix=username)
    a = []
    #count = 0
    for blob in blobs:
        a.append(blob.generate_signed_url(datetime.timedelta(seconds=300), method='GET'))
        #file_object = open("./static/UserPictures/"+username+"/"+blob.name,"wb+")
        #blob.download_to_file(file_object)
    #return file_object
    return json.dumps(a)

def AddFolder(username):
    """Add folder for current user if necessary

    Args:
        username (str): The username to create image folder
    """
    try:
        newFolder = os.getcwd() + "/static/UserPictures/" + username
        os.mkdir(newFolder)
    except FileExistsError:
        pass
