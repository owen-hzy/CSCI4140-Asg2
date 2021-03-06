<?php
error_reporting(E_ALL); ini_set('display_errors', 1);

require_once 'db.info.php';

function db_connect() {
	global $db_host, $db_port, $db_username, $db_password, $db_name;
	
	// Connect to database, construct the info 
	$db_info = 'mysql:host=' . $db_host . ';port=' . $db_port . ';dbname=' . $db_name . ';';
	$db = new PDO($db_info, $db_username, $db_password);
	
	// set some attribute
	$db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
	$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
	$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
	return $db;
}

?>