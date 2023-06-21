<?php
    include 'ncrypt-download/src/class.ncrypt.php'; // un-comment this if needed

    function encripted_data($ct){
        $ncrypt = new mukto90\Ncrypt;
        $ncrypt->set_secret_key( '^&-my-key-&^' );	// optional, but STRONGLY recommended
        $ncrypt->set_secret_iv( '#@)-my-iv-#*$' );	// optional, but STRONGLY recommended
        $ncrypt->set_cipher( 'AES-256-CBC' );		// optional
        // encrypt a plain text/string
        $encrypted = $ncrypt->encrypt( $ct ); // output: SFpQVWk0WjFxdW5lSGFXaUdWUEx3Zz09
        return $encrypted;
    }
    function decripted_data($ct){
        $ncrypt = new mukto90\Ncrypt;
        $ncrypt->set_secret_key( '^&-my-key-&^' );	// optional, but STRONGLY recommended
        $ncrypt->set_secret_iv( '#@)-my-iv-#*$' );	// optional, but STRONGLY recommended
        $ncrypt->set_cipher( 'AES-256-CBC' );		// optional
        // decrypt an encrypted string to it's original plain text/string
        $decrypted = $ncrypt->decrypt( $ct ); // output: Hello World!
        return $decrypted;
    }

