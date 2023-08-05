$(document).ready(function () {  
  var last_selected_client_code = system_user_role == 'client' ? system_username : window.localStorage.getItem('last_selected_client_code') || '';
  $('#order_client_code').val(last_selected_client_code) 
  if ($('#order_client_code').val(last_selected_client_code)){
    updatebodata();
    checkSaleable();
    checkCashLimit();
} 
if(system_user_role == 'client')
{
  $('#order_client_code').prop('readonly', true);
}
})
 
//Added color timeAndsales table
var bidRows = document.querySelectorAll('.mobile-trade-set-row-color-green');
bidRows.forEach((rw) => {
 if (rw.classList.contains('mobile-trade-set-row-color-green')) {
     rw.style.color = '#0CAF82';
  }
});
var askRows = document.querySelectorAll('.mobile-trade-set-row-color-red');
askRows.forEach((rw) => {
  if (rw.classList.contains('mobile-trade-set-row-color-red')) {
     rw.style.color = '#FE3957';
  }
});

//Market-depth-chart
var marketDepthBar=echarts.init(
    document.getElementById("trade-market-depth-bar")
  );
  
  var marketDepthBarOption= {
    grid: {
      left:15,
      right:1,
      width:"100%",
      height:"50%",
      top:1,
      bottom:1,
      containLabel: false
    },
    
    xAxis: {
      type: 'value',
      splitLine: {
      show: false,
    },
     axisLabel: {
       show:false
    }
    },
    yAxis: {
       type: 'category',
       axisLabel: {
       show:false
    },
    axisTick:{
      show:false
   },
      splitLine: {
      show: false,
    },
    axisLine: {
      show: false
    }
    },
    series: [
      {
        name: 'BID Quantity',
        type: 'bar',
        stack: 'total',
        color: '#0CAF82',
        barWidth: '40%',
        itemStyle: {
          emphasis: {
              barBorderRadius: [20]
          },
          normal: {
            barBorderRadius: [20,20,20,20]
        }
      },
        label: {
          show: false
        },
        emphasis: {
          focus: 'series'
        },
        data: [320]
      },
      {
        name: 'ASK Quantity',
        type: 'bar',
        stack: 'total',
        color: '#FE3957',
        barWidth: '40%',
        itemStyle: {
          emphasis: {
              barBorderRadius: [20]
          },
          normal: {
              barBorderRadius: [0,20,20,0]
          }
       },
        label: {
          show: false
        },
        emphasis: {
          focus: 'series'
        },
        data: [220]
      }
    ]
  }
  marketDepthBar.setOption(marketDepthBarOption);

var initial_qty = 0;
var initial_order_rate = 0;
var is_first_call = false;
var initial_drip = 0;

$("#order_qty").on("propertychange change click keyup input paste", function(){
  initial_qty = Number($("#order_qty").val());
});

function decreaseQuantity(decreaseby) {
  initial_qty = isNaN(initial_qty) ? 1 : initial_qty;
  initial_qty = Math.max(1, initial_qty + Number(decreaseby));
  //document.getElementById("order_qty").value = initial_qty;
  // console.log(document.getElementById("order_qty").value)
  $('#order_qty').val(initial_qty).change();
}

function increaseQuantity(increaseby) {
  initial_qty = isNaN(initial_qty) ? 1 : initial_qty;
  initial_qty = initial_qty + Number(increaseby);
  // document.getElementById("order_qty").value = initial_qty;
  // console.log(document.getElementById("order_qty").value)
  $('#order_qty').val(initial_qty).change();
}

$("#limit_order_rate").on("propertychange change click keyup input paste", function(){
  initial_order_rate = Number($("#limit_order_rate").val());
});

function decreaseOrderRate(decreaseby) {
  if(!is_first_call && typeof initial_order_rate === "undefined")
  {
    initial_order_rate = 1;
    is_first_call= true;

  }
  
    initial_order_rate = isNaN(initial_order_rate) ? 1 : initial_order_rate;
    initial_order_rate = Math.max(1, (initial_order_rate + Number(decreaseby)));

    $('#limit_order_rate').val(initial_order_rate.toFixed(1)).change();
  // document.getElementById("limit_order_rate").value = initial_order_rate.toFixed(2);
}

function increaseOrderRate(increaseby) {

  if(!is_first_call && typeof initial_order_rate === "undefined")
  {
    initial_order_rate = 1;
    is_first_call= true;

  }
  else
  {
    
    initial_order_rate = isNaN(initial_order_rate) ? 1 : initial_order_rate;
    initial_order_rate = Math.max(1, (initial_order_rate + Number(increaseby)));
  }
  $('#limit_order_rate').val(initial_order_rate.toFixed(1)).change();
  // document.getElementById("limit_order_rate").value = initial_order_rate.toFixed(2);
}

$("#drip_qty").on("propertychange change click keyup input paste", function(){
  initial_drip = Number($("#drip_qty").val());
});

function decreaseDrip(decreaseby) {
  initial_drip = isNaN(initial_drip) ? 1 : initial_drip;
  initial_drip = Math.max(1, initial_drip + Number(decreaseby));
  // document.getElementById("drip_qty").value = initial_drip;
  $('#drip_qty').val(initial_drip).change();
}

function increaseDrip(increaseby) {
  initial_drip = isNaN(initial_drip) ? 1 : initial_drip;
  initial_drip = initial_drip + Number(increaseby);
  // document.getElementById("drip_qty").value = initial_drip;
  $('#drip_qty').val(initial_drip).change();
}

function getmktdepthTrade(target_symbol){
  var symbol_split = target_symbol.split(".");
  var symbol = symbol_split[0];
  var board = symbol_split[1];
  var symbol_board = symbol.replace(/[^a-zA-Z ]/g, '')+board;

  
  $.getJSON("shared/getmktdepth/", {
      mkt_group: board,
      mkt_symbol: symbol
  }, function (data) {
      if(data!=''){
          $('.bidAndask-tbody').html('');

          var bid_levels = JSON.parse(data.bid_levels);
          var ask_levels = JSON.parse(data.ask_levels);
          var price_decimal = data.price_decimals;
          var md_point = parseInt(price_decimal);
          var md_multiple = Math.pow(10, md_point);
          var md_bid =  (bid_levels != null) ? bid_levels.bid_level : [];
          var md_ask = (ask_levels != null) ? ask_levels.ask_level : [];
          
          $('.bidAndask-tbody').html(`
          <tr>
              <td class="bid-sl-value">1</td>
              <td class=" bidQ-column-value ${symbol_board}_db2"></td>
              <td class=" bid-column-value ${symbol_board}_db1"></td>
              <td id="trade-arrow-icon" class="bidAndask-middle-column-value">
                <div><i class="fa fa-angle-double-down trade-icon-up-down"></i></div>
              </td>
              <td class="ask-column-value ${symbol_board}_ds1"></td>
              <td class="askQ-column-value ${symbol_board}_ds2"></td>
              <td class="ask-sl-value">1</td>
          </tr>
          <tr>
              <td class="bid-sl-value">2</td>
              <td class=" bidQ-column-value ${symbol_board}_db4"></td>
              <td class=" bid-column-value ${symbol_board}_db3"></td>
              <td class="bidAndask-middle-column-value"></td>
              <td class="ask-column-value ${symbol_board}_ds3"></td>
              <td class="askQ-column-value ${symbol_board}_ds4"></td>
              <td class="ask-sl-value">2</td>
          </tr>
          <tr class="trade-bidAndask-row">
              <td class="bid-sl-value">3</td>
              <td class=" bidQ-column-value ${symbol_board}_db6"></td>
              <td class=" bid-column-value ${symbol_board}_db5"></td>
              <td class="bidAndask-middle-column-value"></td>
              <td class="ask-column-value ${symbol_board}_ds5"></td>
              <td class="askQ-column-value ${symbol_board}_ds6"></td>
              <td class="ask-sl-value">3</td>
          </tr>
          <tr class="trade-bidAndask-row">
              <td class="bid-sl-value">4</td>
              <td class=" bidQ-column-value ${symbol_board}_db8"></td>
              <td class=" bid-column-value ${symbol_board}_db7"></td>
              <td class="bidAndask-middle-column-value"></td>
              <td class="ask-column-value ${symbol_board}_ds7"></td>
              <td class="askQ-column-value ${symbol_board}_ds8"></td>
              <td class="ask-sl-value">4</td>
          </tr>
          <tr class="trade-bidAndask-row">
              <td class="bid-sl-value">5</td>
              <td class=" bidQ-column-value ${symbol_board}_db10"></td>
              <td class=" bid-column-value ${symbol_board}_db9"></td>
              <td class="bidAndask-middle-column-value"></td>
              <td class="ask-column-value ${symbol_board}_ds9"></td>
              <td class="askQ-column-value ${symbol_board}_ds10"></td>
              <td class="ask-sl-value">5</td>
          </tr>
          <tr class="trade-bidAndask-row">
              <td class="bid-sl-value">6</td>
              <td class=" bidQ-column-value ${symbol_board}_db12"></td>
              <td class=" bid-column-value ${symbol_board}_db11"></td>
              <td class="bidAndask-middle-column-value"></td>
              <td class="ask-column-value ${symbol_board}_ds11"></td>
              <td class="askQ-column-value ${symbol_board}_ds12"></td>
              <td class="ask-sl-value">6</td>
          </tr>
          <tr class="trade-bidAndask-row">
              <td class="bid-sl-value">7</td>
              <td class=" bidQ-column-value ${symbol_board}_db14"></td>
              <td class=" bid-column-value ${symbol_board}_db13"></td>
              <td class="bidAndask-middle-column-value"></td>
              <td class="ask-column-value ${symbol_board}_ds13"></td>
              <td class="askQ-column-value ${symbol_board}_ds14"></td>
              <td class="ask-sl-value">7</td>
          </tr>
          <tr class="trade-bidAndask-row">
              <td class="bid-sl-value">8</td>
              <td class=" bidQ-column-value ${symbol_board}_db16"></td>
              <td class=" bid-column-value ${symbol_board}_db15"></td>
              <td class="bidAndask-middle-column-value"></td>
              <td class="ask-column-value ${symbol_board}_ds15"></td>
              <td class="askQ-column-value ${symbol_board}_ds16"></td>
              <td class="ask-sl-value">8</td>
          </tr>
          <tr class="trade-bidAndask-row">
              <td class="bid-sl-value">9</td>
              <td class=" bidQ-column-value ${symbol_board}_db18"></td>
              <td class=" bid-column-value ${symbol_board}_db17"></td>
              <td class="bidAndask-middle-column-value"></td>
              <td class="ask-column-value ${symbol_board}_ds17"></td>
              <td class="askQ-column-value ${symbol_board}_ds18"></td>
              <td class="ask-sl-value">9</td>
          </tr>
          <tr class="trade-bidAndask-row">
              <td class="bid-sl-value">10</td>
              <td class=" bidQ-column-value ${symbol_board}_db20"></td>
              <td class=" bid-column-value ${symbol_board}_db19"></td>
              <td class="bidAndask-middle-column-value"></td>
              <td class="ask-column-value ${symbol_board}_ds19"></td>
              <td class="askQ-column-value ${symbol_board}_ds20"></td>
              <td class="ask-sl-value">10</td>
          </tr>
          `);

          $('#trade-arrow-icon').click(function() {
            $(this).children().children().toggleClass("fa-rotate-180");
            $(".trade-bidAndask-row").toggle();
          }); 
          
          var buy_qty = 0;
          var sell_qty = 0;
          var total_qty= 0;
          var buy_percent = 0;
          var sell_percent = 0;

          if(md_bid != undefined) {
              x=1;
              md_bid.forEach(function(item, index, arr){
                  var bid_price = (parseInt(item[0])/md_multiple).toFixed(md_point);
                  var bid_qty = parseInt(item[1]);
                  buy_qty = buy_qty + bid_qty;
                  total_qty = total_qty + bid_qty;

                  if($(`.${symbol_board}_db1`).length > 0){
                      $(`.${symbol_board}_db${x}`).text(bid_price);
                      flashup($(`.${symbol_board}_db${x}`));
                      x++;
                      $(`.${symbol_board}_db${x}`).text(bid_qty);
                      x++;
                  }
                  
              });
          }
          if(md_ask != undefined) {
              y=1;
              md_ask.forEach(function(item, index, arr){
                  var ask_price = (parseInt(item[0])/md_multiple).toFixed(md_point);
                  var ask_qty = parseInt(item[1]);
                  sell_qty = sell_qty + ask_qty;
                  total_qty = total_qty + ask_qty;

                  if($(`.${symbol_board}_ds1`).length > 0){
                      $(`.${symbol_board}_ds${y}`).text(ask_price);
                      flashdown($(`.${symbol_board}_ds${y}`));
                      y++;
                      $(`.${symbol_board}_ds${y}`).text(ask_qty);
                      y++;
                  }
              
              });
          }
          		
          buy_percent = (buy_qty/total_qty)*100;
          sell_percent = (sell_qty/total_qty)*100;
          update_market_depth_bar_trade(buy_percent, sell_percent)
          
      }
  });

}

function  update_market_depth_bar_trade(buy_percent, sell_percent){ 
  if (isNaN(buy_percent) && isNaN(sell_percent)) {

      $('.mobile-trade-bidPerQ').text('50%');
      $('.mobile-trade-askPerQ').text('50%');
      
    } 
  else {
      if(marketDepthBar != null){
          marketDepthBar.setOption({
              series: [
                  {
                      name: 'BID Quantity',
                      data: [buy_percent]
                  },
                  {
                      name: 'ASK Quantity',
                      data: [sell_percent]
                  }
              ]
           });
           $('.mobile-trade-bidPerQ').text(buy_percent.toFixed(2)+'%');
           $('.mobile-trade-askPerQ').text(sell_percent.toFixed(2)+'%');
      }
    }

  
}

function symbolpricedataMobileTrade(ticker){
  $.get("/shared/symbolpricedata/", { symbol: ticker }, function (data) {
    var board = data.board;
    var symbol_board = data.symbol.replace(/[^a-zA-Z ]/g, '') + board;
    var ltp = parseFloat(data.ltp); 
    var chg_per = data.ltp_changeper != null ? parseFloat(data.ltp_changeper) : 0;
    var chg_net = data.ltp_change != null ? parseFloat(data.ltp_change) : 0;
    var pos_neg = '';
    
    $('.quote_price').removeClass().addClass('quote_price '+ symbol_board + '_ltp');
    $('.quote_change').removeClass().addClass('quote_change '+ symbol_board + '_chg');
    $('.quote_changeper').removeClass().addClass('quote_changeper '+ symbol_board + '_chgper');

    if (chg_net > 0) {
      pos_neg = '+';
      $('.quote_price').addClass('white');
      $('.changeper-container').removeClass('up-bg down-bg neutral-bg').addClass('up-bg');
    }
    if (chg_net < 0) {
        pos_neg = '';
        $('.quote_price').addClass('white');
        $('.changeper-container').removeClass('up-bg down-bg neutral-bg').addClass('down-bg');
    }
    if (chg_net == 0) {
        pos_neg = '';
        $('.quote_price').addClass('white');
        $('.changeper-container').removeClass('up-bg down-bg neutral-bg').addClass('neutral-bg');
    }

    $('.quote_price').text(ltp);
    $('.quote_price').val(ltp);
    $('.quote_change').text(pos_neg + chg_net);
    $('.quote_change').val(chg_net);
    $('.quote_changeper').text(pos_neg + chg_per + '%')
    $('.quote_changeper').val(chg_per)
}); 

}

function handleClick(selectedValue) {
  
  if (selectedValue === "BUY") {
    $('#order_side_select').prop('checked', true).trigger('change');
    $('#order_side').attr('value', "BUY").trigger('change');
  } else if (selectedValue === "SELL") {
    $('#order_side_select').prop('checked', false).trigger('change');
    $('#order_side').attr('value', "SELL").trigger('change');
  }
    
}
