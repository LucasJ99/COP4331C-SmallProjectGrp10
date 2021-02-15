var urlBase = 'http://contactlookup.ninja/LAMPAPI';
var extension = 'php';

var userID = 0;
var firstName = "";
var lastName = "";

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

function doAlert() {
	window.alert("alert");
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

//testing login
function saveCookie() {
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime() + (minutes * 60 * 1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userID=" + userID + ";expires=" + date.toGMTString();
}

function readCookie() {
	userID = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for (var i = 0; i < splits.length; i++) {
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if (tokens[0] == "firstName") {
			firstName = tokens[1];
		}
		else if (tokens[0] == "lastName") {
			lastName = tokens[1];
		}
		else if (tokens[0] == "userID") {
			userID = parseInt(tokens[1].trim());
		}
	}

	if (userID < 0) {
		window.location.href = "index.html";
	}
	else {
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout() {
	userID = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact() {

	if (userID === 0) {
		window.location.href = "index.html";
		return 0;
	}

	// Add address field to webpage
	// Add addContactResult to webpage
	var fullName = document.getElementById("addName").value;

	// User must specify name to add contact
	if (fullName.length === 0) {
		document.getElementById("contactAddResult").style.display = "block";
		document.getElementById("contactAddResult").className = "alert alert-danger"	
		document.getElementById("contactAddResult").innerHTML = "Name field is required.";
		document.getElementById("addEmail").value = "";
		document.getElementById("addPhoneNumber").value = "";
		document.getElementById("addAddress").value = "";
		return;
	}

	var result = fullName.split(" ");
	if (result[1] === undefined) {
		result[1] = "";
	}

	var FirstName = result[0];
	var LastName = result[1];
	var Email = document.getElementById("addEmail").value;
	var PhoneNumber = document.getElementById("addPhoneNumber").value;
	var Address = document.getElementById("addAddress").value;

	document.getElementById("contactAddResult").innerHTML = "";

	var jsonPayload = '{"UserID" : "' + userID + '", "FirstName" : "' + FirstName + '", "LastName" : "' + LastName + '", "PhoneNumber" : "' + PhoneNumber + '", "Email" : "' + Email + '", "Address" : "' + Address + '"}';

	var url = urlBase + '/AddContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				document.getElementById("contactAddResult").style.display = "block";
				document.getElementById("contactAddResult").className = "alert alert-success"
				var str = "" + fullName + " has been added to your contacts";
				document.getElementById("contactAddResult").innerHTML = str;
				document.getElementById("addName").value = "";
				document.getElementById("addEmail").value = "";
				document.getElementById("addPhoneNumber").value = "";
				document.getElementById("addAddress").value = "";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("contactAddResult").innerHTML = err.message;
	}

}

angular.module("contactList", [])
	// .filter("favorites", function() {
	//   return function(favorites){
	//     switch (favorites) {
	//       case "":
	//         $scope.nameList[$index].favorite = "favorite";
	//         break;
	//       case "favorite":
	//         $scope.nameList[$index].favorite = "";
	//         break;
	//     }
	//   }
	// })
	.controller("nameAdderController", function ($scope) {

		//set temp initial values for testing
		//$scope.nameBox = "George";
		//$scope.emailBox = "george@example.com";
		//

		var nameList = [];

		$scope.nameList = nameList;

		$scope.searchContact = function () {
			$scope.nameList = [];
			var searchText = document.getElementById("searchField").value;
			document.getElementById("searchResult").innerHTML = "";

			var jsonPayload = '{"search" : "' + searchText + '","userId" : ' + userID + '}';
			var url = urlBase + '/SearchContacts.' + extension;

			var xhr = new XMLHttpRequest();
			xhr.open("POST", url, true);
			xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

			try {
				xhr.onreadystatechange = function () {
					if (this.readyState == 4 && this.status == 200) {
						var itr;
						var jsonObject = JSON.parse(xhr.responseText);

						var num = jsonObject.length;
						for (itr = 0; itr < num; itr++) {
							var obj = { name: "" + jsonObject[itr].FirstName + " " + jsonObject[itr].LastName, phone: jsonObject[itr].PhoneNumber, email: jsonObject[itr].Email, address: jsonObject[itr].Address, ID: jsonObject[itr].ID }
							$scope.nameList.push(obj);
						}
						$scope.nameSorter();
						$scope.$apply()
					}
				};
				xhr.send(jsonPayload);
			}
			catch (err) {
				document.getElementById("colorSearchResult").innerHTML = err.message;
			}

			$scope.nameSorter();
		}

		$scope.favName = function ($index) {
			switch ($scope.nameList[$index].favorite) {
				case "":
					$scope.nameList[$index].favorite = "favorite";
					break;
				case "favorite":
					$scope.nameList[$index].favorite = "";
					break;
			}

			console.log($scope.nameList[$index].favorite);
		}

		$scope.editing = false;

		$scope.openEdit = function ($index) {
			if (!$scope.editing) {
				//edit contact is open
				$scope.editing = true;
				$scope.contactName = $scope.nameList[$index].name;
				$scope.nameBox = $scope.nameList[$index].name;
				$scope.emailBox = $scope.nameList[$index].email;
				$scope.phoneBox = $scope.nameList[$index].phone;
				$scope.addressBox = $scope.nameList[$index].address;


			} else {
				$scope.editing = false;
				$scope.emailBox = "";
				$scope.nameBox = "";
				$scope.phoneBox = "";
			}
			$scope.editContact = function () {
				console.log($scope.nameList[$index]);
				//
				//
				//
				
				
				var nameArray = $scope.nameBox.split(" ");
				if(nameArray[1] === undefined){
					if(nameArray[0]===undefined){
						document.getElementById("contactAddResult").style.display = "block";
						document.getElementById("contactAddResult").innerHTML = "Name field required";
						document.getElementById("contactAddResult").className = "alert alert-danger"
						return;
					}
					nameArray[1]="";
				}
				
				var jsonPayload = '{"Id" : "' + $scope.nameList[$index].ID + '","fname" : "' + nameArray[0] + '","lname" : "' + nameArray[1] +'","email" : "' +$scope.emailBox+ '","phone" : "'+$scope.phoneBox+'","addr" : "'+$scope.addressBox+'"}';
				var url = urlBase + '/UpdateContact.' + extension;
				$scope.nameList.splice($index, 1);
				var xhr = new XMLHttpRequest();
				xhr.open("POST", url, true);
				xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

				try {
					xhr.onreadystatechange = function () {
						if (this.readyState == 4 && this.status == 200) {
							console.log("update success");
							document.getElementById("contactAddResult").style.display = "block";
							document.getElementById("contactAddResult").className = "alert alert-success"
							document.getElementById("contactAddResult").innerHTML = "Contact updated";
							
							//reset fields
							$scope.editing = false;
							$scope.emailBox = "";
							$scope.nameBox = "";
							$scope.phoneBox = "";
							$scope.addressBox = "";
							
							//requery after update
							$scope.searchContact();
						}
					};
					xhr.send(jsonPayload);
					
				}
				catch (err) {
					document.getElementById("contactAddResult").innerHTML = err.message;
				}
			}

		}

		// Sort alphabetically
		$scope.nameSorter = function () {
			if ($scope.nameList)
				var byName = $scope.nameList.slice(0)
			byName.sort(function (a, b) {
				var x = a.name.toLowerCase();
				var y = b.name.toLowerCase();
				return x < y ? -1 : x > y ? 1 : 0;
			});
			$scope.nameList = byName;
		}

		//sort onload
		$scope.nameSorter();

		$scope.removeName = function ($index) {

			var currContact = $scope.nameList[$index];
			$scope.nameList.splice($index, 1);

			var jsonPayload = '{"ID" : "' + currContact.ID + '"}';
			var url = urlBase + '/DeleteContact.' + extension;

			var xhr = new XMLHttpRequest();
			xhr.open("POST", url, true);
			xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

			try {
				xhr.onreadystatechange = function () {
					if (this.readyState == 4 && this.status == 200) {
						console.log("remove success");
					}
				};
				xhr.send(jsonPayload);
			}
			catch (err) {
				document.getElementById("contactAddResult").innerHTML = err.message;
			}

		}

	});