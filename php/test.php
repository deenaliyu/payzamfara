<?php

// // Replace with your API key
// $apiKey = "d01543209d89e4c2e2295bb4da31404ba82cc4d551c955a535adece3142e12f8";

// // Replace with your phone number in international format
// $to = "+2349053447098";

// // Replace with your message
// $message = "Hello, World!";

// // Specify your AfricasTalking shortcode or sender ID
// $from = "26787";

// // URL to make the request to
// $url = "https://api.africastalking.com/version1/messaging";

// // Prepare the request data
// $data = array(
//     "username" => "sandbox",
//     "to" => $to,
//     "message" => $message,
//     "from" => $from
// );

// // Convert the data to a string
// $data = http_build_query($data);

// // Initialize cURL
// $ch = curl_init();

// // Set the request options
// curl_setopt($ch, CURLOPT_URL, $url);
// curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// curl_setopt($ch, CURLOPT_HEADER, false);
// curl_setopt($ch, CURLOPT_POST, true);
// curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
// curl_setopt($ch, CURLOPT_HTTPHEADER, array("apiKey: $apiKey"));

// // Make the request
// $response = curl_exec($ch);

// // Check if the request was successful
// if (curl_errno($ch)) {
//     echo "Error sending SMS: " . curl_error($ch);
// } else {
//     echo $response;
// }

// // Close the cURL handle
// curl_close($ch);







// Your API Key for Mailchimp Transactional
// $apiKey = '747aee7f74c4c2b3e1e01f988f2a634a-us12';

// Set the endpoint URL for the Transactional API
// $url = 'https://mandrillapp.com/api/1.0/messages/send';

// Set the recipient's email address
// $to = 'assadeeq929@hotmail.com';

// // Set the email subject
// $subject = 'Test Email';

// // Set the email body
// $body = 'This is a test email sent using Mailchimp Transactional API.';

// // Set the email headers
// $headers = array(
//     'From: assadeeq543@gmail.com',
//     'Content-Type: text/plain'
// );

// // Build the API request payload
// $data = array(
//     'key' => $apiKey,
//     'message' => array(
//         'to' => array(
//             array(
//                 'email' => $to
//             )
//         ),
//         'subject' => $subject,
//         'text' => $body,
//         'from_email' => 'assadeeq543@gmail.com'
//     )
// );

// // Encode the payload as JSON
// $payload = json_encode($data);

// // Initialize cURL
// $ch = curl_init();

// // Set the cURL options
// curl_setopt($ch, CURLOPT_URL, $url);
// curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
// curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// curl_setopt($ch, CURLOPT_POST, true);
// curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);

// // Send the API request
// $result = curl_exec($ch);

// // Check for errors
// if ($result === false) {
//     echo 'Error sending email: ' . curl_error($ch);
// } else {
//     echo 'Email sent successfully';
// }

// // Close the cURL connection
// curl_close($ch);






$destination = "+2349063074452"; // The phone number to send the message to
$message = "This is a test message sent using BulkSMS Nigeria API"; // The message to be sent
$username = "your_username"; // Your BulkSMS Nigeria API username
$apiKey = "VDiuQ1nWkOhDVawGqJ3e0JyJjyofkZ1b9nIQyCMg2jq5HHpjpuDQr1EUYSmx"; // Your BulkSMS Nigeria API key

$url = "http://bulksmsnigeria.com/api/v1/sms/create?api_key=" . $apiKey . "&to=" . $destination . "&from=BulkSMS&body=" . urlencode($message);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response);

if ($result->status == "success") {
    echo "SMS sent successfully!";
} else {
    echo "Error sending SMS: " . $result->message;
}

?>
