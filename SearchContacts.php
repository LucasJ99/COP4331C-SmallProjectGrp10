<?php

        $inData = getRequestInfo();

        $searchResults = array();
        $searchCount = 0;

        $conn = new mysqli("localhost", "Obelisk", "TheTormentorOfCOP4331!", "COP4331");
        if ($conn->connect_error)
        {
                returnWithError( $conn->connect_error );
        }
        else
        {
                $sql = "select FirstName,LastName,Email,PhoneNumber,Address,ID from Contacts where (FirstName like '%" . $inData["search"] . "%' or LastName like '%" . $inData["search"] . "%') and UserID=" . $inData["userId"];
                $result = $conn->query($sql);
                if ($result->num_rows > 0)
                {
                        while($row = $result->fetch_assoc())
                        {
                $searchResults[] = array('ID' => $row["ID"], 'FirstName' => $row["FirstName"], 'LastName' => $row["LastName"], 'Email' => $row["Email"], 'PhoneNumber' => $row["PhoneNumber"], 'Address' => $row["Address"]);
                        }
                        returnWithInfo( $searchResults );
                }
                else
                {
                        returnWithError( "No Records Found" );
                }
                $conn->close();
        }

        // returnWithInfo( $searchResults );

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
                $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
                sendResultInfoAsJson( $retValue );
        }

        function returnWithInfo( $searchResults )
        {
       // $searchResults = $result->fetch_all();
       // $result->free_result();
                // $result->close();
        echo json_encode($searchResults);
        }

?>
