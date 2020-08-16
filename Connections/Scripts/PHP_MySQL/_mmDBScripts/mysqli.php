<?php
$senimandigital = new mysqli("localhost", "senimandigital", "senimandigital", "senimandigital");
if ($senimandigital -> connect_errno) { echo "Failed to connect to MySQL: " . $senimandigital -> connect_error; exit(); }

$query_describe = "DESCRIBE ". $_REQUEST['table'];
$describe = $senimandigital->query($query_describe);
$row_describe = $describe->fetch_assoc();
$totalRows_describe = $senimandigital->affected_rows;
do {
$output[] = $row_describe['Field'] ."|". $row_describe['Null'] ."|". $row_describe['Default'];	
} while( $row_describe = $describe->fetch_assoc() );
echo implode('|', $output); 
?>
