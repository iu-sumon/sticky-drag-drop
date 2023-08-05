var update_interval_sec = 5;
var dashdata_interval = null;
var topgainer_interval = null;
var toploser_interval = null;
var toptrade_interval = null;
var topvalue_interval = null;
var topvolume_interval = null;
var adv_dec_chart_interval = null;
var treemap_interval = null;
var investedsector_interval = null;
var sectorgainchart_interval = null;
var index_impact_interval = null;
var limit_request_interval = null;
var client_data_interval = null;

var currentpage;

$(document).click(function (event) {
  var clickover = $(event.target);
  var $navbar = $("#sub");               
  var _opened = $navbar.hasClass("show");
  if (_opened === true && !clickover.hasClass("subnavmenu")) {      
      $navbar.collapse('hide');
  }
});

var last_selected_client_code = system_user_role == 'client' ? system_username : window.localStorage.getItem('last_selected_client_code') || '';

$('.mobile-global-select').on('change', function() {
  if (last_selected_client_code == null || last_selected_client_code == '' || last_selected_client_code != this.value) {
    window.localStorage.setItem('last_selected_client_code', this.value);
    set_client_code_data(this.value); 
  } else {
    set_client_code_data(last_selected_client_code);
  }
});

function portfolio_associate_code(selectElement) {
  $.getJSON("shared/code_list/", function (data) {
    var code_list = data
    if(code_list.length <= 10)
    {
      $('.client_acc').hide();
      $(selectElement).show();
      
      var optionsHTML = '';
      
      code_list.forEach(function(code) {
        optionsHTML += '<option value="' + code + '">' + code + '</option>';
      });
        
      $(selectElement).html(optionsHTML);
      set_client_code_data(last_selected_client_code);
    } 
    else{
      $('.client_acc').show();
      $(selectElement).hide();
      set_client_code_data(last_selected_client_code);
    }
  })
}


$(document).ready(function () {
  $('#side-navbar').show();
  
  if (system_user_role == 'associate') {
    portfolio_associate_code('.mobile-global-select');
  } else {
    set_client_code_data(last_selected_client_code);
  }

  if ($('.nav-item a').data('link') == 'home') {
    //document.getElementById('nav-title').innerHTML = "DASHBOARD";
  }
  $('.nav-item a').on('click', function (e) { 

    e.preventDefault();
    $("html, body").animate({ scrollTop: '0px' });
    $('.nav-item a').removeClass("active");
    //var page = $(this).attr('href');
    var page = $(this).data('link');
    currentpage = page;
    var pageLoadicon = $('#page-loading-indicator').html();
    if (page == 'index/logout') {
      window.location.href = page;
    } 
    else {
      $('#page-content').html(pageLoadicon).load(page);
      this.className += " active";
      if (page == 'charts/chart_advanced') {
        document.getElementById('global-top-bar').style.display= 'none'
        $("#main-content").css("padding-top", "0px");
      }
      else
      {
        document.getElementById('global-top-bar').style.display= 'block'
        $("#main-content").css("padding-top", "48px");
      }
    }

    //Auto update dashboard for brokeradmin
    if (page != 'home') {
      if (system_user_role == 'brokeradmin' || system_user_role == 'administrator') {
        if (dashdata_interval != null) clearInterval(dashdata_interval);
      }

      if (topgainer_interval != null) clearInterval(topgainer_interval);
      if (toploser_interval != null) clearInterval(toploser_interval);
      if (toptrade_interval != null) clearInterval(toptrade_interval);
      if (topvalue_interval != null) clearInterval(topvalue_interval);
      if (topvolume_interval != null) clearInterval(topvolume_interval);
      if (treemap_interval != null)clearInterval(treemap_interval);
      if (investedsector_interval != null) clearInterval(investedsector_interval);
      if (sectorgainchart_interval != null)clearInterval(sectorgainchart_interval);
      if (index_impact_interval != null) clearInterval(index_impact_interval);
      if ($('#adv-dec').length == 0) {
        if (adv_dec_chart_interval != null) clearInterval(adv_dec_chart_interval);
      }
    }
    if (page != 'portfolio/watchlist') {
      if (topgainer_interval != null) clearInterval(topgainer_interval);
      if (toploser_interval != null) clearInterval(toploser_interval);
      if (toptrade_interval != null) clearInterval(toptrade_interval);
      if (topvalue_interval != null) clearInterval(topvalue_interval);
      if (topvolume_interval != null) clearInterval(topvolume_interval);
      if (investedsector_interval != null) clearInterval(investedsector_interval);
      if (sectorgainchart_interval != null)clearInterval(sectorgainchart_interval);
      if (index_impact_interval != null) clearInterval(index_impact_interval);
    }
    if (page != 'live_orders/trade_portal') {
      if (topgainer_interval != null) clearInterval(topgainer_interval);
      if (toploser_interval != null) clearInterval(toploser_interval);
      if (toptrade_interval != null) clearInterval(toptrade_interval);
      if (topvalue_interval != null) clearInterval(topvalue_interval);
      if (topvolume_interval != null) clearInterval(topvolume_interval);
      if (investedsector_interval != null) clearInterval(investedsector_interval);
      if (sectorgainchart_interval != null)clearInterval(sectorgainchart_interval);
      if (index_impact_interval != null) clearInterval(index_impact_interval);
    }
    if (page != 'broker_ccd/') {
      if (limit_request_interval != null) clearInterval(limit_request_interval);
    }


  });

});


async function set_client_code_data(last_client_code)
{  
    var saleable_data = await getSaleableData(last_client_code);
    var bo_data = await getBoData(last_client_code);
    var total_gain = saleable_data[1].sum_totalgain == undefined ? 0 : parseFloat(saleable_data[1].sum_totalgain);
    var gain_per = saleable_data[1].sum_gain_per == undefined ? 0 : parseFloat(saleable_data[1].sum_gain_per);
    var gain_text = '';
    var loss_gain_text = '';
    var thousand_symbol_cash = '';
    var cash_limit;
    var total_gain_text;
    var thousand_symbol_gain = '';
   
    if(gain_per > 0) 
    {
      $("#default_acc_all_gain_percnt_container").removeClass("down-color neutral-color").addClass("up-color"); 
      gain_text = '+'+gain_per; 
      loss_gain_text = 'Gain';
    }
    if(gain_per < 0) 
    {
      $("#default_acc_all_gain_percnt_container").removeClass("up-color neutral-color").addClass("down-color"); 
      gain_text = gain_per; 
      loss_gain_text = 'Loss';
    }
    if(gain_per == 0) 
    {
      $("#default_acc_all_gain_percnt_container").removeClass("down-color up-color").addClass("neutral-color"); 
      gain_text = gain_per; 
      loss_gain_text = 'No Change';
    }

    if(bo_data.b_limit >= 10000000) {cash_limit = parseInt(bo_data.b_limit/10000000).toFixed(3); thousand_symbol_cash = 'Cr';}
    else {cash_limit = (bo_data.b_limit).toFixed(3); thousand_symbol_cash = '';}

    if(cash_limit > 0) {
      $("#default_acc_bal_container").removeClass("down-color neutral-color").addClass("up-color"); 
    }
    if(cash_limit < 0) {
      $("#default_acc_bal_container").removeClass("up-color neutral-color").addClass("down-color"); 
    }
    if(cash_limit == 0) {
      $("#default_acc_bal_container").removeClass("down-color up-color").addClass("neutral-color"); 
    }

    if(total_gain >= 10000000) {total_gain_text = parseInt(total_gain/10000000).toFixed(3); thousand_symbol_gain = 'Cr';}

    else {total_gain_text = total_gain.toFixed(3); thousand_symbol_gain = '';} 
    
    $("#default_acc_bal").html(bo_data.b_limit == undefined ? '-' : '<span class="gain-text-color">Tk. ' + Number(cash_limit).toLocaleString("en-IN") + thousand_symbol_cash + '</span>');
   
    $("#default_acc_all_gain").html(`<span class='gain-text-color'>Tk. ${Number(total_gain_text).toLocaleString("en-IN")}${thousand_symbol_gain}</span>`); 
   
    $("#loss_gain_text").html(`${loss_gain_text}`);

    $("#acc_all_gain_percnt").html(`<span class='gain-text-color'>${gain_text} %</span>`);

    $("#default_acc_name").html(bo_data?.cln_name == undefined ? '-' : bo_data.cln_name);
    
    $(".profile-card #global_client_code").val(last_client_code);
    
    if ($("#portfolio-page").length > 0) {
      $("#global_client_code").val(last_client_code);
      get_portfolio_data(saleable_data, bo_data);
      get_mobile_order_list(last_client_code);
      get_mobile_history_list(last_client_code);
      // $("#nav-orderlist-tab").click(function () {
      //   get_mobile_order_list(last_client_code);
      // });
      // $("#nav-history-tab").click(function () {
      //   get_mobile_history_list(last_client_code);
      // });
    }
}

function autorefresh_client_data(client_code) {
  if(client_data_interval != null)clearInterval(client_data_interval);
  if(itch_market_status == 'OPEN'){
    client_data_interval = setInterval(function () {set_client_code_data(client_code);}, update_interval_sec*2000);
  }
}