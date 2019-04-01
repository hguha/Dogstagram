function login() {
    //validate it or whatever I'm confused by this
    var username = document.getElementById("username");
    var password = document.getElementById("password");
    console.log(password.value)
  if ((password.value == "password") && (username.value == "username"))
  {
     window.open('target.html')
  }
  else
  {
      alert("The username or password you entered doesn't exist!");
  }
}
function signup()
{
    //figure out how to get this into a database I guess?
}
