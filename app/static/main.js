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
    if(passInput=="" || userInput=="")
    {
        return "Failed";
    }
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
                return "Failed"
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

/** Sends a requst to backend to follow the user */

function followUser(user)
{
    $.post(`/follow/${user}`);
}

/** Returns to the home page/feed */

function returnHome()
{
    //Should show the images of everyone you're following
    window.location.href = '/landing';
}

/** Shows only my images */

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

/** I don't think this function does anything but I'm too scared to delete it */

function upload()
{
    document.querySelector('#imageUpload')
}

/** Gets images of those followed */

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
                let newh2 = document.createElement("h2");
                node = document.createTextNode(image["user"]);
                newh2.appendChild(node);
                imagesDiv.appendChild(newh2);
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

/** SGEtches a specific users images */

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

/** Searches the database for existing user, and shows tere images if exists */

function searchUsername()
{
  let targetUser = ""
  if(document.getElementById("searchUser"))
  {
    targetUser = document.getElementById("searchUser").value
  }
  if(targetUser=="")
  {
      return "Fail"
  }
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


/** TEST SUITE */
let globalcount=0;
function runTests()
{
    console.log("The tests being run here are meant to check if our desired\noutput is correct based on some user inputs. We go through common user \nactions and verify that the output or action is as we expect. We go    \nthrough all of the buttons and make sure that the user is redirected to\nthe correct place. We also make sure that image functionity exists and \nis working as intended")
    console.log("Running tests...")
    console.log(loginTests())
    console.log(signupTests())
    console.log(logoutTests())
    console.log(followTests())
    console.log(searchTests())
    console.log(profileTests())
    console.log("\n\n Total tests passed: " + globalcount +"/15")

}

/** Tests Login functionality */
function loginTests()
{
    let loginTest = "\nTesting the login funcitonality: \n\n"
    let loginCount = 0;
    if(loginValid()=="Passed")
    {
        loginCount++;
        globalcount++;
        loginTest = loginTest + "   Login works for a valid username and Password: Passed\n"
    }
    else{
        loginTest = loginTest + "   Login works for a valid username and Password: Failed\n"
    }
    if(loginInvalid()=="Passed")
    {
        loginCount++;
        globalcount++;
        loginTest = loginTest + "   Login doesn't work for an invalid username and Password: Passed\n"
    }
    else{
        loginTest = loginTest + "   Login doesn't work for an invalid username and Password: Failed\n"
    }
    if(loginOnEmptyUser()=="Passed")
    {
        loginCount++;
        globalcount++;
        loginTest = loginTest + "   Login doesn't work for an empty username: Passed\n"
    }
    else{
        loginTest = loginTest + "   Login doesn't work for an empty username: Failed\n"
    }
    if(loginOnEmptyUser()=="Passed")
    {
        loginCount++;
        globalcount++;
        loginTest = loginTest + "   Login doesn't work for an empty password: Passed\n"
    }
    else{
        loginTest = loginTest + "   Login doesn't work for an empty password: Failed\n"
    }
    loginTest = loginTest + "   Login Tests Passed: " + loginCount + "/4"
    return(loginTest)
}

/** Tests SignUp functionality */

function signupTests()
{
    let output = "\nTesting the signup functionality: \n\n"
    let count=0;
    if(signupEmptyUser()=="Passed")
    {
        count++;
        globalcount++;
        output = output + "   Signup does not allow user to input an empty username: Passed\n"
    }
    else{
        output = output + "   Signup does not allow user to input an empty username: Failed\n"
    }
    if(signupEmptyPassword()=="Passed")
    {
        count++;
        globalcount++;
        output = output + "   Signup does not allow user to input an empty password: Passed\n"
    }
    else{
        output = output + "   Signup does not allow user to input an empty password: Failed\n"
    }
    if(signupNew()=="Passed")
    {
        count++;
        globalcount++;
        output = output + "   Signing up with a new username and password is allowed and creates a new user: Passed\n"
    }
    else{
        output = output + "   Signing up with a new username and password is allowed and creates a new user: Failed\n"
    }
    if(signupExists()=="Passed")
    {
        count++;
        globalcount++;
        output = output + "   Signing up with an existing username fails: Passed\n"
    }
    else{
        output = output + "   Signing up with an existing username fails: Failed\n"
    }

    output = output + "   Signup Tests Passed " + count + "/4"
    return(output)
}

/** Tests Logout functionality */

function logoutTests()
{
    let output = "\nTesting the logout functionality: \n\n"
    let count=0;
    if(loginAfterLoggedOut()=="Passed")
    {
        count++;
        globalcount++;
        output = output + "   Can not login after logged out: Passed\n"
    }
    else{
        output = output + "   Can not login after logged out: Failed\n"
    }
    if(logoutWhenloggedIn()=="Passed")
    {
        count++;
        globalcount++;
        output = output + "   Logout button logs the user out: Passed\n"
    }
    else{
        output = output + "   Logout button logs the user out: Failed\n"
    }

    output = output + "   Logout Tests Passed " + count + "/2"
    return(output)
}

/** Tests Follower functionality */

function followTests()
{
    let output = "\nTesting the follow functionality: \n\n"
    let count=0;
    if(doesFollow()=="Passed")
    {
        count++;
        globalcount++;
        output = output + "   The follow button successfully follows a user: Passed\n"
    }
    else{
        output = output + "   The follow button successfully follows a user: Failed\n"
    }
    output = output + "   Follow Tests Passed " + count + "/1"
    return(output)
}

/** Tests Search functionality */

function searchTests()
{
    let output = "\nTesting the search functionality: \n\n"
    let count=0;
    if(searchNonExist()=="Passed")
    {
        count++;
        globalcount++;
        output = output + "   The search will not work if the user does not exist: Passed\n"
    }
    else{
        output = output + "   The search will not work if the user does not exist: Failed\n"
    }
    if(searchEmpty()=="Passed")
    {
        count++;
        globalcount++;
        output = output + "   You can not search with an empty field: Passed\n"
    }
    else{
        output = output + "   You can not search with an empty field: Failed\n"
    }
    if(searchExists()=="Passed")
    {
        count++;
        globalcount++;
        output = output + "   The seach will work if the user exists: Passed\n"
    }
    else{
        output = output + "   The seach will work if the user exists: Failed\n"
    }
    output = output + "   Search Tests Passed " + count + "/3"
    return(output)
}

/** Tests Profile functionality */

function profileTests()
{
    let output = "\nTesting the profile functionality: \n\n"
    let count=0;
    if(profileLink()=="Passed")
    {
        count++;
        globalcount++;
        output = output + "   The profile link won't work if you aren't logged in: Passed\n"
    }
    else{
        output = output + "   The profile link won't work if you aren't logged in: Failed\n"
    }
    output = output + "   Profile Tests Passed " + count + "/1"
    return(output)
}

function loginInvalid()
{
    let t1;
    $.ajax({
        type: "POST",
        url: '/login',
        async: false,
        data: {
          json_string: JSON.stringify({username: "alk;sjdf;lka", password: "alksjdf;lkasdjf"})
        },
        success: function(response){
            //goes to landing after login but will return to login if user does not exist
            if(response=="False")
            {
                t1 = "Passed"
            }
            else{
                window.location.href = '/landing'
                t1 = "Failed"
            }
        }
    })
    return t1;
}
function loginValid()
{
    let t1;
    $.ajax({
        type: "POST",
        url: '/login',
        async: false,
        data: {
          json_string: JSON.stringify({username: "john", password: "john"})
        },
        success: function(response){
            //goes to landing after login but will return to login if user does not exist
            if(response=="False")
            {
                t1 = "Failed"
            }
            else{
                t1 = "Passed"
            }
        }
    })
    return t1;
}

function loginOnEmptyUser()
{
    let t1;
    $.ajax({
        type: "POST",
        url: '/login',
        async: false,
        data: {
          json_string: JSON.stringify({username: "", password: "asdf"})
        },
        success: function(response){
            //goes to landing after login but will return to login if user does not exist
            if(response=="False")
            {
                t1 = "Passed"
            }
            else{
                t1 = "Failed"
            }
        }
    })
    return t1;
}
function loginOnEmptyPass()
{
    let t1;
    $.ajax({
        type: "POST",
        url: '/login',
        async: false,
        data: {
          json_string: JSON.stringify({username: "asdf", password: ""})
        },
        success: function(response){
            //goes to landing after login but will return to login if user does not exist
            if(response=="False")
            {
                t1 = "Passed"
            }
            else{
                t1 = "Failed"
            }
        }
    })
    return t1;
}
function signupEmptyUser()
{
    document.querySelector("#username").value = ""
    if(signup()=="Failed")
    {
        return "Passed"
    }
    return "Failed"
}
function signupEmptyPassword()
{
    document.querySelector("#password").value = ""
    if(signup()=="Failed")
    {
        return "Passed"
    }
    return "Failed"
}
function signupNew()
{
    $.ajax({
        type: "POST",
        url: '/signup',
        async: false,
        data: {
          json_string: JSON.stringify({username: "qwerty", password: "qwerty"})
        },
        success: function(response){
            //goes to landing after signup
            if(response=="False")
            {
                t1= "Failed"
            }
            else{
                t1= "Passed"
            }

        }
    })
    $.post(`/deleteUser/qwerty`);
    return t1;
}
function signupExists()
{
    $.ajax({
        type: "POST",
        url: '/signup',
        async: false,
        data: {
          json_string: JSON.stringify({username: "john", password: "john"})
        },
        success: function(response){
            //goes to landing after signup
            if(response=="False")
            {
                t1= "Passed"
            }
            else{
                t1= "Failed"
            }

        }
    })
    return(t1)
}
function logoutWhenloggedIn()
{
    $.ajax({
        type: "POST",
        url: '/login',
        async: false,
        data: {
          json_string: JSON.stringify({username: "john", password: "john"})
        },
        success: function(response){
            //goes to landing after login but will return to login if user does not exist
            if(response=="False")
            {
                t1 = "Passed"
            }
            else{
                window.location.href = "/landing"
            }
        }
    })
    window.location.href = "/dropsession"
    if(window.location.pathname=="/login")
    {
        return "Passed"
    }
    return "Failed";
}
function loginAfterLoggedOut()
{
    $.ajax({
        type: "POST",
        url: '/login',
        async: false,
        data: {
          json_string: JSON.stringify({username: "john", password: "john"})
        },
        success: function(response){
            //goes to landing after login but will return to login if user does not exist
            if(response=="False")
            {
                t1 = "Passed"
            }
            else{
                window.location.href = "/landing"
            }
        }
    })
    window.location.href = "/dropsession"
    if(window.location.pathname=="/login")
    {
        return "Passed"
    }
    return "Failed";
}

function doesFollow()
{
    $.ajax({
        type: "POST",
        url: '/doesfollow/giang',
        success: function(response){
            //goes to landing after signup
            if(response.follows==true)
            {
                t1= "Failed"
            }
            else{
                t1= "Passed"
            }

        }
    })
    return t1;
}

function searchNonExist()
{
    let t1;
    $.ajax({
        type: "POST",
        async: false,
        url: '/search/aj;sdlk;jfa;ksdjfaksjdf;alkjsdf;laksdj',
        success: function(response){
            if(response=="False")
            {
              t1= "Passed"
            }
            else {
              t1= "Failed"
            }
        }
      })
      return t1;
}
function searchExists()
{
    let t1;
    $.ajax({
        type: "POST",
        async: false,
        url: '/search/john',
        success: function(response){
            if(response=="False")
            {
              t1= "Failed"
            }
            else {
              t1= "Passed"
            }
        }
      })
      return t1;
}
function searchEmpty()
{
    if(searchUsername()=="Fail")
    {
        return "Passed"
    }
    return "Failed"
}
function profileLink()
{
    $.post('/profile')
    if(window.location.pathname=="/login")
    {
        return "Passed"
    }
    return "Failed"
}
function profileLink()
{
    $.post('/profile')
    if(window.location.pathname=="/login")
    {
        return "Passed"
    }
    return "Failed"
}
