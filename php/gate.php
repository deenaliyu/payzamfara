<?php
session_start();
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';

function generateUniqueID() {
    // Generate a unique ID based on the current time in microseconds
    $uniqueID = uniqid();
    
    return $uniqueID;
}


function check_db_query_staus($db_state, $db_actions)
{
    include "config/index.php";
    $query_User_re = sprintf($db_state);
    $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));
    switch ($db_actions) {
        case 'DEL':
            if ($User_re) {
                $returnResponse = ['status' => 1, 'message' => "Deleted successfully"];
                return ($returnResponse);
            } else {
                $returnResponse = ['status' => 0, 'message' => "failed to delete, try again"];
                return ($returnResponse);
            }
            break;
        case 'UPD':
            if ($User_re) {
                $returnResponse = ['status' => 1, 'message' => "Updated successfully"];
                return ($returnResponse);
            } else {
                $returnResponse = ['status' => 0, 'message' => "failed to update, try again"];
                return ($returnResponse);
            }
            break;
        case 'CHK':
            $row_User_re = mysqli_fetch_assoc($User_re);
            $totalRows_User_re = mysqli_num_rows($User_re);

            if ($User_re) {
                if ($totalRows_User_re > 0) {
                    $arr = ['status' => 1, 'message' => $row_User_re];
                    return ($arr);
                } else {
                    $returnResponse = ['status' => 0, 'message' => "failed to load, try again"];
                    return ($returnResponse);
                }
            } else {
                $returnResponse = ['status' => 0, 'message' => "failed to load, try again"];
                return ($returnResponse);
            }
            break;

        default:
            break;
    }
}

function check_db_query_staus1($db_state, $db_actions)
{
    include "config/index.php";
    $query_User_re = sprintf($db_state);
    $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));

    $totalRows_User_re = mysqli_num_rows($User_re);
    switch ($db_actions) {
        case 'DEL':
            if ($User_re) {
                $returnResponse = ['status' => 1, 'message' => "Deleted successfully"];
                return ($returnResponse);
            } else {
                $returnResponse = ['status' => 0, 'message' => "failed to delete, try again"];
                return ($returnResponse);
            }
            break;
        case 'UPD':
            if ($User_re) {
                $returnResponse = ['status' => 1, 'message' => "Updated successfully"];
                return ($returnResponse);
            } else {
                $returnResponse = ['status' => 0, 'message' => "failed to update, try again"];
                return ($returnResponse);
            }
            break;
        case 'CHK':
            if ($User_re) {
                if ($totalRows_User_re > 0) {
                    $all = [];
                    while ($row_User_re = mysqli_fetch_assoc($User_re)) {
                        $all[] = $row_User_re;
                    };
                    $arr = ['status' => 1, 'message' => $all];
                    return ($arr);
                } else {
                    $returnResponse = ['status' => 0, 'message' => "failed to load, try again"];
                    return ($returnResponse);
                }
            } else {
                $returnResponse = ['status' => 0, 'message' => "failed to load, try again"];
                return ($returnResponse);
            }
            break;

        default:
            break;
    }
}


// analytics API


function getAnalyticInvoice()
{


    $response = array();
    include "config/index.php";

    // Query to get the number of invoices per category
    $query = "SELECT rh.COL_5 as categories, COUNT(*) as count
FROM invoices i
INNER JOIN revenue_heads rh ON i.revenue_head = rh.id
GROUP BY rh.COL_5";

    $result = mysqli_query($ibsConnection, $query) or die(mysqli_error($ibsConnection));
    $invoicesPerCategory = array();
    $totalInvoices = 0;

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $category = $row['categories'];
            $count = $row['count'];

            $invoicesPerCategory[] = array(
                'category' => $category,
                'count' => $count
            );

            $totalInvoices += $count;


            $returnResponse = ['status' => 1, 'totalInvoices' => $totalInvoices,  'invoicesPerCategory' => $invoicesPerCategory];
        }



        exit(json_encode($returnResponse));
    } else {
        $returnResponse = ['status' => 0, 'message' => "try again"];
        exit(json_encode($returnResponse));
    }



    echo json_encode($response);
}


// invoices based on categories fuction
function getInvoicesPaidBasedOnCategories()
{

    $response = array();
    include "config/index.php";

    // Query to get the number of invoices per category
    $query = "SELECT rh.COL_5 as categories, COUNT(*) as count
              FROM invoices i
              INNER JOIN revenue_heads rh ON i.revenue_head = rh.id
              WHERE i.payment_status = 'paid'
              GROUP BY rh.COL_5";

    $result = mysqli_query($ibsConnection, $query) or die(mysqli_error($ibsConnection));
    $paidInvoicesPerCategory = array();
    $totalPaidInvoices = 0;

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $category = $row['categories'];
            $count = $row['count'];

            $paidInvoicesPerCategory[] = array(
                'category' => $category,
                'count' => $count
            );

            $totalPaidInvoices += $count;


            $returnResponse = ['status' => 1, 'totalPaidIncoice' => $totalPaidInvoices, 'paidInvoicesPerCategory' => $paidInvoicesPerCategory];
        }


        exit(json_encode($returnResponse));
    } else {
        $returnResponse = ['status' => 0, 'message' => "try again"];
        exit(json_encode($returnResponse));
    }


    echo json_encode($response);
}


// MDA performance based on LGAs
function getMDALGAPerformance()
{

    $response = array();
    include "config/index.php";

      // Query to get the number of invoices per 'lga'
    $query = "SELECT m.lga, COUNT(p.invoice_number) AS count
              FROM mda m
              LEFT JOIN payment_collection_report_individual p ON m.fullname = p.mda_id
              GROUP BY m.lga";
              
    $result = mysqli_query($ibsConnection, $query) or die(mysqli_error($ibsConnection));
        $invoicesPerLGA = array();
    $totalInvoices = 0;

   

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $lga = $row['lga'];
            $count = $row['count'];

           
            $invoicesPerLGA[] = array(
                'lga' => $lga,
                'count' => $count
            );

            $totalInvoices += $count;


            $returnResponse = ['status' => 1, 'totalRevenue' => $totalInvoices, 'revenuePerLGA' => $invoicesPerLGA];
        }


        exit(json_encode($returnResponse));
    } else {
        $returnResponse = ['status' => 0, 'message' => "try again"];
        exit(json_encode($returnResponse));
    }


    echo json_encode($response);
}

// MDA performance
function getMDAPerformance()
{

    $response = array();
    include "config/index.php";

      // Query to get the number of invoices per 'lga'
    $query = "SELECT m.fullname AS mda, COUNT(p.invoice_number) AS count
              FROM mda m
              LEFT JOIN payment_collection_report_individual p ON m.fullname = p.mda_id
              GROUP BY m.fullname";
              
    $result = mysqli_query($ibsConnection, $query) or die(mysqli_error($ibsConnection));
      $invoicesPerMDA = array();
    $totalInvoices = 0;

   

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
             $mda = $row['mda'];
            $count = $row['count'];

            $invoicesPerMDA[] = array(
                'mda' => $mda,
                'count' => $count
            );

            $totalInvoices += $count;


            $returnResponse = ['status' => 1, 'totalRevenue' => $totalInvoices, 'MDAPerformance' => $invoicesPerMDA];
        }


        exit(json_encode($returnResponse));
    } else {
        $returnResponse = ['status' => 0, 'message' => "try again"];
        exit(json_encode($returnResponse));
    }


    echo json_encode($response);
}


// Revenue Heads performance
function getRevenueHeadsPerformance()
{

    $response = array();
    include "config/index.php";

      // Query to get the number of invoices per 'lga'
    $query = "SELECT r.name AS revenue_head, COUNT(p.invoice_number) AS count
              FROM revenue_heads r
              LEFT JOIN payment_collection_report_individual p ON r.id = p.revenue_head
              GROUP BY r.name";
              
    $result = mysqli_query($ibsConnection, $query) or die(mysqli_error($ibsConnection));
      $invoicesPerRevenueHeads = array();
    $totalInvoices = 0;

   

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
             $revenueHead = $row['revenue_head'];
            $count = $row['count'];

            $invoicesPerRevenueHeads[] = array(
                'revenue_head' => $revenueHead,
                'count' => $count
            );

            $totalInvoices += $count;

            $returnResponse = ['status' => 1, 'revenueScore' => $totalInvoices, 'RevenueHeadPerformances' => $invoicesPerRevenueHeads];
        }


        exit(json_encode($returnResponse));
    } else {
        $returnResponse = ['status' => 0, 'message' => "try again"];
        exit(json_encode($returnResponse));
    }


    echo json_encode($response);
}

// TIN Request per months

function getAnalyticsTINRequestPerMonth()
{

    include "config/index.php";

    $response = array();

    // Query to get the total number of TIN requests and count of requests per month
    $tinQuery = "SELECT COUNT(*) as totalRequests, DATE_FORMAT(created_at, '%Y-%m') as month
                 FROM primary_TIN_request
                 GROUP BY month";
    $tinResult = mysqli_query($ibsConnection, $tinQuery) or die(mysqli_error($ibsConnection));


    $tinRequestsPerMonth = array();
    $totalTINRequests = 0;

    if ($tinResult->num_rows > 0) {
        while ($tinRow = $tinResult->fetch_assoc()) {
            $month = $tinRow['month'];
            $requestCount = $tinRow['totalRequests'];

            $tinRequestsPerMonth[] = array(
                'month' => $month,
                'requestCount' => $requestCount
            );


            $totalTINRequests += $requestCount;
            $returnResponse = ['status' => 1, 'totalTINRequests' => $totalTINRequests, 'tinRequestsPerMonth' => $tinRequestsPerMonth];
        }

        exit(json_encode($returnResponse));
    } else {
        $returnResponse = ['status' => 0, 'message' => "try again"];
        exit(json_encode($returnResponse));
    }

    echo json_encode($response);
}





function getAnalyticsTINRequestPerDAYWEEKMONTH()
{

    include "config/index.php";

    $response = array();


    // Query to get the total number of TIN requests
    $totalQuery = "SELECT COUNT(*) AS totalRequests FROM primary_TIN_request";
    $totalResult = mysqli_query($ibsConnection, $totalQuery) or die(mysqli_error($ibsConnection));

    $totalRequests = $totalResult->fetch_assoc()['totalRequests'];


    // Query to get the monthly TIN request data
    $monthlyQuery = "SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, 
                           COUNT(*) AS count, 
                           SUM(application_status = 'approved') AS approvedRequests,
                           SUM(application_status = 'pending') AS pendingRequests
                    FROM primary_TIN_request
                    GROUP BY DATE_FORMAT(created_at, '%Y-%m')";

    $monthlyResult = mysqli_query($ibsConnection, $monthlyQuery) or die(mysqli_error($ibsConnection));
    $monthlyRequests = array();
    while ($row = $monthlyResult->fetch_assoc()) {
        $monthlyRequests[] = array(
            'month' => $row['month'],
            'numberOfRequest' => $row['count'],
            'approvedRequests' => $row['approvedRequests'],
            'pendingRequests' => $row['pendingRequests']
        );
    }


    $returnResponse = ['status' => 1, 'totalRequests' => $totalRequests, 'monthlyRequests' => $monthlyRequests];

    exit(json_encode($returnResponse));



    echo json_encode($response);
}


// TIN Request per months

// function getAnalyticsTINRequestPerDAYWEEKMONTH() {

//   include "config/index.php";

//     $response = array();

//     $tinQuery = "SELECT
//                     COUNT(*) as totalRequests,
//                     DATE_FORMAT(created_at, '%Y-%m') as month,
//                     CONCAT(YEAR(created_at), '-', WEEK(created_at)) as week,
//                     DATE(created_at) as day
//                  FROM primary_TIN_request
//                  GROUP BY month, week, day";
// $tinResult = mysqli_query($ibsConnection, $tinQuery) or die(mysqli_error($ibsConnection));


//      $tinRequestsPerMonth = array();
//     $tinRequestsPerWeek = array();
//     $tinRequestsPerDay = array();
//     $totalTINRequests = 0;

//     if ($tinResult->num_rows > 0) {
//         while ($tinRow = $tinResult->fetch_assoc()) {
//          $month = $tinRow['month'];
//             $week = $tinRow['week'];
//             $day = $tinRow['day'];
//             $requestCount = $tinRow['totalRequests'];




// $tinRequestsPerMonth[$month] = isset($tinRequestsPerMonth[$month]) ? $tinRequestsPerMonth[$month] + $requestCount : $requestCount;
//             $tinRequestsPerWeek[$week] = isset($tinRequestsPerWeek[$week]) ? $tinRequestsPerWeek[$week] + $requestCount : $requestCount;
//             $tinRequestsPerDay[$day] = isset($tinRequestsPerDay[$day]) ? $tinRequestsPerDay[$day] + $requestCount : $requestCount;

//             $totalTINRequests += $requestCount;



//             $returnResponse = ['status' => 1, 'totalTINRequests' => $totalTINRequests, 'tinRequestsPerMonth' => $tinRequestsPerMonth, 'tinRequestsPerWeek' => $tinRequestsPerWeek, 'tinRequestsPerDay' => $tinRequestsPerDay ];

//         }

//   exit(json_encode($returnResponse));

//     }else {
//         $returnResponse = ['status' => 0, 'message' => "try again"];
//         exit(json_encode($returnResponse));
//     }

//     echo json_encode($response);
// }

function averagePaymentTime()
{
    // Assuming you have a database connection established
    // Query to calculate the average time for payments for invoices for each month
    include "config/index.php";
    $query = "
        SELECT
            YEAR(invoices.date_created) AS year,
            MONTH(invoices.date_created) AS month,
            AVG(TIMESTAMPDIFF(SECOND, payment_collection_report_individual.timeIn, NOW())) AS average_time
        FROM
            invoices
        JOIN
            payment_collection_report_individual
            ON invoices.invoice_number = payment_collection_report_individual.invoice_number
        WHERE
            invoices.payment_status = 'paid'
        GROUP BY
            YEAR(invoices.date_created),
            MONTH(invoices.date_created)
        ORDER BY
            YEAR(invoices.date_created),
            MONTH(invoices.date_created)
    ";
    $result = mysqli_query($ibsConnection, $query);
    $response = [];
    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            $response[] = $row;
            // $year = $row['year'];
            // $month = $row['month'];
            // $averageTime = $row['average_time'];
            // echo "Average time for payments in $month/$year: $averageTime seconds" . PHP_EOL;
        }
        exit(json_encode($response));
    } else {
        // echo "Failed to retrieve data from the database.";
        $response = "Failed to retrieve data from the database.";
        exit(json_encode($response));
    }
}

function login($username, $password)
{
    include "config/index.php";
    $query_User_re = sprintf("SELECT * FROM `payer_user` WHERE email='{$username}'");
    $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));
    $row_User_re = mysqli_fetch_assoc($User_re);
    $totalRows_User_re = mysqli_num_rows($User_re);
    if ($totalRows_User_re > 0) {
        if ($row_User_re['password'] != $password) {
            $arr = ['status' => 0, 'message' => 'Incorrect Password'];
            // $arr = ['status' => 1, 'message' => 'Buzzing you in ðŸ˜Ž', 'user' => $row_User_re];
           
            $user_category = "Payer User";
             $user_id = $row_User_re['id'];
             $comment = "Incorrect Password";
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             $session_id = "";
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
            exit(json_encode($arr));
        } else if ($row_User_re['verification_status'] != 1) {
            $arr = ['status' => 0, 'message' => 'Please Register a new account'];
            $user_category = "Payer User";
             $user_id = $row_User_re['id'];
             $comment = "verification failed";
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             $session_id = "";
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
            exit(json_encode($arr));
        } else {
            unset($row_User_re['password']);
            $arr = ['status' => 1, 'message' => 'Buzzing you in ðŸ˜Ž', 'user' => $row_User_re];
            $_SESSION['session_id'] = generateUniqueID();
            $_SESSION['user_id'] = $row_User_re['tax_number'];
            $ipAddress = $_SERVER['REMOTE_ADDR'];
             $user_category = "Payer User";
             $user_id = $row_User_re['tax_number'];
             $comment = "Logged in successfully";
             $session_id = $_SESSION['session_id'];
            activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
            exit(json_encode($arr));
        }
    } else {
        // $arr = ['status' => 0, 'message' => 'Login details do not match an existing user, Please register or check details again',];
            $user_category = "Payer User";
             $user_id = $username;
             $comment = "Fail to Login";
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             $session_id = "";
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
        //     exit(json_encode($arr));
      
        $query_User_re1 = sprintf("SELECT * FROM `enumerator_tax_payers` WHERE email='{$username}'");
        $User_re1 = mysqli_query($ibsConnection, $query_User_re1) or die(mysqli_error($ibsConnection));
        $row_User_re1 = mysqli_fetch_assoc($User_re1);
        $totalRows_User_re1 = mysqli_num_rows($User_re1);
        if ($totalRows_User_re1 > 0) {
            if ($row_User_re1['password'] != $password) {
                $arr = ['status' => 0, 'message' => 'Incorrect Password'];
                
                $ipAddress = $_SERVER['REMOTE_ADDR'];
                $session_id = "";
                $user_category = "Enum User";
                 $user_id = $row_User_re1['tax_number'];
                 $comment = "Logged in successfully";
                 activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
                exit(json_encode($arr));
            }else{
                // unset($row_User_re1['password']);
                $arr = ['status' => 1, 'message' => 'Buzzing you in ðŸ˜Ž', 'user' => $row_User_re1];
                $_SESSION['session_id'] = generateUniqueID();
            $_SESSION['user_id'] = $row_User_re['tax_number'];
            $ipAddress = $_SERVER['REMOTE_ADDR'];
             $user_category = "Enumerator User";
             $user_id = $row_User_re1['tax_number'];
             $comment = "Logged in successfully";
             $session_id = $_SESSION['session_id'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
                exit(json_encode($arr));
            }
        }else{
            exit(json_encode($arr));
        }

    }
}


function loginAdmin($username, $password)
{
    include "config/index.php";
    $query_User_re = sprintf("SELECT * FROM `Administrative_users` WHERE email='{$username}'");
    $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));
    $row_User_re = mysqli_fetch_assoc($User_re);
    $totalRows_User_re = mysqli_num_rows($User_re);
    if ($totalRows_User_re > 0) {
        if ($row_User_re['password'] == $password) {
            $arr = ['status' => 1, 'message' => 'Buzzing you in ðŸ˜Ž', 'user' => $row_User_re];
                $_SESSION['session_id'] = generateUniqueID();
            $_SESSION['user_id'] = $row_User_re['id'];
            $ipAddress = $_SERVER['REMOTE_ADDR'];
             $user_category = "Admin User";
             $user_id = $row_User_re['id'];
             $comment = "Logged in successfully";
              $session_id = $_SESSION['session_id'];
              activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
            
            exit(json_encode($arr));
        }
    } else {
        $arr = ['status' => 0, 'message' => 'User does not exist',];
        $user_category = "Admin User";
             $user_id = $username;
             $comment = "Error Failed Login";
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             $session_id = "";
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
        exit(json_encode($arr));
    }
}


function loginMda($username, $password)
{
    include "config/index.php";
    $query_User_re = sprintf("SELECT * FROM mda_users WHERE email='{$username}'");
    $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));
    $row_User_re = mysqli_fetch_assoc($User_re);
    $totalRows_User_re = mysqli_num_rows($User_re);
    if ($totalRows_User_re > 0) {
        if ($row_User_re['password'] === $password) {
            $arr = ['status' => 1, 'message' => 'Buzzing you in ðŸ˜Ž', 'user' => $row_User_re];
                $_SESSION['session_id'] = generateUniqueID();
            $_SESSION['user_id'] = $row_User_re['id'];
             $user_category = "Mda User";
             $user_id = $row_User_re['id'];
             $comment = "Logged in successfully";
              $session_id = $_SESSION['session_id'];
              $ipAddress = $_SERVER['REMOTE_ADDR'];
              activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
            exit(json_encode($arr));
        } else {
            $arr = ['status' => 0, 'message' => 'Password does not match',];
               $user_category = "Mda User";
             $user_id = $row_User_re['id'];
             $comment = "Password Incorrect";
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             $session_id = "";
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
            exit(json_encode($arr));
        }
    } else {
        $arr = ['status' => 0, 'message' => 'User does not exist',];
           $user_category = "Mda User";
             $user_id = $username;
             $comment = "Invalid User";
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             $session_id = "";
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
        exit(json_encode($arr));
    }
}

function createUser($data)
{
    include "config/index.php";
    include "config/enctp.php";
    $email = $data->email;
    $password = $data->password;
    $fullname = $data->fullname;
    $phone = $data->phone;
//     $chg = [
//     '1' => 'view',
//     '2' => 'full',
//     '3' => 'no'
// ];
    $dashboard_access = "$data->dashboard_access";
    $analytics_access = "$data->analytics_access";
    $mda_access = "$data->mda_access";
    $reports_access = "$data->reports_access";
    $tax_payer_access = "$data->tax_payer_access";
    $users_access = "$data->users_access";
    $cms_access = "$data->cms_access";
    $img = $data->img;
    $support = "$data->support";
    $enumeration = "$data->enumeration_access";
    $audit_trail = "$data->audit_trail_access";
    $role = $data->role;
    $verification = encripted_data($email . "Ã‚Â£" . "2880" . "_");
    $query_User_re = sprintf("INSERT INTO `Administrative_users`(`fullname`, `email`, `phone`, `password`, `dashboard_access`, `analytics_access`, `mda_access`, `reports_access`, `tax_payer_access`, `users_access`, `cms_access`, `support`, `img`, `verification_status`, `role`, `enumeration_access`, `audit_trail_access`) 
                VALUES ('$fullname', '$email', '$phone', '$password','$dashboard_access','$analytics_access','$mda_access','$reports_access','$tax_payer_access','$users_access','$cms_access','$support','$img','$verification', '$role', '$enumeration', '$audit_trail')");
    $check_exist = check_db_query_staus("SELECT email FROM Administrative_users WHERE email='{$email}'", "CHK");

    if ($check_exist['status'] == 1) {
        $returnResponse = ['status' => 2, 'message' => "{$email} exists already"];
        exit(json_encode($returnResponse));
    } else {
        $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));
        if ($User_re) {
            $last_id = mysqli_insert_id($ibsConnection);
            $sender = "info@useibs.com";

            $to = "$email";
            $subject = "Account Verification";
            // Email Template
            $message = "Hi $fullname! <br />
            Your account on the IBS has been created Successfully<br />
            Here are Your Account details: <br />
            Username: $email. <br />
            Your roles and permissions: <br />

            <ol style='list-style-type: A;'>
            <li >Dashboard : $dashboard_access</li>
            <li style='margin: top 5px;'>Analytics : $analytics_access</li>
            <li style='margin: top 5px;'>Mda : $mda_access</li>
            <li style='margin: top 5px;'>Report : $reports_access</li>
            <li style='margin: top 5px;'>Tax_payer : $tax_payer_access</li>
            <li style='margin: top 5px;'>Users : $users_access</li>
            <li style='margin: top 5px;'>Cms : $cms_access</li>
            <li style='margin: top 5px;'>Support : $support</li>
            </ol>
            <br />
            
            Click on the verification link below to create your password; <br />
             https://useibs.com/createpassword.html?id=$last_id&verification=$verification";


            $header = "From:'$sender'";
            $header .= "MIME-Version: 1.0\r\n";
            $header .= "Content-type: text/html\r\n";
            $retval = mail($to, $subject, $message, $header);

            $returnResponse = ['status' => 1, 'message' => "{$email} added successfully", "id" => $last_id];
          
            $user_category = "Admin User";
             $user_id = "$last_id";
             $comment = "Admin User Registration";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
            exit(json_encode($returnResponse));
        } else {
            $returnResponse = ['status' => 0, 'message' => "{$email} not created, try again"];
            $user_category = "Admin User";
             $user_id = "$email";
             $comment = "Registration Failed";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
            exit(json_encode($returnResponse));
        }
    }
}

function createMDA($data)
{
    include "config/index.php";
    //include "config/enctp.php";
    $email = $data->email;
    $alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    $pass = array();
    $alphaLength = strlen($alphabet) - 1;
    for ($i = 0; $i < 10; $i++) {
        $n = rand(0, $alphaLength);
        $pass[] = $alphabet[$n];
    }
    $password = implode($pass);
    $fullname = $data->fullname;
    $phone = $data->phone;
    $industry = $data->industry;
    $state = $data->state;
    $geolocation = $data->geolocation;
    $lga = $data->lga;
    $address = $data->address;
    $status = $data->status;
    $total_gen_revenue = 0;
    $dashboard_access = "full";
    $revenue_head_access = "full";
    $payment_access = "full";
    $users_access = "full";
    $report_access = "full";
    $allow_payment = $data->allow_payment;
    $office_creation = $data->office_creation;
    $query_User_re = sprintf("INSERT INTO `mda`(`fullname`, `email`, `password`, `phone`, `industry`, `state`, `geolocation`, `lga`, `address`, `status`,`total_gen_revenue`,`allow_payment`,`office_creation`)
                VALUES ('$fullname', '$email', '$password', '$phone', '$industry','$state','$geolocation','$lga','$address','$status','$total_gen_revenue','$allow_payment', '$office_creation')");
    $check_exist = check_db_query_staus("SELECT email FROM mda WHERE email='{$email}'", "CHK");

    if ($check_exist['status'] == 1) {
        $returnResponse = ['status' => 2, 'message' => "{$email} exists already"];
        exit(json_encode($returnResponse));
    } else {
        $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));
        if ($User_re) {
            $last_id = mysqli_insert_id($ibsConnection);
            $query_User_re1 = sprintf("INSERT INTO `mda_users`(`mda_id`, `name`, `email`, `phone_number`, `password`, `dashboard_access`, `revenue_head_access`, `payment_access`, `users_access`, `report_access`)
            VALUES ('$last_id', '$fullname', '$email', '$phone', '$password','$dashboard_access','$revenue_head_access','$payment_access','$users_access','$report_access')");
            $User_re1 = mysqli_query($ibsConnection, $query_User_re1) or die(mysqli_error($ibsConnection));
            
            $sender = "info@useibs.com";

            $to = "$email";
            $subject = "Account Verification";
            // Email Template
            $message = "Hi $fullname! Your account has been Created Successfully <br />
            Here is Your Account details: <br />
            Username: $email. <br />
            
            Click on the link to verify your Account https://useibs.com/mdapassword.html?id=$last_id";


            $header = "From:'$sender'";
            $header .= "MIME-Version: 1.0\r\n";
            $header .= "Content-type: text/html\r\n";
            $retval = mail($to, $subject, $message, $header);
            $returnResponse = ['status' => 1, 'message' => "{$email} added successfully", 'pass' => $password];
            $user_category = "Admin User";
             $user_id = "$last_id";
             $comment = "Mda Creation";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
            exit(json_encode($returnResponse));
        } else {
            $returnResponse = ['status' => 0, 'message' => "{$email} not created, try again"];
             $user_category = "Mda User";
             $user_id = "$email";
             $comment = "Registration Failed";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
            exit(json_encode($returnResponse));
        }
    }
}

function createMDAPaymentForm($data)
{
    include "config/index.php";
    //include "config/enctp.php";
    $content = $data->content;
    $mda_id = $data->mda_id;
    $table_name = "payment" . "_" . $mda_id;
    $query_User_re = sprintf("INSERT INTO `payment_form_labels`(`table_name`, `content`, `mda_id`)
                VALUES ('$table_name', '$content', '$mda_id')");
    $check_exist = check_db_query_staus("SELECT mda_id FROM payment_form_labels WHERE mda_id={$mda_id}", "CHK");

    if ($check_exist['status'] == 1) {
        $returnResponse = ['status' => 2, 'message' => "MDA Payment form exists already"];
        exit(json_encode($returnResponse));
    } else {
        $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));
        if ($User_re) {
            $returnResponse = ['status' => 1, 'message' => "Payment form added successfully"];
            $context_type = ["number" => "int", "text" => "varchar"];
            $context_length = ["number" => "255", "text" => "100"];
            $content =  explode(",", $content);
            // $content_1 = [];
            $txt = "";
            foreach ($content as $key => $value) {
                $content_1 = explode("^", $value);
                // foreach ($content_1 as $key1 => $value1) {

                // }
                $txt .= "`{$key}` {$context_type[$content_1[1]]}({$context_length[$content_1[1]]}) NULL,";
                // echo $txt."\n";
            }
            // $txt = rtrim($txt, ",");
            $query_User_re_table = sprintf("CREATE TABLE `{$table_name}` (id INT AUTO_INCREMENT primary key NOT NULL, {$txt} `time_in` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp())");
            $User_re_table = mysqli_query($ibsConnection, $query_User_re_table) or die(mysqli_error($ibsConnection));


            exit(json_encode($returnResponse));
        } else {
            $returnResponse = ['status' => 0, 'message' => "Payment form not created, try again"];
            exit(json_encode($returnResponse));
        }
    }
}

function getMDAs()
{
    include "config/index.php";
    //include "config/enctp.php";
    $query_User_re = sprintf("SELECT `id`, `fullname`, `email`, `phone`, `industry`, `state`, `geolocation`, `lga`, `address`,`time_in`,`status`,`total_gen_revenue`,`allow_payment`,`office_creation` FROM `mda`");
    $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));
    $row_User_re = mysqli_fetch_assoc($User_re);
    $totalRows_User_re = mysqli_num_rows($User_re);

    if ($totalRows_User_re > 0) {
        $products_array = [];
        while ($row_User_re = mysqli_fetch_assoc($User_re)) {
            $data = $row_User_re['fullname'];
            $sql_details = "SELECT COUNT(*) FROM `revenue_heads` WHERE `COL_3`= '{$data}' ";
            $result_details = mysqli_query($ibsConnection, $sql_details) or die(mysqli_error($ibsConnection));
            if (mysqli_num_rows($result_details) > 0) {
                $all = [];
                while ($row_details = mysqli_fetch_assoc($result_details)) {

                    $all = array_merge($row_User_re, $row_details);
                    array_push($products_array, $all);
                }
            } else {
            }
            $returnResponse = ['status' => 1, 'message' => $products_array];
        }
        exit(json_encode($returnResponse));
    } else {
        $returnResponse = ['status' => 0, 'message' => "try again"];
        exit(json_encode($returnResponse));
    }
}
function getMDAById($data)
{
    $pull_data = check_db_query_staus("SELECT * FROM `mda` WHERE `id`= '{$data}' ", "CHK");
    exit(json_encode($pull_data));
}
function getRevenueHead()
{
    $pull_data = check_db_query_staus1("SELECT * FROM revenue_heads", "CHK");
    exit(json_encode($pull_data));
}
function getMDAsRevenueHead($data)
{
    $pull_data = check_db_query_staus1("SELECT `id`, `COL_1`, `COL_2`, `COL_3`, `COL_4`, `COL_5`, `COL_6`,`total_gen_revenue`,`status` FROM `revenue_heads` WHERE `COL_3`= '{$data}' ", "CHK");
    exit(json_encode($pull_data));
}

function getMDAsRevenueHeadId($data)
{
    $pull_data = check_db_query_staus1("SELECT `id`, `COL_1`, `COL_2`, `COL_3`, `COL_4`, `COL_5`, `COL_6`,`total_gen_revenue`,`status` FROM `revenue_heads` WHERE `id`= '{$data}' ", "CHK");
    exit(json_encode($pull_data));
}

function getIndustries()
{
    $pull_data = check_db_query_staus1("SELECT DISTINCT `COL_3` FROM `revenue_heads`", "CHK");
    exit(json_encode($pull_data));
}

function getTaxPayerList()
{
    $pull_data = check_db_query_staus1("SELECT * FROM `payer_user`", "CHK");
    exit(json_encode($pull_data));
}
function getSingleTaxPayerList($data)
{
    $pull_data = check_db_query_staus1("SELECT * FROM `payer_user` WHERE `id`= '{$data}' ", "CHK");
    exit(json_encode($pull_data));
}

function createMDARevenueHeads($data)
{
    include "config/index.php";
    //include "config/enctp.php";
    $mda_id = $data->mda_id;
    $fullname = $data->fullname;
    $adminCode = $data->adminCode;
    $amount = $data->amount;
    $economicCode = $data->economicCode;
    $category = $data->category;
    $total_gen_revenue = 0;
    $status = 'pending';
    $frequency = $data->frequency;
    $due_date = $data->date;
    $category1 = explode(",", $category);
    $returnResponse = [];
    // print_r($category1);
    foreach($category1 as $value){
        $query_User_re = sprintf("INSERT INTO `revenue_heads`(`COL_1`, `COL_2`, `COL_3`, `COL_4`, `COL_5`, `COL_6`,`total_gen_revenue`, `status`, `frequency`, `due_date`)
                VALUES ('$adminCode', '$economicCode', '$mda_id', '$fullname', '$value', '$amount','$total_gen_revenue','$status', '$frequency', '$due_date')");
        $check_exist = check_db_query_staus("SELECT `COL_4` FROM revenue_heads WHERE `COL_4`='{$fullname}' AND `COL_5`='{$value}'", "CHK");
    
        if ($check_exist['status'] == 1) {
            $returnResponse[$value] = ['status' => 2, 'message' => "{$fullname} exists already"];
            // exit(json_encode($returnResponse));
        } else {
            $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));
            if ($User_re) {
                 $user_category = "Mda User";
                $user_id = $mda_id;
                $comment = "RevenueHead Creation";
                $session_id = $_SESSION['session_id'];
                $ipAddress = $_SERVER['REMOTE_ADDR'];
                activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
                $returnResponse[$value] = ['status' => 1, 'message' => "{$fullname} added successfully"];
                // exit(json_encode($returnResponse));
            } else {
                $returnResponse[$value] = ['status' => 0, 'message' => "{$fullname} not created, try again"];
                $user_category = "Mda User";
             $user_id = "$mda_id";
             $comment = "RevenueHead Creation Failed";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
                // exit(json_encode($returnResponse));
            }
        }
    }
    exit(json_encode($returnResponse));
}

function paymentToMDARevenueHeads($data)
{
    include "config/index.php";
    //include "config/enctp.php";

    $invoice_number = $data->invoice_number;
    $payment_channel = $data->payment_channel;
    $payment_reference_number = $data->payment_reference_number;
    $receipt_number = $data->receipt_number;
    $other_details = check_db_query_staus("SELECT * FROM invoices WHERE invoice_number='{$invoice_number}'", "CHK");
    // if ($other_details['status'] == 1) {
    // $revenue_head = $other_details['message']['revenue_head'];
    // exit(json_encode($revenue_head));
    if ($other_details['status'] == 1) {
        // print_r($other_details1);
        $revenue_head = $other_details['message']['revenue_head'];
        $user_id = $other_details['message']['payer_id'];
        $other_details1 = check_db_query_staus("SELECT COL_3, COL_6, COL_4 FROM revenue_heads WHERE id='{$revenue_head}'", "CHK");
        $mda_id = $other_details1['message']['COL_3'];
        $amount = $other_details1['message']['COL_6'];
        $rev_name = $other_details1['message']['COL_4'];
        $query_User_re = sprintf("INSERT INTO `payment_collection_report_individual`(`mda_id`, `revenue_head`, `user_id`, `invoice_number`, `payment_channel`, `payment_reference_number`, `receipt_number`)
                    VALUES ('$mda_id', '$revenue_head', '$user_id', '$invoice_number', '$payment_channel', '$payment_reference_number', '$receipt_number')");
                      $user_category = "Payer User";
             $user_id = $user_id;
             $comment = "Payment successful";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
        $check_exist = check_db_query_staus("SELECT payment_reference_number FROM payment_collection_report_individual WHERE payment_reference_number='{$payment_reference_number}'", "CHK");
        if ($check_exist['status'] == 1) {
            $returnResponse = ['status' => 2, 'message' => "{$payment_reference_number} exists already"];
            exit(json_encode($returnResponse));
        } else {
            $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));
            if ($User_re) {
                $paid = "paid";

                check_db_query_staus("UPDATE `invoices` SET `payment_status`='{$paid}' WHERE `invoice_number`='{$invoice_number}'", "UPD");
                check_db_query_staus("UPDATE `mda` SET `total_gen_revenue`= total_gen_revenue + {$amount} WHERE `fullname`='{$mda_id}'", "UPD");
                check_db_query_staus("UPDATE `revenue_heads` SET `total_gen_revenue`= total_gen_revenue + {$amount} WHERE `COL_4`='{$rev_name}'", "UPD");
                $returnResponse = ['status' => 1, 'message' => "{$invoice_number} added successfully"];
                      $user_category = "Payer User";
             $user_id = $user_id;
             $comment = "Payment successful";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
                exit(json_encode($returnResponse));
            } else {
                $returnResponse = ['status' => 0, 'message' => "{$invoice_number} not created, try again"];
                      $user_category = "Payer User";
             $user_id = $user_id;
             $comment = "Payment Failed";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
                exit(json_encode($returnResponse));
            }
        }
    } else {
        $returnResponse = ['status' => 0, 'message' => "{$invoice_number} not created, try again"];
        exit(json_encode($returnResponse));
    }
}


function generatePayerID()
{
    $chars = "0123456789";
    $payerID = substr(str_shuffle($chars), 0, 5);
    return $payerID;
}

function createPayerUser($data)

{
    include "config/index.php";
    include "config/enctp.php";
    $email = $data->email;
    $password = $data->password;
    $first_name = $data->first_name;
    $surname = $data->surname;
    $category = $data->category;
    if ($category == 1) {
        $category1 = "C";
    } else if ($category == 2) {
        $category1 = "I";
    } else if ($category == 3) {
        $category1 = "S";
    } else if ($category == 4) {
        $category1 = "F";
    }
    $tax_number = "AKW" . $category1 . "-" . generatePayerID();
    $phone = $data->phone;
    $state = $data->state;
    $employment_status = $data->employment_status;
    $business_type = $data->business_type;
    $lga = $data->lga;
    $img = $data->img;
    $address = $data->address;
    $tin = $data->tin;
    $numberofstaff = $data->numberofstaff;
    $verification = encripted_data($email . "Â£" . "2880" . "_");
    $verification_code = substr(str_shuffle(str_repeat("0123456789", 6)), 0, 6);
    $query_User_re = sprintf("INSERT INTO `payer_user`(`tax_number`, `category`, `first_name`, `surname`, `email`, `phone`, `state`,`business_type`,`employment_status`,`lga`, `address`,`img`,`password`,`verification_status`,`verification_code`,`tin`,`number_of_staff`) 
                VALUES ('$tax_number', '$category', '$first_name', '$surname','$email','$phone','$state','$business_type','$employment_status','$lga','$address','$img','$password','$verification','$verification_code','$tin','$numberofstaff')");
    $email_check = sprintf("SELECT email, tax_number, verification_status FROM payer_user WHERE email='{$email}'");
    $User_re = mysqli_query($ibsConnection, $email_check) or die(mysqli_error($ibsConnection));
    $row_User_re = mysqli_fetch_assoc($User_re);
    $totalRows_User_re = mysqli_num_rows($User_re);
    if ($totalRows_User_re > 0) {
        if ($row_User_re['email'] == $email && $row_User_re['verification_status'] == "1") {
            $returnResponse = ['status' => 2, 'message' => "{$email} exists already", "data" => $row_User_re];
            exit(json_encode($returnResponse));
        } else {
            $check_exist = check_db_query_staus("DELETE FROM `payer_user` WHERE `email`='{$email}'", "DEL");
            if ($check_exist['status'] == 1) {
                $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));
                if ($User_re) {
                    $last_id = mysqli_insert_id($ibsConnection);
                    $fetched_data_last_id = check_db_query_staus("SELECT tax_number FROM payer_user WHERE id = $last_id", "CHK");
                    $returnResponse = ['status' => 1, 'message' => "{$email} added successfully", "data" => $fetched_data_last_id['message'], "id" => $last_id];
                    $_SESSION['session_id'] = generateUniqueID();
                    $_SESSION['user_id'] = $last_id;
                          $user_category = "Payer User";
             $user_id = $last_id;
             $comment = "User Registration";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
                    exit(json_encode($returnResponse));
                } else {
                    $returnResponse = ['status' => 0, 'message' => "{$email} not created, try again"];
                    $user_category = "Payer User";
             $user_id = $email;
             $comment = "User Registration Failed";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
                    exit(json_encode($returnResponse));
                }
            }
        }
    } else {
        $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));
        if ($User_re) {
            $last_id = mysqli_insert_id($ibsConnection);
            $fetched_data_last_id = check_db_query_staus("SELECT tax_number FROM payer_user WHERE id = $last_id", "CHK");
            $returnResponse = ['status' => 1, 'message' => "{$email} added successfully", "data" => $fetched_data_last_id['message'], "id" => $last_id];
             $user_category = "Payer User";
             $user_id = $tax_number;
             $comment = "Payer User Registration";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
            exit(json_encode($returnResponse));
        } else {
            $returnResponse = ['status' => 0, 'message' => "{$email} not created, try again"];
            $user_category = "Payer User";
             $user_id = $tax_number;
             $comment = "Payer User Registration Failed";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
            exit(json_encode($returnResponse));
        }
    }
}

function userProfile($id)
{
    include "config/index.php";
    $query_User_re = sprintf("SELECT * FROM `payer_user` WHERE id='{$id}'");
    $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));
    $row_User_re = mysqli_fetch_assoc($User_re);
    $totalRows_User_re = mysqli_num_rows($User_re);
    if ($totalRows_User_re > 0) {
        $arr = ['status' => 1, 'message' => 'Buzzing you in ðŸ˜Ž', 'user' => $row_User_re];
        exit(json_encode($arr));
    } else {
        $arr = ['status' => 0, 'message' => 'User does not exist',];
        exit(json_encode($arr));
    }
}
function userProfileAdmin($id)
{
    include "config/index.php";
    $query_User_re = sprintf("SELECT * FROM `Administrative_users` WHERE id='{$id}'");
    $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));
    $row_User_re = mysqli_fetch_assoc($User_re);
    $totalRows_User_re = mysqli_num_rows($User_re);
    if ($totalRows_User_re > 0) {
        $arr = ['status' => 1, 'message' => 'Buzzing you in ðŸ˜Ž', 'user' => $row_User_re];
        exit(json_encode($arr));
    } else {
        $arr = ['status' => 0, 'message' => 'User does not exist',];
        exit(json_encode($arr));
    }
}

function updateMDA($data)
{
    // print_r($data);
    $value_to_update = "";
    $md_id = "";
    foreach ($data as $key => $value) {
        if ($key == "mda_id") {
            $md_id = $value;
        }
        if (($key != "updateMDA") && ($key != "mda_id")) {
            $value_to_update .= "`{$key}`='{$value}',";
        }
    }
    $value_to_update = rtrim($value_to_update, ",");
    exit(json_encode(check_db_query_staus("UPDATE `mda` SET {$value_to_update} WHERE `id`='{$md_id}'", "UPD")));
    updateMDAUsers($data);
            $user_category = "Mda User";
             $user_id = $md_id;
             $comment = "Mda Details Update";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
    
}

function deleteMDA($md_id)
{
    // print_r($data);
    exit(json_encode(check_db_query_staus("DELETE FROM `mda` WHERE `id`='{$md_id}'", "DEL")));
     $user_category = "Mda User";
             $user_id = $md_id;
             $comment = "Mda Deleted";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
}

function deleteRevenueHead($id)
{
    // print_r($data);
    exit(json_encode(check_db_query_staus("DELETE FROM `revenue_heads` WHERE `id`='{$id}'", "DEL")));
     $user_category = "Admin User";
             $user_id = $id;
             $comment = "Revenue Head Deleted";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
}

function updateRevenueHead($data)
{
    // print_r($data);
    $value_to_update = "";
    $id = "";
    foreach ($data as $key => $value) {
        if ($key == "id") {
            $id = $value;
        }
        if (($key != "updateRevenueHead") && ($key != "id")) {
            $value_to_update .= "`{$key}`='{$value}',";
        }
    }
    $value_to_update = rtrim($value_to_update, ",");
    exit(json_encode(check_db_query_staus("UPDATE `revenue_heads` SET {$value_to_update} WHERE `id`='{$id}'", "UPD")));
     $user_category = "Admin User";
             $user_id = $id;
             $comment = "Revenue Head Updated";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
}

function updateTaxPayer($data)
{
    // print_r($data);
    $value_to_update = "";
    $id = "";
    foreach ($data as $key => $value) {
        if ($key == "id") {
            $id = $value;
        }
        if (($key != "updateTaxPayer") && ($key != "id")) {
            $value_to_update .= "`{$key}`='{$value}',";
        }
    }
    $value_to_update = rtrim($value_to_update, ",");
    
    
    exit(json_encode(check_db_query_staus("UPDATE `payer_user` SET {$value_to_update} WHERE `id`='{$id}'", "UPD")));
     $user_category = "Payer User";
             $user_id = $id;
             $comment = "Updated profile successfully";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
}

function generateSequenceNumber()
{
    // Connect to database and retrieve the last used ID
    // include "config/index.php";
    // $result = mysqli_query($ibsConnection, "SELECT MAX(id) FROM invoices");
    // $row = mysqli_fetch_row($result);
    // $lastID = $row[0];

    // // Increment the last used ID to get the next ID
    // $nextID = $lastID + 1;

    // // Pad the next ID with leading zeros to make it 10 characters long
    // $sequenceNumber = str_pad($nextID, 10, "0", STR_PAD_LEFT);
    $numbers = range(0, 9);
    shuffle($numbers);
    $sequenceNumber = '';
    for ($i = 0; $i < 10; $i++) {
        $sequenceNumber .= $numbers[$i];
    }
    return $sequenceNumber;
}

function generateInvoice($data)
{
    include "config/index.php";
    // Retrieve the relevant information from the "payer" table
    $tax_number = $data;
    $sql = "SELECT id, category, first_name, surname, email, phone, state, lga, address FROM payer_user WHERE tax_number = '$tax_number'";
    $result = mysqli_query($ibsConnection, $sql);
    $resp = [];
    // Iterate over the results
    while ($row = mysqli_fetch_assoc($result)) {
        $payer_id = $row["id"];
        $category = $row["category"];
        $first_name = $row["first_name"];
        $surname = $row["surname"];
        $email = $row["email"];
        $phone = $row["phone"];
        $state = $row["state"];
        $lga = $row["lga"];
        $address = $row["address"];

        //Retrieve the relevant information from the "what to pay for" table
        $sql1 = "SELECT id, COL_4, COL_2, COL_3, COL_5, COL_6 FROM revenue_heads WHERE COL_5 = '$category'";
        $result1 = mysqli_query($ibsConnection, $sql1);
        while ($row1 = mysqli_fetch_assoc($result1)) {
            $revenue_head_id = $row1["id"];
            $economic_code = $row1["COL_2"];
            $mda = $row1["COL_3"];
            $category1 = $row1["COL_5"];
            $price = $row1["COL_6"];
            $invoice_number = generateSequenceNumber();
            // Set the due date as a future date
            $due_date = date("Y-m-d", strtotime("+1 month"));
            // Insert the new invoice into the "invoice" table
            $sql2 = "INSERT INTO invoices (invoice_number, payer_id, revenue_head, due_date, payment_status) 
                    VALUES ('$invoice_number', '$tax_number', $revenue_head_id,'$due_date', 2)";
            if (mysqli_query($ibsConnection, $sql2)) {
                $resp[] = "Invoice generated successfully";
            }
        }
        // Generate a unique invoice number
    }
    exit(json_encode($resp));
}

function generateSignleInvoice($data)
{
    include "config/index.php";
    // Retrieve the relevant information from the "payer" table
    $tax_number = $data['tax_number'];
    $revenue_head_id1 = $data['revenue_head_id'];
    $check_exist_001 = check_db_query_staus("SELECT `last_name` AS `surname`, `account_type` AS `category`, `first_name`, `email`, `phone`, `state`, `lga`, `address`, `tax_number`, `id` FROM `enumerator_tax_payers` WHERE tax_number='{$tax_number}'", "CHK");
    if($check_exist_001['status'] == 1){
        $sql = "SELECT `last_name` AS `surname`, `account_type` AS `category`, `first_name`, `email`, `phone`, `state`, `lga`, `address`, `tax_number`, `id` FROM `enumerator_tax_payers` WHERE tax_number='{$tax_number}'";
    }else{
        $sql = "SELECT id, category, first_name, surname, email, phone, state, lga, address FROM payer_user WHERE tax_number = '$tax_number'";    
    }
    
    $result = mysqli_query($ibsConnection, $sql);
    $resp = [];
    // Iterate over the results
    while ($row = mysqli_fetch_assoc($result)) {
        $payer_id = $row["id"];
        $category = $row["category"];
        $first_name = $row["first_name"];
        $surname = $row["surname"];
        $email = $row["email"];
        $phone = $row["phone"];
        $state = $row["state"];
        $lga = $row["lga"];
        $address = $row["address"];

        //Retrieve the relevant information from the "what to pay for" table
        $sql1 = "SELECT id, COL_4, COL_2, COL_3, COL_5, COL_6 FROM revenue_heads WHERE id in ({$revenue_head_id1})";
        $result1 = mysqli_query($ibsConnection, $sql1);
        $invoice_number = generateSequenceNumber();
        while ($row1 = mysqli_fetch_assoc($result1)) {
            $revenue_head_id = $row1["id"];
            $economic_code = $row1["COL_2"];
            $revenue_head = $row1["COL_4"];
            $mda = $row1["COL_3"];
            $category1 = $row1["COL_5"];
            $price = $row1["COL_6"];
            // Set the due date as a future date
            $due_date = date("Y-m-d", strtotime("+1 month"));
            // Insert the new invoice into the "invoice" table
            $sql2 = "INSERT INTO invoices (invoice_number, payer_id, revenue_head, due_date, payment_status) 
                    VALUES ('$invoice_number', '$tax_number', $revenue_head_id,'$due_date', 2)";

            $sender = "info@useibs.com";
            //    $contact = "me";
            //    $postmessage = "message";  
            $to = "$email";
            $subject = "Generate Invoice";
            // Email Template
            $message = "<html><body>
            <p>Dear $first_name<p>
            <p>You have successfully generated an invoice for $revenue_head. </p>
            <p>Your invoice number is $invoice_number  and this invoice expires on $due_date. </p>
            <p>Please click https://useibs.com/viewinvoice.html?load=true&invnumber=$invoice_number to make your payment.</p>
            <p>Yoursâ€™</p>
            <p>Akwa Ibom Inland Revenue Service</p>
            </body></html>
            ";
            //    $message .= "<b>Contact Number : </b>".$contact."<br>";
            //    $message .= "<b>Email Address : </b>".$email."<br>";
            //    $message .= "<b>Message : </b>".$postmessage."<br>";

            $header = "From:'$sender'";
            $header .= "MIME-Version: 1.0\r\n";
            $header .= "Content-type: text/html\r\n";
            $retval = mail($to, $subject, $message, $header);
            
          $destination = $phone;
            $msg = "
            Dear $first_name
            You have successfully generated an invoice for $revenue_head.
            Your invoice number is $invoice_number  and this invoice expires on $due_date.
            Please click https://useibs.com/viewinvoice.html?load=true&invnumber=$invoice_number to make your payment.
            Yours
            Akwa Ibom Inland Revenue Service
            ";

            sendSMS($destination, $msg);

            if (mysqli_query($ibsConnection, $sql2)) {
                $sql4 = "INSERT INTO applicable_taxes (payer_id, revenue_head_id, tax_number, revenue_head) 
                    VALUES ($payer_id, $revenue_head_id,'$tax_number', '$revenue_head')";
                mysqli_query($ibsConnection, $sql4);
                    
                $resp = ["status" => 1, "message" => "Invoice generated successfully", "invoice_number" => $invoice_number];
                 $user_category = "Payer User";
             $user_id = $tax_number;
             $comment = "Invoice generated successfully";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
            } else {
                $resp = ["status" => 1, "message" => "Error generating Invoice"];
                 $user_category = "Payer User";
             $user_id = $tax_number;
             $comment = "Error generating Invoice";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
            }
        }
        // Generate a unique invoice number
    }
    exit(json_encode($resp));
   

}

function fetchAllPayment()
{
    // print_r($data);
    exit(json_encode(check_db_query_staus1("SELECT * FROM payment_collection_report_individual INNER JOIN revenue_heads on payment_collection_report_individual.revenue_head=revenue_heads.id INNER JOIN payer_user on payment_collection_report_individual.user_id=payer_user.id", "CHK")));
}

function fetchPayment($data)
{
    // print_r($data);
    $value_to_update = "";

    foreach ($data as $key => $value) {

        if (($key != "fetchPayment") && ($key != "id")) {
            $value_to_update .= "`{$key}`='{$value}',";
        }
    }
    $value_to_update = rtrim($value_to_update, ",");
    exit(json_encode(check_db_query_staus1("SELECT * FROM payment_collection_report_individual INNER JOIN revenue_heads on payment_collection_report_individual.revenue_head=revenue_heads.id WHERE {$value_to_update}", "CHK")));
}

function verifyInvoice($data)
{
    include "config/index.php";
    //include "config/enctp.php";
    //print_r($data);
    $check_exist = check_db_query_staus("SELECT * FROM invoices WHERE invoice_number='{$data}'", "CHK");
    if ($check_exist['status'] == 1) {
                         $user_category = "Payer User";
             $user_id = $data;
             $comment = "Verification of Invoice";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
        exit(json_encode($check_exist));
    } else if ($check_exist['status'] == 0) {
             $user_category = "Payer User";
             $user_id = $data;
             $comment = "Error Verifiying Invoice";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
        exit(json_encode($check_exist));
    }
}

function userInvoices($data)
{
    include "config/index.php";
    //include "config/enctp.php";
    //print_r($data);
    $check_exist = check_db_query_staus1("SELECT invoices.payer_id, invoices.revenue_head,invoices.invoice_number, invoices.due_date, invoices.payment_status, invoices.date_created, revenue_heads.COL_3,revenue_heads.COL_4,revenue_heads.COL_6,payer_user.tax_number,payer_user.first_name,payer_user.surname,payer_user.address,payer_user.email,payer_user.phone FROM invoices JOIN payer_user ON invoices.payer_id = payer_user.tax_number JOIN revenue_heads ON invoices.revenue_head = revenue_heads.id WHERE invoices.payer_id = '{$data}'", "CHK");
    if ($check_exist['status'] == 1) {
        exit(json_encode($check_exist));
    } else if ($check_exist['status'] == 0) {
               $check_exist = check_db_query_staus1("SELECT invoices.payer_id, invoices.revenue_head,invoices.invoice_number, invoices.due_date, invoices.payment_status, invoices.date_created, revenue_heads.COL_3,revenue_heads.COL_4,revenue_heads.COL_6 FROM invoices JOIN revenue_heads ON invoices.revenue_head = revenue_heads.id WHERE invoices.payer_id='{$data}'", "CHK");
        if($check_exist['status'] == 1){
            foreach($check_exist['message'] as $key => $value){
                    $check_exist1 = check_db_query_staus1("SELECT tax_number, first_name, last_name AS surname, address, email, phone FROM enumerator_tax_payers WHERE tax_number='{$value['payer_id']}'", "CHK");  
                    if($check_exist1['status'] == 1){
                        $check_exist['message'][$key]['tax_number'] = $check_exist1['message'][0]['tax_number'];
                        $check_exist['message'][$key]['first_name'] = $check_exist1['message'][0]['first_name'];
                        $check_exist['message'][$key]['surname'] = $check_exist1['message'][0]['surname'];
                        $check_exist['message'][$key]['address'] = $check_exist1['message'][0]['address'];
                        $check_exist['message'][$key]['email'] = $check_exist1['message'][0]['email'];
                        $check_exist['message'][$key]['phone'] = $check_exist1['message'][0]['phone'];
                        
                    }
            }
        }else{
            
        }
        
        exit(json_encode($check_exist));     
    }
}
function getAllInvoice()
{
    //include "config/enctp.php";
    //print_r($data);
    $check_exist = check_db_query_staus1("SELECT invoices.payer_id, invoices.revenue_head,invoices.invoice_number, invoices.due_date, invoices.payment_status, invoices.date_created, revenue_heads.COL_3,revenue_heads.COL_4,revenue_heads.COL_6,payer_user.tax_number,payer_user.first_name,payer_user.surname,payer_user.address,payer_user.email,payer_user.phone FROM invoices JOIN payer_user ON invoices.payer_id = payer_user.tax_number JOIN revenue_heads ON invoices.revenue_head = revenue_heads.id", "CHK");
    if ($check_exist['status'] == 1) {
        exit(json_encode($check_exist));
    } else if ($check_exist['status'] == 0) {
        $check_exist = check_db_query_staus1("SELECT invoices.payer_id, invoices.revenue_head,invoices.invoice_number, invoices.due_date, invoices.payment_status, invoices.date_created, revenue_heads.COL_3,revenue_heads.COL_4,revenue_heads.COL_6 FROM invoices JOIN revenue_heads ON invoices.revenue_head = revenue_heads.id", "CHK");
        if($check_exist['status'] == 1){
            foreach($check_exist['message'] as $key => $value){
                    $check_exist1 = check_db_query_staus1("SELECT tax_number, first_name, last_name AS surname, address, email, phone FROM enumerator_tax_payers WHERE tax_number='{$value['payer_id']}'", "CHK");  
                    if($check_exist1['status'] == 1){
                        $check_exist['message'][$key]['tax_number'] = $check_exist1['message'][0]['tax_number'];
                        $check_exist['message'][$key]['first_name'] = $check_exist1['message'][0]['first_name'];
                        $check_exist['message'][$key]['surname'] = $check_exist1['message'][0]['surname'];
                        $check_exist['message'][$key]['address'] = $check_exist1['message'][0]['address'];
                        $check_exist['message'][$key]['email'] = $check_exist1['message'][0]['email'];
                        $check_exist['message'][$key]['phone'] = $check_exist1['message'][0]['phone'];
                        
                    }
            }
        }else{
            
        }
        
        exit(json_encode($check_exist));     
    }
}

function userInvoiceSingle($data)
{
    include "config/index.php";
    //include "config/enctp.php";
    //print_r($data);
    $check_exist = check_db_query_staus1("SELECT invoices.payer_id, invoices.revenue_head,invoices.invoice_number, invoices.due_date, invoices.payment_status, invoices.date_created, revenue_heads.COL_3,revenue_heads.COL_4,revenue_heads.COL_6,payer_user.tax_number,payer_user.first_name,payer_user.surname,payer_user.address,payer_user.email,payer_user.phone FROM invoices JOIN payer_user ON invoices.payer_id = payer_user.tax_number JOIN revenue_heads ON invoices.revenue_head = revenue_heads.id WHERE invoices.invoice_number='{$data}'", "CHK");
    if ($check_exist['status'] == 1) {
        exit(json_encode($check_exist));
    } else if ($check_exist['status'] == 0) {
        $check_exist = check_db_query_staus1("SELECT invoices.payer_id, invoices.revenue_head,invoices.invoice_number, invoices.due_date, invoices.payment_status, invoices.date_created, revenue_heads.COL_3,revenue_heads.COL_4,revenue_heads.COL_6 FROM invoices JOIN revenue_heads ON invoices.revenue_head = revenue_heads.id WHERE invoices.invoice_number='{$data}'", "CHK");
        if($check_exist['status'] == 1){
            foreach($check_exist['message'] as $key => $value){
                    $check_exist1 = check_db_query_staus1("SELECT tax_number, first_name, last_name AS surname, address, email, phone FROM enumerator_tax_payers WHERE tax_number='{$value['payer_id']}'", "CHK");  
                    if($check_exist1['status'] == 1){
                        $check_exist['message'][$key]['tax_number'] = $check_exist1['message'][0]['tax_number'];
                        $check_exist['message'][$key]['first_name'] = $check_exist1['message'][0]['first_name'];
                        $check_exist['message'][$key]['surname'] = $check_exist1['message'][0]['surname'];
                        $check_exist['message'][$key]['address'] = $check_exist1['message'][0]['address'];
                        $check_exist['message'][$key]['email'] = $check_exist1['message'][0]['email'];
                        $check_exist['message'][$key]['phone'] = $check_exist1['message'][0]['phone'];
                        
                    }
            }
        }else{
            
        }
        
        exit(json_encode($check_exist));     
    }
}

function updateProfile($data)
{
    // print_r($data);
    if (isset($data)) {
        include "config/index.php";
        //include "config/enctp.php";
        $id = $data->id;
        $subject = $data->subject;
        $name_of_organization = $data->name_of_organization;
        $username = $data->username;
        $email = $data->email;
        $contact = $data->contact;
        $tax_id_no = $data->tax_id_no;
        $state = $data->state;
        $employment_status = $data->employment_status;
        $business_type = $data->business_type;


        $query = "UPDATE `profileUpdate` SET `subject`='{$data->subject}', `name_of_organization`='{$data->name_of_organization}', `username`='{$data->username}', `email`='{$data->email}', `contact`='{$data->contact}', `tax_id_no`='{$data->tax_id_no}', `state`='{$data->state}', `l_g_a`='{$data->l_g_a}', `employment_status`='{$data->employment_status}', `business_type`='{$data->business_type}' WHERE `id` = {$data->id}";
        $User_re = mysqli_query($ibsConnection, $query) or die(mysqli_error($ibsConnection));
        if ($User_re) {
            $success_updating = ["status" => 1, "message" => "User Profile Successfully Updated"];
            
            exit(json_encode($success_updating));
        } else {
            $error_updating = ["Error" => "Invalid operation"];
            exit(json_encode($error_updating));
        }
    }
}

function sendSMS($destination, $msg)
{

    $apiKey = "5Img2CELv9EZRZCHrEKHN1N7aRl28e7l1ZxYA1WykaF7wozSxeiDbkOiO0qO"; // Your BulkSMS Nigeria API key

    $url = "https://www.bulksmsnigeria.com/api/v1/sms/create?api_token=" . $apiKey . "&from=AKW-IBS&to=" . $destination . "&body=" . urlencode($msg) . "&dnd=6";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1);

    $response = curl_exec($ch);
    curl_close($ch);

    // $result = json_decode($response);
    // echo $response;
    // if ($result->status == "success") {
    //     echo "SMS sent successfully!";
    // } else {
    //     echo "Error sending SMS: " . $result->message;
    // }
}


function dashboardAnalyticsEndUser($data)
{
    include "config/index.php";
    //include "config/enctp.php";
    //print_r($data);

    //DUE AMOUNT
    $c_date = date('Y-m-d');
    $check_exist = check_db_query_staus1("SELECT invoices.payer_id, invoices.revenue_head,invoices.invoice_number, invoices.due_date, invoices.payment_status,revenue_heads.COL_3,revenue_heads.COL_4,revenue_heads.COL_6,payer_user.tax_number,payer_user.first_name,payer_user.surname FROM invoices JOIN payer_user ON invoices.payer_id = payer_user.id JOIN revenue_heads ON invoices.revenue_head = revenue_heads.id WHERE invoices.payer_id='{$data}' AND invoices.due_date < '{$c_date}'", "CHK");
    $check_exist1 = check_db_query_staus1("SELECT SUM(revenue_heads.COL_6) as total FROM invoices JOIN payer_user ON invoices.payer_id = payer_user.id JOIN revenue_heads ON invoices.revenue_head = revenue_heads.id WHERE invoices.payer_id='{$data}'", "CHK");
    $check_exist2 = check_db_query_staus1("SELECT SUM(revenue_heads.COL_6) as total FROM invoices JOIN payer_user ON invoices.payer_id = payer_user.id JOIN revenue_heads ON invoices.revenue_head = revenue_heads.id WHERE invoices.payer_id='{$data}' AND invoices.payment_status='paid'", "CHK");

    $due_amount = (int)"";
    $due_invoices = (int)"";
    $total_amount_invoiced = (int)"";
    $total_amount_paid = (int)"";
    if ($check_exist['status'] == 1) {
        // $check_exist['message'];
        $due_invoices = count($check_exist['message']);
        foreach ($check_exist['message'] as $key => $value) {
            $due_amount += (int) $value['COL_6'];
        }
    } else if ($check_exist['status'] == 0) {
        $due_amount = 0;
        $due_invoices = 0;
    }
    if ($check_exist1['status'] == 1) {
        // $check_exist['message'];
        $total_amount_invoiced = (int)$check_exist1['message'][0]['total'];
    } else if ($check_exist['status'] == 0) {
        $total_amount_invoiced = 0;
        // $due_invoices = 0;
    }
    if ($check_exist2['status'] == 1) {
        // $check_exist['message'];
        $total_amount_paid = (int)$check_exist2['message'][0]['total'];
    } else if ($check_exist['status'] == 0) {
        $total_amount_paid = 0;
        // $due_invoices = 0;
    }

    $arr = ["due_amount" => $due_amount, "due_invoices" => $due_invoices, "total_amount_invoiced" => $total_amount_invoiced, "total_amount_paid" => $total_amount_paid];
    exit(json_encode($arr));

    //
}

function UpdateTINStatus($data)
{
    include "config/index.php";
    //include "config/enctp.php";

    $id = $_GET['id'];
    $status = $_GET['status'];
    $user_type = $_GET['userType'];
    if (!empty($data)) {

        if ($status == 1) {
            $status = 'Verified';
        } else {
            $status = 'Unverified';
        }
        //print_r($status); die;
        $query = "UPDATE `{$user_type}` SET `tin_status`='{$status}' WHERE `id` = {$id}";
        $User_re = mysqli_query($ibsConnection, $query) or die(mysqli_error($ibsConnection));
        if ($User_re) {
            $arr = ["status" => 1, "message" => "Tax payers tin status successfully updated"];
            $user_category = "Payer User";
             $user_id = $id;
             $comment = "tin status update";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
            exit(json_encode($arr));
        } else {
            $error_updating = ["Error" => "tin status update failed"];
            $user_category = "Payer User";
             $user_id = $id;
             $comment = "tin status update failed";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
            exit(json_encode($error_updating));
        }
    }
}

function updatePassword()
{
    include "config/index.php";
    //include "config/enctp.php";

    $id = $_GET['id'];
    $password = $_GET['password'];

    $query = "UPDATE `payer_user` SET `password`='{$password}' WHERE `id` = {$id}";
    $User_re = mysqli_query($ibsConnection, $query) or die(mysqli_error($ibsConnection));
    if ($User_re) {
        $arr = ["status" => 1, "message" => "Password successfully updated"];
         $user_category = "Payer User";
             $user_id = $id;
             $comment = "Password Update";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
        exit(json_encode($arr));
    } else {
        $error_updating = ["Error" => "Invalid operation"];
        $user_category = "Payer User";
             $user_id = $id;
             $comment = "Password Update failed";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
        exit(json_encode($error_updating));
    }
}

function mdaPassword()
{
    include "config/index.php";
    //include "config/enctp.php";

    $id = $_GET['id'];
    $password = $_GET['password'];
    $query = "UPDATE `mda` SET `password`='{$password}' WHERE `id` = {$id}";
    $User_re = mysqli_query($ibsConnection, $query) or die(mysqli_error($ibsConnection));
    if ($User_re) {
        $query1 = "UPDATE `mda_users` SET `password`='{$password}' WHERE `mda_id` = {$id}";
        $User_re = mysqli_query($ibsConnection, $query1) or die(mysqli_error($ibsConnection));
        $arr = ["status" => 1, "message" => "Password successfully updated"];
         $user_category = "Mda User";
             $user_id = $id;
             $comment = "Password Update";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
        exit(json_encode($arr));
    } else {
        $error_updating = ["Error" => "Password Update failed"];
         $user_category = "Payer User";
             $user_id = $id;
             $comment = "Password Update faled";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
        exit(json_encode($error_updating));
    }
}

function ParticularMDAUsers($data)
{
    //print_r($data);die;

    include "config/index.php";
    //include "config/enctp.php";
    //print_r($data);
    $check_exist = check_db_query_staus1("SELECT * FROM `mda_users` WHERE mda_id='{$data}'", "CHK");
    if ($check_exist['status'] == 1) {
        exit(json_encode($check_exist));
    } else if ($check_exist['status'] == 0) {
        exit(json_encode($check_exist));
    }
}

function createMDAUser($data)
{

    include "config/index.php";
    //include "config/enctp.php";
    $mda_id = $data->mda_id;
    $name = $data->name;
    $email = $data->email;
    $phone_number = $data->phone_number;
    $passwd = $data->passwd;
    $dashboard_access = $data->dashboard_access;
    $revenue_head_access = $data->revenue_head_access;
    $payment_access = $data->payment_access;
    $users_access = $data->users_access;
    $report_access = $data->report_access;
    $offices = $data->offices;


    $query_User_re = sprintf("INSERT INTO `mda_users`(`mda_id`, `name`, `email`, `phone_number`, `password`, `dashboard_access`, `revenue_head_access`, `payment_access`, `users_access`, `report_access`,`office_name`) 
    VALUES ('$mda_id', '$name', '$email', '$phone_number','$passwd','$dashboard_access','$revenue_head_access','$payment_access','$users_access','$report_access','$offices')");
    //print_r($query_User_re); die;
    $check_exist = check_db_query_staus("SELECT email FROM mda_users WHERE email = '{$email}'", "CHK");

    if ($check_exist['status'] == 1) {
        $returnResponse = ['status' => 2, 'message' => "MDA User exists already"];
        exit(json_encode($returnResponse));
    } else {
        $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));
        if ($User_re) {
            $amount = 1;
            check_db_query_staus("UPDATE `offices` SET `no_of_users`= no_of_users + {$amount} WHERE `office_name`='{$offices}'", "UPD");
            $returnResponse = ['status' => 1, 'message' => "MDA User added successfully"];
             $user_category = "Mda User";
             $user_id = $mda_id;
             $comment = "Creation of mda user";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
            exit(json_encode($returnResponse));
        } else {
            $returnResponse = ['status' => 0, 'message' => "MDA User not created, try again"];
            $user_category = "Mda User";
             $user_id = $mda_id;
             $comment = "Creation of mda user failed";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
            exit(json_encode($returnResponse));
        }
    }
}


function pendingPaymentList($data)
{
    // print_r($data); die;
    include "config/index.php";
    //include "config/enctp.php";
    $date_of_payment = $data->date_of_payment;
    $payer_id = $data->payer_id;
    $user_id = $data->user_id;
    $mda_id = $data->mda_id;
    $revenue_head = $data->revenue_head;
    $payment_amount = $data->payment_amount;
    $other_info = $data->other_info;
    $payment_status = $data->payment_status;
    $status = $data->status;


    $query_User_re = sprintf("INSERT INTO `pending_payment_list`(`date_of_payment`, `payer_id`, `user_id`, `mda_id`, `revenue_id`, `payment_amount`, `other_info`, `payment_status`, `status`) VALUES ('$date_of_payment', '$payer_id', '$user_id', '$mda_id', '$revenue_head', '$payment_amount','$other_info','$payment_status','$status')");
    //print_r($query_User_re); die;

    $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));
    if ($User_re) {
        $returnResponse = ['status' => 1, 'message' => "Pending Payment added successfully"];
        exit(json_encode($returnResponse));
    } else {
        $returnResponse = ['status' => 0, 'message' => "Transaction Failed, try again"];
        exit(json_encode($returnResponse));
    }
}

function updatePendingPayentStatus($data)
{
    // print_r($data);
    include "config/index.php";
    //include "config/enctp.php";

    if (!empty($data)) {
        $query = "UPDATE `pending_payment_list` SET `payment_status` = 'invoiced' WHERE `user_id` = {$data}";
        $User_re = mysqli_query($ibsConnection, $query) or die(mysqli_error($ibsConnection));
        if ($User_re) {
            $arr = ["status" => 1, "message" => "Pending Payent Status successfully updated to invoiced"];
            exit(json_encode($arr));
        } else {
            $error_updating = ["Error" => "Invalid operation"];
            exit(json_encode($error_updating));
        }
    }
}

function dashboardAnalyticsAdmin()
{
    include "config/index.php";
    //include "config/enctp.php";
    //print_r($data);

    //DUE AMOUNT
    $c_date = date('Y-m-d');
    $check_exist = check_db_query_staus1("SELECT invoices.payer_id, invoices.revenue_head,invoices.invoice_number, invoices.due_date, invoices.payment_status,revenue_heads.COL_3,revenue_heads.COL_4,revenue_heads.COL_6,payer_user.tax_number,payer_user.first_name,payer_user.surname FROM invoices JOIN payer_user ON invoices.payer_id = payer_user.id JOIN revenue_heads ON invoices.revenue_head = revenue_heads.id WHERE invoices.due_date < '{$c_date}'", "CHK");
    $check_exist1 = check_db_query_staus1("SELECT SUM(revenue_heads.COL_6) as total FROM invoices JOIN payer_user ON invoices.payer_id = payer_user.id JOIN revenue_heads ON invoices.revenue_head = revenue_heads.id", "CHK");
    $check_exist2 = check_db_query_staus1("SELECT SUM(revenue_heads.COL_6) as total FROM invoices JOIN payer_user ON invoices.payer_id = payer_user.id JOIN revenue_heads ON invoices.revenue_head = revenue_heads.id WHERE invoices.payment_status='paid'", "CHK");

    $due_amount = (int)"";
    $due_invoices = (int)"";
    $total_amount_invoiced = (int)"";
    $total_amount_paid = (int)"";
    if ($check_exist['status'] == 1) {
        // $check_exist['message'];
        $due_invoices = count($check_exist['message']);
        foreach ($check_exist['message'] as $key => $value) {
            $due_amount += (int) $value['COL_6'];
        }
    } else if ($check_exist['status'] == 0) {
        $due_amount = 0;
        $due_invoices = 0;
    }
    if ($check_exist1['status'] == 1) {
        // $check_exist['message'];
        $total_amount_invoiced = (int)$check_exist1['message'][0]['total'];
    } else if ($check_exist['status'] == 0) {
        $total_amount_invoiced = 0;
        // $due_invoices = 0;
    }
    if ($check_exist2['status'] == 1) {
        // $check_exist['message'];
        $total_amount_paid = (int)$check_exist2['message'][0]['total'];
    } else if ($check_exist['status'] == 0) {
        $total_amount_paid = 0;
        // $due_invoices = 0;
    }

    $arr = ["due_amount" => $due_amount, "due_invoices" => $due_invoices, "total_amount_invoiced" => $total_amount_invoiced, "total_amount_paid" => $total_amount_paid];
    exit(json_encode($arr));

    //
}

function getAdminUsers()
{
    include "config/index.php";
    //include "config/enctp.php";
    //print_r($data);
    $check_exist = check_db_query_staus1("SELECT `id`, `fullname`, `email`, `phone`, `dashboard_access`, `analytics_access`, `mda_access`, `reports_access`, `enumeration_access`, `audit_trail_access`, `role`, `tax_payer_access`, `users_access`, `cms_access`, `support`, `img`, `verification_status`,`time_in` FROM Administrative_users", "CHK");
    if ($check_exist['status'] == 1) {
        exit(json_encode($check_exist));
    } else if ($check_exist['status'] == 0) {
        exit(json_encode($check_exist));
    }
}

function updateAdminUser($data)
{
    // print_r($data);
    $value_to_update = "";
    $id = "";
    foreach ($data as $key => $value) {
        if ($key == "id") {
            $id = $value;
        }
        if (($key != "updateAdminUser") && ($key != "id")) {
            $value_to_update .= "`{$key}`='{$value}',";
        }
    }
    $value_to_update = rtrim($value_to_update, ",");
    exit(json_encode(check_db_query_staus("UPDATE `Administrative_users` SET {$value_to_update} WHERE `id`='{$id}'", "UPD")));
    $user_category = "Admin User";
             $user_id = $id;
             $comment = "Update Admin user";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
}

function deleteAdminUser($id)
{
    // print_r($data);
    exit(json_encode(check_db_query_staus("DELETE FROM `Administrative_users` WHERE `id`='{$id}'", "DEL")));
    $user_category = "Admin User";
             $user_id = $id;
             $comment = "Delete Admin user";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
}

function getMDACollectionPayments($data)
{
    include "config/index.php";
    //include "config/enctp.php";
    //print_r($data);
    $check_exist = check_db_query_staus1("SELECT pending_payment_list.payment_amount, pending_payment_list.other_info, pending_payment_list.payment_status, pending_payment_list.date_of_payment, mda_users.name, revenue_heads.COL_4 as revenue_name, revenue_heads.COL_6 as actual_amount FROM pending_payment_list JOIN mda_users ON pending_payment_list.user_id = mda_users.id JOIN revenue_heads ON pending_payment_list.revenue_id = revenue_heads.id WHERE pending_payment_list.mda_id='{$data}'", "CHK");
    if ($check_exist['status'] == 1) {
        exit(json_encode($check_exist));
    } else if ($check_exist['status'] == 0) {
        exit(json_encode($check_exist));
    }
}
function updateMDAUser($data)
{
    // print_r($data);
    $value_to_update = "";
    $id = "";
    foreach ($data as $key => $value) {
        if ($key == "id") {
            $id = $value;
        }
        if (($key != "updateMDAUser") && ($key != "id")) {
            $value_to_update .= "`{$key}`='{$value}',";
        }
    }
    $value_to_update = rtrim($value_to_update, ",");
    exit(json_encode(check_db_query_staus("UPDATE `mda_users` SET {$value_to_update} WHERE `id`='{$id}'", "UPD")));
    $user_category = "Mda User";
             $user_id = $id;
             $comment = "Update Mda user";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
}

function updateMDAUsers($data)
{
    // print_r($data);
    $value_to_update = "";
    $id = "";
    foreach ($data as $key => $value) {
        if ($key == "id") {
            $id = $value;
        }
        if (($key != "updateMDAUser") && ($key != "id")) {
            $value_to_update .= "`{$key}`='{$value}',";
        }
    }
    $value_to_update = rtrim($value_to_update, ",");
    exit(json_encode(check_db_query_staus("UPDATE `mda_users` SET {$value_to_update} WHERE `id`='{$id}'", "UPD")));
    $user_category = "Mda User";
             $user_id = $id;
             $comment = "Update Mda users";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
}
function deleteMDAUser($id)
{
    // print_r($data);
    exit(json_encode(check_db_query_staus("DELETE FROM `mda_users` WHERE `id`='{$id}'", "DEL")));
    $user_category = "Mda User";
             $user_id = $id;
             $comment = "Delete Mda user";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
}

function verifyEmail($id)
{


    include "config/index.php";
    //include "config/enctp.php";
    //print_r($data);
    $query_User_re = sprintf("SELECT * FROM `payer_user` WHERE `id` = {$id}");
    $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));
    $row_User_re = mysqli_fetch_assoc($User_re);
    $totalRows_User_re = mysqli_num_rows($User_re);
    if ($totalRows_User_re > 0) {
        $email = $row_User_re['email'];
        $name = $row_User_re['first_name'];
        $verification = $row_User_re['verification_status'];
        $id = $row_User_re['id'];

        $sender = "info@useibs.com";
        //    $contact = "me";
        //    $postmessage = "message";  
        $to = "$email";
        $subject = "Account Verification";
        // Email Template
        $message = "Hi $name! Click on the link to verify your Account https://useibs.com/emailverification.html?id=$id&verification=$verification";
        //    $message .= "<b>Contact Number : </b>".$contact."<br>";
        //    $message .= "<b>Email Address : </b>".$email."<br>";
        //    $message .= "<b>Message : </b>".$postmessage."<br>";

        $header = "From:'$sender'";
        $header .= "MIME-Version: 1.0\r\n";
        $header .= "Content-type: text/html\r\n";
        $retval = mail($to, $subject, $message, $header);
        $arr = ['status' => 1, 'message' => 'Message sent  Successfully Ã°Å¸ËœÅ½'];
        $user_category = "Payer User";
             $user_id = $id;
             $comment = "Payer user Email verification";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
        exit(json_encode($arr));
    } else {
        $arr = ['status' => 0, 'message' => 'Message Not sent',];
        $user_category = "Payer User";
             $user_id = $id;
             $comment = "Payer user Email verification failed";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
        exit(json_encode($arr));
    }
}

function verifyEmailEnum($id)
{


    include "config/index.php";
    //include "config/enctp.php";
    //print_r($data);
    $query_User_re = sprintf("SELECT * FROM `enumerator_tax_payers` WHERE `id` = {$id}");
    $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));
    $row_User_re = mysqli_fetch_assoc($User_re);
    $totalRows_User_re = mysqli_num_rows($User_re);
    if ($totalRows_User_re > 0) {
        $email = $row_User_re['email'];
        $name = $row_User_re['first_name'];
        $verification = $row_User_re['verification'];
        $id = $row_User_re['id'];
        $password = $row_User_re['password'];

        $sender = "info@useibs.com";
        //    $contact = "me";
        //    $postmessage = "message";  
        $to = "$email";
        $subject = "Account Verification";
        // Email Template
        $message = "Hi $name! Click on the link to verify your Account https://useibs.com/emailverification2.html?id=$id&verification=$verification <br />
        Email: $email; <br />
        Password: $password";
        //    $message .= "<b>Contact Number : </b>".$contact."<br>";
        //    $message .= "<b>Email Address : </b>".$email."<br>";
        //    $message .= "<b>Message : </b>".$postmessage."<br>";

        $header = "From:'$sender'";
        $header .= "MIME-Version: 1.0\r\n";
        $header .= "Content-type: text/html\r\n";
        $retval = mail($to, $subject, $message, $header);
        $arr = ['status' => 1, 'message' => 'Message sent  Successfully Ã°Å¸ËœÅ½'];
        $user_category = "Enum User";
             $user_id = $id;
             $comment = "Enum user Email verification";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
        exit(json_encode($arr));
    } else {
        $arr = ['status' => 0, 'message' => 'Message Not sent',];
        $user_category = "Enum User";
             $user_id = $id;
             $comment = "Enum user Email verification failed";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
        exit(json_encode($arr));
    }
}

function UpdateAccountStatus($data)
{
    include "config/index.php";
    //include "config/enctp.php";

    $id = $_GET['id'];
    $status = 1;
    $verification = $_GET['verification'];
    $query = "UPDATE `payer_user` SET `verification_status`='{$status}' WHERE `id` = {$id} AND `verification_status`='{$verification}'";
    $User_re = mysqli_query($ibsConnection, $query) or die(mysqli_error($ibsConnection));
    if ($User_re) {
        $arr = ["status" => 1, "message" => "Account Activated successfully"];
        $user_category = "Payer User";
             $user_id = $id;
             $comment = "Payer User Account status update";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
        exit(json_encode($arr));
    } else {
        $error_updating = ["Error" => "Failed to Activate Account"];
        $user_category = "Payer User";
             $user_id = $id;
             $comment = "Payer user Account status update failed";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
        exit(json_encode($error_updating));
    }
}

function UpdateAccountStatusEnum($data)
{
    include "config/index.php";
    //include "config/enctp.php";

    $id = $_GET['id'];
    $status = 1;
    $verification = $_GET['verification'];
    $query = "UPDATE `enumerator_tax_payers` SET `verification`='{$status}' WHERE `id` = {$id} AND `verification`='{$verification}'";
    $User_re = mysqli_query($ibsConnection, $query) or die(mysqli_error($ibsConnection));
    if ($User_re) {
        $arr = ["status" => 1, "message" => "Account Activated successfully"];
        $user_category = "Enum User";
             $user_id = $id;
             $comment = "Enum User Account status update";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
        exit(json_encode($arr));
    } else {
        $error_updating = ["Error" => "Failed to Activate Account"];
         $user_category = "Enum User";
             $user_id = $id;
             $comment = "Enum User Account status update failed";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
        exit(json_encode($error_updating));
    }
}

function verifySms($data)
{
    include "config/index.php";
    //include "config/enctp.php";
    //print_r($data);
    $id = $_GET['id'];
    $numbere = $_GET["num"];
    $query_User_re = sprintf("SELECT * FROM `payer_user` WHERE `id` = {$id}");
    $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));
    $row_User_re = mysqli_fetch_assoc($User_re);
    $totalRows_User_re = mysqli_num_rows($User_re);
    if ($totalRows_User_re > 0) {
        $message = $row_User_re['verification_code'];
        $destination = $row_User_re['phone'];
        $apiKey = "5Img2CELv9EZRZCHrEKHN1N7aRl28e7l1ZxYA1WykaF7wozSxeiDbkOiO0qO"; // Your BulkSMS Nigeria API key

        $url = "https://www.bulksmsnigeria.com/api/v1/sms/create?api_token=" . $apiKey . "&from=AKW-IBS&to=" . $destination . "&body=" . urlencode($message) . "&dnd=" . $numbere;

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POST, 1);

        $response = curl_exec($ch);
        curl_close($ch);

        $arr = ['status' => 1, 'message' => 'Message sent Successfully ðŸ˜Ž', "response" => $response];
         $user_category = "Payer User";
             $user_id = $id;
             $comment = "Payer User Verification SMS";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
        exit(json_encode($arr));
    } else {
        $arr = ['status' => 0, 'message' => 'Message Not sent',];
         $user_category = "Payer User";
             $user_id = $id;
             $comment = "Payer User Verification SMS failed";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
        exit(json_encode($arr));
    }
}

function verifySmsEnum($data)
{
    include "config/index.php";
    //include "config/enctp.php";
    //print_r($data);
    $id = $_GET['id'];
    $numbere = $_GET["num"];
    $query_User_re = sprintf("SELECT * FROM `enumerator_tax_payers` WHERE `id` = {$id}");
    $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));
    $row_User_re = mysqli_fetch_assoc($User_re);
    $totalRows_User_re = mysqli_num_rows($User_re);
    if ($totalRows_User_re > 0) {
        $message = $row_User_re['verification_code'];
        $destination = $row_User_re['phone'];
        $apiKey = "5Img2CELv9EZRZCHrEKHN1N7aRl28e7l1ZxYA1WykaF7wozSxeiDbkOiO0qO"; // Your BulkSMS Nigeria API key

        $url = "https://www.bulksmsnigeria.com/api/v1/sms/create?api_token=" . $apiKey . "&from=AKW-IBS&to=" . $destination . "&body=" . urlencode($message) . "&dnd=" . $numbere;

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POST, 1);

        $response = curl_exec($ch);
        curl_close($ch);

        $arr = ['status' => 1, 'message' => 'Message sent Successfully ðŸ˜Ž', "response" => $response];
         $user_category = "Enum User";
             $user_id = $id;
             $comment = "Enum User Verification SMS";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
        exit(json_encode($arr));
    } else {
        $arr = ['status' => 0, 'message' => 'Message Not sent',];
         $user_category = "Enum User";
             $user_id = $id;
             $comment = "Enum User Verification SMS failed";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
        exit(json_encode($arr));
    }
}

function UpdateAccountStatusSms($data)
{
    include "config/index.php";
    //include "config/enctp.php";

    $id = $_GET['id'];
    $status = 1;
    $verification = $_GET['code'];
    $query_User_re = sprintf("SELECT verification_code FROM `payer_user` WHERE `verification_code`='{$verification}'");
    $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));
    $row_User_re = mysqli_fetch_assoc($User_re);
    $totalRows_User_re = mysqli_num_rows($User_re);
    if ($totalRows_User_re > 0) {
        $query = "UPDATE `payer_user` SET `verification_status`='{$status}' WHERE `verification_code`='{$verification}'";
        $User_re = mysqli_query($ibsConnection, $query) or die(mysqli_error($ibsConnection));
        if ($User_re) {
            $arr = ["status" => 1, "message" => "Account Activated successfully"];
            
            exit(json_encode($arr));
        } else {
            $error_updating = ["Error" => "Failed to Activate Account"];
            exit(json_encode($error_updating));
        }
    } else {
        $arr = ['status' => 0, 'message' => 'Invalid code',];
        exit(json_encode($arr));
    }
}

function UpdateAccountStatusSmsEnum($data)
{
    include "config/index.php";
    //include "config/enctp.php";

    $id = $_GET['id'];
    $status = 1;
    $verification = $_GET['code'];
    $query_User_re = sprintf("SELECT verification_code FROM `enumerator_tax_payers` WHERE `verification_code`='{$verification}'");
    $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));
    $row_User_re = mysqli_fetch_assoc($User_re);
    $totalRows_User_re = mysqli_num_rows($User_re);
    if ($totalRows_User_re > 0) {
        $query = "UPDATE `payer_user` SET `verification`='{$status}' WHERE `verification_code`='{$verification}'";
        $User_re = mysqli_query($ibsConnection, $query) or die(mysqli_error($ibsConnection));
        if ($User_re) {
            $arr = ["status" => 1, "message" => "Account Activated successfully"];
            exit(json_encode($arr));
        } else {
            $error_updating = ["Error" => "Failed to Activate Account"];
            exit(json_encode($error_updating));
        }
    } else {
        $arr = ['status' => 0, 'message' => 'Invalid code',];
        exit(json_encode($arr));
    }
}

function getMDAsCount()
{
    $pull_data = check_db_query_staus1("SELECT COUNT(*) FROM mda", "CHK");
    exit(json_encode($pull_data));
}
function getRevenueCount()
{
    $pull_data = check_db_query_staus1("SELECT COUNT(*) FROM revenue_heads", "CHK");
    exit(json_encode($pull_data));
}

function updateProfillePix($data)
{
    $id = $data->id;
    $img = $data->img;
    exit(json_encode(check_db_query_staus("UPDATE `payer_user` SET `img`='{$img}' WHERE `id`='{$id}'", "UPD")));
}
function updateProfillePixAdmin($data)
{
    $id = $data->id;
    $img = $data->img;
    exit(json_encode(check_db_query_staus("UPDATE `Administrative_users` SET `img`='{$img}' WHERE `id`='{$id}'", "UPD")));
}

function verifyAdminUser($data)
{
    include "config/index.php";
    //include "config/enctp.php";

    $id = $_GET['id'];
    $status = 1;
    $verification = $_GET['code'];
    $passwd = $_GET['password'];
    $query_User_re = sprintf("SELECT verification_status FROM Administrative_users WHERE `verification_status`='{$verification}' AND `id`='{$id}'");
    $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));
    $row_User_re = mysqli_fetch_assoc($User_re);
    $totalRows_User_re = mysqli_num_rows($User_re);
    if ($totalRows_User_re > 0) {
        $query = "UPDATE `Administrative_users` SET `verification_status`='{$status}', `password`= '{$passwd}' WHERE `verification_status`='{$verification}'";
        $User_re = mysqli_query($ibsConnection, $query) or die(mysqli_error($ibsConnection));
        if ($User_re) {
            $arr = ["status" => 1, "message" => "Account Activated successfully"];
             $user_category = "Admin User";
             $user_id = $id;
             $comment = "Admin User Verification";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
            exit(json_encode($arr));
        } else {
            $error_updating = ["Error" => "Failed to Activate Account"];
               $user_category = "Admin User";
             $user_id = $id;
             $comment = "Admin User Verification Failed";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
            exit(json_encode($error_updating));
        }
    } else {
        $arr = ['status' => 0, 'message' => 'Invalid code',];
        exit(json_encode($arr));
    }
}

function sendContactEmail($data)
{
    $name = $data['name'];
    $email = $data['email'];
    $subject = $data['subject'];
    $message = $data['message'];

    $sender = "$email";
    //    $contact = "me";
    //    $postmessage = "message";  
    $to = "info@useibs.com";
    $subject = "$subject";

    $message = "$message";


    $header = "From:'$sender'";
    $header .= "MIME-Version: 1.0\r\n";
    $header .= "Content-type: text/html\r\n";
    $retval = mail($to, $subject, $message, $header);

    if ($retval == true) {
        $arr = ['status' => 1, 'message' => 'Message sent Successfully Ã°Å¸ËœÅ½'];
        exit(json_encode($arr));
    } else {
        $arr = ['status' => 0, 'message' => 'Message not Sent'];
        exit(json_encode($arr));
    }
}

function createMultipleMDAs($data)
{
    include "config/index.php";
    //include "config/enctp.php";


    $sql = sprintf("INSERT INTO `mda` (`fullname`, `industry`, `state`, `geolocation`, `lga`, `email`, `phone`, `status`, `password`, `address`,`total_gen_revenue`,`allow_payment`,`office_creation`) VALUES ");
    foreach ($data as $g) {
        $alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        $pass = array();
        $alphaLength = strlen($alphabet) - 1;
        for ($i = 0; $i < 10; $i++) {
            $n = rand(0, $alphaLength);
            $pass[] = $alphabet[$n];
        }
        $password = implode($pass);
        $total_gen_revenue = 0;
        $status = 'active';
        if($g->allow_payment)
        
        if ($sql != '');
        if($g->allow_payment == 1){
            $g->allow_payment = 'yes';
        }else{
             $g->allow_payment = 'no';
        };
        if($g->office_creation == 1){
            $g->office_creation = 'yes';
        }else{
             $g->office_creation = 'no';
        };
        $sql .= "('" . $g->fullname . "', '" . $g->industry . "', '" . $g->state . "', '" . $g->geolocation . "', '" . $g->lga . "', '" . $g->email . "', '" . $g->phone . "', '" . $status . "', '" . $password . "', '" . $g->address . "', '" . $total_gen_revenue . "', '" . $g->allow_payment . "', '" . $g->office_creation . "')";
        $sql .= ',';
    }
    $sql = rtrim($sql, ",");
    $User_re = mysqli_query($ibsConnection, $sql) or die(mysqli_error($ibsConnection));
    if ($User_re) {
        $returnResponse = ['status' => 1, 'message' => "MDA created successfully", 'pass' => $password];
        exit(json_encode($returnResponse));
    } else {
        $returnResponse = ['status' => 0, 'message' => "MDA not created, try again"];
        exit(json_encode($returnResponse));
    }
}


function createMultpleMDARevenueHeads($data)
{
    include "config/index.php";
    //include "config/enctp.php";
    // print_r($data);
    $sql = sprintf("INSERT INTO `revenue_heads`(`COL_1`, `COL_2`, `COL_3`, `COL_4`, `COL_5`, `COL_6`,`total_gen_revenue`, `status`, `frequency`, `due_date`) VALUES ");
    foreach ($data as $g) {
        $economicCode = "045RF";
        $adminCode = "22";
        $total_gen_revenue = 0;
        $status = "pending";
        $due_date = "";
        if ($sql != '');
        $sql .= "('" . $adminCode . "', '" . $economicCode . "', '" . $g->mda_id . "', '" . $g->fullname . "', '" . $g->category . "', '" . $g->amount . "', '" . $total_gen_revenue . "', '" . $status . "', '" . $g->frequency . "', '" . $due_date . "')";
        $sql .= ',';
    }
    $sql = rtrim($sql, ",");
    // print_r($sql);

    $User_re = mysqli_query($ibsConnection, $sql) or die(mysqli_error($ibsConnection));
    if ($User_re) {
        $returnResponse = ['status' => 1, 'message' => "revenue heads added successfully"];
        exit(json_encode($returnResponse));
    } else {
        $returnResponse = ['status' => 0, 'message' => "revenue heads not created, try again"];
        exit(json_encode($returnResponse));
    }
}
function createBanners($data)
{
    include "config/index.php";
    //include "config/enctp.php";
    // print_r($data);
    $image = $data->image;
    $body = $data->body;
    $description = $data->description;
    $description_2 = $data->description_2;

    $query_User_re = sprintf("INSERT INTO `banner`(`image`, `body`, `description`, `description_2`) VALUES('$image', '$body', '$description', '$description_2')");
    // print_r($query_User_re); die;
    $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));

    if ($User_re) {
        $returnResponse = ['status' => 1, 'message' => "Banner Created successfully"];
           $user_category = "Admin User";
             $user_id = "";
             $comment = "Admin User Banner creation";
             $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
        exit(json_encode($returnResponse));
    } else {
        $returnResponse = ['status' => 0, 'message' => "failed, try again"];
         $user_category = "Admin User";
             $user_id = "";
             $comment = "Admin User Banner creation failed";
           $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
        exit(json_encode($returnResponse));
    }
}

function updateBanners($data)
{
    include "config/index.php";
    //include "config/enctp.php";
    // print_r($data);
    $id = $data->id;
    $image = $data->image;
    $body = $data->body;
    $description = $data->description;
    $description_2 = $data->description_2;

    $query_User_re = sprintf("UPDATE `banner` SET `image`='$image',`body`='$body',`description`='$description',`description_2`='$description_2'  WHERE `id`='{$id}'");
    // print_r($query_User_re); die;
    $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));

    if ($User_re) {
        $returnResponse = ['status' => 1, 'message' => "Banner Updated successfully"];
        exit(json_encode($returnResponse));
    } else {
        $returnResponse = ['status' => 0, 'message' => "failed, try again"];
        exit(json_encode($returnResponse));
    }
}

function getBanners()
{
    include "config/index.php";
    //include "config/enctp.php";
    //print_r($data);
    $check_exist = check_db_query_staus1("SELECT * FROM banner", "CHK");
    if ($check_exist['status'] == 1) {
        exit(json_encode($check_exist));
    } else if ($check_exist['status'] == 0) {
        exit(json_encode($check_exist));
    }
}

function deleteBanner($data)
{
    // print_r($data); die;
    exit(json_encode(check_db_query_staus("DELETE FROM `banner` WHERE `id`='{$data}'", "DEL")));
}

function insertContactUs($data)
{
    include "config/index.php";
    //include "config/enctp.php";
    // print_r($data);
    $address = $data->address;
    $email = $data->email;
    $phone_number = $data->phone_number;

    $query_User_re = sprintf("INSERT INTO `contact_us`(`address`, `email`, `phone_number`) VALUES('$address', '$email', '$phone_number')");
    // print_r($query_User_re); die;
    $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));

    if ($User_re) {
        $returnResponse = ['status' => 1, 'message' => "Contact us Send successfully"];
        exit(json_encode($returnResponse));
    } else {
        $returnResponse = ['status' => 0, 'message' => "failed, try again"];
        exit(json_encode($returnResponse));
    }
}


function getContactUs()
{
    include "config/index.php";
    //include "config/enctp.php";
    //print_r($data);
    $check_exist = check_db_query_staus1("SELECT * FROM contact_us ORDER BY id DESC", "CHK");
    if ($check_exist['status'] == 1) {
        exit(json_encode($check_exist));
    } else if ($check_exist['status'] == 0) {
        exit(json_encode($check_exist));
    }
}

function updateContactUs($data)
{
    include "config/index.php";
    //include "config/enctp.php";
    // print_r($data);
    $id = $data->id;
    $address = $data->address;
    $email = $data->email;
    $phone_number = $data->phone_number;


    $query_User_re = sprintf("UPDATE `contact_us` SET `address`='$address',`email`='$email',`phone_number`='$phone_number' WHERE `id`='{$id}'");
    // print_r($query_User_re); die;
    $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));

    if ($User_re) {
        $returnResponse = ['status' => 1, 'message' => "Contact Updated successfully"];
        exit(json_encode($returnResponse));
    } else {
        $returnResponse = ['status' => 0, 'message' => "failed, try again"];
        exit(json_encode($returnResponse));
    }
}


function insertOurServices($data)
{
    include "config/index.php";
    //include "config/enctp.php";
    // print_r($data);
    $header = $data->header;
    $body = $data->body;
    $icon = $data->icon;


    $query_User_re = sprintf("INSERT INTO `our_services`(`header`, `body`, `icon`) VALUES ('$header', '$body','$icon')");
    // print_r($query_User_re); die;
    $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));

    if ($User_re) {
        $returnResponse = ['status' => 1, 'message' => "Our Services Created successfully"];
        exit(json_encode($returnResponse));
    } else {
        $returnResponse = ['status' => 0, 'message' => "failed, try again"];
        exit(json_encode($returnResponse));
    }
}
function updateOurServices($data)
{
    include "config/index.php";
    //include "config/enctp.php";
    // print_r($data);
    $id = $data->id;
    $header = $data->header;
    $body = $data->body;
    $icon = $data->icon;


    $query_User_re = sprintf("UPDATE `our_services` SET `header`='$header',`body`='$body',`icon`='$icon' WHERE `id`='{$id}'");
    // print_r($query_User_re); die;
    $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));

    if ($User_re) {
        $returnResponse = ['status' => 1, 'message' => "Our Services Updated successfully"];
        exit(json_encode($returnResponse));
    } else {
        $returnResponse = ['status' => 0, 'message' => "failed, try again"];
        exit(json_encode($returnResponse));
    }
}

function getOurServices()
{
    include "config/index.php";
    //include "config/enctp.php";
    //print_r($data);
    $check_exist = check_db_query_staus1("SELECT * FROM our_services ORDER BY id ASC", "CHK");
    if ($check_exist['status'] == 1) {
        exit(json_encode($check_exist));
    } else if ($check_exist['status'] == 0) {
        exit(json_encode($check_exist));
    }
}

function deleteOurServices($data)
{
    // print_r($data); die;
    exit(json_encode(check_db_query_staus("DELETE FROM `our_services` WHERE `id`='{$data}'", "DEL")));
}

function getTaxClearanceCert()
{
    include "config/index.php";
    //include "config/enctp.php";
    // print_r($data);
    $check_exist = check_db_query_staus1("SELECT * FROM primary_tax_clearance_certificate INNER JOIN secondary_tax_clearance_certificate on primary_tax_clearance_certificate.id = secondary_tax_clearance_certificate.primary_tax_clearance_certificate_id", "CHK");
    if ($check_exist['status'] == 1) {
        exit(json_encode($check_exist));
    } else if ($check_exist['status'] == 0) {
        exit(json_encode($check_exist));
    }
}

function createTaxClearanceCert($data)
{
    include "config/index.php";
    //include "config/enctp.php";
    // print_r($data);
    $user_id = $data->user_id;
    $category = $data->category;
    $title = $data->title;
    $first_name = $data->first_name;
    $surname = $data->surname;
    $middle_name = $data->middle_name;
    $date_of_birth = $data->date_of_birth;
    $gender = $data->gender;
    $merital_status = $data->merital_status;
    $tin = $data->tin;
    $bvn = $data->bvn;
    $state = $data->state;
    $local_area = $data->local_area;
    $ward = $data->ward;
    $city = $data->city;
    $street_name = $data->street_name;
    $house_no = $data->house_no;
    $national_id_no = $data->national_id_no;
    $phone = $data->phone;
    $natioality = $data->natioality;
    $tax_station_name = $data->tax_station_name;
    $employment_type = $data->employment_type;
    $occupation = $data->occupation;
    $profession = $data->profession;
    $mother_maiden_name = $data->mother_maiden_name;
    $first_year = $data->first_year;
    $first_income = $data->first_income;
    $second_year = $data->second_year;
    $second_income = $data->second_income;
    $third_year = $data->third_year;
    $third_income = $data->third_income;
    $tax_paid = $data->tax_paid;
    $cop_rep_authorization = $data->cop_rep_authorization;
    $head_tax_station_authorization = $data->head_tax_station_authorization;
    // $reference_number =  (time() + rand(1, 1000));
    $application_status = "pending";
    $admin_status = 'active';


    // Random reference number
    $alphabet = "IBS";
    $randomNumber2 = rand(1000, 9999);
    $randomNumber =  date('dmY');
    $reference_number = $alphabet . "|" . $randomNumber . "|" . $randomNumber2;
    // print_r($reference_number);die;


    $emai_address = $data->emai_address;
    $state_of_origin = $data->state_of_origin;
    $company_name = $data->company_name;
    $company_branch = $data->company_branch;
    $company_address = $data->company_address;
    $web_address = $data->web_address;
    $official_position = $data->official_position;
    $international_passport_no = $data->international_passport_no;
    $alien_negistration_no = $data->alien_negistration_no;
    $sponsor_name = $data->sponsor_name;
    $sponsor_occupation = $data->sponsor_occupation;
    $sponsor_business = $data->sponsor_business;
    $employment_from_1 = $data->employment_from_1;
    $employment_to_1 = $data->employment_to_1;
    $employment_from_2 = $data->employment_from_2;
    $employment_to_2 = $data->employment_to_2;
    $employment_from_3 = $data->employment_from_3;
    $employment_to_3 = $data->employment_to_3;
    $signature_1 = $data->signature_1;
    $date_1 = $data->date_1;
    $signature_2 = $data->signature_2;
    $date_2 = $data->date_2;

    $query_User_re = sprintf("INSERT INTO `primary_tax_clearance_certificate`(`user_id`, `category`, `title`, `first_name`, `surname`, `middle_name`, `date_of_birth`, `gender`, `merital_status`, `tin`, `bvn`, `state`, `local_area`, `ward`, `city`, `street_name`, `house_no`, `national_id_no`, `phone`, `natioality`, `tax_station_name`, `employment_type`, `occupation`, `profession`, `mother_maiden_name`, `first_year`, `first_income`, `second_year`, `second_income`, `third_year`, `third_income`, `tax_paid`, `cop_rep_authorization`, `head_tax_station_authorization`, `reference_number`, `application_status`, `admin_status`) VALUES ('$user_id', '$category','$title', '$first_name', '$surname', '$middle_name', '$date_of_birth', '$gender', '$merital_status', '$tin', '$bvn', '$state', '$local_area', '$ward', '$city', '$street_name', '$house_no', '$national_id_no', '$phone', '$natioality', '$tax_station_name', '$employment_type', '$occupation', '$profession', '$mother_maiden_name', '$first_year', '$first_income', '$second_year', '$second_income', '$third_year', '$third_income', '$tax_paid', '$cop_rep_authorization', '$head_tax_station_authorization', '$reference_number', '$application_status', '$admin_status')");
    // print_r($query_User_re); die;

    $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));

    if ($User_re) {
        $primary_tax_clearance_certificate_id = $ibsConnection->insert_id;


        $query_User_re2 = sprintf("INSERT INTO `secondary_tax_clearance_certificate`(`primary_tax_clearance_certificate_id`, `emai_address`, `state_of_origin`, `company_name`, `company_branch`, `company_address`, `web_address`, `official_position`, `international_passport_no`, `alien_negistration_no`, `sponsor_name`, `sponsor_occupation`, `sponsor_business`, `employment_from_1`, `employment_to_1`, `employment_from_2`, `employment_to_2`, `employment_from_3`, `employment_to_3`, `audit_report`, `evidence_of_payment`, `signature`, `passport`) VALUES ('$primary_tax_clearance_certificate_id', '$emai_address', '$state_of_origin', '$company_name', '$company_branch', '$company_address', '$web_address', '$official_position', '$international_passport_no', '$alien_negistration_no', '$sponsor_name', '$sponsor_occupation', '$sponsor_business', '$employment_from_1', '$employment_to_1', '$employment_from_2', '$employment_to_2', '$employment_from_3', '$employment_to_3', '$signature_1', '$date_1', '$signature_2', '$date_2')");
        // print_r($query_User_re2); die;

        $User_re2 = mysqli_query($ibsConnection, $query_User_re2) or die(mysqli_error($ibsConnection));

        if ($User_re2) {
            $check_exist = check_db_query_staus("SELECT reference_number FROM primary_tax_clearance_certificate  WHERE `user_id`='{$user_id}'", "CHK");

            $arr = [];


            $arr[] = ['status' => 1, 'message' => "Tax Clearance Certificate Created successfully"];

            $arr[] = $check_exist['message'];
             $user_category = "Admin User";
             $user_id = $user_id;
             $comment = "Tax Clearance Certificate Created";
           $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);

            exit(json_encode($arr));
        } else {
            $returnResponse = ['status' => 0, 'message' => "Secondary Tax Clearance Certificate failed, try again"];
            $user_category = "Admin User";
             $user_id = $user_id;
             $comment = "Tax Clearance Certificate Creation Failed";
           $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
            exit(json_encode($returnResponse));
        }
    } else {
        $returnResponse = ['status' => 0, 'message' => "Primary Tax Clearance Certificate failed, try again"];
        exit(json_encode($returnResponse));
    }
}
function getTINRequest($data)
{
    include "config/index.php";
    //include "config/enctp.php";
    // print_r($data);
    $check_exist = check_db_query_staus1("SELECT * FROM primary_TIN_request  WHERE `user_id`='{$data}'", "CHK");
    if ($check_exist['status'] == 1) {
        exit(json_encode($check_exist));
    } else if ($check_exist['status'] == 0) {
        exit(json_encode($check_exist));
    }
}

function createTINRequest($data)
{
    include "config/index.php";
    //include "config/enctp.php";
    // print_r($data);
    $user_id = $data->user_id;
    $title = $data->title;
    $first_name = $data->first_name;
    $surname = $data->surname;
    $middle_name = $data->middle_name;
    $natioality = $data->natioality;
    $phone_number_1 = $data->phone_number_1;
    $phone_number_2 = $data->phone_number_2;
    $state_of_origin = $data->state_of_origin;
    $marital_status = $data->marital_status;
    $birthday = $data->birthday;
    $occupation = $data->occupation;
    $gender = $data->gender;
    $email = $data->email;
    $mother_maiden_name = $data->mother_maiden_name;
    $mother_name = $data->mother_name;
    $id_card = $data->id_card;
    $id_number = $data->id_number;
    $date_issue = $data->date_issue;
    $expiring_date = $data->expiring_date;
    $place_of_issue = $data->place_of_issue;
    $id_issuing_authority = $data->id_issuing_authority;
    $last_assessment_date = $data->last_assessment_date;
    $last_assessment_amount = $data->last_assessment_amount;
    $last_payment_date = $data->last_payment_date;
    $last_payment_amount = $data->last_payment_amount;
    $tax_type = $data->tax_type;
    $first_year = $data->first_year;
    $first_income = $data->first_income;
    $second_year = $data->second_year;
    $second_income = $data->second_income;
    $third_year = $data->third_year;
    $third_income = $data->third_income;

    $application_status = "pending";
    $admin_status = 'active';


    // Random reference number
    $alphabet = "IBS";
    $randomNumber2 = rand(1000, 9999);
    $randomNumber =  date('dmY');
    $reference_number = $alphabet . "|" . $randomNumber . "|" . $randomNumber2;
    // print_r($reference_number);die;


    $name = $data->name;
    $tin = $data->tin;
    $retyp = $data->retyp;
    $reason = $data->reason;
    $state = $data->state;
    $local_gvt = $data->local_gvt;
    $ward = $data->ward;
    $city = $data->city;
    $street_name = $data->street_name;
    $house_no = $data->house_no;
    $source_of_income = $data->source_of_income;
    $employer_name = $data->employer_name;
    $employer_tin = $data->employer_tin;
    $start_date_of_employment = $data->start_date_of_employment;
    $dep_child_first_name = $data->dep_child_first_name;
    $dep_child_surname = $data->dep_child_surname;
    $dep_child_middle_name = $data->dep_child_middle_name;
    $dep_child_state = $data->dep_child_state;
    $dep_child_birthday = $data->dep_child_birthday;
    $dep_child_tin = $data->dep_child_tin;
    $dep_child_relationship_type = $data->dep_child_relationship_type;
    $sponser_first_name = $data->sponser_first_name;
    $sponser_surname = $data->sponser_surname;
    $sponser_middle_name = $data->sponser_middle_name;
    $start_date = $data->start_date;
    $sponser_tin = $data->sponser_tin;
    $form_assessment_upload = $data->form_assessment_upload;
    $tax_income_upload = $data->tax_income_upload;
    $form_upload_4 = $data->form_upload_4;
    $form_upload_5 = $data->form_upload_5;


    $query_User_re = sprintf("INSERT INTO `primary_TIN_request`( `user_id`, `title`, `first_name`, `surname`, `middle_name`, `natioality`, `phone_number_1`, `phone_number_2`, `state_of_origin`, `marital_status`, `birthday`, `occupation`, `gender`, `email`, `mother_maiden_name`, `mother_name`, `id_card`, `id_number`, `date_issue`, `expiring_date`, `place_of_issue`, `id_issuing_authority`, `last_assessment_date`, `last_assessment_amount`, `last_payment_date`, `last_payment_amount`, `tax_type`, `first_year`, `first_income`, `second_year`, `second_income`, `third_year`, `third_income`, `reference_number`, `application_status`, `admin_status`) VALUES  ('$user_id','$title','$first_name','$surname','$middle_name','$natioality','$phone_number_1','$phone_number_2','$state_of_origin','$marital_status','$birthday','$occupation','$gender','$email','$mother_maiden_name','$mother_name','$id_card','$id_number','$date_issue','$expiring_date','$place_of_issue','$id_issuing_authority','$last_assessment_date','$last_assessment_amount','$last_payment_date','$last_payment_amount','$tax_type','$first_year','$first_income','$second_year','$second_income','$third_year','$third_income','$reference_number','$application_status','$admin_status')");
    // print_r($query_User_re); die;

    $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));

    if ($User_re) {
        $primary_TIN_request_id = $ibsConnection->insert_id;


        $query_User_re2 = sprintf("INSERT INTO `secondary_TIN_request`(`primary_TIN_request_id`, `name`, `tin`, `retyp`, `reason`, `state`, `local_gvt`, `ward`, `city`, `street_name`, `house_no`, `phone_number_1`, `phone_number_2`, `email`, `source_of_income`, `employer_name`, `employer_tin`, `start_date_of_employment`, `dep_child_first_name`, `dep_child_surname`, `dep_child_middle_name`, `dep_child_state`, `dep_child_birthday`, `dep_child_tin`, `dep_child_relationship_type`, `sponser_first_name`, `sponser_surname`, `sponser_middle_name`, `start_date`,`sponser_tin`,`form_assessment_upload`,`tax_income_upload`,`form_upload_4`,`form_upload_5`) VALUES ('$primary_TIN_request_id','$name','$tin','$retyp','$reason','$state','$local_gvt','$ward','$city','$street_name','$house_no','$phone_number_1','$phone_number_2','$email','$source_of_income','$employer_name','$employer_tin','$start_date_of_employment','$dep_child_first_name','$dep_child_surname','$dep_child_middle_name','$dep_child_state','$dep_child_birthday','$dep_child_tin','$dep_child_relationship_type','$sponser_first_name','$sponser_surname','$sponser_middle_name','$start_date','$sponser_tin','$form_assessment_upload','$tax_income_upload','$form_upload_4','$form_upload_5')");
        // print_r($query_User_re2); die;

        $User_re2 = mysqli_query($ibsConnection, $query_User_re2) or die(mysqli_error($ibsConnection));

        if ($User_re2) {
            $check_exist = check_db_query_staus("SELECT reference_number FROM primary_TIN_request  WHERE `user_id`='{$user_id}'", "CHK");

            $arr = [];


            $arr[] = ['status' => 1, 'message' => "Tin Request Created successfully"];

            $arr[] = $check_exist['message'];
            $user_category = "Admin User";
             $user_id = $user_id;
             $comment = "Tin Request Created";
           $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);

            exit(json_encode($arr));
        } else {
            $returnResponse = ['status' => 0, 'message' => "Tin Request failed, try again"];
            $user_category = "Admin User";
             $user_id = $user_id;
             $comment = "Tin Request Created Failed";
           $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
            exit(json_encode($returnResponse));
        }
    } else {
        $returnResponse = ['status' => 0, 'message' => "Tin Request failed, try again"];
        exit(json_encode($returnResponse));
    }
}

function getTaxFiling($data)
{
    include "config/index.php";
    //include "config/enctp.php";
    // print_r($data);
    $check_exist = check_db_query_staus1("SELECT * FROM tax_filing  WHERE `user_id`='{$data}'", "CHK");
    if ($check_exist['status'] == 1) {
        exit(json_encode($check_exist));
    } else if ($check_exist['status'] == 0) {
        exit(json_encode($check_exist));
    }
}

function insertTaxFiling($data)
{
    include "config/index.php";
    //include "config/enctp.php";
    // print_r($data);die;
    $user_id = $data->user_id;
    $category = $data->category;
    $tax_to_file = $data->tax_to_file;
    $first_name = $data->first_name;
    $surname = $data->surname;
    $email = $data->email;
    $phone_number = $data->phone_number;
    $form_assessment_upload = $data->form_assessment_upload;
    $tax_income_upload = $data->tax_income_upload;
    $evidence_of_tax_payment = $data->evidence_of_tax_payment;
    $form_upload_4 = $data->form_upload_4;
    $form_upload_5 = $data->form_upload_5;
    $application_status = "pending";
    $amount = $data->amount;

    // Random reference number
    $alphabet = "IBS";
    $randomNumber2 = rand(1000, 9999);
    $randomNumber =  date('dmY');
    $tax_filling_refrence = $alphabet . "|" . $randomNumber . "|" . $randomNumber2;
    // print_r($reference_number);die;

    $query_User_re = sprintf("INSERT INTO `tax_filing`(`user_id`, `category`, `tax_to_file`, `first_name`, `surname`, `email`, `phone_number`, `form_assessment_upload`, `tax_income_upload`, `evidence_of_tax_payment`, `form_upload_4`, `form_upload_5`, `tax_filling_refrence`,`application_status`,`amount`) VALUES ('$user_id', '$category','$tax_to_file','$first_name', '$surname','$email','$phone_number', '$form_assessment_upload','$tax_income_upload','$evidence_of_tax_payment', '$form_upload_4', '$form_upload_5', '$tax_filling_refrence', '$application_status','$amount')");
    // print_r($query_User_re); die;
    $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));
    if ($User_re) {

        $arr = [];


        $arr[] = ['status' => 1, 'message' => "Tax Filing Created successfully"];

        $arr[] = ['tax_filling_refrence' => "$tax_filling_refrence"];
        $user_category = "Admin User";
             $user_id = $user_id;
             $comment = "Tax Filing Created";
           $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);

        exit(json_encode($arr));
    } else {
        $returnResponse = ['status' => 0, 'message' => "Tax Filing failed, try again"];
         $user_category = "Admin User";
             $user_id = $user_id;
             $comment = "Tax Filing Created failed";
           $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
        exit(json_encode($returnResponse));
    }
}

function checkStatus()
{
    include "config/index.php";
    //include "config/enctp.php";
    $reference = $_GET['reference'];
    $arr = ["TaxClearance" => "primary_tax_clearance_certificate", "TinRequest" => "primary_TIN_request", "TaxFilling" => "tax_filing"];
    $responseArr = [];
    foreach ($arr as $key => $value) {
        if ($value == "tax_filing") {
            $check_exist = check_db_query_staus("SELECT * FROM `{$value}` WHERE tax_filling_refrence='{$reference}'", "CHK");
        } else {
            $check_exist = check_db_query_staus("SELECT * FROM `{$value}` WHERE reference_number='{$reference}'", "CHK");
        }
        if ($check_exist['status'] == 1) {
            $check_exist['service_type'] = $key;
            $check_exist['request_status'] = $check_exist['message']['application_status'];
            $check_exist['data'] = $check_exist['message'];
            $check_exist['message'] = "The status of the application with ID {$reference} is ";
            if ($value != "tax_filing") {
                unset($check_exist['data']);
            }
            exit(json_encode($check_exist));
        } else {
            $responseArr[] = ['status' => 0, 'message' => "No application exists with ID $reference."];
        }
    }
    if (count($responseArr) == 3) {
        exit(json_encode($responseArr[0]));
    }
}

function resetPassword()
{

    include "config/index.php";
    //include "config/enctp.php";
    $email = $_GET['email'];


    $row = sprintf("SELECT * FROM `payer_user` WHERE `email`= '{$email}'");
    $User_re = mysqli_query($ibsConnection, $row) or die(mysqli_error($ibsConnection));
    $row_User_re = mysqli_fetch_assoc($User_re);
    $totalRows_User_re = mysqli_num_rows($User_re);
    if ($totalRows_User_re > 0) {
        $id = $row_User_re['id'];
        $name = $row_User_re['first_name'];

        $sender = "info@useibs.com";
        //    $contact = "me";
        //    $postmessage = "message";  
        $to = "$email";
        $subject = "Reset Password";
        // Email Template
        $message = "Hi $name! Click on the link to to reset your password https://useibs.com/resetpass.html?id=$id";
        //    $message .= "<b>Contact Number : </b>".$contact."<br>";
        //    $message .= "<b>Email Address : </b>".$email."<br>";
        //    $message .= "<b>Message : </b>".$postmessage."<br>";

        $header = "From:'$sender'";
        $header .= "MIME-Version: 1.0\r\n";
        $header .= "Content-type: text/html\r\n";
        $retval = mail($to, $subject, $message, $header);
        // message Notification
        if ($retval == true) {
            echo json_encode(array(
                'status' => 1,
                'success' => true,
                'message' => 'Message sent successfully'
            ));
             $user_category = "Payer User";
             $user_id = $id;
             $comment = "Payer User Reset password link";
           $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
        } else {
            echo json_encode(array(
                'status' => 0,
                'error' => true,
                'message' => 'Error sending message'
            ));
        }
    } else {
        $error_creating = ["status" => 0, "message" => "user doesn't exist"];
        exit(json_encode($error_creating));
    }
}



function changePassword()
{
    //   print_r($data); die;
    include "config/index.php";
    $user_id = $_GET['id'];
    $new_password = $_GET['password'];
    $query =  " UPDATE `payer_user` SET `password`='{$new_password}' WHERE `id` = {$user_id}";
    //   print_r($query);die;
    $User_re = mysqli_query($ibsConnection, $query) or die(mysqli_error($ibsConnection));

    if ($User_re) {
        $arr = ["status" => 1, "message" => "Password Successfully Updated"];
         $user_category = "Payer User";
             $user_id = $user_id;
             $comment = "Payer User Password Change";
           $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
        exit(json_encode($arr));
    } else {
        $error_creating = ["status" => 0, "message" => "Password NOT Updated"];
        $user_category = "Payer User";
             $user_id = $user_id;
             $comment = "Payer User Password Change Failed";
           $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
        exit(json_encode($error_creating));
    }
}

function applicableTaxes()
{
    include "config/index.php";
    //include "config/enctp.php";

    $user_payer_id = $_GET['user_payer_id'];
    $revenue_head_id = $_GET['revenue_head_id'];


    $query_User_re = sprintf("INSERT INTO `applicable_taxes`(`revenue_head_id`, `user_payer_id`) VALUES ('$revenue_head_id','$user_payer_id')");
    // print_r($query_User_re); die;
    $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));

    if ($User_re) {
        $returnResponse = ['status' => 1, 'message' => "Tax applicable for payment"];
        exit(json_encode($returnResponse));
    } else {
        $returnResponse = ['status' => 0, 'message' => "failed, try again"];
        exit(json_encode($returnResponse));
    }
}

function getUserApplicableTax()
{
    include "config/index.php";
    //include "config/enctp.php";

    $user_payer_id = $_GET['user_payer_id'];
    $revenue_head_id = $_GET['revenue_head_id'];
    // print_r($revenue_head_id); die;
    $check_exist = check_db_query_staus1("SELECT applicable_taxes.revenue_head_id, applicable_taxes.user_payer_id, revenue_heads.id, revenue_heads.COL_1, revenue_heads.COL_2, revenue_heads.COL_3, revenue_heads.COL_4, revenue_heads.COL_5, revenue_heads.COL_6, payer_user.id, payer_user.tax_number, payer_user.tin, payer_user.category, payer_user.first_name, payer_user.surname, payer_user.email, payer_user.phone, payer_user.state, payer_user.business_type, payer_user.employment_status, payer_user.number_of_staff, payer_user.lga, payer_user.address, payer_user.img FROM applicable_taxes JOIN payer_user ON applicable_taxes.user_payer_id = payer_user.id JOIN revenue_heads ON applicable_taxes.revenue_head_id = revenue_heads.id WHERE applicable_taxes.user_payer_id = $user_payer_id", "CHK");
    if ($check_exist['status'] == 1) {
        exit(json_encode($check_exist));
    } else if ($check_exist['status'] == 0) {
        exit(json_encode($check_exist));
    }
}

function getTaxFilingAdmin()
{
    include "config/index.php";
    //include "config/enctp.php";
    //print_r($data);
    $check_exist = check_db_query_staus1("SELECT * FROM tax_filing", "CHK");
    if ($check_exist['status'] == 1) {
        exit(json_encode($check_exist));
    } else if ($check_exist['status'] == 0) {
        exit(json_encode($check_exist));
    }
}

function getTaxFilingById($data)
{
    include "config/index.php";
    //include "config/enctp.php";
    //print_r($data);
    $check_exist = check_db_query_staus1("SELECT * FROM tax_filing WHERE id={$data}", "CHK");
    if ($check_exist['status'] == 1) {
        exit(json_encode($check_exist));
    } else if ($check_exist['status'] == 0) {
        exit(json_encode($check_exist));
    }
}

function getTaxFilingByUser($data)
{
    include "config/index.php";
    //include "config/enctp.php";
    //print_r($data);
    $check_exist = check_db_query_staus1("SELECT * FROM tax_filing WHERE user_id={$data}", "CHK");
    if ($check_exist['status'] == 1) {
        exit(json_encode($check_exist));
    } else if ($check_exist['status'] == 0) {
        exit(json_encode($check_exist));
    }
}

function getTinRequestById($data)
{
    include "config/index.php";
    //include "config/enctp.php";
    //print_r($data);
    $check_exist = check_db_query_staus("SELECT * FROM primary_TIN_request INNER JOIN secondary_TIN_request on primary_TIN_request.id = secondary_TIN_request.primary_TIN_request_id WHERE primary_TIN_request.id={$data}", "CHK");
    if ($check_exist['status'] == 1) {
        exit(json_encode($check_exist));
    } else if ($check_exist['status'] == 0) {
        exit(json_encode($check_exist));
    }
}

function getTaxClearanceById($data)
{
    include "config/index.php";
    //include "config/enctp.php";
    //print_r($data);
    $check_exist = check_db_query_staus1("SELECT * FROM primary_tax_clearance_certificate INNER JOIN secondary_tax_clearance_certificate on primary_tax_clearance_certificate.id = secondary_tax_clearance_certificate.primary_tax_clearance_certificate_id WHERE primary_tax_clearance_certificate.id={$data}", "CHK");
    if ($check_exist['status'] == 1) {
        exit(json_encode($check_exist));
    } else if ($check_exist['status'] == 0) {
        exit(json_encode($check_exist));
    }
}

function getTaxClearanceByReference()
{
    include "config/index.php";
    //include "config/enctp.php";
    $reference = $_GET['reference'];
    $check_exist = check_db_query_staus1("SELECT * FROM primary_tax_clearance_certificate INNER JOIN secondary_tax_clearance_certificate on primary_tax_clearance_certificate.id = secondary_tax_clearance_certificate.primary_tax_clearance_certificate_id WHERE primary_tax_clearance_certificate.reference_number={$reference}", "CHK");
    if ($check_exist['status'] == 1) {
        exit(json_encode($check_exist));
    } else if ($check_exist['status'] == 0) {
        exit(json_encode($check_exist));
    }
}

function getAllTinRequest()
{
    include "config/index.php";
    //include "config/enctp.php";
    //print_r($data);
    $check_exist = check_db_query_staus1("SELECT * FROM primary_TIN_request INNER JOIN secondary_TIN_request on primary_TIN_request.id = secondary_TIN_request.primary_TIN_request_id", "CHK");
    if ($check_exist['status'] == 1) {
        exit(json_encode($check_exist));
    } else if ($check_exist['status'] == 0) {
        exit(json_encode($check_exist));
    }
}

function getActivityLoge($userId)
{
    include "config/index.php";
    //include "config/enctp.php";
    //print_r($data);
    $check_exist = check_db_query_staus1("SELECT * FROM `activity_logs` WHERE `user_id` = '{$userId}'", "CHK");
    if ($check_exist['status'] == 1) {
        exit(json_encode($check_exist));
    } else if ($check_exist['status'] == 0) {
        exit(json_encode($check_exist));
    }
}

function getActivityLogs($userId, $user_category)
{
    include "config/index.php";
    //include "config/enctp.php";
    //print_r($data);
    $check_exist = check_db_query_staus1("SELECT * FROM `activity_logs` WHERE `user_id` = '{$userId}' AND `user_category` = '{$user_category}'", "CHK");
    if ($check_exist['status'] == 1) {
        exit(json_encode($check_exist));
    } else if ($check_exist['status'] == 0) {
        exit(json_encode($check_exist));
    }
}

function getAllActivityLogs()
{
    include "config/index.php";
    //include "config/enctp.php";
    //print_r($data);
    $check_exist = check_db_query_staus1("SELECT * FROM `activity_logs`", "CHK");
    if ($check_exist['status'] == 1) {
        exit(json_encode($check_exist));
    } else if ($check_exist['status'] == 0) {
        exit(json_encode($check_exist));
    }
}


function activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress)
{
    include "config/index.php";
    //include "config/enctp.php";
    $query_User_re = sprintf("INSERT INTO `activity_logs`(`user_category`,`user_id`, `comment`, `session_id`, `ip_address`)
                VALUES ('$user_category', '$user_id', '$comment', '$session_id', '$ipAddress')");
    $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));
}

function cmsCreation($data)
{
    include "config/index.php";
    //include "config/enctp.php";
    $page = $data->page;
    $content = $data->content;
    $title = $data->title;
    $image = $data->image;
    $caption = $data->caption;

    $query_User_re = sprintf("INSERT INTO `cms`( `page`, `content`, `title`, `image`, `caption`) 
                VALUES ('$page', '$content', '$title', '$image', '$caption')");
    $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));
    if ($User_re) {
        $last_id = mysqli_insert_id($ibsConnection);
        $returnResponse = ['status' => 1, 'message' => "Created successfully"];
        exit(json_encode($returnResponse));
    } else {
        $returnResponse = ['status' => 0, 'message' => "Not created, try again"];
        exit(json_encode($returnResponse));
    }
}

function cmsUpdate($data)
{
    include "config/index.php";
    //include "config/enctp.php";
    $id = $data->id;
    $page = $data->page;
    $content = $data->content;
    $title = $data->title;
    $image = $data->image;
    $caption = $data->caption;

    $query_User_re = sprintf("UPDATE `cms` SET `page` = '{$page}', `content` = '{$content}', `title` = '{$title}', `image` = '{$image}', `caption` = '{$caption}' WHERE `id` = '{$id}'");
    $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));
    if ($User_re) {
        $returnResponse = ['status' => 1, 'message' => "Updated successfully"];
        exit(json_encode($returnResponse));
    } else {
        $returnResponse = ['status' => 0, 'message' => "Not Updated, try again"];
        exit(json_encode($returnResponse));
    }
}

function deleteCMS($cms_id)
{
    // print_r($data);
    exit(json_encode(check_db_query_staus("DELETE FROM `cms` WHERE `id`='{$cms_id}'", "DEL")));
}
function getcmsCreation()
{
    include "config/index.php";
    //include "config/enctp.php";
    //print_r($data);
    $check_exist = check_db_query_staus1("SELECT * FROM cms", "CHK");
    if ($check_exist['status'] == 1) {
        exit(json_encode($check_exist));
    } else if ($check_exist['status'] == 0) {
        exit(json_encode($check_exist));
    }
}

function supportCreation($data)
{
    include "config/index.php";
    //include "config/enctp.php";
    $fullname = $data->fullname;
    $content = $data->content;
    $tin = $data->tin;
    $img = $data->img;
    $category = $data->category;
    $subject = $data->subject;
    $id = $data->id;
    $mda_id = $data->mda_id;
    $enum_id = $data->enum_id;
    $email = $data->email;
    $status = "pending";
    $numbers = range(0, 9);
    shuffle($numbers);
    $sequenceNumber = '';
    for ($i = 0; $i < 10; $i++) {
        $sequenceNumber .= $numbers[$i];
    }
    $ticket_number = $sequenceNumber;

    $query_User_re = sprintf("INSERT INTO `support`( `user_id`,`fullname`,`email`,`tin`, `subject`, `category`, `content`,`img`,`status`,`ticket_number`,`mda_id`,`enum_id`)
                VALUES ('$id','$fullname','$email', '$tin', '$subject', '$category', '$content','$img','$status','$ticket_number','$mda_id','$enum_id')");
    $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));
    if ($User_re) {
        $last_id = mysqli_insert_id($ibsConnection);
        $returnResponse = ['status' => 1, 'message' => "Ticket Created successfully"];
         $user_category = "Payer User";
             $user_id = $id;
             $comment = "Support creation";
           $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
        exit(json_encode($returnResponse));
    } else {
        $returnResponse = ['status' => 0, 'message' => "Not created, try again"];
        $user_category = "Payer User";
             $user_id = $id;
             $comment = "Support creation Failed";
           $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
        exit(json_encode($returnResponse));
    }
}

function chat($data)
{
    include "config/index.php";
    //include "config/enctp.php";
    $ticket_number = $data->ticket_number;
    $content = $data->content;
    $user_type = $data->type_of_user;
    $query_User_re = sprintf("INSERT INTO `message`(`ticket_number`,`content`,`type_of_user`)
                VALUES ('$ticket_number','$content','$user_type')");
    $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));
    if ($User_re) {
        $returnResponse = ['status' => 1, 'message' => "Message Sent successfully"];
        exit(json_encode($returnResponse));
    } else {
        $returnResponse = ['status' => 0, 'message' => "Not Sent, try again"];
        exit(json_encode($returnResponse));
    }
}

function getChat()
{
    include "config/index.php";
    //include "config/enctp.php";
    //print_r($data);
    $ticket_number = $_GET['ticket_number'];
    $check_exist = check_db_query_staus1("SELECT * FROM `message` WHERE `ticket_number` = '{$ticket_number}'", "CHK");
    if ($check_exist['status'] == 1) {
        exit(json_encode($check_exist));
    } else if ($check_exist['status'] == 0) {
        exit(json_encode($check_exist));
    }
}
function getSupportById($id)
{
    include "config/index.php";
    //include "config/enctp.php";
    //print_r($data);
    $check_exist = check_db_query_staus("SELECT * FROM `support` WHERE `id` = '{$id}'", "CHK");
    if ($check_exist['status'] == 1) {
        exit(json_encode($check_exist));
    } else if ($check_exist['status'] == 0) {
        exit(json_encode($check_exist));
    }
}

function getSupportByMdaId($id)
{
    include "config/index.php";
    //include "config/enctp.php";
    //print_r($data);
    $check_exist = check_db_query_staus1("SELECT * FROM `support` WHERE `mda_id` = '{$id}'", "CHK");
    if ($check_exist['status'] == 1) {
        exit(json_encode($check_exist));
    } else if ($check_exist['status'] == 0) {
        exit(json_encode($check_exist));
    }
}

function getSupportByEnumId($id)
{
    include "config/index.php";
    //include "config/enctp.php";
    //print_r($data);
    $check_exist = check_db_query_staus("SELECT * FROM `support` WHERE `enum_id` = '{$id}'", "CHK");
    if ($check_exist['status'] == 1) {
        exit(json_encode($check_exist));
    } else if ($check_exist['status'] == 0) {
        exit(json_encode($check_exist));
    }
}

function approveSupport($id)
{
    include "config/index.php";
    //include "config/enctp.php";
    //print_r($data);
    $check_exist = check_db_query_staus("UPDATE `support` SET `status`='answered' WHERE id={$id}", "UPD");
    if ($check_exist['status'] == 1) {
        exit(json_encode($check_exist));
    } else if ($check_exist['status'] == 0) {
        exit(json_encode($check_exist));
    }
}

function getSupportByUser($user_id)
{
    include "config/index.php";
    //include "config/enctp.php";
    //print_r($data);
    $check_exist = check_db_query_staus1("SELECT * FROM `support` WHERE `user_id` = '{$user_id}'", "CHK");
    if ($check_exist['status'] == 1) {
        exit(json_encode($check_exist));
    } else if ($check_exist['status'] == 0) {
        exit(json_encode($check_exist));
    }
}

function getSupport()
{
    include "config/index.php";
    //include "config/enctp.php";
    //print_r($data);
    $check_exist = check_db_query_staus1("SELECT * FROM `support`", "CHK");
    if ($check_exist['status'] == 1) {
        exit(json_encode($check_exist));
    } else if ($check_exist['status'] == 0) {
        exit(json_encode($check_exist));
    }
}

function approveTaxFiling($amount, $id)
{
    include "config/index.php";
    //include "config/enctp.php";
    //print_r($data);
    $check_exist = check_db_query_staus("UPDATE `tax_filing` SET `amount`='{$amount}', `application_status`='approved' WHERE id={$id}", "UPD");
    if ($check_exist['status'] == 1) {
        exit(json_encode($check_exist));
    } else if ($check_exist['status'] == 0) {
        exit(json_encode($check_exist));
    }
}

function approveTinRequest($id)
{
    include "config/index.php";
    //include "config/enctp.php";
    //print_r($data);
    $check_exist = check_db_query_staus("UPDATE `primary_TIN_request` SET `application_status`='approved' WHERE id={$id}", "UPD");
    if ($check_exist['status'] == 1) {
        exit(json_encode($check_exist));
    } else if ($check_exist['status'] == 0) {
        exit(json_encode($check_exist));
    }
}

function approveTaxcert($id)
{
    include "config/index.php";
    //include "config/enctp.php";
    //print_r($data);
    $check_exist = check_db_query_staus("UPDATE `primary_tax_clearance_certificate` SET `application_status`='approved' WHERE id={$id}", "UPD");
    if ($check_exist['status'] == 1) {
        exit(json_encode($check_exist));
    } else if ($check_exist['status'] == 0) {
        exit(json_encode($check_exist));
    }
}

function MailTinRequest()
{
    $email = $_GET['email'];
    $message = $_GET['message'];
    include "config/index.php";
    //include "config/enctp.php";
    //print_r($data);
    $sender = "info@useibs.com";
    //    $contact = "me";
    //    $postmessage = "message";  
    $to = "$email";
    $subject = "TIN Request";
    // Email Template
    $message = "$message";
    //    $message .= "<b>Contact Number : </b>".$contact."<br>";
    //    $message .= "<b>Email Address : </b>".$email."<br>";
    //    $message .= "<b>Message : </b>".$postmessage."<br>";

    $header = "From:'$sender'";
    $header .= "MIME-Version: 1.0\r\n";
    $header .= "Content-type: text/html\r\n";
    $retval = mail($to, $subject, $message, $header);
    // message Notification
    if ($retval == true) {
        echo json_encode(array(
            'status' => 1,
            'success' => true,
            'message' => 'Message sent successfully'
        ));
    } else {
        echo json_encode(array(
            'status' => 0,
            'error' => true,
            'message' => 'Error sending message'
        ));
    }
}

function approveRevenueHead($id)
{
    include "config/index.php";
    //include "config/enctp.php";
    //print_r($data);
    $check_exist = check_db_query_staus("UPDATE `revenue_heads` SET `status`='approved' WHERE id={$id}", "UPD");
    if ($check_exist['status'] == 1) {
           $user_category = "Admin User";
             $user_id = $id;
             $comment = "Approve Revenue Head";
           $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
        exit(json_encode($check_exist));
    } else if ($check_exist['status'] == 0) {
        $user_category = "Admin User";
             $user_id = $id;
             $comment = "Approve Revenue Head Failed";
           $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
        exit(json_encode($check_exist));
    }
}

function getMDAsRevenueHeadByStatus($data)
{
    $mdaName = $_GET['mdaName'];
    $status = $_GET['status'];
    $pull_data = check_db_query_staus1("SELECT `id`, `COL_1`, `COL_2`, `COL_3`, `COL_4`, `COL_5`, `COL_6`,`total_gen_revenue`,`status`, `frequency`, `due_date` FROM `revenue_heads` WHERE `COL_3`= '{$mdaName}' AND `status`= '{$status}'", "CHK");
    exit(json_encode($pull_data));
}

function generatePassword($length = 8) {
    // Define characters to use in the password
    $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    
    $password = '';
    
    // Generate random password
    for ($i = 0; $i < $length; $i++) {
        $index = rand(0, strlen($characters) - 1);
        $password .= $characters[$index];
    }
    
    return $password;
}

function generateSerialCode($lga) {
    $states = [
        "AkwaIbom" => [
            "Abak",
            "Eastern Obolo",
            "Eket",
            "Esit Eket",
            "Essien Udim",
            "Etim Ekpo",
            "Etinan",
            "Ibeno",
            "Ibesikpo Asutan",
            "Ibiono-Ibom",
            "Ika",
            "Ikono",
            "Ikot Abasi",
            "Ikot Ekpene",
            "Ini",
            "Itu",
            "Mbo",
            "Mkpat-Enin",
            "Nsit-Atai",
            "Nsit-Ibom",
            "Nsit-Ubium",
            "Obot Akara",
            "Okobo",
            "Onna",
            "Oron",
            "Oruk Anam",
            "Udung-Uko",
            "Ukanafun",
            "Uruan",
            "Urue-Offong Oruko",
            "Uyo"
        ]
        // Add more states and their cities here
    ];

    foreach ($states as $state => $cities) {
        $cityCode = array_search($lga, $cities);
        if ($cityCode !== false) {
            $cityCode = str_pad($cityCode + 1, 2, "0", STR_PAD_LEFT);
            return $cityCode;
        }
    }

    return null; // Invalid city
}




function createEnumerator($data)
{
    include "config/index.php";
    //include "config/enctp.php";
    $email = $data->email;
    $fullname = $data->fullname;
    $state = $data->state;
    $phone = $data->phone;
    $lga = $data->lga;
    $address = $data->address;
    $password = generatePassword(10);
    $agent_id = "AKW" . generatePayerID();
    $query_User_re = sprintf("INSERT INTO `enumerator_users`(`email`, `fullname`, `state`, `phone`, `lga`, `address`,`status`,`password`, `agent_id`)
                VALUES ('$email', '$fullname', '$state', '$phone', '$lga', '$address','1', '$password', '$agent_id')");
    $check_exist = check_db_query_staus("SELECT `email` FROM enumerator_users WHERE `email`='{$email}'", "CHK");

    if ($check_exist['status'] == 1) {
        $returnResponse = ['status' => 2, 'message' => "{$email} exists already"];
        exit(json_encode($returnResponse));
    } else {
        $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));
        if ($User_re) {
             $last_id = mysqli_insert_id($ibsConnection);
             $sender = "info@useibs.com";

            $to = "$email";
            $subject = "Account Creation";
            // Email Template
            $message = "Hi $fullname! Your account has been Created Successfully <br />
            Here is Your Account details: <br />
            Username: $email. <br />
            password: $password <br />
            
            Click on the link to Login into your Account https://useibs.com/enumeration";


            $header = "From:'$sender'";
            $header .= "MIME-Version: 1.0\r\n";
            $header .= "Content-type: text/html\r\n";
            $retval = mail($to, $subject, $message, $header);
            $returnResponse = ['status' => 1, 'message' => "{$fullname} added successfully \n\n Password: $password"];
            $user_category = "Admin User";
             $user_id = $last_id;
             $comment = "Enumerator Creation";
           $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
            exit(json_encode($returnResponse));
        } else {
            $returnResponse = ['status' => 0, 'message' => "{$fullname} not created, try again"];
            $user_category = "Admin User";
             $user_id = "";
             $comment = "Enumerator Creation Failed";
           $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
            exit(json_encode($returnResponse));
        }
    }
}

function createEnumerationTax($data1)
{
    include "config/index.php";
    include "config/enctp.php";
    if(count($data1) == 1){
        // print_r($data1);
        $category = $data1[0]->category;
        $first_name = $data1[0]->first_name;
        $last_name = $data1[0]->last_name;
        $email = $data1[0]->email;
        $phone = $data1[0]->phone;
        $TIN = $data1[0]->tin;
        $employment_status = $data1[0]->employment_status;
        $id_type = $data1[0]->id_type;
        $id_number = $data1[0]->id_number;
        $business_status = $data1[0]->business_status;
        $business_type = $data1[0]->business_type;
        $state = $data1[0]->state;
        $lga = $data1[0]->lga;
        $address = $data1[0]->address;
        $area = $data1[0]->area;
        $account_type = $data1[0]->account_type;
        $by_account = $data1[0]->by_account;
        $revenue_return = $data1[0]->revenue_return;
        $valuation = $data1[0]->valuation;
        $img = $data1[0]->img;
        $staff_quota = $data1[0]->staff_quota;
        if ($account_type == 1) {
            $category1 = "I";
        } else if ($account_type == 2) {
            $category1 = "C";
        } else if ($account_type == 3) {
            $category1 = "P";
        } 
        $payer_id = "AKW" . $category1 . "-" . generatePayerID();
        $verification = encripted_data($email . "Â£" . "2990" . "_");
        $verification_code = substr(str_shuffle(str_repeat("0123456789", 6)), 0, 6);
        // $password = generatePassword(10);
        $query_User_re = sprintf("INSERT INTO `enumerator_tax_payers`(`tax_number`,`category`, `first_name`, `last_name`, `email`, `phone`, `TIN`, `employment_status`, `id_type`, `id_number`, `business_status`, `business_type`, `state`, `lga`, `address`, `area`, `account_type`, `by_account`, `revenue_return`, `valuation`, `img` ,`verification`,`verification_code`,`staff_quota`)
                    VALUES ('$payer_id','$category','$first_name', '$last_name', '$email', '$phone', '$TIN', '$employment_status', '$id_type', '$id_number', '$business_status', '$business_type', '$state', '$lga', '$address', '$area', '$account_type', $by_account, '$revenue_return', '$valuation','$img','$verification','$verification_code','$staff_quota')");
        $check_exist = check_db_query_staus("SELECT `email` FROM enumerator_tax_payers WHERE `email`='{$email}'", "CHK");
    
        if ($check_exist['status'] == 1) {
            $returnResponse = ['status' => 2, 'message' => "{$email} exists already"];
            exit(json_encode($returnResponse));
        } else {
            $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));
            if ($User_re) {
                $last_id = mysqli_insert_id($ibsConnection);
                    $fetched_data_last_id = check_db_query_staus("SELECT * FROM `enumerator_tax_payers` WHERE id = $last_id", "CHK");
                    $returnResponse = ['status' => 1, 'message' => "{$email} added successfully", "data" => $fetched_data_last_id['message'], "id" => $last_id];
                      $user_category = "Enum User";
             $user_id = $last_id;
             $comment = "Enum Tax payer Creation";
           $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
                exit(json_encode($returnResponse));
            } else {
                $returnResponse = ['status' => 0, 'message' => "{$email} not created, try again"];
                     $user_category = "Enum User";
             $user_id = "";
             $comment = "Enum Tax payer Creation Failed";
           $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
                exit(json_encode($returnResponse));
            }
        }
    }elseif(count($data1) == 2){
        if(!isset($data1[0]->property_area)){
            $category = $data1[0]->category;
            $name = $data1[0]->name;
            $industry = $data1[0]->industry;
            $staff_quota = $data1[0]->staff_quota;
            $tin = $data1[0]->tin;
            $email = $data1[0]->email;
            $state = $data1[0]->state;
            $lga = $data1[0]->lga;
            $address = $data1[0]->address;
            $area = $data1[0]->area;
            $tax_category = $data1[0]->tax_category;
            $business_type = $data1[0]->business_type;
            $revenue_return = $data1[0]->revenue_return;
            $valuation = $data1[0]->valuation;
            $img = $data1[0]->img;
            $payer_id = "AKW" . $category1 . "-" . generatePayerID();
            // $password = generatePassword(10);
            $query_User_re = sprintf("INSERT INTO `enumerator_corperate_info`(`user_tax_number`, `category`, `name`, `industry`, `staff_quota`, `tin`, `email`, `state`, `lga`, `address`, `area`, `tax_category`, `business_type`, `revenue_return`, `valuation`,`img`)
                        VALUES ('$payer_id', $category','$name', '$industry', '$staff_quota', '$tin', '$email','$state', '$lga', '$address', '$area', '$tax_category', '$business_type', '$revenue_return', '$valuation','$img')");
            $check_exist = check_db_query_staus("SELECT `email` FROM enumerator_corperate_info WHERE `email`='{$email}'", "CHK");
        
            if ($check_exist['status'] == 1) {
                $returnResponse = ['status' => 2, 'message' => "{$email} exists already"];
                exit(json_encode($returnResponse));
            } else {
                $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));
                if ($User_re) {
                    // $returnResponse = ['status' => 1, 'message' => "{$email} added successfully"];
                    $first_name = $data1[1]->first_name;
                    $last_name = $data1[1]->last_name;
                    $email1 = $data1[1]->email;
                    $phone = $data1[1]->phone;
                    $id_type = $data1[1]->id_type;
                    $id_number = $data1[1]->id_number;
                    $position = $data1[1]->position;
                    $state1 = $data1[1]->state;
                    $lga1 = $data1[1]->lga;
                    $address1 = $data1[1]->address;
                    $account_type = $data1[1]->account_type;
                    $by_account = $data1[1]->by_account;
                    $staff_quota = $data1[0]->staff_quota;
                      $business_type = $data1[0]->business_type;
                    $revenue_return = $data1[0]->revenue_return;
                    $valuation = $data1[0]->valuation;
                    $img = $data1[0]->img;
                    
                    if ($account_type == 1) {
                        $category1 = "I";
                    } else if ($account_type == 2) {
                        $category1 = "C";
                    } else if ($account_type == 3) {
                        $category1 = "P";
                    } 
        
                    $query_User_re1 = sprintf("INSERT INTO `enumerator_tax_payers`(`tax_number`,`first_name`, `last_name`, `email`, `phone`, `id_type`, `id_number`,`state`, `lga`, `address`, `account_type`, `by_account`,`img`,`staff_quota`,`business_type`, `revenue_return`, `valuation`)
                                VALUES ('$payer_id','$first_name', '$last_name', '$email1', '$phone', '$id_type', '$id_number', '$state1', '$lga1', '$address1', '$account_type', '$by_account','$img','$staff_quota','$business_type','$revenue_return','$valuation')");
                    $check_exist1 = check_db_query_staus("SELECT `email` FROM enumerator_tax_payers WHERE `email`='{$email}'", "CHK");
                
                    if ($check_exist1['status'] == 1) {
                        $returnResponse1 = ['status' => 2, 'message' => "Rep({$email1}) exists already"];
                        exit(json_encode($returnResponse1));
                    } else {
                        $User_re = mysqli_query($ibsConnection, $query_User_re1) or die(mysqli_error($ibsConnection));
                        if ($User_re) {
                              $last_id = mysqli_insert_id($ibsConnection);
                            $fetched_data_last_id = check_db_query_staus("SELECT * FROM `enumerator_tax_payers` WHERE id = $last_id", "CHK");
                            $returnResponse = ['status' => 1, 'message' => "{$email} added successfully", "data" => $fetched_data_last_id['message'], "id" => $last_id];
                                 $user_category = "Enum User";
             $user_id = $last_id;
             $comment = "Enum Corporate Creation";
           $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
                            exit(json_encode($returnResponse));
                        } else {
                            $returnResponse1 = ['status' => 0, 'message' => "{$email} not created, try again"];
                                 $user_category = "Enum User";
             $user_id = "";
             $comment = "Enum Corporate Creation Failed";
           $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
                            exit(json_encode($returnResponse1));
                        }
                    }
                    // exit(json_encode($returnResponse));
                } else {
                    $returnResponse = ['status' => 0, 'message' => "{$email} not created, try again"];
                    exit(json_encode($returnResponse));
                }
            }
    }elseif(isset($data1[0]->property_area)){
            $property_file = $data1[0]->property_file;
            $property_type = $data1[0]->property_type;
            $property_area = $data1[0]->property_area;
            $latitude = $data1[0]->latitude;
            $longitude = $data1[0]->longitude;
            $state = $data1[0]->state;
            $lga = $data1[0]->lga;
            $address = $data1[0]->address;
            $area = $data1[0]->area;
            $tax_category = $data1[0]->tax_category;
            $serialCode = generateSerialCode($lga);
            $property_id = "AKW" . $serialCode . generatePayerID();
            $img = $data1[0]->img;
            $payer_id = "AKW" . $category1 . "-" . generatePayerID();
            // $password = generatePassword(10);
            $query_User_re = sprintf("INSERT INTO `enumerator_property_info`(`user_tax_number`,`property_id`,`property_file`, `property_type`, `property_area`, `latitude`, `longitude`, `state`, `lga`, `address`, `area`, `tax_category`,`img`)
                        VALUES ('$payer_id',$property_id','$property_file','$property_type', '$property_area', '$latitude', '$longitude', '$state', '$lga', '$address', '$area', '$tax_category','$img')");
            $check_exist = check_db_query_staus("SELECT `property_file` FROM enumerator_property_info WHERE `property_file`='{$property_file}'", "CHK");
        
            if ($check_exist['status'] == 1) {
                $returnResponse = ['status' => 2, 'message' => "{$property_file} exists already"];
                exit(json_encode($returnResponse));
            } else {
                $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));
                if ($User_re) {
                    // $returnResponse = ['status' => 1, 'message' => "{$email} added successfully"];
                    $first_name = $data1[1]->first_name;
                    $last_name = $data1[1]->last_name;
                    $email1 = $data1[1]->email;
                    $phone = $data1[1]->phone;
                    $id_type = $data1[1]->id_type;
                    $id_number = $data1[1]->id_number;
                    // $position = $data1[1]->position;
                    $state1 = $data1[1]->state;
                    $lga1 = $data1[1]->lga;
                    $address1 = $data1[1]->address;
                    $property_owner = $data1[1]->property_owner;
                    $account_type = $data1[1]->account_type;
                    $by_account = $data1[1]->by_account;
                    $img = $data1[0]->img;
                       if ($account_type == 1) {
            $category1 = "I";
        } else if ($account_type == 2) {
            $category1 = "C";
        } else if ($account_type == 3) {
            $category1 = "P";
        } 
        
                    $query_User_re1 = sprintf("INSERT INTO `enumerator_tax_payers`(`tax_number`,`first_name`, `last_name`, `email`, `phone`, `id_type`, `id_number`,`state`, `lga`, `address`, `property_owner`, `account_type`, `by_account`,`img`)
                                VALUES ('$payer_id','$first_name', '$last_name', '$email1', '$phone', '$id_type', '$id_number', '$state1', '$lga1', '$address1', '$property_owner', '$account_type', '$by_account','$img')");
                    $check_exist1 = check_db_query_staus("SELECT `email` FROM enumerator_tax_payers WHERE `email`='{$email1}'", "CHK");
                
                    if ($check_exist1['status'] == 1) {
                        $returnResponse1 = ['status' => 2, 'message' => "Rep({$email}) exists already"];
                        exit(json_encode($returnResponse1));
                    } else {
                        $User_re1 = mysqli_query($ibsConnection, $query_User_re1) or die(mysqli_error($ibsConnection));
                        if ($User_re1) {
                              $last_id = mysqli_insert_id($ibsConnection);
                    $fetched_data_last_id = check_db_query_staus("SELECT * FROM `enumerator_tax_payers` WHERE id = $last_id", "CHK");
                    $returnResponse = ['status' => 1, 'message' => "{$property_file} added successfully", "data" => $fetched_data_last_id['message'], "id" => $last_id];
                         $user_category = "Enum User";
             $user_id = $last_id;
             $comment = "Enum Property Creation";
           $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
                            exit(json_encode($returnResponse));
                        } else {
                            $returnResponse1 = ['status' => 0, 'message' => "{$property_file} not created, try again"];
                                 $user_category = "Enum User";
             $user_id = "";
             $comment = "Enum Property Creation Failed";
           $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
                            exit(json_encode($returnResponse1));
                        }
                    }
                    // exit(json_encode($returnResponse));
                } else {
                    $returnResponse = ['status' => 0, 'message' => "{$property_file} not created, try again"];
                    exit(json_encode($returnResponse));
                }
            }
    }
    }
    
}

function getEnumerators()
{
    $pull_data = check_db_query_staus1("SELECT `id`, `fullname`, `email`, `agent_id`, `address`, `state`, `lga`, `phone`, `timeIn`, `status` FROM enumerator_users", "CHK");
    exit(json_encode($pull_data));
}

function getEnumerationTaxPayer()
{
    $pull_data = check_db_query_staus1("SELECT e.id, e.category, e.by_account, e.account_type, e.img, e.tax_number, e.first_name, e.last_name, e.email, e.phone, e.TIN, e.employment_status, e.id_type, e.id_number, e.business_status, e.business_type, e.state, e.lga, e.address, e.area,e.tin_status,e.timeIn, p.id, p.fullname FROM enumerator_tax_payers e INNER JOIN enumerator_users p ON e.by_account = p.id", "CHK");
    exit(json_encode($pull_data));
}
function getEnumerationAgent($user_id)
{
    $pull_data = check_db_query_staus1("SELECT * FROM enumerator_users WHERE id={$user_id}", "CHK");
    unset($pull_data['message'][0]['password']);
    exit(json_encode($pull_data));
}
function getEnumerationUserId($user_id)
{
    $pull_data = check_db_query_staus1("SELECT * FROM enumerator_tax_payers WHERE by_account={$user_id}", "CHK");
    unset($pull_data['message'][0]['password']);
    exit(json_encode($pull_data));
}
function enumerator_users_login($username, $password)
{
    include "config/index.php";
    $query_User_re = sprintf("SELECT * FROM `enumerator_users` WHERE email='{$username}'");
    $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));
    $row_User_re = mysqli_fetch_assoc($User_re);
    $totalRows_User_re = mysqli_num_rows($User_re);
    if ($totalRows_User_re > 0) {
        if ($row_User_re['password'] != $password) {
            $arr = ['status' => 0, 'message' => 'Incorrect Password'];
            // $arr = ['status' => 1, 'message' => 'Buzzing you in ðŸ˜Ž', 'user' => $row_User_re];
            exit(json_encode($arr));
        } else {
            unset($row_User_re['password']);
            $arr = ['status' => 1, 'message' => 'Buzzing you in ðŸ˜Ž', 'user' => $row_User_re];
            $user_category = "Enum User";
             $user_id = $row_User_re['id'];
             $comment = "Enumerator Loggedin successfully";
           $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
            exit(json_encode($arr));
        }
    } else {
        $arr = ['status' => 0, 'message' => 'Login details do not match an existing user, Please register or check details again'];
        $user_category = "Enum User";
             $user_id = $username;
             $comment = "Enumerator Loggedin Faled";
           $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
        exit(json_encode($arr));
    }
}

function getEnumerationAgentDashboard()
{
    $pull_data = check_db_query_staus1("SELECT COUNT(*) AS total_users FROM enumerator_tax_payers", "CHK");
    $pull_data1 = check_db_query_staus1("SELECT account_type, COUNT(*) AS total_users FROM enumerator_tax_payers GROUP BY account_type", "CHK");
    $pull_data2 = check_db_query_staus1("SELECT EXTRACT(MONTH FROM timeIn) AS registration_month, COUNT(*) AS total_users FROM enumerator_tax_payers GROUP BY registration_month", "CHK");
    $pull_data3 = check_db_query_staus1("SELECT EXTRACT(YEAR FROM timeIn) AS registration_year, COUNT(*) AS total_users FROM enumerator_tax_payers GROUP BY registration_year", "CHK");
    $pull_data4 = check_db_query_staus1("SELECT account_type, COUNT(*) AS total_users, COUNT(*) * 100.0 / (SELECT COUNT(*) FROM enumerator_tax_payers) AS percentage FROM enumerator_tax_payers GROUP BY account_type", "CHK");
    
    $pull_data0 = [$pull_data['message'],$pull_data1['message'],$pull_data2['message'],$pull_data3['message'],$pull_data4['message']];
    exit(json_encode($pull_data0));
}

function getEnumerationSpecificAgentDashboard()
{
    // echo $user;
    $pull_data = check_db_query_staus1("SELECT COUNT(*) AS total_users FROM enumerator_tax_payers WHERE by_account={$_GET['id']}", "CHK");
    $pull_data1 = check_db_query_staus1("SELECT account_type, COUNT(*) AS total_users FROM enumerator_tax_payers WHERE by_account={$_GET['id']} GROUP BY account_type", "CHK");
    $pull_data2 = check_db_query_staus1("SELECT EXTRACT(MONTH FROM timeIn) AS registration_month, COUNT(*) AS total_users FROM enumerator_tax_payers WHERE by_account={$_GET['id']} GROUP BY registration_month", "CHK");
    $pull_data3 = check_db_query_staus1("SELECT EXTRACT(YEAR FROM timeIn) AS registration_year, COUNT(*) AS total_users FROM enumerator_tax_payers WHERE by_account={$_GET['id']} GROUP BY registration_year", "CHK");
    $pull_data0 = [$pull_data['message'],$pull_data1['message'],$pull_data2['message'],$pull_data3['message']];
    exit(json_encode($pull_data0));
    // print_r($pull_data1);
}

function getEnumerationCategoryDashboard()
{
    // echo $user;
    $pull_data = check_db_query_staus1("SELECT 'individual' AS tax_category, COUNT(*) AS count FROM enumerator_tax_payers WHERE account_type = 'individual' UNION SELECT 'corporate' AS tax_category, COUNT(*) AS count FROM enumerator_tax_payers WHERE account_type = 'corporate' AND corporate_id IS NOT NULL UNION SELECT 'properties' AS tax_category, COUNT(*) AS count FROM enumerator_tax_payers WHERE account_type = 'properties'", "CHK");
    $pull_data1 = check_db_query_staus1("SELECT by_account, COUNT(*) AS count FROM enumerator_tax_payers GROUP BY by_account", "CHK");
    $pull_data2 = check_db_query_staus1("SELECT 'corporate' AS taxpayer_type, ec.business_type, COUNT(*) AS count FROM enumerator_corperate_info ec WHERE ec.business_type IS NOT NULL GROUP BY ec.business_type UNION SELECT 'individual' AS taxpayer_type, etp.business_type, COUNT(*) AS count FROM enumerator_tax_payers etp WHERE etp.account_type = 'individual' GROUP BY etp.business_type", "CHK");
    $pull_data4 = check_db_query_staus1("SELECT category, COUNT(*) AS number FROM `enumerator_tax_payers` GROUP BY category;", "CHK");
    $pull_data5 = check_db_query_staus1("SELECT DATE_FORMAT(timeIn, '%%Y-%%m') AS period, COUNT(*) AS registration_count, AVG(DATEDIFF(timeIn, DATE_FORMAT(timeIn, '%%Y-%%m-01'))) AS average_registration FROM enumerator_tax_payers GROUP BY period;", "CHK");
    $pull_data3 = check_db_query_staus1("SELECT COUNT(*) AS count, DATE_FORMAT(timeIn, '%%Y-%%m') AS period FROM enumerator_tax_payers GROUP BY period", "CHK");
    $pull_data0 = [$pull_data['message'],$pull_data1['message'],$pull_data2['message'],$pull_data4['message'],$pull_data5['message'], $pull_data3['message']];
    exit(json_encode($pull_data0));
    // print_r($pull_data3);
}

function createOffice($data)
{
    include "config/index.php";
    //include "config/enctp.php";
    $mda_id = $data->mda_id;
    $user_id = $data->user_id;
    $office_type = $data->office_type;
    $name = $data->name;
    $state = $data->state;
    $lga = $data->lga;
    $no_of_users = 0;
    $query_User_re = sprintf("INSERT INTO `offices`(`mda_id`, `md_user_id`, `office_type`, `office_name`, `state`, `lga`, `no_of_users`) 
                VALUES ('$mda_id', '$user_id', '$office_type', '$name','$state','$lga','$no_of_users')");
    $check_exist = check_db_query_staus("SELECT office_name FROM offices WHERE office_name='{$name}'", "CHK");

    if ($check_exist['status'] == 1) {
        $returnResponse = ['status' => 2, 'message' => "{$name} exists already"];
        exit(json_encode($returnResponse));
    } else {
        $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));
        if ($User_re) {
            $returnResponse = ['status' => 1, 'message' => "{$name} office added successfully"];
             $user_category = "Mda User";
             $user_id = $mda_id;
             $comment = "Mda Office Creation";
           $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
            exit(json_encode($returnResponse));
        } else {
            $returnResponse = ['status' => 0, 'message' => "{$name} office not created, try again"];
            $user_category = "Mda User";
             $user_id = $mda_id;
             $comment = "Mda Office Creation Failed";
           $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
            exit(json_encode($returnResponse));
        }
    }
}

function getOffice($data){
    $pull_data = check_db_query_staus1("SELECT * FROM offices WHERE office_type={$data}", "CHK");
    exit(json_encode($pull_data));
}

function getPaymentByMdaName($data){
    $pull_data = check_db_query_staus1("SELECT p.id, p.mda_id, p.revenue_head, p.timeIn, rh.COL_1, rh.COL_2, rh.COL_3, rh.COL_4, rh.COL_5, rh.COL_6, rh.total_gen_revenue, rh.status, p.user_id, p.invoice_number, p.payment_channel, p.payment_reference_number, p.receipt_number, u.first_name, u.surname FROM payment_collection_report_individual p INNER JOIN payer_user u ON p.user_id = u.id INNER JOIN revenue_heads rh ON p.revenue_head = rh.id WHERE p.mda_id = '{$data}';", "CHK");
    exit(json_encode($pull_data));
}

function getInvoiceByMdaName($data){
    $pull_data = check_db_query_staus1("SELECT invoices.payer_id, invoices.revenue_head, invoices.invoice_number, invoices.due_date, invoices.payment_status, invoices.date_created, revenue_heads.COL_3, revenue_heads.COL_4, revenue_heads.COL_6, payer_user.tax_number, payer_user.first_name, payer_user.surname, payer_user.address, payer_user.email, payer_user.phone FROM invoices INNER JOIN payer_user ON invoices.payer_id = payer_user.id INNER JOIN revenue_heads ON invoices.revenue_head = revenue_heads.id WHERE revenue_heads.COL_3='{$data}';", "CHK");
    exit(json_encode($pull_data));
}

function createCashPayment($data)
{
    include "config/index.php";
    //include "config/enctp.php";

    $mda_id = $data->mda_id;
    $user_id = $data->user_id;
    $revenue_head = $data->revenue_head;
    $first_name = $data->first_name;
    $surname = $data->surname;
    $tin = $data->tin;
    $phone = $data->phone;
    $state = $data->state;
    $lga = $data->lga;
    $amount = $data->amount;
    $query_User_re = sprintf("INSERT INTO `cash_payment` (`mda_id`, `mda_user_id`, `revenue_head`, `first_name`, `surname`, `tin`,`phone`,`state`, `lga`,`amount`) 
                VALUES ('$mda_id', '$user_id', '$revenue_head', '$first_name','$surname','$tin','$phone', '$state', '$lga','$amount')");
        $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));
        if ($User_re) {
            $last_id = mysqli_insert_id($ibsConnection);
            $query_User_re1 = sprintf("SELECT * FROM `cash_payment` WHERE `id` = '{$last_id}' ");
        $User_re1 = mysqli_query($ibsConnection, $query_User_re1) or die(mysqli_error($ibsConnection));
         $row_User_re1 = mysqli_fetch_assoc($User_re1);
            $returnResponse = ['status' => 1, 'message' => "{$revenue_head} made successfully" , 'data' => $row_User_re1];
            $user_category = "Mda User";
             $user_id = $mda_id;
             $comment = "cash payment Creation";
           $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
            exit(json_encode($returnResponse));
        } else {
            $returnResponse = ['status' => 0, 'message' => "{$revenue_head} not mad, try again"];
             $user_category = "Mda User";
             $user_id = $mda_id;
             $comment = "cash payment Creation Failed";
           $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
            exit(json_encode($returnResponse));
        }
}

function getcashPayment($data){
    $pull_data = check_db_query_staus1("SELECT * FROM cash_payment WHERE `mda_id`={$data}", "CHK");
    exit(json_encode($pull_data));
}

function updatePixMda($data)
{
    $id = $data->id;
    $img = $data->img;
    exit(json_encode(check_db_query_staus("UPDATE `mda_users` SET `img`='{$img}' WHERE `id`='{$id}'", "UPD")));
}

function userProfileMda($id)
{
    include "config/index.php";
    $query_User_re = sprintf("SELECT * FROM `mda_users` WHERE id='{$id}'");
    $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));
    $row_User_re = mysqli_fetch_assoc($User_re);
    $totalRows_User_re = mysqli_num_rows($User_re);
    if ($totalRows_User_re > 0) {
        $arr = ['status' => 1, 'message' => 'Buzzing you in ðŸ˜Ž', 'user' => $row_User_re];
        exit(json_encode($arr));
    } else {
        $arr = ['status' => 0, 'message' => 'User does not exist',];
        exit(json_encode($arr));
    }
}

function getAllOffice(){
    $pull_data = check_db_query_staus1("SELECT * FROM offices ", "CHK");
    exit(json_encode($pull_data));
}

function changePasswordEnumerator()
{
    //   print_r($data); die;
    include "config/index.php";
    $user_id = $_GET['id'];
    $new_password = $_GET['password'];
    $query =  " UPDATE `enumerator_users` SET `password`='{$new_password}' WHERE `id` = {$user_id}";
    //   print_r($query);die;
    $User_re = mysqli_query($ibsConnection, $query) or die(mysqli_error($ibsConnection));

    if ($User_re) {
        $arr = ["status" => 1, "message" => "Password Successfully Updated"];
         $user_category = "Enum User";
             $user_id = $user_id;
             $comment = "Password change";
           $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
        exit(json_encode($arr));
    } else {
        $error_creating = ["status" => 0, "message" => "Password NOT Updated"];
        $user_category = "Enum User";
             $user_id = $user_id;
             $comment = "Password change Failed";
           $session_id = $_SESSION['session_id'];
             $ipAddress = $_SERVER['REMOTE_ADDR'];
             activityLogs($user_category, $user_id, $comment, $session_id, $ipAddress);
        exit(json_encode($error_creating));
    }
}

function updatePixEnum($data)
{
    $id = $data->id;
    $img = $data->img;
    exit(json_encode(check_db_query_staus("UPDATE `enumerator_users` SET `img`='{$img}' WHERE `id`='{$id}'", "UPD")));
}

function getRolesAdmin($id){
    $pull_data = check_db_query_staus1("SELECT dashboard_access, analytics_access, mda_access, reports_access, tax_payer_access, users_access, cms_access, support, enumeration_access, audit_trail_access FROM Administrative_users WHERE id={$id}", "CHK");
    $all1 = [];
    foreach($pull_data['message'] as $key => $items){
        // $all1[] = $items;
        
        foreach($items as $key1 => $itemsInner){
            $all1[$key1] = explode("~", $itemsInner);
        }
    }
    exit(json_encode($all1));
}

function getMdaRoles($id){
    $pull_data = check_db_query_staus1("SELECT dashboard_access, revenue_head_access, payment_access, users_access, report_access FROM mda_users WHERE id={$id}", "CHK");
    $all1 = [];
    foreach($pull_data['message'] as $key => $items){
        // $all1[] = $items;
        
        foreach($items as $key1 => $itemsInner){
            $all1[$key1] = explode("~", $itemsInner);
        }
    }
    exit(json_encode($all1));
}

function getTotalUserLogins()
{
    $pull_data1 = check_db_query_staus1("SELECT EXTRACT(WEEk FROM timeIn) AS logins_week, COUNT(*) AS total_logins FROM activity_logs WHERE comment='Logged in successfully' GROUP BY logins_week", "CHK");
    $pull_data2 = check_db_query_staus1("SELECT EXTRACT(MONTH FROM timeIn) AS logins_month, COUNT(*) AS total_logins FROM activity_logs WHERE comment='Logged in successfully' GROUP BY logins_month", "CHK");
    $pull_data3 = check_db_query_staus1("SELECT EXTRACT(YEAR FROM timeIn) AS logins_year, COUNT(*) AS total_logins FROM activity_logs WHERE comment='Logged in successfully' GROUP BY logins_year", "CHK");
    $pull_data0 = [$pull_data1['message'],$pull_data2['message'],$pull_data3['message']];
    exit(json_encode($pull_data0));
    // print_r($pull_data1);
}

function getTotalUserActivity()
{
    $pull_data1 = check_db_query_staus1("SELECT EXTRACT(WEEk FROM timeIn) AS activity_week, COUNT(*) AS total_activity FROM activity_logs GROUP BY activity_week", "CHK");
    $pull_data2 = check_db_query_staus1("SELECT EXTRACT(MONTH FROM timeIn) AS activity_month, COUNT(*) AS total_activity FROM activity_logs GROUP BY activity_month", "CHK");
    $pull_data3 = check_db_query_staus1("SELECT EXTRACT(YEAR FROM timeIn) AS activity_year, COUNT(*) AS total_activity FROM activity_logs GROUP BY activity_year", "CHK");
    $pull_data0 = [$pull_data1['message'],$pull_data2['message'],$pull_data3['message']];
    exit(json_encode($pull_data0));
    // print_r($pull_data1);
}

function getPresumptiveTax(){
     $pull_data1 = check_db_query_staus1("SELECT * FROM presumptive_tax", "CHK");
     exit(json_encode($pull_data1));
}

function getPresumptiveTaxId($tax_number){
    $check_exist_001 = check_db_query_staus1("SELECT `business_type`, `revenue_return`, `valuation`, `staff_quota` FROM `enumerator_tax_payers` WHERE tax_number='{$tax_number}'",  "CHK");
      
      $all1 = [];
    foreach($check_exist_001['message'] as $key => $items){
        // $all1[] = $items;
        
        foreach($items as $key1 => $itemsInner){
            $all1[$key1] = explode("~", $itemsInner);
            
        }
         
    }

        $business_type =  $all1['business_type'];
      $revenue_return =  $all1['revenue_return'];
      $valuation =  $all1['valuation'];
      $staff_quota =  $all1['staff_quota'];
    $all= [];
   foreach ($staff_quota as $index => $staffQuota) {
    $currentBusinessType = $business_type[$index] ?? null;
      switch ($staffQuota) {
        case '1-9':
            $check_exist1 = check_db_query_staus1("SELECT `id`,`business_type`, `frequency`,`minimum` FROM  `presumptive_tax` WHERE business_type='{$currentBusinessType}'",  "CHK");
            $check_exist1['message']['category'] = 'Micro';
            // exit(json_encode($check_exist1));
            break;
        case '10-29':
            $check_exist1 = check_db_query_staus1("SELECT `id`,`business_type`, `frequency`,`medium` as minimum FROM `presumptive_tax` WHERE business_type='{$currentBusinessType}'",  "CHK");
            $check_exist1['message']['category'] = 'Small';
            //  exit(json_encode($check_exist1));
            break;
        case '30-50':
            $check_exist1 = check_db_query_staus1("SELECT `id`,`business_type`, `frequency`,`maximum` as minimum FROM `presumptive_tax` WHERE business_type='{$currentBusinessType}'",  "CHK");
            $check_exist1['message']['category'] = 'Medium';
        //   exit(json_encode($check_exist1));
            break;
        default:
            exit(json_encode(
          $returnResponse = ['status' => 0, 'message' => "No Taxes"]
            ));
            break;
    }
  
     $all[$index] = $check_exist1['message'];
    }
  exit(json_encode($all));
}

function getTotalUserError()
{
    $pull_data1 = check_db_query_staus1("SELECT EXTRACT(WEEk FROM timeIn) AS error_week, COUNT(*) AS total_error FROM activity_logs WHERE comment LIKE 'Error' GROUP BY error_week", "CHK");
    $pull_data2 = check_db_query_staus1("SELECT EXTRACT(MONTH FROM timeIn) AS error_month, COUNT(*) AS total_error FROM activity_logs WHERE comment LIKE 'Error' GROUP BY error_month", "CHK");
    $pull_data3 = check_db_query_staus1("SELECT EXTRACT(YEAR FROM timeIn) AS error_year, COUNT(*) AS total_error FROM activity_logs WHERE comment LIKE 'Error' GROUP BY error_year", "CHK");
    $pull_data0 = [$pull_data1['message'],$pull_data2['message'],$pull_data3['message']];
    exit(json_encode($pull_data0));
    // print_r($pull_data1);
}

function getApplicableTaxes($tax_number){
    $check_exist_001 = check_db_query_staus1("SELECT * FROM `applicable_taxes` WHERE tax_number='{$tax_number}' AND revenue_head IN ('Witholding Tax (General)', 'Pay As You Earn (PAYE)', 'Environmental Fees', 'Economic Development Levy', 'Renewal of Business Premises', 'Direct Assesment', 'Registration and Renewal of Contractor', 'Renewal of Private Educational Institutions', 'Dealers License', 'Renewl Fee of Evening Continunig Education', 'Renewal of Environmental Contractors/Consultant', 'Registration /RenewaI Fees for Private Medical Clinic', 'Renewal Fees Ambulances', 'Sitting /ApprovaI of GSM Renewal Charges', 'Renewal of Audit Firms', 'Listing & Reco Hotels Tourism Entterp. Fees', 'Right of Way', 'Land Rent — Temporary right of Occupancy', 'Land Use Rent (Privace C/O)')",  "CHK");
    $all = [];
    foreach($check_exist_001['message'] as $key => $items){
      $business_type =  $items['revenue_head_id'];
      $revenue_head =  $items['revenue_head'];
         switch ($revenue_head) {
        case 'Pools Betting License: Issues':
            $check_exist1 = check_db_query_staus1("SELECT * FROM  `revenue_heads` WHERE COL_4 IN ('Witholding Tax (General)', 'Pay As You Earn (PAYE)', 'Environmental Fees', 'Economic Development Levy', 'Renewal of Business Premises')",  "CHK");
            $check_exist1['message']['business_type_id'] = $business_type;
            $check_exist1['message']['business_type'] = $revenue_head;
   
            break;
        case 'Pay As You Earn (PAYE)':
            $check_exist1 = check_db_query_staus1("SELECT * FROM  `revenue_heads` WHERE COL_4 IN ('Witholding Tax (General)', 'Environmental Fees', 'Economic Development Levy', 'Renewal of Business Premises')",  "CHK");
            $check_exist1['message']['business_type_id'] = $business_type;
            $check_exist1['message']['business_type'] = $revenue_head;
          
            break;
        case 'Renewal of Business Premises':
            $check_exist1 = check_db_query_staus1("SELECT * FROM  `revenue_heads` WHERE COL_4 IN ('Witholding Tax (General)', 'Pay As You Earn (PAYE)', 'Environmental Fees', 'Economic Development Levy')",  "CHK");
            $check_exist1['message']['business_type_id'] = $business_type;
            $check_exist1['message']['business_type'] = $revenue_head;
     
            break;
        case 'Witholding Tax (General)':
            $check_exist1 = check_db_query_staus1("SELECT * FROM  `revenue_heads` WHERE COL_4 IN ('Renewal of Business Premises', 'Pay As You Earn (PAYE)', 'Environmental Fees', 'Economic Development Levy')",  "CHK");
            $check_exist1['message']['business_type_id'] = $business_type;
            $check_exist1['message']['business_type'] = $revenue_head;
       
            break;
        case 'Direct Assesment':
            $check_exist1 = check_db_query_staus1("SELECT * FROM  `revenue_heads` WHERE COL_4 IN ('Renewal of Business Premises', 'Pay As You Earn (PAYE)', 'Environmental Fees', 'Economic Development Levy', 'Witholding Tax (General)')",  "CHK");
            $check_exist1['message']['business_type_id'] = $business_type;
            $check_exist1['message']['business_type'] = $revenue_head;
      
            break;
            case 'Registration and Renewal of Contractor':
            $check_exist1 = check_db_query_staus1("SELECT * FROM  `revenue_heads` WHERE COL_4 IN ('Renewal of Business Premises', 'Pay As You Earn (PAYE)', 'Environmental Fees', 'Economic Development Levy', 'Witholding Tax (General)', 'Direct Assesment')",  "CHK");
            $check_exist1['message']['business_type_id'] = $business_type;
            $check_exist1['message']['business_type'] = $revenue_head;
      
            break;
            case 'Renewal of Private Educational Institutions':
            $check_exist1 = check_db_query_staus1("SELECT * FROM  `revenue_heads` WHERE COL_4 IN ('Renewal of Business Premises', 'Pay As You Earn (PAYE)', 'Environmental Fees', 'Economic Development Levy', 'Witholding Tax (General)', 'Direct Assesment')",  "CHK");
            $check_exist1['message']['business_type_id'] = $business_type;
            $check_exist1['message']['business_type'] = $revenue_head;
      
            break;
            case 'Dealers License':
            $check_exist1 = check_db_query_staus1("SELECT * FROM  `revenue_heads` WHERE COL_4 IN ('Renewal of Business Premises', 'Pay As You Earn (PAYE)', 'Environmental Fees', 'Economic Development Levy', 'Witholding Tax (General)', 'Direct Assesment')",  "CHK");
            $check_exist1['message']['business_type_id'] = $business_type;
            $check_exist1['message']['business_type'] = $revenue_head;
      
            break;
            case 'Renewl Fee of Evening Continunig Education':
            $check_exist1 = check_db_query_staus1("SELECT * FROM  `revenue_heads` WHERE COL_4 IN ('Renewal of Business Premises', 'Pay As You Earn (PAYE)', 'Environmental Fees', 'Economic Development Levy', 'Witholding Tax (General)', 'Direct Assesment')",  "CHK");
            $check_exist1['message']['business_type_id'] = $business_type;
            $check_exist1['message']['business_type'] = $revenue_head;
      
            break;
            case 'Renewal of Environmental Contractors/Consultants':
            $check_exist1 = check_db_query_staus1("SELECT * FROM  `revenue_heads` WHERE COL_4 IN ('Renewal of Business Premises', 'Pay As You Earn (PAYE)', 'Environmental Fees', 'Economic Development Levy', 'Witholding Tax (General)', 'Direct Assesment')",  "CHK");
            $check_exist1['message']['business_type_id'] = $business_type;
            $check_exist1['message']['business_type'] = $revenue_head;
      
            break;
            case 'Registration /RenewaI Fees for Private Medical Clinic':
            $check_exist1 = check_db_query_staus1("SELECT * FROM  `revenue_heads` WHERE COL_4 IN ('Renewal of Business Premises', 'Pay As You Earn (PAYE)', 'Environmental Fees', 'Economic Development Levy', 'Witholding Tax (General)', 'Direct Assesment')",  "CHK");
            $check_exist1['message']['business_type_id'] = $business_type;
            $check_exist1['message']['business_type'] = $revenue_head;
      
            break;
             case 'Renewal Fees Ambulances':
            $check_exist1 = check_db_query_staus1("SELECT * FROM  `revenue_heads` WHERE COL_4 IN ('Renewal of Business Premises', 'Pay As You Earn (PAYE)', 'Environmental Fees', 'Economic Development Levy', 'Witholding Tax (General)', 'Direct Assesment')",  "CHK");
            $check_exist1['message']['business_type_id'] = $business_type;
            $check_exist1['message']['business_type'] = $revenue_head;
      
            break;
             case 'Sitting /ApprovaI of GSM Renewal Charges':
            $check_exist1 = check_db_query_staus1("SELECT * FROM  `revenue_heads` WHERE COL_4 IN ('Renewal of Business Premises', 'Pay As You Earn (PAYE)', 'Environmental Fees', 'Economic Development Levy', 'Witholding Tax (General)', 'Direct Assesment')",  "CHK");
            $check_exist1['message']['business_type_id'] = $business_type;
            $check_exist1['message']['business_type'] = $revenue_head;
      
            break;
             case 'Land Rent — Temporary right of Occupancy':
            $check_exist1 = check_db_query_staus1("SELECT * FROM  `revenue_heads` WHERE COL_4 IN (  'Environmental Fees', 'Economic Development Levy', 'Direct Assesment')",  "CHK");
            $check_exist1['message']['business_type_id'] = $business_type;
            $check_exist1['message']['business_type'] = $revenue_head;
      
            break;
            case 'Land Use Rent (Privace C/O)':
            $check_exist1 = check_db_query_staus1("SELECT * FROM  `revenue_heads` WHERE COL_4 IN (  'Environmental Fees', 'Economic Development Levy', 'Direct Assesment')",  "CHK");
            $check_exist1['message']['business_type_id'] = $business_type;
            $check_exist1['message']['business_type'] = $revenue_head;
      
            break;
             case 'Renewal of Driving School':
            $check_exist1 = check_db_query_staus1("SELECT * FROM  `revenue_heads` WHERE COL_4 IN ('Renewal of Business Premises', 'Pay As You Earn (PAYE)', 'Environmental Fees', 'Economic Development Levy', 'Witholding Tax (General)', 'Direct Assesment')",  "CHK");
            $check_exist1['message']['business_type_id'] = $business_type;
            $check_exist1['message']['business_type'] = $revenue_head;
      
            break;
              case 'Renewal of Audit Firms':
            $check_exist1 = check_db_query_staus1("SELECT * FROM  `revenue_heads` WHERE COL_4 IN ('Renewal of Business Premises', 'Pay As You Earn (PAYE)', 'Environmental Fees', 'Economic Development Levy', 'Witholding Tax (General)', 'Direct Assesment')",  "CHK");
            $check_exist1['message']['business_type_id'] = $business_type;
            $check_exist1['message']['business_type'] = $revenue_head;
      
            break;
              case 'Listing & Reco Hotels Tourism Entterp. Fees':
            $check_exist1 = check_db_query_staus1("SELECT * FROM  `revenue_heads` WHERE COL_4 IN ('Renewal of Business Premises', 'Pay As You Earn (PAYE)', 'Environmental Fees', 'Economic Development Levy', 'Witholding Tax (General)', 'Direct Assesment')",  "CHK");
            $check_exist1['message']['business_type_id'] = $business_type;
            $check_exist1['message']['business_type'] = $revenue_head;
      
            break;
              case 'Right of Way':
            $check_exist1 = check_db_query_staus1("SELECT * FROM  `revenue_heads` WHERE COL_4 IN ('Renewal of Business Premises', 'Pay As You Earn (PAYE)', 'Environmental Fees', 'Economic Development Levy', 'Witholding Tax (General)', 'Direct Assesment')",  "CHK");
            $check_exist1['message']['business_type_id'] = $business_type;
            $check_exist1['message']['business_type'] = $revenue_head;
      
            break;
              case 'Renewal of Driving School':
            $check_exist1 = check_db_query_staus1("SELECT * FROM  `revenue_heads` WHERE COL_4 IN ('Renewal of Business Premises', 'Pay As You Earn (PAYE)', 'Environmental Fees', 'Economic Development Levy', 'Witholding Tax (General)', 'Direct Assesment')",  "CHK");
            $check_exist1['message']['business_type_id'] = $business_type;
            $check_exist1['message']['business_type'] = $revenue_head;
      
            break;
        default:
        // $check_exist1 = check_db_query_staus1("SELECT * FROM  `revenue_heads` WHERE COL_4 = '{$revenue_head}'",  "CHK");
        $check_exist1 = ['status' => 0, 'message' => "No Taxes"];
            break;
    }
    $all[$key]= $check_exist1['message'];
    }
    
    exit(json_encode($all));

}

function ApproveRevenueHeadStatus($id){
    exit(json_encode(check_db_query_staus("UPDATE `revenue_head` SET `status`= 1 WHERE `id`='{$id}'", "UPD")));
}

function getActiveUsers(){
    exit(json_encode(check_db_query_staus("SELECT id, COUNT(id) AS id_count FROM users GROUP BY id", "UPD")));
}


function getAllMdaUsers(){
    exit(json_encode(check_db_query_staus1("SELECT id, name, email FROM mda_users", "CHK")));
}
