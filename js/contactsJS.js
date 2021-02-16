var urlBase = 'http://contactlookup.ninja/LAMPAPI';
var extension = 'php';

var userID = 0;
var firstName = "";
var lastName = "";


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

angular.module("contactList", [])

    .controller("nameAdderController", function ($scope) {

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

        $scope.addContact = function () {

            //namebox, emailbox,phonebox, etc
            if ($scope.nameBox === undefined || $scope.nameBox === "") {

                //actiave alert bot
                document.getElementById("contactAddResult").style.display = "block";
                document.getElementById("contactAddResult").className = "alert alert-danger"
                document.getElementById("contactAddResult").innerHTML = "Name field is required.";

                //reset fields
                $scope.emailBox = "";
                $scope.phoneBox = "";
                $scope.addressBox = "";

                return;
            }
            //parse first name
            var fullName = $scope.nameBox.split();
            if (fullName[1] === undefined) {
                fullName[1] = "";
            }

            //set undefined(s) to empty


            //build payload
            var jsonPayload = '{"UserID" : "' + userID + '", "FirstName" : "' + fullName[0] + '", "LastName" : "' + fullName[1] + '", "PhoneNumber" : "' + $scope.phoneBox + '", "Email" : "' + $scope.emailBox + '", "Address" : "' + $scope.addressBox + '"}';

            //send it
            var url = urlBase + '/AddContact.' + extension;

            var xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

            try {
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {

                        //display success
                        document.getElementById("contactAddResult").style.display = "block";
                        document.getElementById("contactAddResult").className = "alert alert-success"
                        var str = "" + fullName[0] + " has been added to your contacts";
                        document.getElementById("contactAddResult").innerHTML = str;

                        //reset fields
                        $scope.nameBox = "";
                        $scope.emailBox = "";
                        $scope.phoneBox = "";
                        $scope.addressBox = "";
                    }
                };
                xhr.send(jsonPayload);
            }
            catch (err) {
                document.getElementById("contactAddResult").innerHTML = err.message;
            }

        }

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

                var nameArray = $scope.nameBox.split(" ");
                if (nameArray[1] === undefined) {
                    if (nameArray[0] === undefined) {
                        document.getElementById("contactAddResult").style.display = "block";
                        document.getElementById("contactAddResult").innerHTML = "Name field required";
                        document.getElementById("contactAddResult").className = "alert alert-danger"
                        return;
                    }
                    nameArray[1] = "";
                }

                var jsonPayload = '{"Id" : "' + $scope.nameList[$index].ID + '","fname" : "' + nameArray[0] + '","lname" : "' + nameArray[1] + '","email" : "' + $scope.emailBox + '","phone" : "' + $scope.phoneBox + '","addr" : "' + $scope.addressBox + '"}';
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
