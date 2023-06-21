<?php
$hostname_ibs = "localhost";
$database_ibs = "primeguageIBS";
$username_ibs = "root";
$password_ibs = "";
$ibsConnection = mysqli_connect($hostname_ibs, $username_ibs, $password_ibs, $database_ibs) or trigger_error(mysqli_error($ibsConnection), E_USER_ERROR);


    // <?php
    // $hostname_ibs = "";
    // $database_ibs = "steazhex_primeguage";
    // $username_ibs = "steazhex_primeguage";
    // $password_ibs = "primeguage@2023";
    // $ibsConnection = mysqli_connect($hostname_ibs, $username_ibs, $password_ibs, $database_ibs) or trigger_error(mysqli_error($ibsConnection),E_USER_ERROR);    