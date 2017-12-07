<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "test";
// Create connection
$conn = new mysqli($servername, $username, $password,$dbname);

// Check connection
if ($conn->connect_error) {
die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";

$name = $_POST['name'];
$emailId = $_POST['emailId'];
$phone = $_POST['phone'];
$address = $_POST['address'];

$sql = "INSERT INTO personal-details (entity_id, entity_name, entity_email, entity_phone, entity_address)
VALUES ('NULL','".$name."','".$emailId."','".$phone."','".$address."')";

mysqli_query($conn, $sql);

?>
