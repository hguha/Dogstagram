import os

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
    with open("UserInfo.txt", "a") as myfile:
        myfile.write(newEntry)
    return True

def UserExists(username):
    """Checks whether user still exists
    
    Args:
        username (str): The username to check

    Returns:
        bool: Returns true if user with username exists already
    """
    file = open("UserInfo.txt","r") 
    fileAsString = file.read()
    arr = fileAsString.split('\n')
    for i in range(0,len(arr)):
        arr[i] = arr[i].split(' ')
        if arr[i][0] == username:
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
    file = open("UserInfo.txt","r") 
    fileAsString = file.read()
    arr = fileAsString.split('\n')
    for i in range(0,len(arr)):
        arr[i] = arr[i].split(' ')
        if arr[i][0] == username and arr[i][1]==password:
            return True
    return False

def AddFolder(username):
    """Add folder for current user if necessary
    
    Args:
        username (str): The username to create image folder
    """
    try:
        newFolder = os.getcwd() + "static/UserPictures/" + username
        os.mkdir(newFolder)
    except FileExistsError:
        pass