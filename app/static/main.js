/** Handles the login, checks the database/files to assure authentication, then pushes it to the backend */

function login() {
  //get user and password from front end
  let username = document.querySelector("#username").value;
  let password = document.querySelector("#password").value;

    $.ajax({
        type: "POST",
        url: '/login',
        data: {
          json_string: JSON.stringify({username: username, password: password})
        },
        success: function(response){
            //goes to landing after login but will return to login if user does not exist
            if(response=="False")
            {
                window.alert("Incorrect username or password")
                window.location.href = '/login'
            }
            else{
                window.location.href = '/landing'
            }
        }
    })
}


/** Stores the inputted username and password(if it doesn't exist already) in the file/database */

function signup()
{
  //get user and password from front end
  const username = document.querySelector("#username");
  const userInput = username.value;
  const password = document.querySelector("#password");
  const passInput = password.value;

    $.ajax({
        type: "POST",
        url: '/signup',
        data: {
          json_string: JSON.stringify({username: userInput, password: passInput})
        },
        success: function(response){
            //goes to landing after signup
            if(response=="False")
            {
                window.alert("Username already taken")
                window.location.href = '/login'
            }
            else{
                window.location.href = '/landing'
            }

        }
    })
}

/** Drops the session if confirmed */
function logOut()
{
    if(confirm("are you sure you want to log out?"))
    {
        window.location.href = '/dropsession';
    }
}

function followUser(user)
{
    $.post(`/follow/${user}`);
}

function returnHome()
{
    //Should show the images of everyone you're following
    window.location.href = '/landing';
}

function myImages()
{
    //should show your images
    window.location.href = '/profile';
}

/** Opens the image uploader */
function uploadImage()
{
    document.querySelector('#upload').style.visibility = "visible";
}

function fetchImagesforNewsfeed()
{
    $.ajax({
        type: "GET",
        url: '/user/newsfeed',
        success: function (response) {
            imagesDiv = document.querySelector("#images");
            for (let image of JSON.parse(response)) {
                let newImg = document.createElement("img");
                newImg.src = image["link"];
                imagesDiv.appendChild(newImg);
            }
        }
    });
}

/** Gets the images from the backend */
function fetchImagesforProfile()
{
    $.ajax({
        type: "GET",
        url: '/user/images',
        success: function (response) {
            imagesDiv = document.querySelector("#images");
            for (let image of JSON.parse(response)) {
                let newImg = document.createElement("img");
                newImg.src = image["link"];
                newImg.onclick = function () {
                    if(confirm("are you sure you want to delete this image?"))
                    {
                        $.post(`delete/${image["name"]}`);
                        window.location.href = '/landing';
                    }
                }
                imagesDiv.appendChild(newImg);
            }
        }
    });
}
function fetchUserImages(user)
{
  $.ajax({
    type: "GET",
    url: '/user/' + user + '/images',
    success: function (response) {
        imagesDiv = document.querySelector("#images");
        for (let image of JSON.parse(response)) {
            let newImg = document.createElement("img");
            newImg.src = image["link"];
            imagesDiv.appendChild(newImg);
        }
    }
});
}

function searchUsername()
{
  let targetUser = document.getElementById("searchUser").value
  $.ajax({
    type: "POST",
    url: '/search/' + targetUser,
    success: function(response){
        //goes to landing after signup
        if(response=="False")
        {
          window.alert("Username does not exist");
        }
        else {
          window.location.href = '/search/' + targetUser
        }
    }
  })
}

window.onload = () => {
    if (window.location.pathname == '/landing') {
        fetchImagesforNewsfeed();
    }
    if (window.location.pathname == '/profile') {
        fetchImagesforProfile();
    }
    pathArr = window.location.pathname.split('/')
    if (pathArr[1] == 'search') {
      fetchUserImages(pathArr[2]);
    }
}
