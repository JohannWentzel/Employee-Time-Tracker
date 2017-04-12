
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

// Create database references for JSON children


// More testing..


// Get UI element references
const btnLogOut = document.getElementById('logOutButton');
const showUser = document.getElementById('userEmail');
const navbar = document.getElementById('navbar');

// Check for user authentication
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    let UID = user.uid;
    showUser.innerText = user.email;
    btnLogOut.classList.remove('hide');
    navbar.style.visibility = "visible";
    let email="";
    let type = "";
    let name = "";
    //populate the calendar and anything else that has to do with the uniqe ID on load.
    //database can be updated later using the email from the page it self
    let dbEmployee = database.ref().child("Employee/"+UID);
    dbEmployee.once("value").then( snapshot => {
      name = snapshot.child("name").val();
      type = snapshot.child("type").val();
      email = snapshot.child("email").val();
      email = email.replace(".","@");
      console.log(name);
      console.log(type);
      console.log(email);
      let dbEvents = database.ref().child('Events/'+email);
        //Read the Events from Firebase
      dbEvents.on('value', snapshot => {
            //console.log(snapshot.val());
        scheduler.firebase(dbEvents); // Set events to the scheduler
      });
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
