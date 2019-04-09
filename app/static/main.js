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

//set up document reference
var firestore = firebase.firestore();
const docRef = firestore.collection("users")



function login() {
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
            window.location.href = '/landing'
        }
    })
    console.log(password.value)
}



function signup()
{
    var username1 = document.getElementById("username");
    var password1 = document.getElementById("password");
    $.ajax({
        type: "POST",
        url: '/signup',
        data: {
          json_string: JSON.stringify({username: username1.value, password: password1.value})
        },
        success: function(response){
            //goes to landing after signup
            window.location.href = '/landing'
        }
    })

  //get user and password from front end
  const username = document.querySelector("#username");
  const userInput = username.value;
  const password = document.querySelector("#password");
  const passInput = password.value;

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



function logOut()
{
    window.location.href = '/dropsession'
}
