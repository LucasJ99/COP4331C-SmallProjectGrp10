<?php
	$inData = getRequestInfo();
	
	$FirstName = $inData["FirstName"];
	$LastName = $inData["LastName"];
	$PhoneNumber = $inData["PhoneNumber"];
	$Email = $inData["Email"];
	$Address = $inData["Address"];
	$UserID = $inData["UserID"];

	$conn = new mysqli("localhost", "Obelisk", "TheTormentorOfCOP4331!", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "INSERT INTO Contacts (UserID , FirstName , LastName , PhoneNumber ,  Email , Address) VALUES (". $UserID. ",'" . $FirstName . "','" . $LastName . "','" . $PhoneNumber . "','" . $Email . "','" . $Address . "')";
		if( $result = $conn->query($sql) != TRUE )
		{
			returnWithError( $conn->error );
		}
		$conn->close();
	}
	
	returnWithError("");
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
