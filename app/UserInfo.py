import os

def AddUser(username, password):
    if UserExists(username):
        return False
    AddFolder(username)
    newEntry = username + " " + password + "\n"
    print(newEntry)
    with open("UserInfo.txt", "a") as myfile:
        myfile.write(newEntry)
    return True

def UserExists(username):
    file = open("UserInfo.txt","r") 
    fileAsString = file.read()
    arr = fileAsString.split('\n')
    for i in range(0,len(arr)):
        arr[i] = arr[i].split(' ')
        if arr[i][0] == username:
            return True
    return False

def CheckCredentials(username,password):
    file = open("UserInfo.txt","r") 
    fileAsString = file.read()
    arr = fileAsString.split('\n')
    for i in range(0,len(arr)):
        arr[i] = arr[i].split(' ')
        if arr[i][0] == username and arr[i][1]==password:
            return True
    return False

def AddFolder(username):
    newFolder = "./UserPictures/" + username
    os.mkdir(newFolder) 