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
  const btnSignUp = document.getElementById('signUpButton');
  const btnLogOut = document.getElementById('logOutButton');
  const showUser = document.getElementById('User');

  // Add login event
  btnLogin.addEventListener('click', e => {
    // Get email and password values
    const email = txtEmail.value;
    const password = txtPassword.value;
    const auth = firebase.auth();
    console.log(email);
    console.log(password);

    // Sign In
    const promise = auth.signInWithEmailAndPassword(email,password);
    promise.catch(e => console.log(e.message));
  });

  btnLogOut.addEventListener('click', e =>{
    firebase.auth().signOut();
  });

  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser){
      console.log(firebaseUser);
      showUser.innerText = firebaseUser.email;
      btnLogOut.classList.remove('hide');
    } else{
      btnLogOut.classList.add('hide');
      showUser.innerText = 'No user.';
    }
  });
}());
