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
const btnLogOut = document.getElementById('logOutButton');
const showUser = document.getElementById('userEmail');
const navbar = document.getElementById('navbar');
const employeesBtn = document.getElementById('employeesBtn');
const projectsBtn = document.getElementById('projectsBtn');
const settingsBtn = document.getElementById('settingsBtn');
const approvalsBtn = document.getElementById('approvalsBtn');
const projectManagementBtn = document.getElementById('projectManagementBtn');
const sendBtn = document.getElementById('sendBtn');
const NotificationsBtn = document.getElementById('NotificationsBtn');
const addProjectBtn = document.getElementById('addProjectBtn');
const saveProject = document.getElementById('saveProject');

// Check for user authentication
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    let UID = user.uid;
    showUser.innerText = user.email;
    btnLogOut.classList.remove('hide');

    let email = "";
    let type = "";
    let name = "";
    // Populate the calendar and anything else that has to do with the uniqe ID on load
    // Database can be updated later using the email from the page it self
    let dbEmployee = database.ref().child("Employee/" + UID);
    dbEmployee.once("value").then( snapshot => {
      name = snapshot.child("name").val();
      type = snapshot.child("type").val();
      email = snapshot.child("email").val();
      vacation1 = snapshot.child("vacation").val();
      vacation.update(vacation1)
    });
    //console.log(UID);
    let dbNotes = database.ref().child('Notification/' + UID);

    dbNotes.on('value', snapshot => {
      let html = '';
      let c = 0;
      snapshot.forEach(function(childSnapshot) {
        c = c + 1;
        html += "<div class=\"well\">" + childSnapshot.val() + "</div>";
      });
      document.getElementById('yourNotes').innerHTML = html;
      if(c != 0) {
        document.getElementById('note_badge').innerHTML = c;
      }
    });

    let dbEvents = database.ref().child('Events/'+UID);

    // Read the Events from Firebase
    dbEvents.on('value', snapshot => {
      //console.log(snapshot.val());
      let totalHours = 0;
      let totalDev = 0;
      let totalMeeting = 0;
      let totalOther = 0;
      var today = new Date();
      var mondayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay()+1).valueOf();
      var sundayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay()+8).valueOf()-1;

      snapshot.forEach(function (childSnapshot) {
        var key = childSnapshot.key;

        let start = childSnapshot.child("start_date").val();
        let end = childSnapshot.child("end_date").val();
        let duration = (end-start)/(1000*60*60);
        let type = childSnapshot.child("type").val();

        //console.log(duration);
        if (start >= mondayOfWeek && start <= sundayOfWeek){
          totalHours = totalHours + duration;
          if (type === '1'){
            totalDev = totalDev+duration;
          }
          else if (type == '2'){
            totalMeeting = totalMeeting+duration;
          }
          else{
            totalOther=totalOther+duration;
          }
        }
      });
      scheduler.firebase(dbEvents); // Set events to the scheduler
      hours.update(totalHours);
      hoursByType.update([totalOther,totalMeeting,totalDev])
    });

    // Display navbar if the user is a Manager
    // A painful way of returning a promise begins
    return firebase.database().ref('/Employee/' + UID).once('value').then(function(snapshot) {
      let userType = snapshot.child("type").val();

      if(userType == "Manager"){
        employeesBtn.style.visibility = "visible";
        projectsBtn.style.visibility = "visible";
        settingsBtn.style.visibility = "visible";
        approvalsBtn.style.visibility = "visible";
        projectManagementBtn.visibility = "visible";
      }
      else {
        employeesBtn.remove();
        projectsBtn.remove();
        settingsBtn.remove();
        approvalsBtn.remove();
        projectManagementBtn.remove();
      }

    // Manager wants to see all events for all UID's
    if(userType == "Manager"){
      let dbEvents2 = database.ref().child('Events/');
      // Read the Events from Firebase
      dbEvents2.on('value', snapshot => {
        snapshot.forEach(allEventsSnapshot => {
          console.log(allEventsSnapshot);
        });
      });
    }
    });
  } 
  else {
    window.location.href = "login.html";
  }
});

// Log out event
btnLogOut.addEventListener('click', e => {
  firebase.auth().signOut();
  window.location.href = "login.html";
});

// Manager's navbar-employee button
employeesBtn.addEventListener('click', e => {
  //close other sidemenus
  document.getElementById("projectSidenav").style.width = "0";
  document.getElementById("approvalSidenav").style.width = "0";
  document.getElementById("settingSidenav").style.width = "0";

  // Displays a container with all employees in the database
  document.getElementById("employeeSidenav").style.width = "250px";
  // Loop through "Employee" to get data of every Employee in the data base
  var index = 1;
  var query = firebase.database().ref("Employee/");
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

// Navbar projects
projectsBtn.addEventListener('click', e => {
  //close other sidemenu opens
  document.getElementById("approvalSidenav").style.width = "0";
  document.getElementById("settingSidenav").style.width = "0";
  document.getElementById("employeeSidenav").style.width = "0";

  //open project side menu
  document.getElementById("projectSidenav").style.width = "250px";
  var index = 1;
  var query = firebase.database().ref("Project/");
  query.once("value")
  .then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      // key will be "ada" the first time and "alan" the second time
      var key = childSnapshot.key;
      var childData = childSnapshot.val();
      document.getElementById("project"+index.toString()).innerText = childData;
      index++;
    });
  });

});

// Navbar approvals
approvalsBtn.addEventListener('click', e => {
  //close other sidemenu open
  document.getElementById("employeeSidenav").style.width = "0";
  document.getElementById("projectSidenav").style.width = "0";
  document.getElementById("settingSidenav").style.width = "0";
  //open approval sidemenu
  document.getElementById("approvalSidenav").style.width = "250px";
  document.getElementById("1").innerText = "Approval1";
  document.getElementById("2").innerText = "Approval2";
  document.getElementById("3").innerText = "Approval3";
});

// Navbar Setting
settingsBtn.addEventListener('click', e => {
  //close other sidemnu open
  document.getElementById("employeeSidenav").style.width = "0";
  document.getElementById("projectSidenav").style.width = "0";
  document.getElementById("approvalSidenav").style.width = "0";

  //open settings side menu
  document.getElementById("settingSidenav").style.width = "250px";
  document.getElementById("1").innerText = "Delete user";
  document.getElementById("2").innerText = "Add User";
  document.getElementById("3").innerText = "Add Project";
});

function closeSideMenu() {
  document.getElementById("employeeSidenav").style.width = "0";
  document.getElementById("projectSidenav").style.width = "0";
  document.getElementById("approvalSidenav").style.width = "0";
  document.getElementById("settingSidenav").style.width = "0";
}

projectManagementBtn.addEventListener('click', e => {
    $('#noteModal').modal('hide');
  var query = firebase.database().ref("Employee/").orderByKey();
  query.once("value")
  .then(function(snapshot) {
    html = '';
    snapshot.forEach(function(childSnapshot) {
      // key will be "ada" the first time and "alan" the second time
      var key = childSnapshot.key;
      var childData = childSnapshot.val();
      let employee_first = childData["firstName"];
      let employee_last = childData["lastName"];
      let type = childData["type"];

      html += "<option>" + employee_first + " " + employee_last + "</option>";
    });
    document.getElementById('recipient').innerHTML = html;
  });

$('#NotificationsModal').appendTo("body");
});

sendBtn.addEventListener('click', e => {
  let a = document.getElementById("recipient");
  let recipient = a.options[a.selectedIndex].value;
  msg = document.getElementById("message-text").value;
  if(msg.length > 0){
  //get uid of the recipient
  var query = firebase.database().ref("Employee/").orderByKey();
  query.once("value")
    .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          // key will be "ada" the first time and "alan" the second time
          var key = childSnapshot.key;
          var childData = childSnapshot.val();
          let employee_first = childData["firstName"];
          let employee_last = childData["lastName"];
          let full = employee_first+" "+employee_last;
          if (full === recipient){
            firebase.database().ref("Notification/"+key).push(msg);
          }
        });

    snapshot.forEach(function(childSnapshot) {
      // key will be "ada" the first time and "alan" the second time
      var key = childSnapshot.key;
      var childData = childSnapshot.val();
      let employee_first = childData["firstName"];
      let employee_last = childData["lastName"];
      let full = employee_first + " " + employee_last;
      if (full === recipient){
        firebase.database().ref("Notification/"+key).push(msg);
      }
    });
  });
  }
document.getElementById("message-text").value = "";
$('#NotificationsModal').modal('hide');
});

addProjectBtn.addEventListener('click', e => {
  $('#AddProjectModal').appendTo("body");
});

saveProject.addEventListener('click', e => {
  name = document.getElementById("proj-name").value;

  if(name.length > 0){
    firebase.database().ref("Project").push(name);
  }
  document.getElementById("proj-name").value = "";
  $('#AddProjectModal').modal('hide');
});

// function closeProject() {
//   document.getElementById("projectSidenav").style.width = "0";
// }
//
// function closeApproval() {
//   document.getElementById("approvalSidenav").style.width = "0";
// }
//
// function closeSetting() {
//   document.getElementById("settingSidenav").style.width = "0";
// }

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
    color: ['#7CFC00','red']
  }],
  center: function(d) {
            return d.toFixed(2) + ' HOURS'
          }
});

var vacation = new RadialProgressChart('.vacation', {
  diameter: 100,
  stroke:{
    width: 20,
    gap: 2
  },
  max: 15,
  round: false,
  series: [{
    value: 0,
    color: ['#82CAFF', '#151B54']
  }],
  center: function(d) {
            return d.toFixed(1) + ' DAYS'
          }
});

var hoursByType = new RadialProgressChart('.hours_by_type', {
  diameter: 130,
  max: 40,
  series: [
    {labelStart: '\uF106', value: 15, color: ['#43C6DB','#2B65EC']},
    {labelStart: '\uF101', value: 35, color: ['#79F7CF', '#41A317']},
    {labelStart: '\uF105', value: 20, color: ['#F778A1', '#F70D1A']}
  ]
});

function getProjects() {
  let project = database.ref().child('Project/');
  var array = [];
  // Read the Projects from Firebase
  var deferred = $.Deferred(); // Magical defer 
  project.once('value')
    .then(snapshot => {
      snapshot.forEach(allProjectsSnapshot => {
        //console.log(array);
        array.push(allProjectsSnapshot.val());
      });
      deferred.resolve(array);
    });
  return deferred.promise();
};

// Initialize the DHTMLX scheduler
function init() {
  scheduler.config.start_on_monday = false; // Weeks start on Sunday
  scheduler.init('scheduler_here', new Date(), "week");
  scheduler.locale.labels.section_text = 'Description';
  scheduler.locale.labels.section_projects = 'Projects';
  scheduler.locale.labels.section_type = 'Type';

  // Day/week views will show the expanded event lightbox
  scheduler.config.details_on_create = true;
  scheduler.config.details_on_dblclick = true;

  promise = getProjects();
  project_opts = []; 
  promise.then(projectArray => {
    for (i = 0; i < projectArray.length; i++) {
      project_opts.push({ key: i, label: projectArray[i] });
    }
  });

  var type_opts = [
  { key: 1, label: 'Development' },
  { key: 2, label: 'Meeting' },
  { key: 3, label: 'Testing' }
  ];

  // Configure the lightbox fields
  scheduler.config.lightbox.sections = [
  { name:"text", height:50, map_to:"text", type:"textarea", focus:true },
  { name:"projects", height:50, map_to:"type", type:"select", options:project_opts},
  { name:"type", height:50, map_to:"type", type:"select", options:type_opts},
  { name:"time", height:72, type:"time", map_to:"auto"} // note that this field must always be last
  ];
}
