<?php
	$inData = getRequestInfo();
	
    $Id = $inData["Id"];
    $fname = $inData["fname"];
    $lname = $inData["lname"];
    $email = $inData["email"];
    $phone = $inData["phone"];
    $addr = $inData["addr"];

	$conn = new mysqli("localhost", "Obelisk", "TheTormentorOfCOP4331!", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "update Contacts set FirstName ='" . $fname . "',LastName ='" . $lname ."',Email ='" . $email . "',PhoneNumber ='" . $phone . "',Address ='" . $addr . "' where Id =" . $Id . "";
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