<?php
    $hostname_ibs = "";
    $database_ibs = "payzamfara_ibs";
    $username_ibs = "payzamfara_user";
    $password_ibs = "zamfara@2023";
    $ibsConnection = mysqli_connect($hostname_ibs, $username_ibs, $password_ibs, $database_ibs) or trigger_error(mysqli_error($ibsConnection),E_USER_ERROR);    