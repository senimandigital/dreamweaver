<?php
$senimandigital = new mysqli("localhost", "senimandigital", "senimandigital", "senimandigital");
if ($senimandigital -> connect_errno) { echo "Failed to connect to MySQL: " . $senimandigital -> connect_error; exit(); }

if ($_REQUEST['opCode'] == 'getDataDistinct') {
$query_distinct = "SELECT DISTINCT `". $_REQUEST['field'] ."` FROM ". $_REQUEST['table'];
$distinct = $senimandigital->query($query_distinct);
$row_distinct = $distinct->fetch_assoc();
$totalRows_distinct = $senimandigital->affected_rows;
do {
$output[] = $row_distinct[$_REQUEST['field']];
$tipu[]	= "text";
} while( $row_distinct = $distinct->fetch_assoc() );
$output = array_merge($output, $tipu);

} else {

$query_describe = "DESCRIBE ". $_REQUEST['table'];
$describe = $senimandigital->query($query_describe);
$row_describe = $describe->fetch_assoc();
$totalRows_describe = $senimandigital->affected_rows;
do {
$output[] = $row_describe['Field'] ."|". $row_describe['Null'] ."|". $row_describe['Default'];	
} while( $row_describe = $describe->fetch_assoc() );

}
echo implode('|', $output); 
?>
