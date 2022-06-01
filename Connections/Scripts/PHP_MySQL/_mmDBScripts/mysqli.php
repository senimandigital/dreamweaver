<?php // online update: https://github.com/senimandigital/dreamweaver/blob/master/Connections/Scripts/PHP_MySQL/_mmDBScripts/mysqli.php
$source = file_get_contents('../Connections/senimandigital.php');
preg_match('%[$]username_.*? = "(.*?)";%s', $source, $username); //print_r($username);
preg_match('%[$]password_.*? = "(.*?)";%s', $source, $password); //print_r($password);
preg_match('%[$]database_.*? = "(.*?)";%s', $source, $database); //print_r($database);

    $senimandigital = new mysqli("localhost", $username[1], $password[1], $database[1]);
if ($senimandigital -> connect_errno) { echo "Failed to connect to MySQL: " . $senimandigital -> connect_error; exit(); }

if ($_REQUEST['opCode'] == 'getDataDistinct') {
$query_distinct = "SELECT DISTINCT `". $_REQUEST['field'] ."` FROM ". $_REQUEST['table'] ." ORDER BY `". $_REQUEST['field'] ."`";
$distinct = $senimandigital->query($query_distinct);
$row_distinct = $distinct->fetch_assoc();
$totalRows_distinct = $senimandigital->affected_rows;
do {
$output[] = $row_distinct[$_REQUEST['field']];
} while( $row_distinct = $distinct->fetch_assoc() );

} else {

$query_describe = "DESCRIBE `". $_REQUEST['table'] ."`";
$describe = $senimandigital->query($query_describe);
$row_describe = $describe->fetch_assoc();
$totalRows_describe = $senimandigital->affected_rows;
do { $output[] = $row_describe['Field'] ."|". $row_describe['Null'] ."|". $row_describe['Default']; } while( $row_describe = $describe->fetch_assoc() );

}
echo implode('|', $output); 
?>
