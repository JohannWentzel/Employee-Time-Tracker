// Initialize Firebase
var config = {
  apiKey: "AIzaSyCiTqWN0OhnaaQibMzHgL5itpqQX1bnEo8",
  authDomain: "employee-time-tracking-b561d.firebaseapp.com",
  databaseURL: "https://employee-time-tracking-b561d.firebaseio.com",
  storageBucket: "employee-time-tracking-b561d.appspot.com",
  messagingSenderId: "195814535649"
};

// Create & initializes the Firebase app instance
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

// Get UI element references
const txtEmail = document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');
const txtConfirmPassword = document.getElementById('txtConfirmPassword');
const txtFirstName = document.getElementById('txtFirstName');
const txtLastName = document.getElementById('txtLastName');
const typeSelect = document.getElementById('typeSelect');
const btnLogin = document.getElementById('loginButton');
const btnSubmit = document.getElementById('submitButton');
const btnSignUp = document.getElementById('signUpButton');
const btnCancel = document.getElementById('cancelButton');
const navbar = document.getElementById('navbar');
const formGroup = document.getElementById('form-group');
const alertMsg = document.getElementById('alertMsg');

// Focus cursor
txtEmail.focus();

// Add login event
btnLogin.addEventListener('click', e => {
  const email = txtEmail.value;
  const password = txtPassword.value;
  const auth = firebase.auth();

  // Sign In
  auth.signInWithEmailAndPassword(email,password).catch( e => {
    var errorCode = e.code;
    var errorMessage = e.message;
    alertMsg.innerHTML = "<strong>Whoops!</strong> Invalid login credentials.";
    $('#loginAlert').show();
  });
});

// Display the sign-up form
btnSignUp.addEventListener('click', f => {
  btnLogin.classList.add('hide');
  btnSignUp.classList.add('hide');
  btnCancel.classList.remove('hide');
  btnSubmit.classList.remove('hide');
  txtConfirmPassword.classList.remove('hide');
  txtFirstName.classList.remove('hide');
  txtLastName.classList.remove('hide');
  typeSelect.classList.remove('hide');
});

// Display the login form
btnCancel.addEventListener('click', f => {
  btnLogin.classList.remove('hide');
  btnSignUp.classList.remove('hide');
  btnCancel.classList.add('hide');
  btnSubmit.classList.add('hide');
  txtConfirmPassword.classList.add('hide');
  txtFirstName.classList.add('hide');
  txtLastName.classList.add('hide');
  typeSelect.classList.add('hide');
});

// Create a new user - upon creation, the user is logged in
btnSubmit.addEventListener('click', e => {
  const email = txtEmail.value;
  const password = txtPassword.value;
  const confirmPassword = txtConfirmPassword.value;
  const firstName = txtFirstName.value;
  const lastName = txtLastName.value;
  const type = typeSelect.value;

  var fields = [email, password, confirmPassword, firstName, lastName];

  if (areNull(fields)) {
    alertMsg.innerHTML = "<strong>Stop!</strong> One or more of your fields are empty.";
    $('#loginAlert').show();
    return;
  }

  if (password != confirmPassword) {
    alertMsg.innerHTML = "<strong>Uhoh!</strong> Passwords do not match.";
    $('#loginAlert').show();
    return;
  }

  const auth = firebase.auth();
  const promise = auth.createUserWithEmailAndPassword(email,password);

  var dbRef= database.ref();

  promise.then(val => {
    dbRef.child('Employee/' + val.uid).set({
      email : email,
      firstName : firstName,
      lastName : lastName,
      type : type,
      vacation: 0
    });
  }).catch(e => {
    console.log(e.message);
    return;
  });
});

// Firebase authentication listener
firebase.auth().onAuthStateChanged(firebaseUser => {
  if (firebaseUser) {
    var s = firebaseUser.uid;
    console.log(s);
    window.location.href = "main.html";
  } else {
      console.log(firebaseUser);
  }
});

// On click, hide the specified element
$("[data-hide]").click(function(){
  $($(this).attr('data-hide')).hide();
});

// Pressing "Enter" now clicks "login"
formGroup.addEventListener('keypress', e => {
  if (e.which == 13 || e.which == 3) {
    if ($(btnLogin).is(":visible")) {
      btnLogin.click();
    }
    else {
      btnSubmit.click();
    }
	}
});

// Check if any fields are empty
function areNull(fields) {
  var len = fields.length;
  for (var i = 0; i < len; i++) {
    if (fields[i] === "") {
      //console.log("Found a null field.");
      return true;
    }
  }
  return false;
}
