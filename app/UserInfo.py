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
    newEntry = username + " " + password + "\n"

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

def addFollow(username,user):
    """Adds new follow for users
    
    Args:
        username (str): Current user
        user (str): Username to follow
    """
    if UserExists(username):
        if UserExists(user):
            users = users_ref.get()
            for key, val in users.items():
                if username == val['username']:
                    flag = True
                    follows = users_ref.child(key).child('follow').get()
                    if follows != None:
                        for keyf, valf in follows.items():
                            if valf['user'] == user:
                                flag = False
                                break
                    if flag:
                        users_ref.child(key).child('follow').push({'user':user})
                    else:
                        return "False"

def isFollowed(username,user):
    """Checks if current user is following a user
    
    Args:
        username (str): Current user
        user (str): User to check if they are following
    
    Returns:
        bool: Returns whether the user is following the other user
    """
    users=users_ref.get()
    for key, val in users.items():
        if username == val['username']:
            follows = users_ref.child(key).child('follow').get()
            for keyf,valf in follows.items():
                if valf['user'] == user:
                    return True
    return False


def upload_blob(file,username):
    """Uploads a file to the bucket.
    
    Args:
        file (file): File object to upload
        username (str): Username of image uploader
    """
    bucket = storage.bucket()
    blob = bucket.blob(username+"/"+secure_filename(file.filename))
    blob.upload_from_file(file)

def download_blobs(username):
    """Downloads all images for a user
    
    Args:
        username (str): Username to find images for
    
    Returns:
        str: JSON object listing all images from user
    """
    bucket = storage.bucket()
    blobs = bucket.list_blobs(prefix=username)
    a = []
    #count = 0
    for blob in blobs:
        a.append({
            "link":blob.generate_signed_url(datetime.timedelta(seconds=300), method='GET'),
            "name":blob.name
        })
    return json.dumps(a)

def delete_blob(username,imagename):
    """Deletes an image from the server
    
    Args:
        username (str): Username of image to delete
        imagename (str): Name of image to delete
    """
    bucket = storage.bucket()
    blob = bucket.blob(username+"/"+imagename)
    blob.delete()

def delete_user(user):
    """Deletes passed user
    
    Args:
        user (str): Username to delete
    """
    users=users_ref.get()
    for key, val in users.items():
        if user == val['username']:
            users_ref.child(key).delete()
            return "Success"
    return

def getUserNewsfeed(username):
    """Gets feed of all followed accounts for current user
    
    Args:
        username (str): Username to generate feed for
    """
    bucket = storage.bucket()
    a = []
    users = users_ref.get()
    for key, val in users.items():
        if username == val['username']:
            follows = users_ref.child(key).child('follow').get()
            if follows != None:
                for keyf, valf in follows.items():
                    blobs = bucket.list_blobs(prefix=valf['user'])
                    for blob in blobs:
                        a.append({
                            "link":blob.generate_signed_url(datetime.timedelta(seconds=300), method='GET'),
                            "name":blob.name,
                            "user":valf['user']
                        })
            break
    blobs = bucket.list_blobs(prefix=username)
    for blob in blobs:
        a.append({
            "link":blob.generate_signed_url(datetime.timedelta(seconds=300), method='GET'),
            "name":blob.name,
            "user":username
        })
    return json.dumps(a)
