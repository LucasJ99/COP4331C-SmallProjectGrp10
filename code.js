var urlBase = 'http://contactlookup.ninja/LAMPAPI';
var extension = 'php';

var userID = 0;
var firstName = "";
var lastName = "";

function doRegister()
{
  	document.getElementById("registerResult").innerHTML = "";

	var firstName = document.getElementById("registrationFirstName").value;
	var lastName = document.getElementById("registrationLastName").value;
	var username = document.getElementById("registrationLogin").value;
	var password = document.getElementById("registrationPassword").value;

	if(password != document.getElementById("registrationRetypedPassword").value){
		document.getElementById("registerResult").innerHTML = "Passwords do not match!";
		return;
	}
	
	document.getElementById("registerResult").innerHTML = "";
	
	var jsonPayload = '{"Login" : "' + username + '", "FirstName" : "' + firstName + '", "LastName" : "' + lastName + '", "Password" : "' + password + '"}';
	var url = urlBase + '/CreateAccount.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try{
		xhr.send(jsonPayload);
	}
	catch(err){
		document.getElementById("registerResult").innerHTML = err.message;
	}
	
	if(document.getElementById("registerResult").innerHTML == ""){
		window.location.href = "index.html";
		document.getElementById("loginResult").innerHTML = "Registration successful. Please sign in";
	}
	return false;
}

function doAlert()
{
	window.alert("alert");
}

function doLogin()
{
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
	try
	{
		xhr.send(jsonPayload);
		
		var jsonObject = JSON.parse( xhr.responseText );
    	userID = jsonObject.ID;
		if( userID < 1 )
		{
			document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
			return;
		}
		
		firstName = jsonObject.FirstName;
    	lastName = jsonObject.LastName;
		saveCookie();

		window.location.href = "contacts.html";
		return false;
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}



//testing login
function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userID=" + userID + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userID = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userID" )
		{
			userID = parseInt( tokens[1].trim() );
		}
	}
	
	if( userID < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userID = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact()
{
	window.alert(userID);
  if(userID===0){
    window.location.href = "index.html";
    return 0;
  }

	//add address field to webpage
  //add addContactResult to webpage
  var fullName = document.getElementById("addName").value;
  var result = fullName.split(" ");
  if(result[1] === undefined){
    result[1] = "";
  }

	var FirstName = result[0];
	var LastName = result[1];
	var Email = document.getElementById("addEmail").value;
	var PhoneNumber = document.getElementById("addPhoneNumber").value;
	var Address = document.getElementById("addAddress").value;

	document.getElementById("contactAddResult").innerHTML = "";

  var jsonPayload = '{"UserID" : "' + userID + '", "FirstName" : "' + FirstName + '", "LastName" : "' + LastName + '", "PhoneNumber" : "' + PhoneNumber + '", "Email" : "' + Email + '", "Address" : "' +Address+ '"}';

	var url = urlBase + '/AddContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200){
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}

}

function addColor()
{
	var newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";
	
	var jsonPayload = '{"color" : "' + newColor + '", "userId" : ' + userId + '}';
	var url = urlBase + '/AddColor.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
	
}

function doSearch()
{
	var searchText = document.getElementById("searchField").value;
	document.getElementById("searchResult").innerHTML= "";

	var contactList = "";

	var jsonPayload = '{"search" : "' + searchText + '","userId" : ' + userID + '}';
	var url = urlBase + '/SearchContacts.' + extension;

	window.alert(jsonPayload);
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var jsonObject = JSON.parse( xhr.responseText );
				
				window.alert(jsonObject.results[0]);				
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
}

function searchColor()
{
	var srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";
	
	var colorList = "";
	
	var jsonPayload = '{"search" : "' + srch + '","userId" : ' + userId + '}';
	var url = urlBase + '/SearchColors.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				var jsonObject = JSON.parse( xhr.responseText );
				
				for( var i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
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
  .controller("nameAdderController", function($scope) {

    //set temp initial values for testing
    //$scope.nameBox = "George";
    //$scope.emailBox = "george@example.com";
    //

    var nameList = [{
      name: "Scott",
      favorite: "",
      phone: "888-888-8888",
      email: "scott@website.com",
      address: "685 address south"
    }, {
      name: "Chris",
      favorite: "",
      phone: "888-888-8888",
      email: "chris@website.com",
      address: "685 address south"
    }, {
      name: "Dave",
      favorite: "",
      phone: "888-888-8888",
      email: "dave@website.com",
      address: "685 address south"
    }, {
      name: "John",
      favorite: "",
      phone: "888-888-8888",
      email: "john@website.com",
      address: "685 address south"
    }, {
      name: "Craig",
      favorite: "",
      phone: "888-888-8888",
      email: "craig@website.com",
      address: "685 address south"
    }, {
      name: "Sarah",
      favorite: "favorite",
      phone: "888-888-8888",
      email: "sarah@website.com",
      address: "685 address south"
    }, {
      name: "Nick",
      favorite: "",
      phone: "888-888-8888",
      email: "nick@website.com",
      address: "685 address south"
    }, {
      name: "Laura",
      favorite: "",
      phone: "888-888-8888",
      email: "laura@website.com",
      address: "688 address south"
    }, {
      name: "Amy",
      favorite: "",
      phone: "888-888-8888",
      email: "amy@website.com",
      address: "685 address south"
    }, ];
    $scope.nameList = nameList;

    $scope.favName = function($index) {
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
  
    $scope.openEdit = function($index) {
      if (!$scope.editing) {
        //edit contact is open
        $scope.editing = true;
        $scope.contactName = $scope.nameList[$index].name;
        $scope.nameBox = $scope.nameList[$index].name;
        $scope.emailBox = $scope.nameList[$index].email;
        $scope.phoneBox = $scope.nameList[$index].phone;
        $scope.addressBox = $scope.nameList[$index].address;
        $scope.favBox = $scope.nameList[$index].favorite;
        if($scope.favBox == "favorite"){
          $scope.favBox = true;
        }else{
          $scope.favBox = false;
        }
      } else {
        $scope.editing = false;
        $scope.emailBox = "";
        $scope.nameBox = "";
        $scope.phoneBox = "";
      }
      $scope.editContact = function(){
          
       
          console.log($scope.nameList[$index]);
          $scope.nameList.splice($index, 1);
          $scope.addContact();
          $scope.editing = false;
        }
    }

    $scope.nameSorter = function() {
      var byName = $scope.nameList.slice(0)
      byName.sort(function(a, b) {
        var x = a.name.toLowerCase();
        var y = b.name.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
      });
      $scope.nameList = byName;
    }
    
    //sort onload
    $scope.nameSorter();

    $scope.removeName = function($index) {
      var curName = $scope.nameList[$index].name;
      $scope.nameList.splice($index, 1);
      console.log(curName + " removed");
    }

    $scope.deleteAll = function() {
      $scope.nameList = [];
    }

    $scope.favSort = false;

    $scope.favToggle = function() {
      if ($scope.favSort) {
        $scope.favSort = false;
      } else {
        $scope.favSort = true;
      }
      console.log($scope.favSort);
    }

    $scope.filterFavs = function(obj) {
      //console.log(obj.name, obj.favorite);
      if ($scope.favSort) {
        if (obj.favorite === "favorite") {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }

    }
  });