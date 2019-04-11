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

/* currently broken
  //query for matching username and password in Firebase
  docRef.where("user", "==", userInput).get().then(function (doc) {
    if (doc && doc.exists) {
      let myData = doc.data();
      console.log( myData );
      if (myData.user == userInput) {
        //userValid = true;
        console.log( "myData.user: ");
      }
      if (myData.pass == passInput) {
        //passValid = true;
        console.log( "myData.pass: ");
      }
    }
  })

  console.log(password.value)
  if ((password.value == "password") && (username.value == "username"))
  {
     window.location.href = "landing.html";
  }
  else
  {
      alert("The username or password you entered doesn't exist!");
  }
*/
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

function logOut()
{
    window.location.href = '/dropsession';
}

function returnHome()
{
    window.location.href = '/landing';
}

function uploadImage()
{
    document.querySelector('#upload').style.visibility = "visible";
}

function fetchImages()
{
    $.ajax({
        type: "GET",
        url: '/user/images',
        success: function (response) {
          console.log(response)
            imagesDiv = document.querySelector("#images");
            for (let image of JSON.parse(response)) {
                let newImg = document.createElement("img");
                newImg.src = image;
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
        console.log(response)
        imagesDiv = document.querySelector("#images");
        for (let image of JSON.parse(response)) {
            let newImg = document.createElement("img");
            newImg.src =  "../" + image;
            imagesDiv.appendChild(newImg);
        }
    }
});
}  

function searchUsername()
{
  let targetUser = document.getElementById("searchUser").value
  $.ajax({
    type: "GET",
    asyn: false,
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
        fetchImages();
    }
    pathArr = window.location.pathname.split('/')
    if (pathArr[1] == 'search') {
      fetchUserImages(pathArr[2]);
    }

    
}