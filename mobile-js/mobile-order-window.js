//Long-Term Order global variables
var num_weekdays = 0;
var longterm_daily_qty = 0;

//-------------------------------

$(document).ready(function () {
  //Code for Order Window Mode
  var ordermodeSwitch = document.querySelector(
    '.order-switch input[type="checkbox"]'
  );
  
  if (ordermodeSwitch != null) {
    ordermodeSwitch.checked = false;

    function switchOrderMode(e) {
      if (e.target.checked) {
        $('#order_mode_text').text("Advance");
        $(".order_window_advanced").show();
       
      } else {
        $('#order_mode_text').text("Simple");
        $(".order_window_advanced").hide();
        
      }
    }
    ordermodeSwitch.addEventListener("change", switchOrderMode, false);
  }
  

  //buy-sell bootstrap switch
  $("#order_side_select").bootstrapSwitch();
  init_symbols_codes();
  $(".datepicker").datepicker();

  //Set Default GUI

  $("#limit-window").hide();
  $("#market-window").hide();
  $("#special-window").hide();
  $('.yield_window').hide();
  $('#exchange_select').show();

  //Force Numeric input only
  $("#order_qty").ForceNumericOnly();
  $("#drip_qty").ForceNumericOnly();
  $("#min_qty").ForceNumericOnly();

  // $(".order_submit_btn").prop("disabled", true);
  $("#drip_qty").prop("defaultValue", "0");
  $("#min_qty").prop("defaultValue", "0");

  //Long-Term Order Window Initialized
  $("#long-term-weekdays").text("0 working days at ");
  $("#daily-qty").text("");
  $("#min-drip-qty").text("");
  reset_fields();

});

//Switch Exchange Function
function switch_exchange(elem) {
  var elemid = $(elem).attr("id");
  if (elemid == "xcg1") {
    $("#exchange").val("Priority");
    $("#xcg1").addClass("widget-btn-active");
    $("#xcg2").removeClass("widget-btn-active");
    $("#xcg3").removeClass("widget-btn-active");
  }
  if (elemid == "xcg2") {
    $("#exchange").val("DSE");
    $("#xcg2").addClass("widget-btn-active");
    $("#xcg1").removeClass("widget-btn-active");
    $("#xcg3").removeClass("widget-btn-active");
  }
  if (elemid == "xcg3") {
    $("#exchange").val("CSE");
    $("#xcg3").addClass("widget-btn-active");
    $("#xcg1").removeClass("widget-btn-active");
    $("#xcg2").removeClass("widget-btn-active");
  }
}
// // Update symbol data on symbol change
$('#order_instrument').on('change', function () {
  $('#order_qty').val('');
  $('#order_qty').removeAttr('style');
  $('#order_value').val('');
  $("#limit_order_rate").val('');
  $("#limit_order_yield").val('');
  $('#limit_order_rate').removeAttr('style');
  
  reset_fields();
  getBBO();
  getSymbolInfo();
  if (code_list.includes($('#order_client_code').val())) {
      updatebodata();
      checkSaleable();
      checkCashLimit();
  }
});

// Update account data on trading account change
$('#order_client_code').on('input', function () {
    $('#order_qty').val('');
    $('#order_qty').removeAttr('style');
    $('#order_value').val('');
    $("#limit_order_rate").val('');
    $("#limit_order_yield").val('');
    $('#limit_order_rate').removeAttr('style');
    reset_fields();
  if (code_list.includes($(this).val())) {
    $('#global_client_code').val($(this).val()).trigger('change');
    var selected_client = $(this).val();
    set_client_code_data(selected_client);
    reset_fields();
    getBBO();
    getSymbolInfo();
    updatebodata();
    checkSaleable();
    checkCashLimit();
  }
});

//Update Trading Account data function
function updatebodata() {
  var cln_code = $('#order_client_code').val();
  if (cln_code?.length && code_list.includes(cln_code)) {
      $.getJSON("shared/getbodata/", {
          cln_code: cln_code
      }, function (data) {
          if(Object.keys(data).length > 0){
              // $("portfolio_code").innerHTML = cln_code + " - " + item.cln_name;
              // $("bo_label").innerHTML = item.cln_bo;
              document.getElementById("ac_name").innerHTML = data.cln_name;
              document.getElementById("bo_label").innerHTML = data.cln_bo;
              document.getElementById("bo_acc").value = data.cln_bo;
              document.getElementById("client_ac_type").value = data.acc_type;
              document.getElementById("client_name").value = data.cln_name;
              document.getElementById("pvdr_id").value = "";
              document.getElementById("cln_id").value = "";
              document.getElementById("ref_id").value = "";
              document.getElementById("order_branch").value = data.branch;
              // Dealer Assignment
              $('#trader_id').attr('data-dse-trader',data.dealer);
              $('#trader_id').attr('data-cse-trader',data.dealer);
              if($("#exchange").val() == 'DSE'){
                  document.getElementById("trader_id").value = data.dealer;
              }
              if($("#exchange").val() == 'CSE'){
                  document.getElementById("trader_id").value = data.dealer;
              }
          }
      });
  }
}

//On Change of Exchange Reset or Trading Account Change, Reset Form Fields
function reset_fields(){
  $('#order_qty').attr('placeholder','Order Qty');
  $('#drip_qty').attr('placeholder','Drip Qty');
  if($('.yield_window').is(":visible")){
      $('#accr_int').text('');
      $('#dirty_price').text('');
  }
  $('#limit_order_yield').attr('placeholder','Order Yield');
  $('#min_qty').attr('placeholder','0');
  $('#stop_loss').attr('placeholder','0.00');
  $('#take_profit').attr('placeholder','0.00');
  $('#limit_order_rate').attr('placeholder','Order Rate');
  
  // $('#order_qty').val('');
  // $('#order_qty').removeAttr('style');
  // $('#order_value').val('');
  // $("#limit_order_rate").val('');
  // $('#limit_order_rate').removeAttr('style');

  $('#drip_qty').val('');
  $("#min_qty").val('');
  $("#stop_loss").val('');
  $("#take_profit").val('');
  $("#order_validity").val("DAY").trigger('change');

  $('#ac_balance').removeAttr('style');
  $('#ac_balance').val('');
  $('#ac_name').val('');
  $('#bo_label').val('');

  $('#ac_balance').text('');
  $('#ac_name').text('');
  $('#bo_label').text('');
  // $('#stock_value').removeAttr('style');
  // $('#stock_value').val('');
  // $('#stock_value').text('');
  $('#saleable_qty').val('');
  $('#saleable_qty').text('');
  $(".order_submit_btn").prop("disabled", true);

}

//Limit Order Type Select
$('#limit_order_type').change(function(){
  if ($(this).val()=='Buy Limit'){
      $('#order_side_select').prop('checked', true).trigger('change');
      $('#order_side').attr('value', 'BUY').trigger('change');
     
  }
  if ($(this).val()=='Sell Limit'){
      $('#order_side_select').prop('checked', false).trigger('change');
      $('#order_side').attr('value', 'SELL').trigger('change');
  }
     
});

//Correlated Order Type Select
$('#corr_order_side_1').change(function(){
  if ($(this).val()=='BUY'){
      $('#order_side_select').prop('checked', true).trigger('change');
      $("#corr_order_side_1").css("background", "#26a051");
      $("#corr_order_side_2").css("color", "#c71919");
      $('#corr_order_side_2').val('SELL');
      $('#corr_order_side_2').text(' SELL ');
  }
  if ($(this).val()=='SELL'){
      $('#order_side_select').prop('checked', false).trigger('change');
      $("#corr_order_side_1").css("background", "#c71919");
      $("#corr_order_side_2").css("color", "#26a051");
      $('#corr_order_side_2').val('BUY');
      $('#corr_order_side_2').text(' BUY ');
  }
});
//Index Order Type Select
$('#index_order_type').change(function(){
  if ($(this).val()=='BUY'){
      $('#order_side_select').prop('checked', true).trigger('change');
      $('#order_side').attr('value', 'BUY').trigger('change');
  }
  if ($(this).val()=='SELL'){
      $('#order_side_select').prop('checked', false).trigger('change');
      $('#order_side').attr('value', 'SELL').trigger('change');
  }
});
//Long-Term Order Type Select
$('#longterm_order_type').change(function(){
  if ($(this).val()=='BUY'){
      $('#order_side_select').prop('checked', true).trigger('change');
      $('#order_side').attr('value', 'BUY').trigger('change');
  }
  if ($(this).val()=='SELL'){
      $('#order_side_select').prop('checked', false).trigger('change');
      $('#order_side').attr('value', 'SELL').trigger('change');
  }
});


$("#order_side_select").change(function () {
  if ($(this).is(":checked")) {
    $(this).attr("value", "BUY");
    $(".ord-win-border").css("border-color", "#26a051");
    $("#order_side").attr("value", "BUY");
    $(".order_submit_btn")
      .removeClass()
      .addClass("order_submit_btn btn activebuy w-100");
    $('#limit_order_rate').removeAttr('style');
    $('#order_qty').removeAttr('style');
    $('#ac_balance').removeAttr('style');
    $('#stock_value').removeAttr('style');
    $('#stock_value').text('');
    $('#stock_value').val('');
    $('#order_value').val('');
    $('#limit_order_type').val('Buy Limit');
    
  } else {
    $(this).attr("value", "SELL");
    $(".ord-win-border").css("border-color", "#c71919");
    $("#order_side").attr("value", "SELL");
    $(".order_submit_btn")
      .removeClass()
      .addClass("order_submit_btn btn activesell w-100");
    $('#limit_order_rate').removeAttr('style');
    $('#order_qty').removeAttr('style');
    $('#ac_balance').removeAttr('style');
    $('#stock_value').removeAttr('style');
    $('#stock_value').text('');
    $('#stock_value').val('');
    $('#order_value').val('');
    $('#limit_order_type').val('Sell Limit');
    
  }
});

$("#special_order_type").change(function () {
  var special_type = $("#special_order_type").val();
  if (special_type == "index_based") {
    $("#global-qty").show();
    $("#index_name_field").show();
    $("#index_value_field").show();
    $("#index-window").show();
    $("#correlated-window").hide();
    $("#long-term-window").hide();
  } else {
    $("#index_name_field").hide();
    $("#index_value_field").hide();
  }
  if (special_type == "long_term") {
    $("#global-qty").hide();
    $("#longterm_order_field").show();
    $("#long-term-window").show();
    $("#index-window").hide();
    $("#correlated-window").hide();
    $("#bid-ask-2").show();
    $("#bid-ask-1").hide();
    tradetime();
  } else {
    $("#longterm_order_field").hide();
  }
  if (special_type == "correlated") {
    $("#global-qty").hide();
    $("#correlated-window").show();
    $("#long-term-window").hide();
    $("#index-window").hide();
  }
});


$('#order_type').change(function () {
  $(".order_submit_btn").prop("disabled", true);
  $("#order_qty").val('');
  $("#limit_order_rate").val('');
  $('#limit_order_yield').val('');
  var order_type = $('#order_type').val();
  if (order_type == 'Limit') {
      $('.limit_window').show();
      $('.market_window').hide();
      $('.special_window').hide();
  }
  if (order_type == 'Market' || order_type == 'MarketBest') {
      $('.limit_window').hide();
      $('.market_window').show();
      $('.special_window').hide();
      if($('#order_side').val() == 'BUY'){
          $('#market_order_rate').val($(".order_askp").val());
      }
      if($('#order_side').val() == 'SELL'){
          $('#market_order_rate').val($(".order_bidp").val());
      }
  }
  if (order_type == 'Special') {
      $('.limit_window').hide();
      $('.market_window').hide();
      $('.special_window').show();
      $('#special_order_type').val('index_based').trigger('change');
  }
});


// Get Order Sending Time
function get_order_sending_time(){
  var d = new Date();
  var order_time = d.getUTCFullYear()+''+((d.getUTCMonth() < 10 ? '0' : '') + (d.getUTCMonth()+1))+''
  +((d.getUTCDate() < 10 ? '0' : '') + d.getUTCDate())+'-'
  +((d.getUTCHours() < 10 ? '0' : '') + d.getUTCHours())+':'
  +((d.getUTCMinutes() < 10 ? '0' : '') + d.getUTCMinutes())+':'
  +((d.getUTCSeconds() < 10 ? '0' : '') + d.getUTCSeconds())+'.'
  +millisec_format(d.getUTCMilliseconds());
  $('#order_time').val(order_time);
  return order_time;
}

function get_order_expire_time(){
  var d = new Date();
  var order_time = d.getUTCFullYear()+''+((d.getUTCMonth() < 10 ? '0' : '') + (d.getUTCMonth()+1))+''
  +((d.getUTCDate() < 10 ? '0' : '') + d.getUTCDate())+'-'
  +(((d.getUTCHours()+1) < 10 ? '0' : '') + (d.getUTCHours()+1))+':'
  +((d.getUTCMinutes() < 10 ? '0' : '') + d.getUTCMinutes())+':'
  +((d.getUTCSeconds() < 10 ? '0' : '') + d.getUTCSeconds())+'.'
  +millisec_format(d.getUTCMilliseconds());
  $('#order_time').val(order_time);
  return order_time;
}
//Format Milliseconds
function millisec_format(ms){
  var millisec;
  if (ms < 10){
      millisec = '00'+ms;
  }
  if (ms >= 10 && ms < 100){
      millisec = '0'+ms;
  }
  if (ms >= 100){
      millisec = ms;
  }
  return millisec;
}
// Create Client Order ID
function create_new_order_id(client_code){
  var d = new Date();
  var n = 8; // 7 alphanumeric chars - order id length
  // var client_order_id = client_code+'-'+d.getHours()+''+d.getMinutes()+''+d.getSeconds()+''+d.getMilliseconds();
  var randomString = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for ( var i = 0; i < n; i++ ) {
    randomString += characters.charAt(Math.floor(Math.random()*characters.length));
  }

  var client_order_id = randomString;

  $('#client_order_id').val(client_order_id);
  $('#chain_id').val(client_order_id);
  return client_order_id;
}
// Compile FIX msg
function compile_fix_msg(form){
  var formvals = {};
  var ordermsg = '';
  var orderside = '';
  var ordervalidity = '';

  $.each($(form).serializeArray(), function(i, field) {
      formvals[field.name] = field.value;
  });

  var symbol_split = formvals.order_instrument.split('.');
  var order_symbol = symbol_split[0];
  var order_board = symbol_split[1];

  switch(formvals.order_validity){
      case 'DAY': ordervalidity='0'; break;
      case 'SESSION': ordervalidity='S'; break;
      case 'IOC': ordervalidity='3'; break;
      case 'FOK': ordervalidity='4'; break;
      case 'GTC': ordervalidity='1'; break;
      case 'GTD': ordervalidity='6'; break;
      default : 'DAY';
  } 
  
  
  //+'50='+formvals.trader_id.toUpperCase()
  new_order_id = create_new_order_id(formvals.order_client_code);
  formvals.client_order_id = new_order_id;
  formvals.chain_id = new_order_id;
  formvals.order_side == 'BUY' ? orderside = '1' : orderside = '2';
  formvals.order_time = get_order_sending_time();

  console.log(formvals);
  //Add header tags
  ordermsg = "8=FIXT.1.19=21635=D34=852=20210830-07:08:20.48956=TEST"
  ordermsg += '1='+formvals.bo_acc+'11='+formvals.client_order_id+'453=1448='+formvals.order_client_code
              +'447=C452=5529=N'+'762='+order_board+'59='+ordervalidity
              +'55='+order_symbol+'54='+orderside+'38='+formvals.order_qty
              +'50='+formvals.trader_id+'60='+formvals.order_time+'';

  if (formvals.exchange == 'DSE'){
      if(formvals.order_type == 'Market'){ //Market Order
          ordermsg += '40=1' + '';

          if (order_board!='BLOCK' && formvals.pvt_mkt_order == 'true'){ // Private Market Order
              ordermsg += '18=S' + '';
          }
          if(order_board=='BLOCK' && formvals.pvt_mkt_order == 'false'){ //Block Market Order
              ordermsg += '18=w' + '';
          }
          if(order_board=='BLOCK' && formvals.pvt_mkt_order == 'true'){ //Block Pvt Market Order
              ordermsg += '18=w S' + '';
          }
      } else if(formvals.order_type == 'MarketBest'){ //Market at Best
          ordermsg += '40=Z' + '';
          if (order_board!='BLOCK' && formvals.pvt_mkt_order == 'true'){ // Private Market Order
              ordermsg += '18=S' + '';
          }
          if(order_board=='BLOCK' && formvals.pvt_mkt_order == 'false'){ //Block Market Order
              ordermsg += '18=w' + '';
          }
          if(order_board=='BLOCK' && formvals.pvt_mkt_order == 'true'){ //Block Pvt Market Order
              ordermsg += '18=w S' + '';
          }
      } else if(formvals.order_type == 'Limit'){ //Limit Order
          ordermsg += '40=2' + '44='+formvals.limit_order_rate + '';

          if(order_board!='BLOCK' && formvals.pvt_limit_order == 'true'){ // Private Limit Order
              ordermsg += '18=S' + '';
          }
          if(order_board=='BLOCK' && formvals.pvt_limit_order == 'false' && $("#whole_none").val() == "WON"){ //Block Limit Order
              ordermsg += '18=w' + '';
          }
          if(order_board=='BLOCK' && formvals.pvt_limit_order == 'true'){ //Block Pvt Limit Order
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
      if(ordervalidity == 6){ //GTD Order
          ordermsg += '126='+get_order_sending_time() + '';
          ordermsg += '432='+get_order_expire_time() + '';
      }
      //add checksum
      ordermsg += '10=100'+'';
      
  }
  return ordermsg;
}

$("#order-window-form").submit(function(e) {
e.preventDefault();
});

//Process FIX msg for Order Form
function processOrder(){
  $(".order_submit_btn").prop("disabled", true);
  if(orderwindow != undefined){
      orderwindow.close();
  }
  // Check server and market status
  $.get("/shared/getmktstatus/", function (data) {
      if (system_user_role != 'brokeradmin' && system_user_role != 'administrator' && system_user_role != 'brokertrader' && system_user_role != 'client' && system_user_role != 'associate'){
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
          if(code_list.includes($('#order_client_code').val())){
              $('#pvt_limit_checkbox').prop('checked') ? $('#pvt_limit_order').val('true') : $('#pvt_limit_order').val('false');
              $('#pvt_mkt_checkbox').prop('checked') ? $('#pvt_mkt_order').val('true') : $('#pvt_mkt_order').val('false');
              
              var symbol_split = $("#order_instrument").val().split('.');
              var board = symbol_split[1];
              var form = $('#order-window-form');
              var validator = form.validate();
              if(validator.form()){
                  //called from rms_validation.js
                  var rms_check = rms_validation(form);
                  // console.log('rms check result: '+rms_check);
                  if (rms_check == true){
                      var fix_msg = compile_fix_msg(form);
                      // console.log(fix_msg);
                      order_code = $('#order_client_code').val();
                      order_type = $('#order_type').val();
                      order_instrument = $('#order_instrument').val();
                      order_qty = $('#order_qty').val();
                      order_value = $('#stock_value').text();
                      order_price = $('#limit_order_rate').val();
                      order_yield = $('#limit_order_yield').val();
                      order_side = $('#order_side').val();
                      order_name = $('#ac_name').text();
                      if(order_type == 'Market' || order_type == 'MarketBest')order_price = 'Market Price';

                      confirm_msg = "Place "+order_type+" "+order_side+" order "+order_instrument+"<br>"
                          +"Qty: "+order_qty+" @ "+order_price+" | Value BDT: "+order_value+"<br>"
                          +"Client Code: "+order_code+"<br>"
                          +"Name: "+order_name;

                      $.confirm({
                          title: 'Confirm Order',
                          titleClass: 'text-center',
                          content: confirm_msg,
                          typeAnimated: true,
                          theme: 'dark',
                          escapeKey: 'Cancel',
                          buttons: {
                              OK: {
                                  keys: ['enter'],
                                  btnClass: 'btn-success',
                                  action: function () {
                                      add_new_order(form,fix_msg);
                                      $("#order-window-form")[0].reset();
                                      $("#stock_value b").empty();
                                  }
                              },
                              Cancel: {
                                  btnClass: 'btn-danger',
                                  action: function () {}
                              }
                          }
                      });
                      
                  }
              }
          }
      }
  });

}


// Check Saleable quantity for selected stock
function checkSaleable(){
  // console.log('Qty Limit checking');
  // Check for Saleable Qty for this symbol and client code for SELL Side
  $('#saleable_qty').val('');
  $(".order_submit_btn").prop("disabled", true);
  if ($("#order_instrument").val() != null && $("#order_instrument").val() != ''){
      var symbol_split = $("#order_instrument").val().split('.');
      var clientcode = $("#order_client_code").val();
      var symbol = symbol_split[0];
      var orderside = $('#order_side').val();
      $.getJSON("shared/checksaleable/", {
          clientcode: clientcode,
          symbol: symbol
      }, function (data) {
          $('#saleable_qty').text(Number(data).toLocaleString("en-IN"));
          $('#saleable_qty').val(data);
          if (orderside == 'SELL'){
            $('#order_qty').val(data).trigger('change');
              if (data > 0 && verify_fields() == true){
                  $(".order_submit_btn").prop("disabled", false);
              } else {
                  $(".order_submit_btn").prop("disabled", true);
              }
          }
      });
  }
}


// Check Entered qty with Saleable while typing
$('#order_qty').on("input change", function() {
//   console.log('qty field changed');
  var saleable = parseInt($('#saleable_qty').val());
  var qty = parseInt($(this).val()) || 0;
  var cashlimit =  parseFloat($('#ac_balance').val());
  var price = 0;
  var askprice = parseFloat($('.order_askp').val());
  var orderside = $('#order_side').val();
  var order_type = $('#order_type').val();
  var value = 0;

  if (order_type == 'Market' || order_type == 'MarketBest'){
      price = parseFloat($("#market_order_rate").val()) || 0;
  }
  if (order_type == 'Limit'){
      price = parseFloat($("#limit_order_rate").val()) || 0;
  }
  
  if(verify_fields() == false){
      $(".order_submit_btn").prop("disabled", true);
  }

  if(qty == 0 || price == 0 || qty == '' || price == '') {
      $('#stock_value').val('');
      $('#order_value').val('');
      $('#stock_value').text('');
  }
  if (qty != 0 && price != 0){
      value = qty * price;
      $('#order_value').val(value);
      document.getElementById("stock_value").innerHTML = '<span style="color: #00DB86;"><b>'+Number(value).toLocaleString('en-IN')+'</b></span>';
  }

  if (order_type == 'Limit' && orderside == 'BUY'){
      if(cashlimit != 0){
          if (value > cashlimit) {
              $('#order_qty').css({"color": "red", "font-weight": "bold"});
              $('#ac_balance').css({"color": "red", "font-weight": "bold"});
              $(".order_submit_btn").prop("disabled", true);
          }
          if (value <= cashlimit && verify_fields() == true) {
              $('#order_qty').removeAttr('style');
              $('#ac_balance').css({"color": "#00DB86", "font-weight": "bold"});
              $(".order_submit_btn").prop("disabled", false);
          }
      } else {
          $('#order_qty').css({"color": "red", "font-weight": "bold"});
          $(".order_submit_btn").prop("disabled", true);
      }
  }
  if(saleable != '' && orderside == 'SELL'){
      if (qty > saleable) {
          $('#order_qty').css({"color": "red", "font-weight": "bold"});
          $(".order_submit_btn").prop("disabled", true);
      }
      if (qty <= saleable && verify_fields() == true) {
          $('#order_qty').removeAttr('style');
          $(".order_submit_btn").prop("disabled", false);
      }
  }
  if (order_type != 'Limit' && orderside == 'BUY'){
      if(cashlimit != 0){
          if (value > cashlimit) {
              $('#order_qty').css({"color": "red", "font-weight": "bold"});
              $('#ac_balance').css({"color": "red", "font-weight": "bold"});
              $(".order_submit_btn").prop("disabled", true);
          }
          if (value <= cashlimit && verify_fields() == true) {
              $('#order_qty').removeAttr('style');
              $('#ac_balance').css({"color": "#00DB86", "font-weight": "bold"});
              $(".order_submit_btn").prop("disabled", false);
          }
      } else {
          $('#order_qty').css({"color": "red", "font-weight": "bold"});
          $(".order_submit_btn").prop("disabled", true);
      }
  }
});


$('#limit_order_yield').on("input change", function() {
  if($('.yield_window').is(":visible")){
      var saleable = parseInt($('#saleable_qty').val());
      var orderside = $('#order_side').val();
      var order_qty = parseInt($('#order_qty').val());
      var cashlimit =  parseFloat($('#ac_balance').val());
      var order_value = parseFloat($('#order_value').val());
      
      var yield = $('#limit_order_yield').val();
      var period = $('.yield_window').data("period");
      var semi_annual_coupon_payment = $('.yield_window').data("couponpayment");
      var face_value = $('.yield_window').data("facevalue");
      var order_rate = yield_to_price(yield, period, semi_annual_coupon_payment, face_value);
      $('#limit_order_rate').val(order_rate.toFixed(4));
      
      var accr_int = parseFloat($('#accr_int').text());
      var dirty_price = order_rate + accr_int;
      $('#dirty_price').text(dirty_price.toFixed(4));

      var qty = parseInt($('#order_qty').val()) || 0;
      var price = parseFloat($('#limit_order_rate').val()) || 0;

      if(qty == 0 || price == 0 || qty == '' || price == '') {
          $('#stock_value').val('');
          $('#order_value').val('');
          $('#stock_value').text('');
      }
      if (qty != 0 && price != 0){
          value = qty * price;
          $('#order_value').val(value);
          document.getElementById("stock_value").innerHTML = '<span style="color: #00DB86;"><b>'+Number(value).toLocaleString('en-IN')+'</b></span>';
      }

      if(verify_fields() == true){
          if(saleable != 0 && orderside == 'SELL'){
              if (order_qty > saleable) {
                  $('#order_qty').css({"color": "red", "font-weight": "bold"});
                  $(".order_submit_btn").prop("disabled", true);
              }
              if (order_qty <= saleable) {
                  $('#order_qty').removeAttr('style');
                  $(".order_submit_btn").prop("disabled", false);
              }
          }
          if(cashlimit != 0 && orderside == 'BUY'){
              if (order_value > cashlimit) {
                  $('#limit_order_rate').css({"color": "red", "font-weight": "bold"});
                  $('#ac_balance').css({"color": "red", "font-weight": "bold"});
                  $(".order_submit_btn").prop("disabled", true);
              }
              if (order_value <= cashlimit) {
                  $('#limit_order_rate').removeAttr('style');
                  $('#ac_balance').css({"color": "#00DB86", "font-weight": "bold"});
                  $(".order_submit_btn").prop("disabled", false);
              }
          }
      }
      
  }
});

// Check Entered price with Cash Limit while typing
$('#limit_order_rate').on("input change", function() {
  // console.log('rate field changed');
  var saleable = parseInt($('#saleable_qty').val());
  var qty = parseInt($('#order_qty').val()) || 0;
  var price = parseFloat($(this).val()) || 0;
  var cashlimit =  parseFloat($('#ac_balance').val());
  var value = 0;
  var orderside = $('#order_side').val();
  var order_type = $('#order_type').val();
  
  if(verify_fields() == false){
      $(".order_submit_btn").prop("disabled", true);
  }

  if(qty == 0 || price == 0 || qty == '' || price == '') {
      $('#stock_value').val('');
      $('#order_value').val('');
      $('#stock_value').text('');
  }
  if (qty != 0 && price != 0){
      value = qty * price;
      $('#order_value').val(value);
      document.getElementById("stock_value").innerHTML = '<span style="color: #00DB86;"><b>'+Number(value).toLocaleString('en-IN')+'</b></span>';
  }

  if($('.yield_window').is(":visible")){
      var clean_price = parseFloat($(this).val());
      var period = parseFloat($('.yield_window').data("period"));
      var semi_annual_coupon_payment = parseFloat($('.yield_window').data("couponpayment"));
      var face_value = parseInt($('.yield_window').data("facevalue"));
      var coupon_freq = parseInt($('.yield_window').data("couponfreq"));
      var order_yield = price_to_yield(period, semi_annual_coupon_payment, clean_price, face_value, coupon_freq);
      $('#limit_order_yield').val(order_yield.toFixed(4));

      var accr_int = parseFloat($('#accr_int').text());
      var dirty_price = clean_price + accr_int;
      $('#dirty_price').text(dirty_price.toFixed(4));
  }

  if (order_type == 'Limit' && orderside == 'BUY'){
      if(cashlimit != 0){
          if (value > cashlimit) {
              $('#limit_order_rate').css({"color": "red", "font-weight": "bold"});
              $('#ac_balance').css({"color": "red", "font-weight": "bold"});
              $(".order_submit_btn").prop("disabled", true);
          }
          if (value <= cashlimit && verify_fields() == true) {
              $('#limit_order_rate').removeAttr('style');
              $('#ac_balance').css({"color": "#00DB86", "font-weight": "bold"});
              $(".order_submit_btn").prop("disabled", false);
          }
      } else {
          $('#limit_order_rate').css({"color": "red", "font-weight": "bold"});
          $(".order_submit_btn").prop("disabled", true);
      }
  }
  if(saleable != '' && orderside == 'SELL'){
      if (qty > saleable) {
          $('#order_qty').css({"color": "red", "font-weight": "bold"});
          $(".order_submit_btn").prop("disabled", true);
      }
      if (qty <= saleable && verify_fields() == true) {
          $('#order_qty').removeAttr('style');
          $(".order_submit_btn").prop("disabled", false);
      }
  }
  

});

function verify_fields(){
  if($('#order_type').val() == 'Market' || $('#order_type').val() == 'MarketBest'){
      if($("#order_client_code").val() != '' && 
      $("#order_instrument").val() != '' && 
      $("#order_qty").val() != '' && 
      // $("#market_order_rate").val() != '' &&
      $("#order_client_code").val() != null && 
      $("#order_instrument").val() != null && 
      $("#order_qty").val() != null &&
      $("#order_qty").val() != 0
      // $("#market_order_rate").val() != 0
      ){
          return true;
      } else {
          return false;
      }
  }
  if($('#order_type').val() == 'Limit'){
      if($("#order_client_code").val() != '' && 
      $("#order_instrument").val() != '' && 
      $("#order_qty").val() != '' && 
      $("#limit_order_rate").val() != '' &&
      $("#order_client_code").val() != null && 
      $("#order_instrument").val() != null && 
      $("#order_qty").val() != null && 
      $("#limit_order_rate").val() != null &&
      $("#order_qty").val() != 0 && 
      $("#limit_order_rate").val() != 0){
          return true;
      } else {
          return false;
      }
  }
}
// Check cash limit of account
function checkCashLimit(){
  // console.log('cash limit check');
  if ($("#order_client_code").val() != null && $("#order_client_code").val() != ''){
      
      var clientcode = $("#order_client_code").val();
      var orderside = $('#order_side').val();

      $.getJSON("shared/checkcashlimit/", {
          clientcode: clientcode,
      }, function (data) {
          $('#ac_balance').text(Number(data).toLocaleString('en-IN'));
          $('#ac_balance').val(data);
          $('#ac_balance').css({"color": "#00DB86", "font-weight": "bold"});
          if (orderside == 'BUY'){
              if (data > 0 && verify_fields() == true){
                  $(".order_submit_btn").prop("disabled", false);
              } else {
                  $(".order_submit_btn").prop("disabled", true);
              }
          }
      });
  }
}
//Fetch Symbol info for selected stock
function getSymbolInfo(){
  if ($("#order_instrument").val() != null && $("#order_instrument").val() != ''){
      var symbol_split = $("#order_instrument").val().split('.');
      var symbol = symbol_split[0];
      var board = symbol_split[1];
      if(board == 'YIELDDBT' || board == 'BUYDBT'){
          $('.yield_window').show();
          $('#limit_order_rate').attr('step',0.0001);
          getGsecData(symbol);
      } else {
          $('.yield_window').hide();
          $('#limit_order_rate').attr('step',0.10);
      }
      $.getJSON("shared/getsymboldata/", {
          mkt_group: board,
          mkt_symbol: symbol
      }, function (data) {
          $('#sym_isin').val(data.isin);
          $('#sym_class').val(data.symbol_instr);
          $('#sym_category').val(data.symbol_category);
          if (data.market_type == 'S'){
              $('#sym_spot').val('Y');
              $('.symbol_spot').show();
          }
          if (data.market_type == 'P'){
              $('#sym_spot').val('N');
              $('.symbol_spot').hide();
              if (data.symbol_category=="A" || data.symbol_category=="B" || data.symbol_category=="D" ||
              data.symbol_category=="N" || data.symbol_category=="Z"){
                  $(".order_up").text(data.circuit_up != null ? data.circuit_up : '-');
                  $(".order_down").text(data.circuit_down != null ? data.circuit_down : '-');
              }
          }
          data.high != null ? $(".order_high").text(data.high) : $(".order_high").text('-');
          data.low != null ? $(".order_low").text(data.low) : $(".order_low").text('-');
          
      });

    //   $.get("/shared/symbolpricedata/", { symbol: symbol }, function (data) {
    //     console.log(data)
    //     var buy_percent =  (data.buy_qty/data.total_qty)*100;
    //     var sell_percent =  (data.sell_qty/data.total_qty)*100;
        
    //     update_market_depth_bar(buy_percent, sell_percent);
    
    //   })
      
  }
}

// GSEC FORMULA PRICE TO YIELD
RATE = function(periods, payment, present, future, type, guess) {
  guess = (guess === undefined) ? 0.01 : guess;
  future = (future === undefined) ? 0 : future;
  type = (type === undefined) ? 0 : type;

  // Set maximum epsilon for end of iteration
  var epsMax = 1e-10;

  // Set maximum number of iterations
  var iterMax = 10;

  // Implement Newton's method
  var y, y0, y1, x0, x1 = 0,
    f = 0,
    i = 0;
  var rate = guess;
  if (Math.abs(rate) < epsMax) {
    y = present * (1 + periods * rate) + payment * (1 + rate * type) * periods + future;
  } else {
    f = Math.exp(periods * Math.log(1 + rate));
    y = present * f + payment * (1 / rate + type) * (f - 1) + future;
  }
  y0 = present + payment * periods + future;
  y1 = present * f + payment * (1 / rate + type) * (f - 1) + future;
  i = x0 = 0;
  x1 = rate;
  while ((Math.abs(y0 - y1) > epsMax) && (i < iterMax)) {
    rate = (y1 * x0 - y0 * x1) / (y1 - y0);
    x0 = x1;
    x1 = rate;
      if (Math.abs(rate) < epsMax) {
        y = present * (1 + periods * rate) + payment * (1 + rate * type) * periods + future;
      } else {
        f = Math.exp(periods * Math.log(1 + rate));
        y = present * f + payment * (1 / rate + type) * (f - 1) + future;
      }
    y0 = y1;
    y1 = y;
    ++i;
  }
  return rate;
};

// GSEC FORMULA YIELD TO PRICE
PV = function(rate, period, pmt, fv) {
  rate = parseFloat(rate);
  nper = parseFloat(period);
  pmt = parseFloat(pmt);
  fv = parseFloat(fv);
  var factor = (rate == 0 ? nper : (1 - Math.pow(1+rate, -nper))/rate);
  var pv_value = -pmt*factor - fv * Math.pow(1+rate, -nper);
  return pv_value;
}

function price_to_yield(period, semi_annual_coupon_payment, clean_price, face_value, coupon_freq){
  var price_to_yield = RATE(period, semi_annual_coupon_payment, -clean_price, face_value) * coupon_freq * 100;
  return price_to_yield;
}

function yield_to_price(yield, period, semi_annual_coupon_payment, face_value){
  var yield_to_price = PV(yield/(2*100), period, -semi_annual_coupon_payment, -face_value);
  return yield_to_price;
}

function getGsecData(symbol) {
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

          if($('.yield_window').is(":visible")){
              $('.yield_window').attr("data-period", period);
              $('.yield_window').attr("data-couponpayment", semi_annual_coupon_payment);
              $('.yield_window').attr("data-facevalue", face_value);
              $('.yield_window').attr("data-couponfreq", coupon_freq);
              $('#dirty_price').text('');
              $('#accr_int').text(accr_int);
          }
      })
      .catch((err) => {
          console.log(err);
      });
}


function getBBO(){

  if( $("#order_instrument").val() != null && $("#order_instrument").val() != ''  && $("#order_instrument").val() != undefined){
    
    $(".order_bidp").text('-');
    $(".order_askp").text('-');
    $(".order_bidp").val(0);
    $(".order_askp").val(0);
    $('.order_bidq').text('-');
    $('.order_askq').text('-');
    $(".order_high").text('-');
    $(".order_low").text('-');
    $(".order_up").text('-');
    $(".order_down").text('-');
    $('#market_order_rate').val('');
    $('.order_bidp').removeClass().addClass('order_bidp');
    $('.order_askp').removeClass().addClass('order_askp');
    $('.order_bidq').removeClass().addClass('order_bidq');
    $('.order_askq').removeClass().addClass('order_askq');

    var market_type = '';
    var symbol_split = $("#order_instrument").val().split('.');
    var symbol = symbol_split[0];
    var board = symbol_split[1];
    getmktdepthTrade(symbol+'.'+board);
    symbolpricedataMobileTrade(symbol+'.'+board)
    $.getJSON("shared/getBBO/", {
            mkt_group: board,
            mkt_symbol: symbol
        }, function (data) {
            if (data.bid_price != null && data.ask_price != null){
                var md_bid =  data.bid_price;
                var md_ask = data.ask_price;
                var bid_vol = data.bid_qty;
                var ask_vol = data.ask_qty;
                
                if ($('#order_type').val() == 'Market' || $('#order_type').val() == 'MarketBest'){
                    if($('#order_side').val() == 'BUY'){
                        if(!isNaN(md_ask) && md_ask != null && md_ask != 0){
                            $('#market_order_rate').val(md_ask);
                        } else {
                            $('#market_order_rate').val('');
                        }
                    }
                    if($('#order_side').val() == 'SELL'){
                        if(!isNaN(md_bid) && md_bid != null && md_bid != 0){
                            $('#market_order_rate').val(md_bid);
                        } else {
                            $('#market_order_rate').val('');
                        }
                    }
                }
                if(!isNaN(md_bid) && md_bid != null && md_bid != 0){
                    $('.order_bidp').text(md_bid);
                    $(".order_bidp").val(md_bid);
                    $('.order_bidp').addClass('font-weight-bold up');
                    flashup($('.order_bidp'));
                } else {
                    $('.order_bidp').text('-');
                    $(".order_bidp").val('');
                    $('.order_bidp').removeClass().addClass('order_bidp');
                    
                }
                
                if(!isNaN(md_ask) && md_ask != null && md_ask != 0){
                    $('.order_askp').text(md_ask);
                    $(".order_askp").val(md_ask);
                    $('.order_askp').addClass('font-weight-bold down');
                    flashdown($('.order_askp'));
                } else {
                    $('.order_askp').text('-');
                    $(".order_askp").val('');
                    $('.order_askp').removeClass().addClass('order_askp');
                }
                if(!isNaN(bid_vol) && bid_vol != null && bid_vol != 0){
                    $('.order_bidq').text(bid_vol);
                    $(".order_bidq").val(bid_vol);
                    $('.order_bidq').addClass('font-weight-bold up');
                } else {
                    $('.order_bidq').text('-');
                    $(".order_bidq").val('');
                    $('.order_bidq').removeClass().addClass('order_bidq');
                }
                if(!isNaN(ask_vol) && ask_vol != null && ask_vol != 0){
                    $('.order_askq').text(ask_vol);
                    $('.order_askq').val(ask_vol);
                    $('.order_askq').addClass('font-weight-bold down');
                } else {
                    $('.order_askq').text('-');
                    $(".order_askq").val('');
                    $('.order_askq').removeClass().addClass('order_askq');
                }
            }
    });

  }
}

function add_new_order(form,fix_msg){
	
	var formvals = {};
	var order_time = moment().format("DD/MM/YYYY  HH:mm:ss");
	$.each($(form).serializeArray(), function(i, field) {
		formvals[field.name] = field.value;
	});

  var symbol_split = formvals.order_instrument.split('.');
  var order_symbol = symbol_split[0];
  var order_board = symbol_split[1];
    
    
	formvals.order_qty == '' ?	$("#order_qty").val("0") : formvals.order_qty=formvals.order_qty; 
	formvals.drip_qty == '' ?	$("#drip_qty").val("0") : formvals.drip_qty=formvals.drip_qty;
	formvals.min_qty == '' ?	$("#min_qty").val("0") : formvals.min_qty=formvals.min_qty;
	formvals.stop_loss == '' ?	$("#stop_loss").val("0.00") : formvals.stop_loss=formvals.stop_loss;
	formvals.take_profit == '' ?	$("#take_profit").val("0.00") : formvals.take_profit=formvals.take_profit;
	formvals.limit_order_rate == '' ?	$("#limit_order_rate").val("0.00") : formvals.limit_order_rate=formvals.limit_order_rate;
  formvals.limit_order_yield == '' ?	$("#limit_order_yield").val("0.00") : formvals.limit_order_yield=formvals.limit_order_yield;
  formvals.order_time = order_time;
  formvals.fix_msg = fix_msg;

  
  publish_order_cache_msg(JSON.stringify(formvals));

}


function panic_mode_fix_msg(data){
	var cancelmsg = '';
    var formvals = {};
    var d = new Date();
    var order_time = get_order_sending_time();
    var cancel_order_id = create_new_order_id(data.client_code);
    
    if(data.exec_status != 'Rejected' || data.reforder_id == ''){
        formvals.reforder_id = data.order_id;
    } else {
        formvals.reforder_id=data.reforder_id;
    }

    formvals.agressor_indicator=data.agressor_indicator;
    formvals.avg_px=data.avg_px;
    formvals.bo_acc=data.bo_acc;
    formvals.chain_id=data.chain_id;
    formvals.client_name=data.client_name;
    formvals.client_order_id=cancel_order_id;
    formvals.cln_id="";
    formvals.cum_qty=data.cum_qty;
    formvals.drip_qty=data.drip_qty;
    formvals.emergency=data.emergency;
    formvals.engine_id=data.engine_id;
    formvals.exchange=data.exchange;
    formvals.exec_status=data.exec_status;
    formvals.fix_ws_id=data.fix_workstation_id;
    formvals.gross_trade_amt=data.gross_trade_amt;
    formvals.last_px=data.last_px;
    formvals.last_qty=data.last_qty;
    formvals.leaves_qty=data.due_qty;
    formvals.limit_order_date=data.limit_order_date;
    formvals.limit_order_expiry_date=data.limit_order_expiry_date;
    formvals.limit_order_rate=data.order_price;
    formvals.limit_order_type=data.limit_order_type;
    formvals.min_qty=data.min_qty;
    formvals.order_action=data.order_action;
    formvals.order_branch=data.branch;
    formvals.order_client_code=data.client_code;
    formvals.order_date=data.order_date;
    formvals.order_instrument=data.symbol_code+'.'+data.board_type;
    formvals.order_qty=data.order_qty;
    formvals.order_side=data.order_side;
    formvals.order_status="cancel request";
    formvals.order_time=data.order_time;
    formvals.order_type=data.order_type;
    formvals.order_validity=data.order_validity;
    formvals.pvdr_id=data.broker_id;
    formvals.pvt_limit_order=data.pvt_limit_order;
    formvals.pvt_mkt_order=data.pvt_mkt_order;
    formvals.ref_id=data.ref_user_id;
    formvals.settle_date=data.settle_date;
    formvals.stop_loss=data.stop_loss;
    formvals.sym_category=data.symbol_category;
    formvals.sym_class=data.symbol_assetclass;
    formvals.sym_isin=data.symbol_isin;
    formvals.sym_spot=data.compulsory_spot;
    formvals.take_profit=data.take_profit;
    formvals.time_in_force=data.time_in_force;
    formvals.trade_date=data.trade_date;
    formvals.trade_match_id=data.trade_match_id;
    formvals.trader_id=data.trader_ws_id;
    formvals.user_device=data.user_device;
    formvals.user_id=data.user_id;
    formvals.user_role=data.user_role;
    formvals.ws_group_id=data.ws_group_id;
    formvals.order_value=data.order_value;
    formvals.limit_order_yield=data.order_yield;
    
    data.order_side == 'BUY' ? orderside = '1' : orderside = '2';

    cancelmsg = "8=FIXT.1.19=21635=F34=852=20210830-07:08:20.48956=TEST"
    cancelmsg += '11='+cancel_order_id+'41='+data.order_id+'54='+orderside
            +'38='+data.order_qty+'55='+data.symbol_code+'60='+order_time
            +'50='+data.trader_ws_id+'';
    //add checksum
    cancelmsg += '10=100'+'';
    
    formvals.fix_msg = cancelmsg;

    publish_order_cache_msg(JSON.stringify(formvals));
    // setTimeout(publish_fix_msg(cancelmsg), 250);
    return;
}
//-----------------------------
// BEGIN Long-Term Order Logic
//-----------------------------

// function to parse Long-Term Order date range string
function parseDateRange(date_range) {
  var dates = date_range.split(' to ');
  var start_date = dates[0].trim();
  var end_date = dates[1].trim();
  
  $.getJSON("shared/getholidays/", function (data) {
      console.log(data);
      // var holiday_data = data;
      // var final_range = findHolidays(start_date, end_date, holiday_data);
      // $('#long-term-weekdays').text(num_weekdays+' working days at ');
      // calcDailyQty();
      // check_min_drip_qty();

  });
  
  // console.log('Working Dates:'+final_range.working_days+' | No. of Weekdays:'+num_weekdays);
}

// Find weekends or holidays in selected Long-Term date range
function findHolidays(start_date, end_date, holidays) {
  var working_days = [];
  holidays = holidays.slice(1,-1).split(",").map(dateitem => new Date(dateitem));
  var num_holidays = 0;
  var num_weekends = 0;
  num_weekdays = 0;
  var start = new Date(start_date);
  var end = new Date(end_date);
  var current = start;
  current.setHours(0,0,0,0);
  while (current <= end) {
      var day = current.getDay();
      if(holidays.find(d => d.getTime() === current.getTime())){
          num_holidays += 1;
      } else if (day == 5 || day == 6) {
          num_weekends += 1;
      } else {
          num_weekdays += 1;
          var date = current.toDateString();
          working_days.push(date);
      }
      current.setDate(current.getDate() + 1);
  }
  return ({
      'working_days':working_days,
      'num_weekdays':num_weekdays,
      'num_holidays':num_holidays,
      'num_weekends':num_weekends
  });
}

//Calculate Long-Term Order Daily Quantity
function calcDailyQty(){
  var qty = $('#longterm_order_qty').val();
  longterm_daily_qty = 0;
  if (qty != undefined){
      longterm_daily_qty = Math.round(qty/num_weekdays);
      $('#daily-qty').text(longterm_daily_qty+' per day');
  } else {
      $('#daily-qty').text('');
  }
}
//Long-Term Date Range Change
$('#order_date_range').change(function(){
  var dt = $('#order_date_range').val();
  if(dt.indexOf('to') > -1){
      parseDateRange(dt);
  }
});

$('#longterm_order_qty').keyup(function(){
  calcDailyQty();
  check_min_drip_qty();
});

$('#longterm_drip_qty').keyup(function(){
  check_min_drip_qty();
});
//Check Drip Quantity validity and minimum requirements
function check_min_drip_qty(){
  var quantity = longterm_daily_qty;
  var drip_qty = $('#longterm_drip_qty').val();

  if(drip_qty == 0 || drip_qty == '' || drip_qty == undefined || drip_qty == null){
      $('#min-drip-qty').text('');
  } else if(drip_qty >= quantity*0.1 && drip_qty < quantity*1.0){
      $('#min-drip-qty').text('');
  } else if(drip_qty >= quantity*1.0){
      $('#min-drip-qty').text('Max Drip Qty must be < '+quantity*1.0.toFixed(2));
  } else if(drip_qty > 0 && drip_qty < quantity*0.1){
      $('#min-drip-qty').text('Min Drip Qty must be > '+quantity*0.1.toFixed(2));
  }   
}
// Long-Term Trade Time Selection
function tradetime(){
  var time_select = document.getElementById("trade_time"); 
  var time_range = ['10:00','10:15','10:30','10:45',
              '11:00','11:15','11:30','11:45',
              '12:00','12:15','12:30','12:45',
              '1:00','1:15','1:30','1:45',
              '2:00','2:15','2:30']
  $("#trade_time").empty();
  for (item in time_range){
      var timelist = document.createElement("option");
      timelist.text = time_range[item];
      time_select.add(timelist);
  }
}
//Long-Term Special Order Trade at Market Price
$("#trade_market_order").change(function(){
  if ($(this).is(':checked')) {
      $('#order_range').hide();
      $('#bid-ask-2').hide();
      $('#bid-ask-1').show();
  } else {
      $('#order_range').show();
      $('#bid-ask-2').show();
      $('#bid-ask-1').hide();
  }
});


//---------------------------
// END Long-Term Order Logic
//---------------------------
