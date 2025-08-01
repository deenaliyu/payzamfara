let USER_SESSION = localStorage.getItem("MDAINFO");
let finalUSER_SESSION = JSON.parse(USER_SESSION);
let mdaID = finalUSER_SESSION.fullname;


async function fetchPayment() {
  $("#recentPayment").html("");
  $("#loader").css("display", "flex");

  const response = await fetch(
    `${HOST}/php/index.php?getPaymentByMda&mda_name=${mdaID}`
  );
  const paymentHistory = await response.json();
  console.log(paymentHistory);
  $("#loader").css("display", "none");
  if (paymentHistory.status === 1) {

    paymentHistory.message.forEach((payment, i) => {
      const userInvoice = paymentHistory.message[i];
      var date = new Date(payment.timeIn);
      var year = date.getFullYear();
      var month = ('0' + (date.getMonth() + 1)).slice(-2);
      var day = ('0' + date.getDate()).slice(-2);

      var formattedDate = year + '-' + month + '-' + day;
      $("#recentPayment").append(`
          <tr>
          <td>${i + 1}</td>
          <td>${payment.first_name} ${payment.surname} </td>
          <td>${payment.COL_4} </td>
          <td>&#8358;${parseFloat(payment.amount_paid).toLocaleString()} </td>
          <td>${formattedDate}</td>
          </tr>
          `);

    })

  } else {
    $("#dataTable").DataTable();
  }
}

fetchPayment().then(yy => {
  $("#dataTable").DataTable()
});

let ttRem = null
let totalInv = null

async function getDashboardAnalyticsAdmin() {

  const response = await fetch(`${HOST}/php/index.php?dashboardAnalyticsMda&id=${mdaID}`);
  const dashboardAnalytics = await response.json();

  const tttt = document.getElementById("dashboardPie")

  $("#totalInv").html(dashboardAnalytics.total_invoice.toLocaleString())
  $("#totalRem").html("₦" + dashboardAnalytics.total_amount_paid.toLocaleString())



  var chartDom = document.getElementById('dashboardPie');
  var myChart = echarts.init(chartDom);
  var option;

  option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: 'Total',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },

        labelLine: {
          show: false
        },
        data: [
          { value: dashboardAnalytics.total_amount_invoiced, name: 'Total Amount Invoiced' },
          { value: dashboardAnalytics.total_amount_paid, name: 'Total Amount Paid' }
          // { value: dashboardAnalytics.due_invoices, },
          // { value: dashboardAnalytics.due_amount,},
        ]
      }
    ]
  };


  option && myChart.setOption(option);

  fetchInvoicess(dashboardAnalytics.due_invoices, dashboardAnalytics.total_invoice_paid)
}

getDashboardAnalyticsAdmin();

async function fetchInvoicess(dash, dash1) {
  const response = await fetch(
    `${HOST}/php/index.php?AllInvoices`
  );
  const userInvoices = await response.json();

  if (userInvoices.status === 1) {
    let theMDAInv = userInvoices.message.filter(inv => inv.COL_3 === mdaID)
    let totalInv = theMDAInv.length
    // console.log(totalInv)

    var chartDom = document.getElementById('dashboardPi');
    var myChart = echarts.init(chartDom);
    var option;

    option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: 'Total',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },

          labelLine: {
            show: false
          },
          data: [
            { value: dash1, name: 'total invoice paid' },
            { value: dash, name: 'due invoices' }
          ]
        }
      ]
    };

    option && myChart.setOption(option);

  } else {

  }
}




