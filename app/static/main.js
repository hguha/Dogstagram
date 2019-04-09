function login() {
    //validate it or whatever I'm confused by this
    var username = document.getElementById("username");
    var password = document.getElementById("password");
    console.log(password.value)
  if ((password.value == "password") && (username.value == "username"))
  {
     window.location.href = "landing.html";
  }
  else
  {
      alert("The username or password you entered doesn't exist!");
  }
}


function signup()
{

    $.ajax({
        type: "POST",
        url: '/signup',
        data: {
          json_string: JSON.stringify({username: username.value, password: password.value})
        },
        success: function(response){
            //goes to landing after signup
            window.location.href = '/landing'
        }
    })  

    
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAI5CEVqPwnDM7p6WmDIyQLx2V6QdfL2Nc",
    authDomain: "dogstagram-b019f.firebaseapp.com",
    databaseURL: "https://dogstagram-b019f.firebaseio.com",
    projectId: "dogstagram-b019f",
    storageBucket: "dogstagram-b019f.appspot.com",
    messagingSenderId: "495415462838"
  };
  firebase.initializeApp(config);

  //set up document reference
  var firestore = firebase.firestore();
  const docRef = firestore.collection("users").doc("user1")

  //get user and password from front end
  const username = document.querySelector("#username");
  const userInput = username.value;
  const password = document.querySelector("#password");
  const passInput = password.value;

  //pass user inputs to Firebase
  console.log("I'm saving " + userInput + ' ' + passInput + " to Firestore.");
  docRef.set
  ({
    user: userInput,
    pass: passInput
  });
}


function logOut()
{
  if(confirm("are you sure you want to log out?"))
  {
       window.location.href = "index.html";
  }
}
