<?php

declare(strict_types=1);
header('Content-Type: text/xml');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
// header('Content-Type: application/json');
date_default_timezone_set('Africa/Lagos');

$whitelist = array('41.223.145.174', '154.72.34.174');
function isAllowedIp($ip, array $whitelist)
{
    $ip = (string)$ip;
    if (in_array($ip, $whitelist, true)) {
        // the given ip is found directly on the whitelist --allowed
        return true;
    }
    // go through all whitelisted ips
    foreach ($whitelist as $whitelistedIp) {
        $whitelistedIp = (string)$whitelistedIp;
        // find the wild card * in whitelisted ip (f.e. find position in "127.0.*" or "127*")
        $wildcardPosition = strpos($whitelistedIp, "*");
        if ($wildcardPosition === false) {
            // no wild card in whitelisted ip --continue searching
            continue;
        }
        // cut ip at the position where we got the wild card on the whitelisted ip
        // and add the wold card to get the same pattern
        if (substr($ip, 0, $wildcardPosition) . "*" === $whitelistedIp) {
            // f.e. we got
            //  ip "127.0.0.1"
            //  whitelisted ip "127.0.*"
            // then we compared "127.0.*" with "127.0.*"
            // return success
            return true;
        }
    }
    // return false on default
    return false;
}

if (! isAllowedIp($_SERVER['REMOTE_ADDR'], $whitelist)) {
    echo $_SERVER['REMOTE_ADDR'];
}else{
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    include '../gate.php';
    $xmlData = file_get_contents("php://input");
    if (!empty($xmlData)) {
        $xmlString = $xmlData;
        $xml = simplexml_load_string($xmlString);
        $jsonString = json_encode($xml);
        $dataArray = json_decode($jsonString, true);
        // print_r($dataArray);
        if (strpos($xmlData, "</PaymentNotificationRequest>") !== false) {
            $newData = [
                "endpoint" => "createInvidualPayment",
                "data" => [
                    "invoice_number" => $dataArray["Payments"]["Payment"]["CustReference"],
                    "payment_channel" => $dataArray["Payments"]["Payment"]["BankName"],
                    "payment_reference_number" => $dataArray["Payments"]["Payment"]["PaymentReference"],
                    "receipt_number" => $dataArray["Payments"]["Payment"]["ReceiptNo"]."-".$dataArray["Payments"]["Payment"]["PaymentLogId"],
                    "amount_paid" => $dataArray["Payments"]["Payment"]["Amount"]
                ]
            ];
            $paymentNotificationResponse = [
                "PaymentNotificationResponse" => [
                    "Payments" => [
                        "Payment" => [
                            "PaymentLogId" => $dataArray["Payments"]["Payment"]["PaymentLogId"],
                            "Status" => "",
                            "StatusMessage" => ""
                        ],
                    ],
                ]
            ];
           
            if (empty($newData["data"]["invoice_number"]) || empty($newData["data"]["payment_channel"]) || empty($newData["data"]["payment_reference_number"]) || empty($newData["data"]["receipt_number"]) || empty($newData["data"]["amount_paid"])) {
                // Set Transaction Status to false 3
                $transactionStatus = false;
                $errorMessage = "false 3";
                $paymentNotificationResponse['PaymentNotificationResponse']['Payments']['Payment']['Status'] = 1;
                $paymentNotificationResponse['PaymentNotificationResponse']['Payments']['Payment']['StatusMessage'] = "One or more required parameters are missing or empty. Please make sure to provide values for the following parameters: [CustReference, BankName, PaymentReference, ReceiptNo, Amount].";
                $xml = new SimpleXMLElement('<PaymentNotificationResponse/>');
                arrayToXml($paymentNotificationResponse['PaymentNotificationResponse'], $xml);
                $dom = dom_import_simplexml($xml)->ownerDocument;
                $dom->formatOutput = true;
                echo $dom->saveXML();
                exit();
                // echo $errorMessage;
            } else {
                $checkSt = userInvoiceSingle($newData["data"]["invoice_number"], 'default');
                // print_r($checkSt);
                if ($checkSt['message'][0]['amount_paid'] !== $newData["data"]["amount_paid"]) {
                $paymentNotificationResponse['PaymentNotificationResponse']['Payments']['Payment']['Status'] = 1;
                $paymentNotificationResponse['PaymentNotificationResponse']['Payments']['Payment']['StatusMessage'] = "Invalid";
                $xml = new SimpleXMLElement('<PaymentNotificationResponse/>');
                arrayToXml($paymentNotificationResponse['PaymentNotificationResponse'], $xml);
                $dom = dom_import_simplexml($xml)->ownerDocument;
                $dom->formatOutput = true;
                echo $dom->saveXML();
                exit();
                }
                
                if ($dataArray["Payments"]["Payment"]["IsReversal"] !=='False') {
                $paymentNotificationResponse['PaymentNotificationResponse']['Payments']['Payment']['Status'] = 1;
                $paymentNotificationResponse['PaymentNotificationResponse']['Payments']['Payment']['StatusMessage'] = "Invalid";
                $xml = new SimpleXMLElement('<PaymentNotificationResponse/>');
                arrayToXml($paymentNotificationResponse['PaymentNotificationResponse'], $xml);
                $dom = dom_import_simplexml($xml)->ownerDocument;
                $dom->formatOutput = true;
                echo $dom->saveXML();
                exit();
                }
                
                $rr_no = $newData["data"]["receipt_number"];
                $inv_no = $newData["data"]["invoice_number"];
                $checkSt12 = check_db_query_staus("SELECT * FROM `payment_collection_report_individual` WHERE invoice_number='$inv_no'", "CHK");
                if ($checkSt12['status'] == 1) {
                    if($checkSt12['message']['receipt_number'] !== $newData["data"]["receipt_number"]){
                        $paymentNotificationResponse['PaymentNotificationResponse']['Payments']['Payment']['Status'] = 1;
                        $paymentNotificationResponse['PaymentNotificationResponse']['Payments']['Payment']['StatusMessage'] = "Invalid";
                        $xml = new SimpleXMLElement('<PaymentNotificationResponse/>');
                        arrayToXml($paymentNotificationResponse['PaymentNotificationResponse'], $xml);
                        $dom = dom_import_simplexml($xml)->ownerDocument;
                        $dom->formatOutput = true;
                        echo $dom->saveXML();
                        // print_r($checkSt1);
                        exit();   
                    }
                }
                
                $newJsonData = json_encode($newData);
                $newJsonData = (array) json_decode($newJsonData);
                $responseData = paymentToMDARevenueHeads1($newJsonData['data']);
                if ($responseData && isset($responseData['status']) && $responseData['status'] === 1) {
                    $paymentNotificationResponse['PaymentNotificationResponse']['Payments']['Payment']['Status'] = 0;
                    $paymentNotificationResponse['PaymentNotificationResponse']['Payments']['Payment']['StatusMessage'] = "Received";
                    $xml = new SimpleXMLElement('<PaymentNotificationResponse/>');
                    arrayToXml($paymentNotificationResponse['PaymentNotificationResponse'], $xml);
                    $dom = dom_import_simplexml($xml)->ownerDocument;
                    $dom->formatOutput = true;
                    echo $dom->saveXML();
                    exit();
                } elseif ($responseData && isset($responseData['status']) && $responseData['status'] === 0) {
                    $paymentNotificationResponse['PaymentNotificationResponse']['Payments']['Payment']['Status'] = 1;
                    $paymentNotificationResponse['PaymentNotificationResponse']['Payments']['Payment']['StatusMessage'] = "Rejected by System";
                    $xml = new SimpleXMLElement('<PaymentNotificationResponse/>');
                    arrayToXml($paymentNotificationResponse['PaymentNotificationResponse'], $xml);
                    $dom = dom_import_simplexml($xml)->ownerDocument;
                    $dom->formatOutput = true;
                    echo $dom->saveXML();
                    exit();
                } elseif ($responseData && isset($responseData['status']) && $responseData['status'] === 2) {
                    $paymentNotificationResponse['PaymentNotificationResponse']['Payments']['Payment']['Status'] = 0;
                    $paymentNotificationResponse['PaymentNotificationResponse']['Payments']['Payment']['StatusMessage'] = "Duplicate Payment";
                    $xml = new SimpleXMLElement('<PaymentNotificationResponse/>');
                    arrayToXml($paymentNotificationResponse['PaymentNotificationResponse'], $xml);
                    $dom = dom_import_simplexml($xml)->ownerDocument;
                    $dom->formatOutput = true;
                    echo $dom->saveXML();
                    exit();
                }
            }
            // print_r($newData);            
        } elseif (strpos($xmlData, "</CustomerInformationRequest>") !== false) {
            if ($dataArray['MerchantReference'] == '6405') {
                userInvoiceSingle($dataArray['CustReference'], 'payDirect');
            } else {
                $customerInformationResponse = [
                    "MerchantReference" => $dataArray['MerchantReference'],
                    "Customers" => [
                        "Customer" => [
                            "Status" => "1",
                            "StatusMessage" => "Invalid MerchantReference",
                            "CustReference" => $dataArray['CustReference']
                        ]
                    ],
                ];
                // $customerInformationResponse = [$customerInformationResponse];
                $xml = new SimpleXMLElement('<CustomerInformationResponse/>');
                arrayToXml($customerInformationResponse, $xml);
                $dom = dom_import_simplexml($xml)->ownerDocument;
                $dom->formatOutput = true;
                echo $dom->saveXML();
                exit();
            }

            // print_r($dataArray);
        }
        else{
            $all_response = [
                    "Customers" => [
                        "Customer" => [
                            "Status" => "1",
                            "StatusMessage" => "Invalid"
                        ]
                    ],
                ];
            $all_response1 = [
                "PaymentNotificationResponse" => [
                    "Payments" => [
                        "Payment" => [
                            "PaymentLogId" => $dataArray["Payments"]["Payment"]["PaymentLogId"],
                            "Status" => "1",
                            "StatusMessage" => "System Rejected"
                        ],
                    ],
                ],
            ]; 
            $cc = "";
            if (strpos($xmlData, "</PaymentNotificationRequest>") !== false) {
                $cc = "<PaymentNotificationRequest/>";
                $xml = new SimpleXMLElement($cc);
                arrayToXml($all_response1, $xml);
                $dom = dom_import_simplexml($xml)->ownerDocument;
                $dom->formatOutput = true;
                echo $dom->saveXML();
                exit();
            } elseif (strpos($xmlData, "</CustomerInformationRequest>") !== false) {
                $cc = "<CustomerInformationResponse/>";
                $xml = new SimpleXMLElement($cc);
                arrayToXml($all_response, $xml);
                $dom = dom_import_simplexml($xml)->ownerDocument;
                $dom->formatOutput = true;
                echo $dom->saveXML();
                exit();
            }
            
        }
    } else {
        $responseXml = '<?xml version="1.0" encoding="UTF-8"?>';
        $responseXml .= '<response>';
        $responseXml .= '<status>error</status>';
        $responseXml .= '<message>No XML data received.</message>';
        $responseXml .= '</response>';
        echo $responseXml;
        exit();
    }
    } else {
        $responseXml = '<?xml version="1.0" encoding="UTF-8"?>';
        $responseXml .= '<response>';
        $responseXml .= '<status>error</status>';
        $responseXml .= '<message>Invalid request method.</message>';
        $responseXml .= '</response>';
        echo $responseXml;
        exit();
    }
}


