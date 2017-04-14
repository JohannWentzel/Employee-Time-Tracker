
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
const employeesBtn = document.getElementById('employeesBtn');
const projectsBtn = document.getElementById('projectsBtn');
const settingsBtn = document.getElementById('settingsBtn');
const approvalsBtn = document.getElementById('approvalsBtn');

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
      console.log(name);
      console.log(type);
      console.log(email);

    });
    console.log(UID);

    let dbEvents = database.ref().child('Events/'+UID);
    //Read the Events from Firebase
    dbEvents.on('value', snapshot => {
      //console.log(snapshot.val());
      scheduler.firebase(dbEvents); // Set events to the scheduler
    });



    /*
    //manager wants to see all events for all UID's
    let dbEvents2 = database.ref().child('Events/');
    //Read the Events from Firebase
    dbEvents.on('value', snapshot => {
    snapshot.forEach(function (allEventsSnapshot) {
    console.log(allEventsSnapshot);
    scheduler.firebase(dbEvents2);
    });

    // Set events to the scheduler
    });
    */
  } else {
    window.location.href = "login.html";
  }
});

// Log out event
btnLogOut.addEventListener('click', e => {
  firebase.auth().signOut();
  window.location.href = "login.html";
});

//Manager's navbar-employee button
employeesBtn.addEventListener('click', e => {
  //displays a container with all employees in the database
  document.getElementById("mySidenav").style.width = "250px";
  //Loop through "Employee" to get data of every Employee in the data base
  var index = 1;
  var query = firebase.database().ref("Employee/").orderByKey();
  query.once("value")
  .then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      // key will be "ada" the first time and "alan" the second time
      var key = childSnapshot.key;
      var childData = childSnapshot.val();
      document.getElementById(index.toString()).innerText = childData["firstName"];
      index++;
    });
  });
});

projectsBtn.addEventListener('click', e => {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("1").innerText = "Project1";
  document.getElementById("2").innerText = "Project2";
  document.getElementById("3").innerText = "Project3";
});

approvalsBtn.addEventListener('click', e => {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("1").innerText = "Approval1";
  document.getElementById("2").innerText = "Approval2";
  document.getElementById("3").innerText = "Approval3";
});

settingsBtn.addEventListener('click', e => {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("1").innerText = "Delete user";
  document.getElementById("2").innerText = "Add User";
  document.getElementById("3").innerText = "Add Project";
});

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

var hours = new RadialProgressChart('.hours', {
  diameter: 200,
    max: 40,
    round: false,
    series: [{
      value: 37.75,
    color: ['red', '#7CFC00']
    }],
    center: function(d) {
              return d.toFixed(2) + ' HOURS'
            }
});

// Initialize the DHTMLX scheduler
function init() {
  scheduler.init('scheduler_here', new Date(), "week");
}
