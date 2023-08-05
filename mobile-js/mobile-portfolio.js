 // var portfolio_colors = ["#0ba68a", "#6C0BA9", '#5c7bd9',"#ffbc00","#fa3364","#46B950","#FC8452","#EF629E"];
var portfolio_colors = ["#5470c6", "#91cc75", '#fac858', "#ee6666", "#73c0de", "#3ba272", "#fc8452", "#9a60b4"];

var last_selected_client_code = system_user_role == 'client' ? system_username : window.localStorage.getItem('last_selected_client_code') || '';

$("#global_client_code").val(last_selected_client_code);

$(document).ready(function () {
  if (system_user_role == 'associate') {
    portfolio_associate_code('.mobile-portfolio-select');
  } else {
    load_portfolio();
    get_mobile_order_list(last_selected_client_code);
    get_mobile_history_list(last_selected_client_code);
  }

  // $("#nav-orderlist-tab").click(function () {
  //   get_mobile_order_list(last_selected_client_code);
  // });

  // $("#nav-history-tab").click(function () {
  //   get_mobile_history_list(last_selected_client_code);
  // });

});

$('.mobile-portfolio-select').on('change', function () {
  if (last_selected_client_code == null || last_selected_client_code == '' || last_selected_client_code != this.value) {
    window.localStorage.setItem('last_selected_client_code', this.value);
    set_client_code_data(this.value);
  } else {
    set_client_code_data(last_selected_client_code);
  }
});

function get_mobile_order_list(last_client_code) {
  // localStorage.getItem('portfolio') !== null ? localStorage.removeItem('portfolio') : null;
  // localStorage.getItem('history') !== null ? localStorage.removeItem('history') : null; 

  $.get('live_orders/mobile_portfolio_handler', { type: 'all', clientCode: last_client_code, order: 'True' }, function (data) {
    $('#accordion1').html(data)  
    getListOrder()
  }); 
} 
 
function get_mobile_history_list(last_client_code) {
  // localStorage.getItem('portfolio') !== null ? localStorage.removeItem('portfolio') : null;
  // localStorage.getItem('order') !== null ? localStorage.removeItem('order') : null; 

  $.get('live_orders/mobile_portfolio_handler', { type: 'all', clientCode: last_client_code, order: 'False' }, function (data) {
    $('#accordion2').html(data)  
    getListHistory() 
  });
}

async function load_portfolio() {
  var saleable_data = await getSaleableData(last_selected_client_code);
  var bo_data = await getBoData(last_selected_client_code);
  get_portfolio_data(saleable_data, bo_data)  
}

function get_portfolio_data(saleableData, bodata) {
  var value = [];
  var otherCost = 0;
  var otherPerc = 0;
  var ticker = [];
  portfolioMobilePieChartOption.series[0].data = [];

  var total_cost = saleableData[1].sum_totalcost == undefined ? 0 : saleableData[1].sum_totalcost;
  var total_limit = bodata.b_limit == undefined ? 0 : bodata.b_limit;
  var cash_available = total_cost - total_limit;
  var total_portfolio = total_cost + total_limit;
  var cash_per = total_limit == 0 ? 0 : ((cash_available / total_limit) * 100).toFixed(2);
  var portfolio_per = total_limit == 0 ? 0 : ((total_portfolio / total_limit) * 100).toFixed(2);

  // summary data
  $("#total_gain").html(saleableData[1].sum_totalgain == undefined ? '' : saleableData[1].sum_totalgain.toFixed(2));
  $("#gain_per").html(saleableData[1].sum_gain_per == undefined ? '' : saleableData[1].sum_gain_per + "%");
  $("#total_value").html(saleableData[1].sum_totalvalue == undefined ? '' : saleableData[1].sum_totalvalue.toFixed(2));
  $("#total_cost").html(total_cost.toFixed(2));
  $("#cash_available").html(cash_available.toFixed(2));
  $("#total_portfolio").html(total_portfolio.toFixed(2));
  $("#cash_per").html(cash_per + "%");
  $("#portfolio_per").html(portfolio_per + "%");

  var ul = document.getElementById("accordion");
  ul.innerHTML = '';

  var table = document.querySelector('#chart_table');
  table.innerHTML = '';
  var row = '';
  var column = '';

  for (var i = 0; i < saleableData[0]?.length; i++) {
    saleableData[0].sort((a, b) => b.totalcost - a.totalcost);
    var colorclass = null;
    if (parseInt(saleableData[0][i].qty) * parseFloat(saleableData[0][i].ltp) > parseFloat(saleableData[0][i].totalcost)) {
      colorclass = 'up'
    }
    if (parseInt(saleableData[0][i].qty) * parseFloat(saleableData[0][i].ltp) < parseFloat(saleableData[0][i].totalcost)) {
      colorclass = 'down'
    }
    if (parseInt(saleableData[0][i].qty) * parseFloat(saleableData[0][i].ltp) == parseFloat(saleableData[0][i].totalcost)) {
      colorclass = 'neutral'
    }
    // insert data into portfolio section
    var li = document.createElement("li");
    var uniqueId = "portfolio_" + i;
    li.setAttribute("data-index", uniqueId);
    li.classList.add("portfolio-portfolio-list")
    li.innerHTML = `
                <div class="portfolio-mobile-link portfolio-mobile-link-portfolio">
                <div align="left">
                  <div>
                      <span class="portfolio-mobile-click">
                      <span class="portfolio-mobile-row-acc-icon"><i class="fa fa-chevron-down"></i></span>
                      <span id="ticker" class="portfolio-mobile-row-titles">${saleableData[0][i].symbol}</span>
                      </span>
                  </div>
                  <div>
                    <span class="portfolio-mobile-row-sub-titles">${saleableData[0][i].qty}</span>
                    <i class="fa fa-at portfolio-mobile-right-icon" aria-hidden="true"></i>
                    <span class="portfolio-mobile-row-sub-titles">${saleableData[0][i].avgcost}Tk</span><br />
                  </div>
                </div>
                <div  align="center">
                      <button onclick="placeorder('${saleableData[0][i].symbol + '.' + saleableData[0][i].board}','BUY')" class="btn portfolio-mobile-new-buy-order" title="Place BUY Order" >
                      BUY
                      </button>
                      <button onclick="placeorder('${saleableData[0][i].symbol + '.' + saleableData[0][i].board}','SELL')" class="btn portfolio-mobile-new-sell-order ml-1" title="Place SELL Order">
                      SELL
                      </button>
                  </div>
                  
                  <div align="right" class=" d-flex flex-column"> 

                      <span class="portfolio-mobile-prices ${colorclass}">${saleableData[0][i].gain}</span> 
                      <span class="portfolio-mobile-volumes ${colorclass}">${saleableData[0][i].gain_per}%</span> 

                  </div>

                </div> 
              </div>

              <ul class="portfolio-mobile-submenu">
                <li>
                  <div class="portfolio-mobile-containers">
                    <div class="portfolio-mobile-row">
                      <div class="portfolio-mobile-column-left portfolio-mobile-detail-row-titles green">
                        Buy
                      </div>
                    </div>

                    <div class="portfolio-mobile-row">
                      <div class="portfolio-mobile-column-left">
                        <span class="portfolio-mobile-row-sub-titles">${saleableData[0][i].avgcost}</span>
                        <span>
                          <i class="fa fa-arrow-right portfolio-mobile-right-icon" aria-hidden="true"></i>
                        </span>
                        <span class="portfolio-mobile-row-sub-titles">${saleableData[0][i].ltp}</span><br />
                      </div>
                    </div>

                    <div class="portfolio-mobile-row">
                      <div>
                        2022.06.13 14:54
                      </div>
                    </div>
                    <div class="portfolio-mobile-detail-list">
                      <div class="portfolio-mobile-detail-row-sub-titles">
                        S/L
                      </div>
                      <span class="portfolio-mobile-column-value-right">-</span>
                      <div class="portfolio-mobile-detail-row-sub-titles">
                        T/P
                      </div>
                      <span class="portfolio-mobile-column-right">-</span>
                      <div class="portfolio-mobile-detail-row-sub-titles">
                        ID
                      </div>
                      <span class="portfolio-mobile-column-value-right">-</span>
                      <div class="portfolio-mobile-detail-row-sub-titles">
                        Cost
                      </div>
                      <span class="portfolio-mobile-column-right">${saleableData[0][i].totalcost}</span>
                      <div class="portfolio-mobile-detail-row-sub-titles">
                        Quantity
                      </div>
                      <span class="portfolio-mobile-column-value-right">${saleableData[0][i].qty}</span>
                      <div class="portfolio-mobile-detail-row-sub-titles">
                        Comm.
                      </div>
                      <span class="portfolio-mobile-column-right">-</span>
                    </div>
                  </div>
                </li>
                 
              </ul>
    `
    ul.appendChild(li);

    // insert saleable data into portfolio chart
    if (i > 6) {
      otherCost += saleableData[0][i].totalcost;
      otherPerc += saleableData[0][i].invest_per;
    }
    else {
      value.push(saleableData[0][i].totalcost);
      ticker.push(saleableData[0][i].symbol);
      portfolioMobilePieChartOption.series[0].data.push({ value: value[i], name: ticker[i] })

      // portfolio table - Up to 7 items
      row = document.createElement('tr');
      row.classList.add('portfolio-mobile-data-table-row');

      column = document.createElement('td');
      column.classList.add('data-table-row-column');
      column.textContent = saleableData[0][i].symbol + "-";
      column.style.color = portfolio_colors[i % portfolio_colors.length];
      // console.log(column.style.color)
      row.appendChild(column);

      column = document.createElement('td');
      column.classList.add('data-table-row-column');
      column.textContent = (saleableData[0][i].totalcost / 1000).toLocaleString('en-US', { maximumFractionDigits: 2 }) + "K";
      row.appendChild(column);

      column = document.createElement('td');
      column.classList.add('data-table-row-column');
      column.textContent = saleableData[0][i].invest_per + "%";
      row.appendChild(column);

      table.appendChild(row);
    }
  }

  getListPortfolio()

  // If there is "Other" item - 
  if (otherCost != 0 || otherPerc != 0) {
    portfolioMobilePieChartOption.series[0].data.push({ value: otherCost, name: "Other" });

    // Add item "Other" in the table
    row = document.createElement('tr');
    row.classList.add('portfolio-mobile-data-table-row');

    column = document.createElement('td');
    column.classList.add('data-table-row-column');
    column.textContent = "Other-";
    column.style.color = portfolio_colors[7];
    row.appendChild(column);

    column = document.createElement('td');
    column.classList.add('data-table-row-column');
    column.textContent = otherCost.toFixed(2) + "K";
    row.appendChild(column);

    column = document.createElement('td');
    column.classList.add('data-table-row-column');
    column.textContent = otherPerc + "%";
    row.appendChild(column);

    table.appendChild(row);
  }

  portfolioMobilePieChart.setOption(portfolioMobilePieChartOption);

};

var portfolioMobilePieChart = echarts.init(document.getElementById('portfolio-mobile-pie-chart-new'));
$(window).on("resize", function () {
  if (portfolioMobilePieChart != null && portfolioMobilePieChart != undefined) {
    portfolioMobilePieChart.resize();
  }
});
var portfolioMobilePieChartOption = {
  tooltip: {
    trigger: 'item',
    confine: true,
  },
  backgroundColor: "rgba(255,255,255,0)",
  grid: {
    left: 0,
    top: 0,
    right: 10,
    bottom: 30,

  },
  responsive: true,
  maintainAspectRatio: false,

  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['10%', '80%'],
      center: ['40%', '50%'],
      width: "100%",
      itemStyle: {
        borderRadius: 5,
        borderColor: '#000',
        borderWidth: 2,
        normal: {
          color: function (params) {
            return portfolio_colors[params.dataIndex % portfolio_colors.length];
          }
        }
      },
      startAngle: 0,
      label: {
        position: 'inner',
        // position: 'outside',
        fontSize: '8',
        // fontWeight: 'bold',
        rotate: 'tangential',
      },
      labelLine: {
        show: false
      },
      left: "10%",
      right: "10%",
      top: 0,
      bottom: 20,
      data: [{ value: 0, name: 'Other' }]
    }
  ]
}

portfolioMobilePieChart.setOption(portfolioMobilePieChartOption);


$(".portfolio-mobile-down-icon").click(function () {
  $(this).toggleClass("open");
  $(this).toggleClass("fa-rotate-180");
  $('.hide').slideToggle('fast');
});

// $(function () {
//   var Accordion = function (el, multiple) {
//     this.el = el || {};
//     this.multiple = multiple || false;

//     // Variables privadas
//     var links = this.el.find(".portfolio-mobile-link .fa-chevron-down");
//     // Evento
//     links.on(
//       "click",
//       { el: this.el, multiple: this.multiple },
//       this.dropdown
//     );
//   };

//   Accordion.prototype.dropdown = function (e) {
//     var $el = e.data.el;
//     ($this = $(this)), ($next = $this.parent().siblings());
//     $next.slideToggle();
//     $this.parent().toggleClass("open");
//   };

//   var accordion = new Accordion($(".portfolio-mobile-accordion"), false);

//   $(".portfolio-mobile-detail-row-titles:contains('Buy')").addClass("green");
//   $(".portfolio-mobile-detail-row-titles:contains('Sell')").addClass("red");



// });

// $(".portfolio-mobile-click-orderlist").click(function () {
//   $header = $(this).parent().parent().parent();
//   $content = $header.next();

//   $content.slideToggle(50, function () {
//     $header.toggleClass("portfolio-mobile-link");
//     $header.toggleClass("portfolio-mobile-link-border-bottom-remove");
//   });

// });

// $(".portfolio-mobile-click-history").click(function () {
//   $header = $(this).parent().parent().parent();
//   $content = $header.next();

//   $content.slideToggle(50, function () {
//     $header.toggleClass("portfolio-mobile-link");
//     $header.toggleClass("portfolio-mobile-link-border-bottom-remove");
//   });

// });

// $(".portfolio-mobile-accordion-link").click(function () {
//   console.log("click2")
//   $header = $(this).parent();
//   //getting the next element
//   $content = $header.next();
//   //open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
//   $content.slideToggle(500, function () {

//   });

// });

function openModifyTrade(client_order_id) {
  $('#page-content').load('live_orders/mobile_modify_trade', function() {
    get_mobile_order_data(client_order_id);
  });
}

function openmodal_news_table(input) {
  $("#order-details-modal").modal("show");

  $(".order-details-modal-close-btn")
    .unbind()
    .click(function (event) {
      $("#order-details-modal").modal("hide");
    });
}

function show_mobile_hawla_msg(order_chain_id) {
  console.log(order_chain_id)
  var modal = $("#main-page-modal");
  var pageLoader = $('#page-loading-indicator').html();
  var url = "/live_orders/mobile_order_hawla/" + order_chain_id;
  modal.modal({ show: true });
  modal.find('.modal-title').text('ORDER DETAILS');
  modal.find('.modal-body').html(pageLoader).load(url);
}

function placeorder(symbol_board, side) {
  $.get('live_orders/mobile_trade', { side: side, symbol_board: symbol_board }, function (data) {
    $('#page-content').html(data);
    $('#order_instrument').val(symbol_board).trigger('change');
    $('#order_side').attr('value', side).trigger('change');

    if (side == "SELL") {
      $('#order_side_select').prop('checked', false).trigger('change');
      $('#limit_order_type').val('Sell Limit').change();
      $('.trade-buy-btn').removeClass('active');
      $('.trade-sell-btn').addClass('active');
    } else {
      $('#order_side_select').prop('checked', true).trigger('change');
      $('#limit_order_type').val('Buy Limit').change();
      $('.trade-sell-btn').removeClass('active');
      $('.trade-buy-btn').addClass('active');
    }

  });
}

// Mobile Cancel Order
function mobile_cancel_order(client_order_id) {
  $.getJSON("shared/getorderdata/", {
    orderid: client_order_id
  }, function (data) {
    console.log(data)
    var cancelmsg = '';
    var formvals = {};
    var d = new Date();
    var order_time = get_order_sending_time();
    var cancel_order_id = create_mobile_order_cancel_id(data.client_code);

    if (data.exec_status != 'Rejected' || data.reforder_id == '') {
      formvals.reforder_id = data.order_id;
    } else {
      formvals.reforder_id = data.reforder_id;
    }

    formvals.agressor_indicator = data.agressor_indicator;
    formvals.avg_px = data.avg_px;
    formvals.bo_acc = data.bo_acc;
    formvals.chain_id = data.chain_id;
    formvals.client_name = data.client_name;
    formvals.client_order_id = cancel_order_id;
    formvals.cln_id = "";
    formvals.cum_qty = data.cum_qty;
    formvals.drip_qty = data.drip_qty;
    formvals.emergency = data.emergency;
    formvals.engine_id = data.engine_id;
    formvals.exchange = data.exchange;
    formvals.exec_status = data.exec_status;
    formvals.fix_ws_id = data.fix_workstation_id;
    formvals.gross_trade_amt = data.gross_trade_amt;
    formvals.last_px = data.last_px;
    formvals.last_qty = data.last_qty;
    formvals.leaves_qty = data.due_qty;
    formvals.limit_order_date = data.limit_order_date;
    formvals.limit_order_expiry_date = data.limit_order_expiry_date;
    formvals.limit_order_rate = data.order_price;
    formvals.limit_order_type = data.limit_order_type;
    formvals.min_qty = data.min_qty;
    formvals.order_action = data.order_action;
    formvals.order_branch = data.branch;
    formvals.order_client_code = data.client_code;
    formvals.order_date = data.order_date;
    formvals.order_instrument = data.symbol_code + '.' + data.board_type;
    formvals.order_qty = data.order_qty;
    formvals.order_side = data.order_side;
    formvals.order_status = "cancel request";
    formvals.order_time = data.order_time;
    formvals.order_type = data.order_type;
    formvals.order_validity = data.order_validity;
    formvals.pvdr_id = data.broker_id;
    formvals.pvt_limit_order = data.pvt_limit_order;
    formvals.pvt_mkt_order = data.pvt_mkt_order;
    formvals.ref_id = data.ref_user_id;
    formvals.settle_date = data.settle_date;
    formvals.stop_loss = data.stop_loss;
    formvals.sym_category = data.symbol_category;
    formvals.sym_class = data.symbol_assetclass;
    formvals.sym_isin = data.symbol_isin;
    formvals.sym_spot = data.compulsory_spot;
    formvals.take_profit = data.take_profit;
    formvals.time_in_force = data.time_in_force;
    formvals.trade_date = data.trade_date;
    formvals.trade_match_id = data.trade_match_id;
    formvals.trader_id = data.trader_ws_id;
    formvals.user_device = data.user_device;
    formvals.user_id = data.user_id;
    formvals.user_role = data.user_role;
    formvals.ws_group_id = data.ws_group_id;
    formvals.order_value = data.order_value;
    formvals.limit_order_yield = data.order_yield;

    data.order_side == 'BUY' ? orderside = '1' : orderside = '2';

    cancelmsg = "8=FIXT.1.19=21635=F34=852=20210830-07:08:20.48956=TEST"
    cancelmsg += '11=' + cancel_order_id + '41=' + data.order_id + '54=' + orderside
      + '38=' + data.order_qty + '55=' + data.symbol_code + '60=' + order_time
      + '50=' + data.trader_ws_id + '';
    //add checksum
    cancelmsg += '10=100' + '';

    formvals.fix_msg = cancelmsg;

    confirm_msg = "Cancel " + formvals.order_side + " Order? <br>"
      + "Order ID: " + formvals.reforder_id + "<br>"
      + "Ticker: " + data.symbol_code + "<br>"
      + "Qty: " + formvals.order_qty + " | Price: " + formvals.limit_order_rate + "<br>"
      + "Client Code: " + formvals.order_client_code + "<br>"
      + "Name: " + formvals.client_name;
    $.confirm({
      title: 'Cancel Order',
      titleClass: 'text-center',
      content: confirm_msg,
      typeAnimated: true,
      theme: 'dark',
      escapeKey: 'NO',
      buttons: {
        YES: {
          keys: ['enter'],
          btnClass: 'btn-success',
          action: function () {
            publish_order_cache_msg(JSON.stringify(formvals));
          }
        },
        NO: {
          keys: ['esc'],
          btnClass: 'btn-danger',
          action: function () { }
        }
      }
    });
    return;
  });
}

function create_mobile_order_cancel_id(client_code) {
  var d = new Date();
  var n = 8; // 7 alphanumeric chars - order id length
  // var client_order_id = client_code+'-'+d.getHours()+''+d.getMinutes()+''+d.getSeconds()+''+d.getMilliseconds();
  var randomString = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < n; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  var client_order_id = randomString;
  return client_order_id;
}

function toggleContent(element, localStorageKey) {
  var $firstDiv = $(element);
  var $header = $firstDiv.parent();
  var $content = $firstDiv.next();

  $content.slideToggle(1, function() {
    $firstDiv.toggleClass("portfolio-mobile-link");
    $firstDiv.toggleClass("portfolio-mobile-link-border-bottom-remove");
  });

  var openedTradeIdList = JSON.parse(localStorage.getItem(localStorageKey)) || [];
  var tradeId = $header.attr("data-index");

  if (!openedTradeIdList.includes(tradeId)) {
    openedTradeIdList.push(tradeId);
    localStorage.setItem(localStorageKey, JSON.stringify(openedTradeIdList));
  } else {
    var updatedTradeIdList = openedTradeIdList.filter((s) => s !== tradeId);
    localStorage.setItem(localStorageKey, JSON.stringify(updatedTradeIdList));
  }
}

$(document).on('click', '.portfolio-mobile-link-portfolio', function () {
  toggleContent(this, 'portfolio');
});

$(document).on('click', '.portfolio-mobile-link-order', function () {
  toggleContent(this, 'order');
});

$(document).on('click', '.portfolio-mobile-link-history', function () {
  toggleContent(this, 'history');
});



function toggleAccordion($accordionLink) {
  $accordionLink.children("div:first").next().show();
  $accordionLink.children("div:first").toggleClass("portfolio-mobile-link portfolio-mobile-link-border-bottom-remove");
}

function getListPortfolio() {
  var savedTradeArray = JSON.parse(localStorage.getItem('portfolio')) || [];
  savedTradeArray.forEach(function(savedTradeId) {
    var $accordionLink = $(`.portfolio-portfolio-list[data-index="${savedTradeId}"]`);
    toggleAccordion($accordionLink);
  });
}

function getListOrder() {
  var savedTradeArray = JSON.parse(localStorage.getItem('order')) || [];
  savedTradeArray.forEach(function(savedTradeId) {
    var $accordionLink = $(`.portfolio-order-list[data-index="${savedTradeId}"]`);
    toggleAccordion($accordionLink);
  });
}

function getListHistory() {
  var savedTradeArray = JSON.parse(localStorage.getItem('history')) || [];
  savedTradeArray.forEach(function(savedTradeId) {
    var $accordionLink = $(`.portfolio-history-list[data-index="${savedTradeId}"]`);
    toggleAccordion($accordionLink);
  });
}