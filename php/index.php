<?php

declare(strict_types=1);
// header('Content-type:application/json;charset=utf-8');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
  include 'gate.php';
  if (isset($_GET['login'])) {
    $username = (string) $_GET['email'];
    $password = (string) $_GET['password'];
    login($username, $password);
  } elseif (isset($_GET['loginAdmin'])) {
    $username = (string) $_GET['email'];
    $password = (string) $_GET['password'];
    loginAdmin($username, $password);
  } elseif (isset($_GET['enumerator_users_login'])) {
    $username = (string) $_GET['email'];
    $password = (string) $_GET['password'];
    enumerator_users_login($username, $password);
  } elseif (isset($_GET['loginMda'])) {
    $username = (string) $_GET['email'];
    $password = (string) $_GET['password'];
    loginMda($username, $password);
  } elseif (isset($_GET['getMDAs'])) {
    getMDAs();
  } elseif (isset($_GET['getEnumerationAgent'])) {
    getEnumerationAgent($_GET['id']);
  } elseif (isset($_GET['getAllRevenueHeads'])) {
    getRevenueHead();
  } elseif (isset($_GET['getEnumerationAgentDashboard'])) {
    getEnumerationAgentDashboard();
  } elseif (isset($_GET['getEnumerationSpecificAgentDashboard'])) {
    getEnumerationSpecificAgentDashboard();
  } elseif (isset($_GET['getEnumerationCategoryDashboard'])) {
    getEnumerationCategoryDashboard();
  } elseif (isset($_GET['getMDAsRevenueHeads'])) {
    getMDAsRevenueHead($_GET['mdName']);
  } elseif (isset($_GET['getMDAsRevenueHeadId'])) {
    getMDAsRevenueHeadId($_GET['id']);
  } elseif (isset($_GET['getMDA'])) {
    getIndustries();
  } elseif (isset($_GET['mdaPassword'])) {
    mdaPassword($_GET);
  } elseif (isset($_GET['updateMDA'])) {
    updateMDA($_GET);
  } elseif (isset($_GET['deleteMDA'])) {
    deleteMDA($_GET['mda_id']);
  } elseif (isset($_GET['deleteRevenueHead'])) {
    deleteRevenueHead($_GET['id']);
  } elseif (isset($_GET['updateRevenueHead'])) {
    updateRevenueHead($_GET);
  } elseif (isset($_GET['generateInvoices'])) {
    generateInvoice($_GET['taxPayerNumber']);
  } elseif (isset($_GET['generateSingleInvoices'])) {
    generateSignleInvoice($_GET);
  } elseif (isset($_GET['updateTaxPayer'])) {
    updateTaxPayer($_GET);
  } elseif (isset($_GET['getTaxPayer'])) {
    getTaxPayerList($_GET);
  } elseif (isset($_GET['getSingleTaxPayer'])) {
    getSingleTaxPayerList($_GET['id']);
  } elseif (isset($_GET['fetchPayment'])) {
    fetchPayment($_GET);
  } elseif (isset($_GET['fetchAllPayment'])) {
    fetchAllPayment();
  } elseif (isset($_GET['AllInvoices'])) {
    getAllInvoice($_GET);
  } elseif (isset($_GET['getInvoicesGeneratedBasedOnCategories'])) {
    getAnalyticInvoice();
  } elseif(isset($_GET['getAnalyticPaidInvoiceBasedOnCategories'])){
      getInvoicesPaidBasedOnCategories();
  } elseif(isset($_GET['getAnalyticsTINRequestPerMonth'])){
      getAnalyticsTINRequestPerMonth();
  }elseif(isset($_GET['getAnalyticsTINRequestPerDAYWEEKMONTH'])){
      getAnalyticsTINRequestPerDAYWEEKMONTH();
  }elseif (isset($_GET['verifyInvoice'])) {
    verifyInvoice($_GET['invoice_number']);
  } elseif (isset($_GET['userInvoices'])) {
    userInvoices($_GET['payer_id']);
  } elseif (isset($_GET['sendSMS'])) {
    sendSMS($_GET['number'], $_GET['msg']);
  } elseif (isset($_GET['getSingleInvoice'])) {
    userInvoiceSingle($_GET['invoiceNumber']);
  } elseif (isset($_GET['getDashboardAnalytics'])) {
    dashboardAnalyticsEndUser($_GET['user_id']);
  } elseif (isset($_GET['UpdateTaxPayersTINStatus'])) {
    UpdateTINStatus($_GET);
  } elseif (isset($_GET['usersParticularMDA'])) {
    ParticularMDAUsers($_GET['mda_id']);
  } elseif (isset($_GET['updatePendingPayentStatus'])) {
    updatePendingPayentStatus($_GET['user_id']);
  } elseif (isset($_GET['getDashboardAnalyticsAdmin'])) {
    dashboardAnalyticsAdmin();
  } elseif (isset($_GET['getAdminUser'])) {
    getAdminUsers();
  } elseif (isset($_GET['updateAdminUser'])) {
    updateAdminUser($_GET);
  } elseif (isset($_GET['deleteAdminUser'])) {
    deleteAdminUser($_GET['id']);
  } elseif (isset($_GET['getMDACollections'])) {
    getMDACollectionPayments($_GET['mda_id']);
  } elseif (isset($_GET['updateMDAUser'])) {
    updateMDAUser($_GET);
  } elseif (isset($_GET['deleteMDAUser'])) {
    deleteMDAUser($_GET['id']);
  } elseif (isset($_GET['sendEmail'])) {
    verifyEmail($_GET['id']);
  } elseif (isset($_GET['activateAcount'])) {
    UpdateAccountStatus($_GET);
  } elseif (isset($_GET['smsVerify'])) {
    verifySms($_GET);
  } elseif (isset($_GET['smsUpdateAccount'])) {
    UpdateAccountStatusSms($_GET);
  } elseif (isset($_GET['getMDAsCount'])) {
    getMDAsCount();
  } elseif (isset($_GET['getRevenueCount'])) {
    getRevenueCount();
  } elseif (isset($_GET['verifyAdminUser'])) {
    verifyAdminUser($_GET);
  } elseif (isset($_GET['sendContactEmail'])) {
    sendContactEmail($_GET);
  } elseif (isset($_GET['getBanners'])) {
    getBanners($_GET);
  } elseif (isset($_GET['deleteBanner'])) {
    deleteBanner($_GET['id']);
  } elseif (isset($_GET['getContactUs'])) {
    getContactUs($_GET);
  } elseif (isset($_GET['getOurServices'])) {
    getOurServices($_GET);
  } elseif (isset($_GET['deleteOurServices'])) {
    deleteOurServices($_GET['id']);
  } elseif (isset($_GET['userProfile'])) {
    userProfile($_GET['id']);
  }elseif (isset($_GET['userProfileAdmin'])) {
    userProfileAdmin($_GET['id']);
  } elseif (isset($_GET['userPassword'])) {
    updatePassword($_GET);
  } elseif (isset($_GET['getTaxClearanceCert'])) {
    getTaxClearanceCert();
  } elseif (isset($_GET['getTINRequest'])) {
    getTINRequest($_GET['user_id']);
  } elseif (isset($_GET['getTaxFiling'])) {
    getTaxFiling($_GET['user_id']);
  } elseif (isset($_GET['checkStatus'])) {
    checkStatus($_GET);
  } elseif (isset($_GET['resetPassword'])) {
    resetPassword($_GET);
    // print_r($data['data']);
  } elseif (isset($_GET['applicableTaxes'])) {
    applicableTaxes($_GET);
    // print_r($data['data']);
  } elseif (isset($_GET['getUserApplicableTax'])) {
    getUserApplicableTax($_GET);
    // print_r($data['data']);
}elseif (isset($_GET['changePassword'])) {
  changePassword($_GET);
  // print_r($data['data']);
}elseif (isset($_GET['getAllTaxFiling'])) {
  getTaxFilingAdmin();
  // print_r($data['data']);
}elseif (isset($_GET['getAllTinRequest'])) {
  getAllTinRequest();
  // print_r($data['data']);
}elseif (isset($_GET['getActivityLogs'])) {
  getActivityLogs($_GET['userId'], $_GET['user_category']);
  // print_r($data['data']);
}elseif (isset($_GET['getAllActivityLogs'])) {
  getAllActivityLogs();
  // print_r($data['data']);
}elseif (isset($_GET['getTaxFilingByUser'])) {
  getTaxFilingByUser($_GET['id']);
  // print_r($data['data']);
}elseif (isset($_GET['getTaxFilingById'])) {
  getTaxFilingById($_GET['id']);
  // print_r($data['data']);
}elseif (isset($_GET['getTinRequestById'])) {
  getTinRequestById($_GET['id']);
  // print_r($data['data']);
}elseif (isset($_GET['getCMS'])) {
  getcmsCreation();
  // print_r($data['data']);
}elseif (isset($_GET['getSupportByMdaId'])) {
  getSupportByMdaId($_GET['mda_id']);
  // print_r($data['data']);
}elseif (isset($_GET['getSupportByEnumId'])) {
  getSupportByEnumId($_GET['id']);
  // print_r($data['data']);
}elseif (isset($_GET['getSupportById'])) {
  getSupportById($_GET['id']);
  // print_r($data['data']);
}elseif (isset($_GET['getSupportByUser'])) {
  getSupportByUser($_GET['user_id']);
  // getSupportByUser
  // print_r($data['data']);
}elseif (isset($_GET['getSupport'])) {
  getSupport();
  // print_r($data['data']);
}elseif (isset($_GET['approveSupport'])) {
  approveSupport($_GET['id']);
  // print_r($data['data']);
}elseif (isset($_GET['approveTaxFiling'])) {
  approveTaxFiling($_GET['amount'], $_GET['id']);
  // print_r($data['data']);
}elseif (isset($_GET['approveTaxcert'])) {
  approveTaxcert($_GET['id']);
  // print_r($data['data']);
}elseif (isset($_GET['getTaxClearanceById'])) {
  getTaxClearanceById($_GET['id']);
}elseif (isset($_GET['approveTinRequest'])) {
  approveTinRequest($_GET['id']);
  // print_r($data['data']);
}elseif (isset($_GET['MailTinRequest'])) {
  MailTinRequest($_GET);
  // print_r($data['data']);
}elseif (isset($_GET['getTaxClearanceByReference'])) {
  getTaxClearanceByReference($_GET);
  // print_r($data['data']);
} elseif (isset($_GET['deleteCMS'])) {
  deleteCMS($_GET['cms_id']);
}elseif (isset($_GET['getChat'])) {
  getChat($_GET['ticket_number']);
}elseif (isset($_GET['averagePaymentTime'])) {
  averagePaymentTime();
}elseif (isset($_GET['updateRevenueHeadStatus'])) {
  approveRevenueHead($_GET['id']);
}elseif (isset($_GET['getRevenueHeadByStatus'])) {
  getMDAsRevenueHeadByStatus($_GET);
}elseif (isset($_GET['getEnumUser'])) {
  getEnumerators();
}elseif (isset($_GET['getEnumerationTaxPayer'])) {
  getEnumerationTaxPayer();
}elseif (isset($_GET['getEnumerationTaxPayerById'])) {
  getEnumerationUserId($_GET['id']);
}elseif (isset($_GET['getMDAById'])) {
  getMDAById($_GET['id']);
}elseif (isset($_GET['getOffice'])) {
  getOffice($_GET['office_type']);
}elseif (isset($_GET['getPaymentByMda'])) {
  getPaymentByMdaName($_GET['mda_name']);
}elseif (isset($_GET['changePasswordEnum'])) {
  changePasswordEnumerator($_GET);
  // print_r($data['data']);
}elseif (isset($_GET['sendEmailEnum'])) {
    verifyEmailEnum($_GET['id']);
  } elseif (isset($_GET['activateAcountEnum'])) {
    UpdateAccountStatusEnum($_GET);
  } elseif (isset($_GET['smsVerifyEnum'])) {
    verifySmsEnum($_GET);
  } elseif (isset($_GET['smsUpdateAccountEnum'])) {
    UpdateAccountStatusSmsEnum($_GET);
  }elseif (isset($_GET['getcashPayment'])) {
    getcashPayment($_GET['mda_id']);
  }elseif (isset($_GET['getInvoiceByMda'])) {
    getInvoiceByMdaName($_GET['mda_name']);
  }elseif (isset($_GET['getMDALGAPerformance'])) {
    getMDALGAPerformance($_GET);
  }elseif (isset($_GET['getMDAPerformance'])) {
    getMDAPerformance($_GET);
  }elseif (isset($_GET['getAdminRoles'])) {
    getRolesAdmin($_GET['id']);
  }elseif (isset($_GET['getMdaRoles'])) {
    getMdaRoles($_GET['id']);
  }elseif (isset($_GET['getTotalUserLogins'])) {
    getTotalUserLogins();
  }elseif (isset($_GET['getTotalUserActivity'])) {
    getTotalUserActivity();
  }elseif (isset($_GET['getPresumptiveTax'])) {
    getPresumptiveTax();
  }elseif (isset($_GET['getPresumptiveTaxId'])) {
    getPresumptiveTaxId($_GET['tax_number']);
  }elseif (isset($_GET['getTotalUserError'])) {
    getTotalUserError();
  }


} elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {
  include 'gate.php';
  $entityBody = file_get_contents('php://input');
  // price_update_add($entityBody);
  if (!empty($entityBody)) {
    $data = (array) json_decode($entityBody);
    if ($data['endpoint'] == "createAdmin") {
      createUser($data['data']);
    } elseif ($data['endpoint'] == "createMDA") {
      createMDA($data['data']);
    } elseif ($data['endpoint'] == "createCMS") {
      cmsCreation($data['data']);
    }elseif ($data['endpoint'] == "createSupport") {
      supportCreation($data['data']);
    }elseif ($data['endpoint'] == "cmsUpdate") {
      cmsUpdate($data['data']);
    } elseif ($data['endpoint'] == "createMultipleMDA") {
      createMultipleMDAs($data['data']);
      //  print_r($data['data']);
    } elseif ($data['endpoint'] == "createMDAPaymentForm") {
      createMDAPaymentForm($data['data']);
    } elseif ($data['endpoint'] == "createMDArHead") {
      createMDARevenueHeads($data['data']);
    } elseif ($data['endpoint'] == "createMultplerHead") {
      createMultpleMDARevenueHeads($data['data']);
      // print_r($data['data']);
    } elseif ($data['endpoint'] == "createInvidualPayment") {
      // print_r($data['data']);
      paymentToMDARevenueHeads($data['data']);
    } elseif ($data['endpoint'] == "createPayerAccount") {
      createPayerUser($data['data']);
    }elseif ($data['endpoint'] == "chat") {
      chat($data['data']);
    } elseif ($data['endpoint'] == "sendSMS") {
      createPayerUser($data['data']);
    } elseif ($data['endpoint'] == "createMDAUser") {
      createMDAUser($data['data']);
    } elseif ($data['endpoint'] == "pendingPaymentList") {
      pendingPaymentList($data['data']);
    } elseif ($data['endpoint'] == "updatePixAdmin") {
      updateProfillePixAdmin($data['data']);
    }elseif ($data['endpoint'] == "updatePix") {
      updateProfillePix($data['data']);
    } elseif ($data['endpoint'] == "createBanners") {
      createBanners($data['data']);
    } elseif ($data['endpoint'] == "insertContactUs") {
      insertContactUs($data['data']);
    } elseif ($data['endpoint'] == "insertOurServices") {
      insertOurServices($data['data']);
    } elseif ($data['endpoint'] == "createTaxClearanceCert") {
      // print_r($data['data']);
      createTaxClearanceCert($data['data']);
    } elseif ($data['endpoint'] == "createTINRequest") {
      // print_r($data['data']);
      createTINRequest($data['data']);
    } elseif ($data['endpoint'] == "insertTaxFiling") {
      // print_r($data['data']);
      insertTaxFiling($data['data']);
    }
    elseif ($data['endpoint'] == "createEnumUser") {
    //   print_r($data['data']);
      createEnumerator($data['data']);
    } elseif ($data['endpoint'] == "createEnumTaxPayer") {
    //   print_r($data['data']);
      createEnumerationTax($data['data']);
    }elseif ($data['endpoint'] == "createOffices") {
      //   print_r($data['data']);
      createOffice($data['data']);
      } elseif ($data['endpoint'] == "updatePixEnum") {
      updatePixEnum($data['data']);
    }elseif ($data['endpoint'] == "createCashPayment") {
      // print_r($data['data']);
      createCashPayment($data['data']);
    }
  }
} elseif ($_SERVER['REQUEST_METHOD'] == 'PUT') {
  include 'gate.php';
  $entityBody = file_get_contents('php://input');
  // price_update_add($entityBody);
  if (!empty($entityBody)) {
    $data = (array) json_decode($entityBody);
    if ($data['endpoint'] == "updateProfile") {
      // print_r($data['data']);
      updateProfile($data['data']);
    } elseif ($data['endpoint'] == "updateBanners") {
      // print_r($data['data']);
      updateBanners($data['data']);
    } elseif ($data['endpoint'] == "updateOurServices") {
      // print_r($data['data']);
      updateOurServices($data['data']);
    } elseif ($data['endpoint'] == "updateContactUs") {
      // print_r($data['data']);
      updateContactUs($data['data']);
    }
  }
}
