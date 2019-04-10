//initialize Firebase
var config = {
  apiKey: "AIzaSyAI5CEVqPwnDM7p6WmDIyQLx2V6QdfL2Nc",
  authDomain: "dogstagram-b019f.firebaseapp.com",
  databaseURL: "https://dogstagram-b019f.firebaseio.com",
  projectId: "dogstagram-b019f",
  storageBucket: "dogstagram-b019f.appspot.com",
  messagingSenderId: "495415462838"
};
firebase.initializeApp(config);


/** Handles the login, checks the database/files to assure authentication, then pushes it to the backend */
function login() {
  //set up document reference
  var firestore = firebase.firestore();
  let docRef = firestore.collection("users")

  //get user and password from front end
  const username = document.querySelector("#username");
  const userInput = username.value;
  const password = document.querySelector("#password");
  const passInput = password.value;

  let userValid = false;
  let passvalid = false;

    $.ajax({
        type: "POST",
        url: '/login',
        data: {
          json_string: JSON.stringify({username: username.value, password: password.value})
        },
        success: function(response){
            console.log(response)
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
    console.log(password.value)
}


/** Stores the inputted username and password(if it doesn't exist already) in the file/database */

function signup()
{
  //set up document reference
  var firestore = firebase.firestore();
  let docRef = firestore.collection("users")

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

  // Add a new document with a generated id.
  firestore.collection("users").add({
      user: userInput,
      pass: passInput
  })
  .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
  })
  .catch(function(error) {
      console.error("Error adding document: ", error);
  });
}

/** Useless function */
function addImage()
{
  //set up document reference
  var firestore = firebase.firestore();
  let docRef = firestore.collection("images")

  //get image url from front end
  const img = document.querySelector("#image");
  const imgInput = img.value;

  // Add a new document with a generated id.
  docRef.add({
      location: imgInput
  })
  .then(function(docRef) {
      console.log("Document written with ID: ", docRef.location);
  })
  .catch(function(error) {
      console.error("Error adding document: ", error);
  });
}

/** Drops the session if confirmed */
function logOut()
{
    if(confirm("are you sure you want to log out?")
    {
        window.location.href = '/dropsession';
    }
}

/** Opens the image uploader */
function uploadImage()
{
    document.querySelector('#upload').style.visibility = "visible";
}

/** Gets the images from the backend */
function fetchImages()
{
    $.ajax({
        type: "GET",
        url: '/user/images',
        success: function (response) {
            imagesDiv = document.querySelector("#images");
            for (let image of JSON.parse(response)) {
                let newImg = document.createElement("img");
                newImg.src = image;
                imagesDiv.appendChild(newImg);
            }
        }
    });
}

window.onload = () => {
    if (window.location.pathname == '/landing') {
        fetchImages();
    }
}
