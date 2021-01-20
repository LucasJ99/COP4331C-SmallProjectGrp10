<?php
	$inData = getRequestInfo();
	
	$firstName = $inData["FirstName"];
	$lastName = $inData["LastName"];
	$phone = $inData["PhoneNumber"];
	$email = $inData["Email"];
	$address = $inData["Address"];
	$userId = $inData["UserID"];

	$conn = new mysqli("localhost", "Obelisk", "TheTormentorOfCOP4331!", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "insert into Contacts (UserId,Name) VALUES (" . $userId . ",'" . $firstName . ",'" . $lastName . ",'" . $phone . ",'" . $email . ",'" . $address . "')";
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