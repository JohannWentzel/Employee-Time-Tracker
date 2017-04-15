
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

    });
  //  console.log(UID);

    let dbEvents = database.ref().child('Events/'+UID);
    //Read the Events from Firebase


    dbEvents.on('value', snapshot => {
      //console.log(snapshot.val());
        let totalHours=0;
        var today = new Date();
        var mondayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay()+1).valueOf();
        var sundayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay()+8).valueOf()-1;

        snapshot.forEach(function (childSnapshot) {
           var key = childSnapshot.key;

           let start=childSnapshot.child("start_date").val();
           let end=childSnapshot.child("end_date").val();
           let duration = (end-start)/(1000*60*60);
           //console.log(duration);
           if (start>=mondayOfWeek && start<=sundayOfWeek){
               totalHours=totalHours+duration;
           }



        });
      scheduler.firebase(dbEvents); // Set events to the scheduler
        hours.update(totalHours);
    });

    //Display navbar Buttons IF the current is of type Manager
    return firebase.database().ref('/Employee/' + UID).once('value').then(function(snapshot) {
    let userType = snapshot.child("type").val();
      if(userType == "Manager"){
        employeesBtn.style.visibility = "visible";
        projectsBtn.style.visibility = "visible";
        settingsBtn.style.visibility = "visible";
        approvalsBtn.style.visibility = "visible";
      }
      else {
        employeesBtn.style.visibility = "hidden";
        projectsBtn.style.visibility = "hidden";
        settingsBtn.style.visibility = "hidden";
        approvalsBtn.style.visibility = "hidden";
      }

      //manager wants to see all events for all UID's
       if(userType == "Manager"){
        let dbEvents2 = database.ref().child('Events/');
       //Read the Events from Firebase
        dbEvents2.on('value', snapshot => {
        snapshot.forEach(function (allEventsSnapshot) {
        console.log(allEventsSnapshot);
        //each snapshot contains events for each user.
        //need to iterate through each user to get all events of each user.
        //then add them to the calendar
        //scheduler.firebase(dbEvents2);
         });
         // Set events to the scheduler
         });
       }
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

//Nav bar projects
projectsBtn.addEventListener('click', e => {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("1").innerText = "Project1";
  document.getElementById("2").innerText = "Project2";
  document.getElementById("3").innerText = "Project3";
});

//Nav bar approvals
approvalsBtn.addEventListener('click', e => {

  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("1").innerText = "Approval1";
  document.getElementById("2").innerText = "Approval2";
  document.getElementById("3").innerText = "Approval3";

});

//Nav bar Setting
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
    diameter: 100,
    stroke:{
        width: 20,
        gap: 2
    },
    max: 40,
    round: false,
    series: [{
      value: 0,
    color: ['red', '#7CFC00']
    }],
    center: function(d) {
              return d.toFixed(2) + ' HOURS'
            }
});



// Initialize the DHTMLX scheduler
function init() {
  scheduler.init('scheduler_here', new Date(), "month");
  scheduler.locale.labels.section_text = 'Description';
  scheduler.locale.labels.section_projects= 'Projects';
  scheduler.locale.labels.section_type = 'Type';

  // day/week views will show the expanded event lightbox
  scheduler.config.details_on_create=true;
  scheduler.config.details_on_dblclick=true;

  // labels are currently placeholders
  var project_opts = [
    { key: 1, label: 'Project 1' },
    { key: 2, label: 'Project 2' },
    { key: 3, label: 'Project 3' }
  ];

  var type_opts = [
    { key: 1, label: 'Development' },
    { key: 2, label: 'Meeting' },
    { key: 3, label: 'Testing' }
  ];

  scheduler.config.lightbox.sections = [
    { name:"text", height:50, map_to:"text", type:"textarea", focus:true },
    { name:"projects", height:50, map_to:"type", type:"select", options:project_opts},
    { name:"type", height:50, map_to:"type", type:"select", options:type_opts},
    { name:"time", height:72, type:"time", map_to:"auto"} // note that this field must always be last
  ];
}
