(function() {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCiTqWN0OhnaaQibMzHgL5itpqQX1bnEo8",
    authDomain: "employee-time-tracking-b561d.firebaseapp.com",
    databaseURL: "https://employee-time-tracking-b561d.firebaseio.com",
    storageBucket: "employee-time-tracking-b561d.appspot.com",
    messagingSenderId: "195814535649"
  };

  firebase.initializeApp(config);

  // TESTING REALTIME DATABASE
  // var BigOne = document.getElementById('Greetings');
  // var dbRef = firebase.database().ref().child('Employee').child('hAymr6CBameiJT6BlkofnYYChSi1').child('name');
  // dbRef.on('value', snap => Greetings.innerText = snap.val());

  //Get UI element references
  const txtEmail = document.getElementById('txtEmail');
  const txtPassword = document.getElementById('txtPassword');
  const btnLogin = document.getElementById('loginButton');
  const btnSubmit = document.getElementById('submitButton');
  const btnSignUp = document.getElementById('signUpButton');
  const btnCancel = document.getElementById('cancelButton');
  const btnLogOut = document.getElementById('logOutButton');
  const showUser = document.getElementById('User');
  const navbar = document.getElementById('navbar');

  // Add login event
  btnLogin.addEventListener('click', e => {
    const email = txtEmail.value;
    const password = txtPassword.value;
    const auth = firebase.auth();
    //console.log(email);
    //console.log(password);

    // Sign In
    const promise = auth.signInWithEmailAndPassword(email,password);
    promise.catch(e => console.log(e.message));

//    window.location.href = "main.html";
//    var user = firebase.auth().currentUser;
//    console.log(user)
  });

  // Display the sign-up form 
  btnSignUp.addEventListener('click', e => {
    btnLogin.classList.add('hide');
    btnSignUp.classList.add('hide');
    btnCancel.classList.remove('hide');
    btnSubmit.classList.remove('hide');
  });

  // Display the login form
  btnCancel.addEventListener('click', e => {
    btnLogin.classList.remove('hide');
    btnSignUp.classList.remove('hide');
    btnCancel.classList.add('hide');
    btnSubmit.classList.add('hide');
  });

  // Create a new user - upon creation, the user is logged in
  btnSubmit.addEventListener('click', e => {
    const email = txtEmail.value;
    const password = txtPassword.value;
    const auth = firebase.auth();
    const promise = auth.createUserWithEmailAndPassword(email,password);
    promise.catch(e => console.log(e.message));
  });

  btnLogOut.addEventListener('click', e => {
    firebase.auth().signOut();
  });

  // Firebase authentication listener
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      console.log(firebaseUser);
      showUser.innerText = firebaseUser.email;
      btnLogOut.classList.remove('hide');
      navbar.style.visibility = "visible";
    } else {
      btnLogOut.classList.add('hide');
      showUser.innerText = 'no user is logged in';
      navbar.style.visibility = "hidden";
    }
  });
}());
