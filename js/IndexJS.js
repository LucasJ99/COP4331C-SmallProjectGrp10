var urlBase = 'http://contactlookup.ninja/LAMPAPI';
var extension = 'php';

var userID;
var firstName;
var lastName;

function doRegister() {
	document.getElementById("registerResult").innerHTML = "";

	var firstName = document.getElementById("registrationFirstName").value;
	var lastName = document.getElementById("registrationLastName").value;
	var username = document.getElementById("registrationLogin").value;
	var password = document.getElementById("registrationPassword").value;
	var retypedPassword = document.getElementById("registrationRetypedPassword").value;

	// All fields required for new account
	if (firstName.length === 0 || lastName.length === 0 || username.length === 0 || password.length === 0 || retypedPassword.length === 0) {
		document.getElementById("registerResult").innerHTML = "All fields are required.";
		return;
	}

	// Verify passwords match
	if (password != retypedPassword) {
		document.getElementById("registerResult").innerHTML = "Passwords do not match!";
		return;
	}

	document.getElementById("registerResult").innerHTML = "";

	var jsonPayload = '{"Login" : "' + username + '", "FirstName" : "' + firstName + '", "LastName" : "' + lastName + '", "Password" : "' + password + '"}';
	var url = urlBase + '/CreateAccount.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("registerResult").innerHTML = err.message;
	}

	if (document.getElementById("registerResult").innerHTML == "") {
		window.location.href = "index.html";
		document.getElementById("loginResult").innerHTML = "Registration successful. Please sign in";
	}
	return false;
}

function doLogin() {
	userID = 0;
	firstName = "";
	lastName = "";

	var login = document.getElementById("loginUsername").value;
	var password = document.getElementById("loginPassword").value;
	//	var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

	//	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
	var jsonPayload = '{"Login" : "' + login + '", "Password" : "' + password + '"}';
	var url = urlBase + '/Login.' + extension;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.send(jsonPayload);

		var jsonObject = JSON.parse(xhr.responseText);
		userID = jsonObject.ID;
		if (userID < 1) {
			document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
			return;
		}

		firstName = jsonObject.FirstName;
		lastName = jsonObject.LastName;
		saveCookie();

		window.location.href = "contacts.html";
		return false;
	}
	catch (err) {
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie() {
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime() + (minutes * 60 * 1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userID=" + userID + ";expires=" + date.toGMTString();
}
