<?php
// Include the database configuration file
include 'config.php';
	

	$ct =  $_REQUEST['number'];

	


include 'src/class.ncrypt.php'; // un-comment this if needed

$ncrypt = new mukto90\Ncrypt;

$ncrypt->set_secret_key( '^&-my-key-&^' );	// optional, but STRONGLY recommended
$ncrypt->set_secret_iv( '#@)-my-iv-#*$' );	// optional, but STRONGLY recommended
$ncrypt->set_cipher( 'AES-256-CBC' );		// optional

// encrypt a plain text/string
//$encrypted = $ncrypt->encrypt( $ct ); // output: SFpQVWk0WjFxdW5lSGFXaUdWUEx3Zz09
//echo $encrypted;
// decrypt an encrypted string to it's original plain text/string
$decrypted = $ncrypt->decrypt( $ct ); // output: Hello World!
//echo $decrypted;

$query_doc = "SELECT * FROM documents WHERE id='$decrypted'";
    $doc = mysqli_query( $db, $query_doc) or die(mysql_error());
    $row_doc = mysqli_fetch_assoc($doc);
    $totalRows_doc = mysqli_num_rows($doc);
$imageURL = 'uploads/'.$row_doc["file_name"];
$url = '../'.$imageURL;
$db_filename = $row_doc['filename'];
  //  $download = '<a href="../'.$imageURL.'" download="'.$db_filename.'">download</a>';

    

if (file_exists($url)) {

    header('Content-Description: File Transfer');
            header('Content-Type: application/octet-stream');
            header('Content-Disposition: attachment; filename="'.basename($url).'"');
            header('Expires: 0');
            header('Cache-Control: must-revalidate');
            header('Pragma: public');
            header('Content-Length: ' . filesize($url));
            flush(); // Flush system output buffer
            readfile($url);
            die();
        } else {
            http_response_code(404);
	        die();
        }


 ?> 