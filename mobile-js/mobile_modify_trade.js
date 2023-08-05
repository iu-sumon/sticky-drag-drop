var order_value_original; 
//Market-depth-chart
var marketDepthBarModify = echarts.init(
    document.getElementById("modify-market-depth-bar")
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
  marketDepthBarModify.setOption(marketDepthBarOption);

var initial_qty;
var initial_order_rate;
var is_first_call = false;
var initial_drip = 0;

$("#order_qty_mod").on("propertychange change click keyup input paste", function(){
  // initial_qty = Number($("#order_qty_mod").val());
  // console.log(initial_qty)
  initial_qty = parseInt($(this).val()) || 0;
  console.log(initial_qty)

    var saleable = parseInt($('#saleable_qty_mod').val()) || 0;
    var original_qty = parseInt($("#original_qty_mod").val());
    // var qty = parseInt($(this).val()) || 0;
    var exec_qty = parseInt($("#cum_qty_mod").val()) || 0;
    var cashlimit =  parseFloat($('#ac_balance_mod').val());
    var price = 0;
    var orderside = $('#order_side_mod').val();
    var order_type = $('#order_type_mod').val();
    var value = 0;

    if (order_type == 'Limit'){
        
        price = parseFloat($("#limit_order_rate_mod").val()) || 0;
        
    
        if(verify_mobile_fields_mod() == false){
            $(".order_mod_submit_btn").prop("disabled", true);
        }
        

        

        if (initial_qty != 0 && price != 0){
            value = initial_qty * price;
            var value_diff = value - order_value_original;
            if(value_diff < 0)$("#order_value_diff_mod_text").removeClass().addClass('down');
            if(value_diff == 0)$("#order_value_diff_mod_text").removeClass().addClass('neutral');
            if(value_diff > 0)$("#order_value_diff_mod_text").removeClass().addClass('up');
            $("#order_value_diff_mod_text").text(Number(value_diff).toLocaleString('en-IN'));
            $("#order_value_diff_mod").val(value_diff);
            $("#order_value_mod_text").text(Number(value).toLocaleString('en-IN'));
            $("#order_value_mod").val(value);
        }

        if (orderside == 'BUY'){
            if(cashlimit != 0){
                if (value > cashlimit) {
                    $('#order_qty_mod').css({"color": "red", "font-weight": "bold"});
                    $('#ac_balance_mod').css({"color": "red", "font-weight": "bold"});
                    $(".order_mod_submit_btn").prop("disabled", true);
                }
                if (value <= cashlimit && verify_mobile_fields_mod() == true) {
                    $('#order_qty_mod').removeAttr('style');
                    $('#ac_balance_mod').css({"color": "#00DB86", "font-weight": "bold"});
                    $(".order_mod_submit_btn").prop("disabled", false);
                }
            } else {
                $('#order_qty_mod').css({"color": "red", "font-weight": "bold"});
                $(".order_mod_submit_btn").prop("disabled", true);
            }
        }
        if(orderside == 'SELL'){
            if (initial_qty > (original_qty + saleable)) {
                $('#order_qty_mod').css({"color": "red", "font-weight": "bold"});
                $(".order_mod_submit_btn").prop("disabled", true);
            }
            if (initial_qty <= (original_qty + saleable) && verify_mobile_fields_mod() == true) {
                $('#order_qty_mod').removeAttr('style');
                $(".order_mod_submit_btn").prop("disabled", false);
            }
        }
        if(initial_qty <= exec_qty){
            $('#order_qty_mod').css({"color": "red"});
            $(".order_mod_submit_btn").prop("disabled", true);
        } else {
            $('#order_qty_mod').css({"color": "var(--font-color)"});
            $(".order_mod_submit_btn").prop("disabled", false);
        }
    
    }

  
});

function decreaseQuantity(decreaseby) {
  initial_qty = isNaN(initial_qty) ? 1 : initial_qty;
  initial_qty = Math.max(1, initial_qty + Number(decreaseby));
  // document.getElementById("order_qty_mod").value = original_qty;
  $('#order_qty_mod').val(initial_qty).change();
}

function increaseQuantity(increaseby) {
  initial_qty = isNaN(initial_qty) ? 1 : initial_qty;
  initial_qty = initial_qty + Number(increaseby);
  // document.getElementById("order_qty_mod").value = original_qty;
  $('#order_qty_mod').val(initial_qty).change();
}

$("#limit_order_rate_mod").on("propertychange change click keyup input paste", function(){
  initial_order_rate = parseFloat($(this).val()) || 0;

  var saleable = parseInt($('#saleable_qty_mod').val()) || 0;
    var original_qty = parseInt($("#original_qty_mod").val());
    var qty = parseInt($('#order_qty_mod').val()) || 0;
    // var price = parseFloat($(this).val()) || 0;
    var cashlimit =  parseFloat($('#ac_balance_mod').val());
    var value = 0;
    var orderside = $('#order_side_mod').val();
    var order_type = $('#order_type_mod').val();
    
    if (order_type == 'Limit'){

        if(verify_mobile_fields_mod() == false){
            $(".order_mod_submit_btn").prop("disabled", true);
        }

        if (qty != 0 && initial_order_rate != 0){
            value = qty * initial_order_rate;
            var value_diff = value - order_value_original;
            if(value_diff < 0)$("#order_value_diff_mod_text").removeClass().addClass('down');
            if(value_diff == 0)$("#order_value_diff_mod_text").removeClass().addClass('neutral');
            if(value_diff > 0)$("#order_value_diff_mod_text").removeClass().addClass('up');
            $("#order_value_diff_mod_text").text(Number(value_diff).toLocaleString('en-IN'));
            $("#order_value_diff_mod").val(value_diff);
            $("#order_value_mod_text").text(Number(value).toLocaleString('en-IN'));
            $("#order_value_mod").val(value);
        }

        if($('.yield_window_mod').is(":visible")){
            var clean_price = parseFloat($(this).val());
            var period = parseFloat($('#yield_data_mod').data("period"));
            var semi_annual_coupon_payment = parseFloat($('#yield_data_mod').data("couponpayment"));
            var face_value = parseInt($('#yield_data_mod').data("facevalue"));
            var coupon_freq = parseInt($('#yield_data_mod').data("couponfreq"));
            var order_yield = price_to_yield(period, semi_annual_coupon_payment, clean_price, face_value, coupon_freq);
            $('#limit_order_yield_mod').val(order_yield.toFixed(4));

            var accr_int = parseFloat($('#accr_int_mod').text());
            var dirty_price = clean_price + accr_int;
            $('#dirty_price_mod').text(dirty_price.toFixed(4));
        }

        if (orderside == 'BUY'){
            if(cashlimit != 0){
                if (value > cashlimit) {
                    $('#limit_order_rate_mod').css({"color": "red", "font-weight": "bold"});
                    $('#ac_balance_mod').css({"color": "red", "font-weight": "bold"});
                    $(".order_mod_submit_btn").prop("disabled", true);
                }
                if (value <= cashlimit && verify_mobile_fields_mod() == true) {
                    $('#limit_order_rate_mod').removeAttr('style');
                    $('#ac_balance_mod').css({"color": "#00DB86", "font-weight": "bold"});
                    $(".order_mod_submit_btn").prop("disabled", false);
                }
            } else {
                $('#limit_order_rate_mod').css({"color": "red", "font-weight": "bold"});
                $(".order_mod_submit_btn").prop("disabled", true);
            }
        }
        if(orderside == 'SELL'){
            if (qty > (original_qty + saleable)) {
                $('#order_qty_mod').css({"color": "red", "font-weight": "bold"});
                $(".order_mod_submit_btn").prop("disabled", true);
            }
            if (qty <= (original_qty + saleable) && verify_mobile_fields_mod() == true) {
                $('#order_qty_mod').removeAttr('style');
                $(".order_mod_submit_btn").prop("disabled", false);
            }
        }
    }
});

function decreaseOrderRate(decreaseby) {
  if(!is_first_call && typeof initial_order_rate === "undefined")
  {
    initial_order_rate = 1;
    is_first_call= true;

  }
  
    initial_order_rate = isNaN(initial_order_rate) ? 1 : initial_order_rate;
    initial_order_rate = Math.max(1, (initial_order_rate + Number(decreaseby)));


  // document.getElementById("modify_limit_order_rate").value = initial_order_rate.toFixed(2);
  $('#limit_order_rate_mod').val(initial_order_rate.toFixed(1)).change();
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

  // document.getElementById("modify_limit_order_rate").value = initial_order_rate.toFixed(2);
  $('#limit_order_rate_mod').val(initial_order_rate.toFixed(1)).change();
}

$("#drip_qty_mod").on("propertychange change click keyup input paste", function(){
  initial_drip = Number($("#drip_qty_mod").val());
});

function decreaseDrip(decreaseby) {
  initial_drip = isNaN(initial_drip) ? 1 : initial_drip;
  initial_drip = Math.max(1, initial_drip + Number(decreaseby));
  // document.getElementById("modify_drip_qty").value = initial_drip;
  $('#drip_qty_mod').val(initial_drip).change();
}

function increaseDrip(increaseby) {
  initial_drip = isNaN(initial_drip) ? 1 : initial_drip;
  initial_drip = initial_drip + Number(increaseby);
  // document.getElementById("modify_drip_qty").value = initial_drip;
  $('#drip_qty_mod').val(initial_drip).change();
}

$('.back-button-modify').on('click', function () {
  $(this).css("background-color", "linear-gradient(to left,#26d6e6,#67efb8)");
  $('#page-content').load('portfolio/mobile_portfolio'); // Redirect to Portfolio
});


//Process FIX msg for Order Modify Form
function processMobileModifyOrder(){
    
  // $(".order_mod_submit_btn").prop("disabled", true);

  // if(modwindow != undefined){
  //     modwindow.close();
  // }
  // Check server and market status
  $.get("/shared/getmktstatus/", function (data) {
    console.log(data)
      if (system_user_role != 'brokeradmin' && system_user_role != 'brokertrader' && system_user_role != 'client' && system_user_role != 'associate'){
          show_flash_messages('Trading Unauthorized','danger');
          return;
      }
      if (data['itch_status']!="Session Connected" || data['fix_status']!="Session Connected"){
          show_flash_messages('Trade Server Offline','danger');
          return;
      } else if (data['PUBLIC']!="CONTINUOUS" && data['PUBLIC']!="POSTCLOSING") {
          show_flash_messages('Trading not allowed at this time','danger');
          return;
      } else {
      
          $('#pvt_limit_checkbox_mod').prop('checked') ? $('#pvt_limit_order_mod').val('true') : $('#pvt_limit_order_mod').val('false');
          $('#pvt_mkt_checkbox_mod').prop('checked') ? $('#pvt_mkt_order_mod').val('true') : $('#pvt_mkt_order_mod').val('false');
          var form = $('#order-mobile-modify-form');
          var validator = form.validate();
          console.log(form)
          console.log(validator)
          // if(validator.form()){
              //called from rms_validation.js
              console.log('yes')
              var rms_check = rms_validation(form, 'modify');
              console.log('rms check result: '+rms_check);
              if (rms_check == true){
                  var fix_msg = compile_mobile_fix_modify_msg(form);
                  mobile_modify_order(form,fix_msg);
              }
          // }
      }
  });
}

// Compile Mobile FIX Modify Msg
function compile_mobile_fix_modify_msg(form){

  var formvals = {};
  var ordermsg = '';
  var orderside = '';
  var ordervalidity = '';

  $.each($(form).serializeArray(), function(i, field) {
      formvals[field.name] = field.value;
  });
  console.log(formvals)

  switch(formvals.order_validity){
      case 'DAY': ordervalidity='0'; break;
      // case 'SESSION': ordervalidity='S'; break;
      // case 'IOC': ordervalidity='3'; break;
      // case 'FOK': ordervalidity='4'; break;
      // case 'GTC': ordervalidity='1'; break;
      // case 'GTD': ordervalidity='6'; break;
      default : 'DAY';
  } 
  
  var symbol_split = formvals.order_instrument.split('.');
  var order_symbol = symbol_split[0];
  var order_board = symbol_split[1];

  //+'50='+formvals.trader_ws_id.toUpperCase()
  if(formvals.exec_status != 'Rejected' || formvals.reforder_id == ''){
      formvals.reforder_id = formvals.client_order_id;
      $('#reforder_id_mod').val(formvals.reforder_id);
  } else {
      formvals.exec_status = 'none';
  }
  var new_order_id = create_mobile_order_modify_id(formvals.order_client_code);
  //Update Order in Terminal
// if ($('#trade-orders').length > 0 && $('#'+formvals.client_order_id).length > 0){
// 	row = $('#'+formvals.client_order_id).find("td");
// 	row.eq(2).text(new_order_id);
  // }

  formvals.client_order_id = new_order_id
  $('#client_order_id_mod').val(formvals.client_order_id);

  formvals.order_side == 'BUY' ? orderside = '1' : orderside = '2';
  formvals.order_time = get_order_sending_time();
  

  //Add header tags
  ordermsg = "8=FIXT.1.19=21635=G34=852=20210830-07:08:20.48956=TEST"
  ordermsg += '1='+formvals.bo_acc+'11='+formvals.client_order_id+'453=1448='+formvals.order_client_code
              +'447=C452=5529=N'+'762='+order_board+'41='+formvals.reforder_id
              +'37='+formvals.engine_id+'59='+ordervalidity
              +'55='+order_symbol+'54='+orderside+'38='+formvals.order_qty
              +'50='+formvals.trader_id+'60='+formvals.order_time+'';

  if (formvals.exchange == 'DSE'){
      if(formvals.order_type == 'Market'){ //Market Order
          ordermsg += '40=1' + '';

          if (formvals.board_type!='BLOCK' && formvals.pvt_mkt_order == 'true'){ // Private Market Order
              ordermsg += '18=S' + '';
          }
          if(formvals.board_type=='BLOCK' && formvals.pvt_mkt_order == 'false'){ //Block Market Order
              ordermsg += '18=w' + '';
          }
          if(formvals.board_type=='BLOCK' && formvals.pvt_mkt_order == 'true'){ //Block Pvt Market Order
              ordermsg += '18=w S' + '';
          }
      } else if(formvals.order_type == 'MarketBest'){ //Market at Best
          ordermsg += '40=Z' + '';
          if (formvals.board_type!='BLOCK' && formvals.pvt_mkt_order == 'true'){ // Private Market Order
              ordermsg += '18=S' + '';
          }
          if(formvals.board_type=='BLOCK' && formvals.pvt_mkt_order == 'false'){ //Block Market Order
              ordermsg += '18=w' + '';
          }
          if(formvals.board_type=='BLOCK' && formvals.pvt_mkt_order == 'true'){ //Block Pvt Market Order
              ordermsg += '18=w S' + '';
          }
      } else if(formvals.order_type == 'Limit'){ //Limit Order
          ordermsg += '40=2' + '44='+formvals.limit_order_rate + '';

          if(formvals.board_type!='BLOCK' && formvals.pvt_limit_order == 'true'){ // Private Limit Order
              ordermsg += '18=S' + '';
          }
          if(formvals.board_type=='BLOCK' && formvals.pvt_limit_order == 'false'){ //Block Market Order
              ordermsg += '18=w' + '';
          }
          if(formvals.board_type=='BLOCK' && formvals.pvt_limit_order == 'true'){ //Block Pvt Market Order
              ordermsg += '18=w S' + '';
          }
      } else if(formvals.order_type == 'Special'){ //Special Order
          console.log('special orders not processed by Fix directly');
      }
      if(formvals.drip_qty > 0){ //hidden order
          ordermsg += '1138='+formvals.drip_qty + '';
      }
      //For Min Qty (110 tag) Order Validity = IOC or FOK. Min Qty == Order Qty (38 tag)
      if(formvals.min_qty > 0){ //min qty order
          ordermsg += '110='+formvals.min_qty + '';
      }
      //add checksum
      ordermsg += '10=100'+'';
      
  }
  // console.log(ordermsg);
  return ordermsg;
}

// $("#order-mobile-modify-form").submit(function(e) {
// 	e.preventDefault();
// });

function mobile_modify_order(form,fix_msg){
	
	var formvals = {};
	
	$.each($(form).serializeArray(), function(i, field) {
		formvals[field.name] = field.value;
	});
    
	formvals.order_qty == '' ?	$("#order_qty_mod").val("0") : formvals.order_qty=formvals.order_qty; 
	formvals.drip_qty == '' ?	$("#drip_qty_mod").val("0") : formvals.drip_qty=formvals.drip_qty;
	formvals.min_qty == '' ?	$("#min_qty_mod").val("0") : formvals.min_qty=formvals.min_qty;
	formvals.stop_loss == '' ?	$("#stop_loss_mod").val("0.00") : formvals.stop_loss=formvals.stop_loss;
	formvals.take_profit == '' ?	$("#take_profit_mod").val("0.00") : formvals.take_profit=formvals.take_profit;
	formvals.limit_order_rate == '' ?	$("#limit_order_rate_mod").val("0.00") : formvals.limit_order_rate=formvals.limit_order_rate;
  formvals.limit_order_yield == '' ?	$("#limit_order_yield_mod").val("0.00") : formvals.limit_order_yield=formvals.limit_order_yield;

    formvals.order_status = 'modify request';
    // console.log(formvals);
    formvals.fix_msg = fix_msg;
    
    order_symbol = formvals.order_instrument.split('.')[0];

    confirm_msg = "Modify "+formvals.order_side+" Order? <br>"
                        +"Order ID: "+formvals.reforder_id+"<br>"
                        +"Ticker: "+order_symbol+"<br>"
                        +"New Qty: "+formvals.order_qty+"<br>"
                        +"New Price: "+formvals.limit_order_rate+"<br>"
                        +"Client Code: "+formvals.order_client_code+"<br>"
                        +"Name: "+formvals.client_name;
    $.confirm({
        title: 'Modify Order',
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
                    $('#page-content').load('portfolio/mobile_portfolio');
                }
            },
            NO: {
                btnClass: 'btn-danger',
                action: function () {}
            }
        }
    });
    
}

function create_mobile_order_modify_id(client_code){
  var d = new Date();
  var n = 8; // 7 alphanumeric chars - order id length
  // var client_order_id = client_code+'-'+d.getHours()+''+d.getMinutes()+''+d.getSeconds()+''+d.getMilliseconds();
  var randomString = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for ( var i = 0; i < n; i++ ) {
    randomString += characters.charAt(Math.floor(Math.random()*characters.length));
  }
  var client_order_id = randomString;
  return client_order_id;
}

function get_mobile_order_data(client_order_id){
  console.log(client_order_id) 
  $.getJSON("shared/getorderdata/", {orderid: client_order_id}, function (data) {  
      var ticker =  data.symbol_code+'.'+data.board_type;  
      symbolpricedataMobileModify(ticker)  
      getmktdepthMobileModify(ticker) 

      switch(data.exchange) {
          case 'Priority': elemid = 'xcg1_mod'; break;
          case 'DSE': elemid = 'xcg2_mod'; break;
          case 'CSE': elemid = 'xcg3_mod'; break;
          default: 'DSE'
      }
      $("#exchange_mod").empty();
      $('#exchange_mod').append($('<option>', {
          value: data.exchange,
          text: data.exchange
      }));
      mobile_switch_exchange_mod(elemid);

      $("#order_client_code_mod").empty();
      $('#order_client_code_mod').append($('<option>', {
          value: data.client_code,
          text: data.client_code
      }));
      // $("#order_client_code_mod").val(data.client_code);
      updateMobilebodata_mod(data.client_code);

      $("#order_instrument_mod").empty();
      $('#order_instrument_mod').append($('<option>', {
          value: data.symbol_code+'.'+data.board_type,
          text: data.symbol_code+'.'+data.board_type
      }));

      checkMobileModSaleable();
      getSymbolInfoMobileModify()

      $("#limit_order_rate_mod").val(data.order_price).trigger('change');

      if(data.board_type == 'YIELDDBT' || data.board_type == 'BUYDBT'){
          $('.yield_window_mod').show();
          getGsecDataMod(data.symbol_code);
          
      } else {
          $('.yield_window_mod').hide();
      }

      $("#limit_order_type_mod").empty();
      $('#limit_order_type_mod').append($('<option>', {
          value: data.limit_order_type,
          text: data.limit_order_type
      }));
      $("#original_qty_mod").val(data.order_qty);
      $("#order_qty_mod").val(data.order_qty).change();
      $("#drip_qty_mod").val(data.drip_qty).change();
      $("#min_qty_mod").val(data.min_qty);
      $("#stop_loss_mod").val(data.stop_loss);
      $("#take_profit_mod").val(data.take_profit);

      switch(data.order_type) {
          // case 'Market': $("#order_type_mod").val('Market').trigger('change'); $('#limit-window-mod').hide();$('#market-window-mod').show();break;
          case 'Limit': $("#order_type_mod").val('Limit').trigger('change'); 
          $('#limit-window-mod').show();
          $('#market-window-mod').hide();
          break;
          case 'MarketBest': $("#order_type_mod").val('MarketBest').trigger('change'); $('#limit-window-mod').hide();$('#market-window-mod').show();break;
          default: data.order_type
      }
      
      $('#order_type_mod').change(function () {
          var order_type_mod = $('#order_type_mod').val();
          if (order_type_mod == 'Limit') {
              $('#limit-window-mod').show();
              $('#market-window-mod').hide();
          }
          if (order_type_mod == 'Market' || order_type_mod == 'MarketBest') {
              $('#limit-window-mod').hide();
              $('#market-window-mod').show();
          }
          
      });
      switch(data.order_validity) {
          case 'DAY': $("#order_validity_mod").val('DAY').trigger('change'); break;
          case 'SESSION': $("#order_validity_mod").val('SESSION').trigger('change'); break;
          case 'IOC': $("#order_validity_mod").val('IOC').trigger('change'); break;
          case 'FOK': $("#order_validity_mod").val('FOK').trigger('change'); break;
          case 'GTC': $("#order_validity_mod").val('GTC').trigger('change'); break;
          case 'GTD': $("#order_validity_mod").val('GTD').trigger('change'); break;
          default: data.order_validity
      }
      switch(data.order_side){
          case 'BUY': $('#order_side_select_mod').prop('checked', true).trigger('change'); 
          $('#order_side_mod').val('BUY'); 
          $(".order_mod_submit_btn").removeClass().addClass('order_mod_submit_btn btn activebuy w-100');
          // $('.ord-win-border').css('border-color', '#26a051');
          break;
          case 'SELL': $('#order_side_select_mod').prop('checked', false).trigger('change'); 
          $('#order_side_mod').val('SELL'); 
          $(".order_mod_submit_btn").removeClass().addClass('order_mod_submit_btn btn activesell w-100');
          // $('.ord-win-border').css('border-color', '#c71919');
          break;
          default: data.order_side
      }
      switch(data.pvt_mkt_order){
          case 'true': $("#pvt_mkt_checkbox_mod").prop('checked', true); break;
          case 'false': $("#pvt_mkt_checkbox_mod").prop('checked', false); break;
          default: data.pvt_mkt_order
      }
      
      switch(data.limit_order_type) {
          case 'Buy Limit': $('#order_side_mod').val('BUY'); 
          // $('.ord-win-border').css('border-color', '#26a051');
          $('#order_side_select_mod').prop('checked', true).trigger('change');
          $(".order_mod_submit_btn").removeClass().addClass('order_mod_submit_btn btn activebuy w-100');
          break;
          case 'Sell Limit': $('#order_side_mod').val('SELL'); 
          // $('.ord-win-border').css('border-color', '#c71919');
          $('#order_side_select_mod').prop('checked', false).trigger('change');
          $(".order_mod_submit_btn").removeClass().addClass('order_mod_submit_btn btn activesell w-100');
          break;
          default: data.limit_order_type
      }
      
      $("#limit_order_date_mod").val(data.limit_order_date);
      $("#limit_order_expiry_date_mod").val(data.limit_order_expiry_date);

      switch(data.pvt_limit_order){
          case 'true': $("#pvt_limit_checkbox_mod").prop('checked', true); break;
          case 'false': $("#pvt_limit_checkbox_mod").prop('checked', false); break;
          default: data.pvt_limit_order
      }
      
      
      order_value_original = data.order_price * data.order_qty;
      $("#order_value_diff_mod_text").removeClass().addClass('neutral');
      $("#order_value_diff_mod_text").text('0.00');
      $("#order_value_diff_mod").val(0);
      $("#order_value_mod_text").text(order_value_original);
      $("#order_value_mod").val(order_value_original);
      
      $("#limit_order_yield_mod").val(data.order_yield);
      $("#order_time_mod").val(data.order_time);
      $("#client_order_id_mod").val(data.order_id);
      $("#time_in_force_mod").val(data.time_in_force);
      $("#engine_id_mod").val(data.engine_id);
      $("#emergency_mod").val(data.emergency);
      $("#leaves_qty_mod").val(data.due_qty);
      $("#cum_qty_mod").val(data.cum_qty);
      $("#last_qty_mod").val(data.last_qty);
      $("#last_px_mod").val(data.last_px);
      $("#avg_px_mod").val(data.avg_px);
      $("#order_status_mod").val(data.order_status);
      $("#user_device_mod").val(data.user_device);
      $("#order_branch_mod").val(data.branch);

      $('#sym_isin_mod').val(data.symbol_isin);
      $('#sym_class_mod').val(data.symbol_assetclass);
      $('#sym_category_mod').val(data.symbol_category);
      $('#sym_spot_mod').val(data.compulsory_spot);
      $('#chain_id_mod').val(data.chain_id);
      $('#exec_status_mod').val(data.exec_status);
      $('#reforder_id_mod').val(data.reforder_id);
      
  });
} 

//Switch Exchange Function
function mobile_switch_exchange_mod(elemid){
  if (elemid == "xcg1_mod"){
      $('#xcg1_mod').addClass('widget-btn-mod-active');
      $('#xcg2_mod').removeClass('widget-btn-mod-active');
      $('#xcg3_mod').removeClass('widget-btn-mod-active');
  }
  if (elemid == "xcg2_mod"){
      $('#xcg2_mod').addClass('widget-btn-mod-active');
      $('#xcg1_mod').removeClass('widget-btn-mod-active');
      $('#xcg3_mod').removeClass('widget-btn-mod-active');
  }
  if (elemid == "xcg3_mod"){
      $('#xcg3_mod').addClass('widget-btn-mod-active');
      $('#xcg1_mod').removeClass('widget-btn-mod-active');
      $('#xcg2_mod').removeClass('widget-btn-mod-active');
  }    
}

function updateMobilebodata_mod(client_id) {
  var cln_code = client_id;
  
  if (cln_code.length && code_list.includes(cln_code)) {
      $.getJSON("shared/getbodata/", {
          cln_code: cln_code
      }, function (data) {
          // console.log(data);
          if(Object.keys(data).length > 0){
              // document.getElementById("portfolio_code").innerHTML = cln_code + " - " + item.cln_name;
              // document.getElementById("bo_label").innerHTML = item.cln_bo;
              document.getElementById("ac_name_mod").innerHTML = "Name : "+data.cln_name;
              $('#ac_balance_mod').text(Number(data.b_limit).toLocaleString('en-IN'));
              $('#ac_balance_mod').val(data.b_limit);
              $('#ac_balance_mod').css({"color": "#00DB86", "font-weight": "bold"});
              document.getElementById("order_branch_mod").value = data.branch;
              document.getElementById("client_ac_type_mod").value = data.acc_type;
              // document.getElementById("broker_label").innerHTML = item.pvdr_id;
              document.getElementById("bo_acc_mod").value = data.cln_bo;
              document.getElementById("client_name_mod").value = data.cln_name;
              document.getElementById("pvdr_id_mod").value = "";
              document.getElementById("cln_id_mod").value = "";
              document.getElementById("ref_id_mod").value = "";
              $('#trader_id_mod').attr('data-dse-trader',data.dealer);
              $('#trader_id_mod').attr('data-cse-trader',data.dealer);
              document.getElementById("trader_id_mod").value = data.dealer;
              
          }
      });
  }
}

function checkMobileModSaleable(){
  $('#saleable_qty_mod').val('');
  if ($("#order_instrument_mod").val() != null && $("#order_instrument_mod").val() != ''){
      var symbol_split = $("#order_instrument_mod").val().split('.');
      var clientcode = $("#order_client_code_mod").val();
      var symbol = symbol_split[0];
      var orderside = $('#order_side_mod').val();
      $.getJSON("shared/checksaleable/", {
          clientcode: clientcode,
          symbol: symbol
      }, function (data) {
          $('#saleable_qty_mod').text(Number(data).toLocaleString("en-IN"));
          $('#saleable_qty_mod').val(data);
          
      });
  }
}

function verify_mobile_fields_mod(){
  if($('#order_type_mod').val() == 'Limit'){
      if($("#order_client_code_mod").val() != '' && 
      $("#order_instrument_mod").val() != '' && 
      $("#order_qty_mod").val() != '' && 
      $("#limit_order_rate_mod").val() != '' &&
      $("#order_client_code_mod").val() != null && 
      $("#order_instrument_mod").val() != null && 
      $("#order_qty_mod").val() != null && 
      $("#limit_order_rate_mod").val() != null &&
      $("#order_qty_mod").val() != 0 && 
      $("#limit_order_rate_mod").val() != 0){
          return true;
      } else {
          return false;
      }
  }
}

function symbolpricedataMobileModify(ticker){
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

//Fetch Symbol info for selected stock
function getSymbolInfoMobileModify(){
  if ($("#order_instrument_mod").val() != null && $("#order_instrument_mod").val() != ''){

      var symbol_split = $("#order_instrument_mod").val().split('.');
      var symbol = symbol_split[0];
      var board = symbol_split[1];
      if(board == 'YIELDDBT' || board == 'BUYDBT'){
          $('.yield_window_mod').show();
          $('#limit_order_rate_mod').attr('step',0.0001);
          getGsecDataMobileModify(symbol);
      } else {
          $('.yield_window_mod').hide();
          $('#limit_order_rate_mod').attr('step',0.10);
      }
      $.getJSON("shared/getsymboldata/", {
          mkt_group: board,
          mkt_symbol: symbol
      }, function (data) {
          $('#sym_isin_mod').val(data.isin);
          $('#sym_class_mod').val(data.symbol_instr);
          $('#sym_category_mod').val(data.symbol_category);
          if (data.market_type == 'S'){
              $('#sym_spot_mod').val('Y');
              // $('.symbol_spot').show();
              $(".order_up").text(data.circuit_up != null ? data.circuit_up : '-');
              $(".order_down").text(data.circuit_down != null ? data.circuit_down : '-');
          }
          if (data.market_type == 'P'){
              $('#sym_spot_mod').val('N');
              // $('.symbol_spot').hide();
              if (data.symbol_category=="A" || data.symbol_category=="B" || data.symbol_category=="D" ||
              data.symbol_category=="N" || data.symbol_category=="Z"){
                  $(".order_up").text(data.circuit_up != null ? data.circuit_up : '-');
                  $(".order_down").text(data.circuit_down != null ? data.circuit_down : '-');
              }
          }
          data.high != null ? $(".order_high").text(data.high) : $(".order_high").text('-');
          data.low != null ? $(".order_low").text(data.low) : $(".order_low").text('-');
          
      }); 
      
  }
}

function getGsecDataMobileModify(symbol) {
  fetch(`shared/getgsecdata/${symbol}`)
      .then((res) => res.json())
      .then((data) => {
          // console.log(data);
          
          var today = new Date();
          var face_value = parseInt(data[4].data_value);
          var coupon_rate_percent = parseFloat(data[8].data_value)/100;
          var year_basis = parseInt(data[14].data_value);
          var maturity_date = new Date(data[11].data_value);
          var issue_date = new Date(data[7].data_value);
          var coupon_freq = parseInt(data[10].data_value);
          var tenure = data[6].data_value;
          var market_lot = parseInt(data[5].data_value);
          
          var maturity_period = Math.round(maturity_date.getTime() - today.getTime());
          var days_to_maturity = (maturity_period / (1000 * 3600 * 24));
          var years_to_maturity = parseFloat((days_to_maturity/year_basis).toFixed(4));
          var period = years_to_maturity * coupon_freq;
          var semi_annual_coupon_rate_percent = coupon_rate_percent / 2;
          var semi_annual_coupon_payment = face_value * semi_annual_coupon_rate_percent;

          var coupon_period=0, days_till_next_coupon=0;

          var first_coupon_date = new Date(data[7].data_value);
          var second_coupon_date = new Date(data[7].data_value);

          first_coupon_date.setDate(first_coupon_date.getDate() + (year_basis/2));
          second_coupon_date.setDate(second_coupon_date.getDate() + year_basis);

          if(days_to_maturity > 0){
              first_coupon_date.setFullYear(today.getFullYear());
              second_coupon_date.setFullYear(today.getFullYear());
              first_coupon_month_diff = first_coupon_date.getMonth() - today.getMonth();
              second_coupon_month_diff = second_coupon_date.getMonth() - today.getMonth();
              if(first_coupon_month_diff < second_coupon_month_diff){
                  coupon_period = Math.round(first_coupon_date.getTime() - today.getTime());
              } else {
                  coupon_period = Math.round(second_coupon_date.getTime() - today.getTime());
              }
              days_till_next_coupon = (coupon_period / (1000 * 3600 * 24));
          }
          var days_since_last_coupon = (year_basis/coupon_freq) - days_till_next_coupon;
          var accr_int = parseFloat(((face_value * coupon_rate_percent * days_since_last_coupon) / year_basis).toFixed(4));

          if($('.yield_window_mod').is(":visible")){
              $('.yield_window_mod').attr("data-period", period);
              $('.yield_window_mod').attr("data-couponpayment", semi_annual_coupon_payment);
              $('.yield_window_mod').attr("data-facevalue", face_value);
              $('.yield_window_mod').attr("data-couponfreq", coupon_freq);
              $('#dirty_price_mod').text('');
              $('#accr_int_mod').text(accr_int);
          }
      })
      .catch((err) => {
          console.log(err);
      });
}

function getmktdepthMobileModify(target_symbol){

  var symbol_split = target_symbol.split(".");
  var symbol = symbol_split[0];
  var board = symbol_split[1];
  var symbol_board = symbol.replace(/[^a-zA-Z ]/g, '')+board;

  $.getJSON("shared/getmktdepth/", {
      mkt_group: board,
      mkt_symbol: symbol
  }, function (data) {
      if(data!=''){
          $('.mobile-modify-bidAndask-tbody').html('');

          var bid_levels = JSON.parse(data.bid_levels);
          var ask_levels = JSON.parse(data.ask_levels);
          var price_decimal = data.price_decimals;
          var md_point = parseInt(price_decimal);
          var md_multiple = Math.pow(10, md_point);
          var md_bid =  (bid_levels != null) ? bid_levels.bid_level : [];
          var md_ask = (ask_levels != null) ? ask_levels.ask_level : [];
          
          $('.mobile-modify-bidAndask-tbody').html(`

          <tr>                             
              <td class=" mobile-modify-bidQ-column-value ${symbol_board}_db2"></td>
              <td class=" mobile-modify-bid-column-value ${symbol_board}_db1"></td>
              <td class="mobile-modify-bidAndask-middle-column-value">
                  <div id="mobile-modify-arrow-icon">
                      <i class="fa fa-angle-double-down mobile-modify-icon-up-down"></i> 
                  </div>
              </td>
              <td class=" mobile-modify-ask-column-value ${symbol_board}_ds1"></td>
              <td class=" mobile-modify-askQ-column-value ${symbol_board}_ds2"></td>  
          </tr>
          <tr class="mobile-modify-bidAndask-row"> 
              <td class=" mobile-modify-bidQ-column-value ${symbol_board}_db4"></td>
              <td class=" mobile-modify-bid-column-value ${symbol_board}_db3"></td>
              <td class="mobile-modify-bidAndask-middle-column-value"></td>
              <td class=" mobile-modify-ask-column-value ${symbol_board}_ds3"></td>
              <td class=" mobile-modify-askQ-column-value ${symbol_board}_ds4"></td> 
          </tr>
          <tr class="mobile-modify-bidAndask-row"> 
              <td class=" mobile-modify-bidQ-column-value ${symbol_board}_db6"></td>
              <td class=" mobile-modify-bid-column-value ${symbol_board}_db5"></td>
              <td class="mobile-modify-bidAndask-middle-column-value"></td>
              <td class=" mobile-modify-ask-column-value ${symbol_board}_ds5"></td>
              <td class=" mobile-modify-askQ-column-value ${symbol_board}_ds6"></td> 
          </tr>
          <tr class="mobile-modify-bidAndask-row"> 
              <td class=" mobile-modify-bidQ-column-value ${symbol_board}_db8"></td>
              <td class=" mobile-modify-bid-column-value ${symbol_board}_db7"></td>
              <td class="mobile-modify-bidAndask-middle-column-value"></td>
              <td class=" mobile-modify-ask-column-value ${symbol_board}_ds7"></td>
              <td class=" mobile-modify-askQ-column-value ${symbol_board}_ds8"></td> 
          </tr>
          <tr class="mobile-modify-bidAndask-row"> 
              <td class=" mobile-modify-bidQ-column-value ${symbol_board}_db10"></td>
              <td class=" mobile-modify-bid-column-value ${symbol_board}_db9"></td>
              <td class="mobile-modify-bidAndask-middle-column-value"></td>
              <td class=" mobile-modify-ask-column-value ${symbol_board}_ds9"></td>
              <td class=" mobile-modify-askQ-column-value ${symbol_board}_ds10"></td> 
          </tr>
          <tr class="mobile-modify-bidAndask-row"> 
              <td class=" mobile-modify-bidQ-column-value ${symbol_board}_db12"></td>
              <td class=" mobile-modify-bid-column-value ${symbol_board}_db11"></td>
              <td class="mobile-modify-bidAndask-middle-column-value"></td>
              <td class=" mobile-modify-ask-column-value ${symbol_board}_ds11"></td>
              <td class=" mobile-modify-askQ-column-value ${symbol_board}_ds12"></td> 
          </tr>
          <tr class="mobile-modify-bidAndask-row"> 
              <td class=" mobile-modify-bidQ-column-value ${symbol_board}_db14"></td>
              <td class=" mobile-modify-bid-column-value ${symbol_board}_db13"></td>
              <td class="mobile-modify-bidAndask-middle-column-value"></td>
              <td class=" mobile-modify-ask-column-value ${symbol_board}_ds13"></td>
              <td class=" mobile-modify-askQ-column-value ${symbol_board}_ds14"></td> 
          </tr>
          <tr class="mobile-modify-bidAndask-row"> 
              <td class=" mobile-modify-bidQ-column-value ${symbol_board}_db16"></td>
              <td class=" mobile-modify-bid-column-value ${symbol_board}_db15"></td>
              <td class="mobile-modify-bidAndask-middle-column-value"></td>
              <td class=" mobile-modify-ask-column-value ${symbol_board}_ds15"></td>
              <td class=" mobile-modify-askQ-column-value ${symbol_board}_ds16"></td> 
          </tr>
          <tr class="mobile-modify-bidAndask-row"> 
              <td class=" mobile-modify-bidQ-column-value ${symbol_board}_db18"></td>
              <td class=" mobile-modify-bid-column-value ${symbol_board}_db17"></td>
              <td class="mobile-modify-bidAndask-middle-column-value"></td>
              <td class=" mobile-modify-ask-column-value ${symbol_board}_ds17"></td>
              <td class=" mobile-modify-askQ-column-value ${symbol_board}_ds18"></td> 
          </tr>
          <tr class="mobile-modify-bidAndask-row"> 
              <td class=" mobile-modify-bidQ-column-value ${symbol_board}_db20"></td>
              <td class=" mobile-modify-bid-column-value ${symbol_board}_db19"></td>
              <td class="mobile-modify-bidAndask-middle-column-value"></td>
              <td class=" mobile-modify-ask-column-value ${symbol_board}_ds19"></td>
              <td class=" mobile-modify-askQ-column-value ${symbol_board}_ds20"></td> 
          </tr> 
          `); 

          var mobile_trade_trs = document.getElementsByClassName('mobile-modify-bidAndask-row');  
          $('#mobile-modify-arrow-icon').click(function() {
            $(this).children().toggleClass("fa-rotate-180");  

            if ($(this).children().hasClass("fa-rotate-180")) {
              mobile_trade_trs.forEach(function(tr, index) {
                tr.style.display = index < 3 ? 'table-row' : 'none';
              });
            }
            else {
              $(".mobile-modify-bidAndask-row").hide();
            }
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
          update_market_depth_bar_modify(buy_percent, sell_percent)
          
      }
  });

}

function  update_market_depth_bar_modify(buy_percent, sell_percent){ 

  if (isNaN(buy_percent) && isNaN(sell_percent)) {

      $('.mobile-modify-bidPerQ').text('50%');
      $('.mobile-modify-askPerQ').text('50%');
      
    } 
  else {
      if(marketDepthBarModify != null){
        marketDepthBarModify.setOption({
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
           $('.mobile-modify-bidPerQ').text(buy_percent.toFixed(2)+'%');
           $('.mobile-modify-askPerQ').text(sell_percent.toFixed(2)+'%');
      }
    }

  
}