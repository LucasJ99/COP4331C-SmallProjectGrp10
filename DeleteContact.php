<?php
        $inData = getRequestInfo();

        $ID = $inData["ID"];

        $conn = new mysqli("localhost", "Obelisk", "TheTormentorOfCOP4331!", "COP4331");
        if ($conn->connect_error)
        {
                returnWithError( $conn->connect_error );
        }
        else
        {
                $sql = "DELETE FROM Contacts WHERE ID=" . $ID ."";
                $result = $conn->query($sql);
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
