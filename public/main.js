
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
var UID;
// Get a reference to the database service
var database = firebase.database();

// Create database references for JSON children
var dbEvents = database.ref().child('Events');
//var dbEmployee; //= database.ref().child("Employee/hAymr6CBameiJT6BlkofnYYChSi1"); // TODO: pull the current logged-in user

// Read the Events from Firebase
dbEvents.on('value', snapshot => {
  //console.log(snapshot.val());
  scheduler.firebase(dbEvents); // Set events to the scheduler
});

// More testing..


// Get UI element references
const btnLogOut = document.getElementById('logOutButton');
const showUser = document.getElementById('userEmail');
const navbar = document.getElementById('navbar');

// Check for user authentication
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    UID = user.uid;
    showUser.innerText = user.email;
    btnLogOut.classList.remove('hide');
    navbar.style.visibility = "visible";


    let dbEmployee = database.ref().child("Employee/"+UID);
    dbEmployee.once("value").then( snapshot => {
      let name = snapshot.child("name").val();
      let type = snapshot.child("type").val();
      console.log(name);
      console.log(type);
    });


  } else {
      window.location.href = "login.html";
  }
});

// Log out event
btnLogOut.addEventListener('click', e => {
  firebase.auth().signOut();
  window.location.href = "login.html";
});

// Initialize the DHTMLX scheduler
function init() {
  scheduler.init('scheduler_here', new Date(), "month");
}

