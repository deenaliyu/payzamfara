<?php
// Database configuration
$dbHost     = "localhost";
$dbUsername = "steazhex_steam_repo";
$dbPassword = "covid19@[/''~";
$dbName     = "steazhex_steam_repo";

// Create database connection
$db = new mysqli($dbHost, $dbUsername, $dbPassword, $dbName);

// Check connection
if ($db->connect_error) {
    die("Connection failed: " . $db->connect_error);
}
?>