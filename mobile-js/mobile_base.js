$(".arrow-icon").click(function () {
  $("#full-details").slideToggle("fast");
});

$(document).on('click', '#first-arrow-down', function (e) {
 $(this).toggleClass("fa-rotate-90");
});

//Added color timeAndsales table
var rows = document.getElementById("timeAndsales-data-table-id").getElementsByTagName("tbody")
[0].getElementsByTagName("tr");

for (var i = 0; i < rows.length; i++) {
 var cells = rows[i].getElementsByTagName('td');
 if (cells[1].innerText == 'Sell') {
   rows[i].className = "red";
 }
 if (cells[1].innerText == 'Buy') {
   rows[i].className = "green";
 }
}

function makeLI (array) {

  var dom_ul = document.getElementById('slide-container')
  for (var i = 1; i < array.news.length; i++) {
    if (i == 4){
      break;
    }
    var item = document.createElement('li');
    item.classList.add('li-side');
    item.innerHTML = `
      <span><i class="fa fa-volume-up icon-alert" aria-hidden="true"></i></span>
      <span class="news-text"> ${array.news[i][3]} </span>
      <span><i class="fa-solid fa-xmark"></i></span>
          `
    dom_ul.appendChild(item);
  }
  $(".slide").inewsticker({
    speed:3000, // text change speed
    effect:"slide", // fade, slide or typing
    dir:"ltr", // ltr or rtl
    delay_after:100 //  text speed delay after
  });
}

var dom_ul = document.getElementById('slide-container')
// load news tab on click news_slider
dom_ul.addEventListener("click", function () {
  var news_tab = document.getElementById("nav-news-tab")
  news_tab.click()
})

//Chart display none and block
var income_statement_quarter = document.getElementById("scrolling-container-income-statement-quarter");
var income_statement_annual = document.getElementById("scrolling-container-income-statement-annual");
var balance_sheet_quarter = document.getElementById("scrolling-container-balance-sheet-quarter");
var balance_sheet_annual = document.getElementById("scrolling-container-balance-sheet-annual");
var cash_flow_quarter = document.getElementById("scrolling-container-cash-flow-quarter");
var cash_flow_annual = document.getElementById("scrolling-container-cash-flow-annual");
var stock_info_first_container = document.getElementById("stock-info_first_container");
var stock_info_income_table = document.getElementById("stock-info-income-statement-table-container");
var stock_info_balance_table = document.getElementById("stock-info-balance-table-container");
var stock_info_cashflow_table = document.getElementById("stock-info-cashflow-table-container");
var stock_info_holding_table = document.getElementById("stock-info-holding-table-container");

var minute_tab = document.getElementById("nav-minute-tab");
var pro_tab = document.getElementById("nav-pro-tab");

var minute_chart = document.getElementById("tv_chart_container");
var pro_chart = document.getElementById("tv_chart_container_advanced");

income_statement_quarter.style.display = "none";
income_statement_annual.style.display = "block";

balance_sheet_quarter.style.display = "none";
balance_sheet_annual.style.display = "block";

cash_flow_quarter.style.display = "none";
cash_flow_annual.style.display = "block";

minute_chart.style.display = "block";
pro_chart.style.display = "none";

function getIncStatementAnnualData() {
    income_statement_annual.style.display = "block";
    income_statement_quarter.style.display = "none";
    setTimeout(function () {TableTdOptimizer(income_statement_annual,'.scroll-row-income-annual');}, 500);
}
function getIncStatementQuarterlyData() {
    income_statement_quarter.style.display = "block";
    income_statement_annual.style.display = "none";
    setTimeout(function () {TableTdOptimizer(income_statement_quarter,'.scroll-row-income-quarter');}, 500);
}
function getBalanceAnnualData() {
    balance_sheet_annual.style.display = "block";
    balance_sheet_quarter.style.display = "none";
    setTimeout(function () {TableTdOptimizer(balance_sheet_annual,'.scroll-row-balance-annual');}, 500);
}
function getBalanceQuarterlyData() {
    balance_sheet_quarter.style.display = "block";
    balance_sheet_annual.style.display = "none";
    setTimeout(function () {TableTdOptimizer(balance_sheet_quarter,'.scroll-row-balance-quarter');}, 500);
}
function getCashFlowAnnualData() {
    cash_flow_annual.style.display = "block";
    cash_flow_quarter.style.display = "none";
    setTimeout(function () {TableTdOptimizer(cash_flow_annual,'.scroll-row-cash-annual');}, 500);
}
function getCashFlowQuarterlyData() {
    cash_flow_quarter.style.display = "block";
    cash_flow_annual.style.display = "none";
    setTimeout(function () {TableTdOptimizer(cash_flow_quarter,'.scroll-row-cash-quarter');}, 500);
}
function getIncomeTable() {
    stock_info_income_table.style.display = 'block';
    stock_info_first_container.style.display = 'none';
    setTimeout(function () {TableTdOptimizer(income_statement_annual,'.scroll-row-income-annual');}, 500);
}
function getBalanceTable() {
    stock_info_balance_table.style.display = 'block';
    stock_info_first_container.style.display = 'none';
    setTimeout(function () {TableTdOptimizer(balance_sheet_annual,'.scroll-row-balance-annual');}, 500);
}
function getCashFlowTable() {
    stock_info_cashflow_table.style.display = 'block';
    stock_info_first_container.style.display = 'none';
    setTimeout(function () {TableTdOptimizer(cash_flow_annual,'.scroll-row-cash-annual');}, 500);
}
function getHoldingTable() {
    stock_info_holding_table.style.display = 'block';
    stock_info_first_container.style.display = 'none';
}
function backToFinancialChart() {
    stock_info_first_container.style.display = 'block';
    stock_info_income_table.style.display = 'none';
    stock_info_balance_table.style.display = 'none';
    stock_info_cashflow_table.style.display = 'none';
    stock_info_holding_table.style.display = 'none';
}

minute_tab.addEventListener('click', function () {
    minute_chart.style.display = "block";
    pro_chart.style.display = "none";
})

pro_tab.addEventListener('click', function () {
    pro_chart.style.display = "block";
    minute_chart.style.display = "none";
})


function openmodal_pro_chart() {
  $("#pro_modal_chart").addClass('pro_modal_chart_container');
  $("#pro_modal_chart").show();
}


$('#backToHomepageProChart').on('click', function() {
  $("#pro_modal_chart").hide();
   minute_chart.style.display = "block";
});

function TableTdOptimizer(scrollableDiv ,selector)
{
  var totalWidth = scrollableDiv.scrollWidth - scrollableDiv.clientWidth;
  scrollableDiv.addEventListener('scroll', () => {
    var scrollLeft = scrollableDiv.scrollLeft;
    var ratio = scrollLeft / totalWidth;
    var newWidth = 230 - (230 * ratio);

    if (newWidth < 100) {
      return;
    }

    var boxes = document.querySelectorAll(selector);
    for (var i = 0; i < boxes.length; i++) { 
      boxes[i].style.maxWidth  = newWidth + "px";   
    }
});

}