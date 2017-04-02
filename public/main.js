// Initialize Firebase
var config = {
	apiKey: "AIzaSyCiTqWN0OhnaaQibMzHgL5itpqQX1bnEo8",
	authDomain: "employee-time-tracking-b561d.firebaseapp.com",
	databaseURL: "https://employee-time-tracking-b561d.firebaseio.com",
	storageBucket: "employee-time-tracking-b561d.appspot.com",
	messagingSenderId: "195814535649"
};

firebase.initializeApp(config);

//Get UI element references
//  const txtEmail = document.getElementById('txtEmail');
//  const txtPassword = document.getElementById('txtPassword');
//  const btnLogin = document.getElementById('loginButton');
//  const btnSubmit = document.getElementById('submitButton');
const btnLogOut = document.getElementById('logOutButton');
const showUser = document.getElementById('User');
const navbar = document.getElementById('navbar');

firebase.auth().onAuthStateChanged(user => {
	if (user) {
		console.log(user);
		showUser.innerText = user.email;
		btnLogOut.classList.remove('hide');
		navbar.style.visibility = "visible";
	} else {
		console.log("No user is logged in. How did you do that?");
	}
});

// Log out event
btnLogOut.addEventListener('click', e => {
	firebase.auth().signOut();
	window.location.href = "index.html";
});

function init() {
    scheduler.config.xml_date="%Y-%m-%d %H:%i";
    scheduler.init('scheduler_here',new Date(2018,0,1),"week");
    scheduler.load("./data/events.xml");

}