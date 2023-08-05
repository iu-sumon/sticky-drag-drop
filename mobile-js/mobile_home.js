//Initialize function on Page Load
$(document).ready(function() {
    var last_selected_client_code = system_user_role == 'client' ? system_username : window.localStorage.getItem('last_selected_client_code') || '';

    const swiper1 = new Swiper('.swiper-default', {
        spaceBetween: 30,
        direction: 'horizontal',
        loop: false
    });
    
    const swiper2 = new Swiper('.swiper-first', {
        spaceBetween: 30,
        direction: 'horizontal',
        loop: false
    });

    const swiper3 = new Swiper('.swiper-calendar', {
        spaceBetween: 30,
        slidesPerView: 3,
        freeMode: true,
        direction: 'horizontal',
        loop: false
    });

    const swiper4 = new Swiper('.swiper-menubar', {
        spaceBetween: 10,
        slidesPerView: 4,
        freeMode: true,
        direction: 'horizontal',
        loop: false
    });
    
    if($("#marketstat").width() < 450){
        $("#adlabels").css('margin-top','-70px');
    } else {
        $("#adlabels").css('margin-top','-40px');
    }

    code_input();
    show_advance_decline();
    get_market_movers();
    get_market_sentiment();
    get_topgainer();
    get_toploser();
    get_toptrade();
    get_topvalue();
    get_topvolume();
    setTimeout(function () {autorefresh_toplist();}, update_interval_sec*1000);
    setTimeout(function () {autorefresh_client_data(last_selected_client_code);}, update_interval_sec*2000);
    if(index_impact_interval != null)clearInterval(index_impact_interval);
    index_impact_interval = setInterval(function () {
        if(itch_market_status == 'OPEN'){
            get_market_movers();
        }}, update_interval_sec*1000);
    
});

function show_advance_decline(){
    $.get('shared/widget_advance_decline/', function(data) {
        $('#adv-dec').html(data);
    });
}

// Mobile Market Watch Page Load
var onMobileMarketWatchClick = () => {
    // load a html page into the main content area
    $('#page-content').load('analysis/mobile_market_watch');
};

// Mobile News Page Load
var onMobileNewsClick = () => {
    // load a html page into the main content area
    $('#page-content').load('shared/mobile_news/');
};

// Mobile IPO Page Load
var onMobileIpoClick = () => {
    // load a html page into the main content area
    $('#page-content').load('analysis/mobile_ipo');
};

// Mobile SME Page Load
var onMobileSmeClick = () => {
    // load a html page into the main content area
    $('#page-content').load('shared/mobile_sme_page');
}

// Mobile ATB Page Load
var onMobileAtbClick = () => {
    // load a html page into the main content area
    $('#page-content').load('shared/mobile_atb_page');
}

// Mobile GSEC Page Load
var onMobileGsecClick = () => {
    // load a html page into the main content area
    $('#page-content').load('shared/mobile_gsec_page');
}


// Mobile Event Page Load
var onMobileEventClick = (index, event) => {
    if (event == 0) {
        var backBtnContainer = $('<div class="back-btn-bg">').html('<span class="backToMarkets"><i class="fa fa-arrow-left fa-2x font-arrow-btn" aria-hidden="true"></i></span>');

        var noEventContainer = $('<div>').html('<h4 class="pt-2 pb-2">No Event</h4>');
        noEventContainer.css('text-align', 'center');

        var historyButton = $('<button class="mobile_corp_full_events">').html('Full Event').click(() => {
            var historyContainer = $('#history-container');
            if (historyContainer.children().length > 0) {
                historyContainer.slideToggle();
            } else {
                $.get('shared/widget_corp_events/', function(data) {
                    var container = $('<div style="overflow-x: hidden;">').html(data);
                    var table = container.find('table'); // find the table element
                    table.attr('cellpadding', '5'); // update the cellpadding attribute
                    historyContainer.empty().append(container).slideDown();
                });
            }
        });

        var historyContainer = $('<div>').attr('id', 'history-container');
        $('#page-content').empty().append(backBtnContainer, noEventContainer, historyButton, historyContainer);
        $('.backToMarkets').on('click', function () {
            $('#page-content').load('mobile_home');
        });
    } else {
        var id = "corp_event_date_" + index;
        var date = $("#" + id).text();
        $('#page-content').load('/mobile_home/mobile_corp_events/', () => {
            get_mobile_corporate_events(date);
            var historyButton = $('<button class="mobile_corp_full_events">').html('Full Event').click(() => {
                var historyContainer = $('#history-container');
                if (historyContainer.children().length > 0) {
                    historyContainer.slideToggle();
                } else {
                    $.get('shared/widget_corp_events/', function(data) {
                        var container = $('<div style="overflow-x: hidden;">').html(data);
                        var table = container.find('table'); // find the table element
                        table.attr('cellpadding', '5'); // update the cellpadding attribute
                        historyContainer.empty().append(container).slideDown();
                    });
                }
            });

            var historyContainer = $('<div>').attr('id', 'history-container');
            $('#page-content').append(historyButton, historyContainer);
        });
    }
};


//Initialize Gridstack library


var colors_array = ['#36ff40','#6bfa2c','#8bf416','#a4ee00','#b9e800','#cbe200','#dbdb00','#e9d506','#f5ce1c','#ffc82c'];
var reverse_colors_array = ['#ff0000','#ff4300','#ff6300','#ff7e00','#ff9600','#ffac00','#ffc200','#ffd700','#faeb04','#f4ff36'];
    
var fgi = 0;
var fgistate = '';
var sector = [];
var sector_vals = [];
var market_movers_tab = 'pos';
//Dashboard Charts
google.charts.load('current', {packages:['corechart','gauge', 'bar']});

function drawSentimentChart() {

    var data = google.visualization.arrayToDataTable([
    [fgistate],
    [fgi]
    ]);

    var options = {
        width: 250,
        height: 250,
        redFrom: 0,
        redTo: 40,
        yellowFrom: 40,
        yellowTo: 60,
        greenFrom: 60,
        greenTo: 100,
        minorTicks: 20,
        max: 100,
        min: 0,
        majorTicks: ['0','20','40','60','80','100']
    };

    var chart = new google.visualization.Gauge(document.getElementById('market_sentiment'));
    chart.draw(data, options);

}

function get_market_sentiment(){
    // if ($('.global_dse').hasClass('xcg_active')){
    //     xcg = 'DSE';
    // }
    // if ($('.global_cse').hasClass('xcg_active')){
    //     xcg = 'CSE';
    // }
    xcg = 'DSE';
    $.get("/shared/getmarkethealth/", {
        xcg: xcg
    }, function (data) {
        var buy_percent, sell_percent;

        if(data != 0){
            var mkt_turnover = parseFloat(data.total_turnover);
            var market_buy_turnover = parseInt(data.buy_turnover);
            var market_sell_turnover = parseInt(data.sell_turnover);

            var market_trade = parseInt(data.total_trade);
            var market_buy_trade = parseInt(data.buy_trade);
            var market_sell_trade = parseInt(data.sell_trade);

            var market_volume = parseInt(data.total_volume);
            var market_buy_volume = parseInt(data.buy_volume);
            var market_sell_volume = parseInt(data.sell_volume);
        
            buy_percent = parseFloat(data.buy_percent);
            sell_percent = parseFloat(data.sell_percent);

            if (mkt_turnover > 10000000){
                mkt_turnover = mkt_turnover/10000000;
                $('#market_turnover').text(Number(mkt_turnover).toLocaleString('en-IN')+' cr');
            
            } else {
                $('#market_turnover').text(Number(mkt_turnover).toLocaleString('en-IN'));
            }
            $('#market_turnover').val(mkt_turnover);

            if (market_volume > 10000000){
                market_volume = market_volume/10000000;
                $('#market_volume').text(Number(market_volume).toLocaleString('en-IN')+' cr');
            
            } else {
                $('#market_volume').text(Number(market_volume).toLocaleString('en-IN'));
            }

            $('#market_trade').text(Number(market_trade).toLocaleString('en-IN'));
        } else {
            buy_percent = 50;
            sell_percent = 50;
        }
        fgi = Math.round(sell_percent);
        if(fgi >= 0 && fgi <= 20){fgistate = 'Extreme Bear';}
        if(fgi > 20 && fgi <= 40){fgistate = 'Bear';}
        if(fgi > 40 && fgi <= 60){fgistate = 'Neutral';}
        if(fgi > 60 && fgi <= 80){fgistate = 'Bull';}
        if(fgi > 80 && fgi <= 100){fgistate = 'Extreme Bull';}
    
        google.setOnLoadCallback(drawSentimentChart);
        
    });
    
}
function get_market_movers(){
    var url = '/shared/getindeximpact/';

    $.getJSON(url, function (data) {

        $("#pos_mover_table tbody tr").remove(); 
        $("#neg_mover_table tbody tr").remove(); 
        var pos_mover_table = document.getElementById('pos_mover_table').getElementsByTagName('tbody')[0];
        var neg_mover_table = document.getElementById('neg_mover_table').getElementsByTagName('tbody')[0];
        // Positive Impact
        for (i = 0; i < data[0].length; i++) {
            row = pos_mover_table.insertRow();
            row.classList.add("gridtab");
            row.style.textAlign='right';
            
            symbol = data[0][i].symbol;
            board = '.PUBLIC';
            symbol_board = symbol + board;
            
            row.insertCell(0).innerHTML = `<div class="bold" onclick="onCompanySelect('${symbol}','${symbol_board}')" data-symbol="${symbol_board}" align="left">${symbol}</div>`;
            row.insertCell(1).innerHTML = '<div class="tab-border-left">'+data[0][i].ltp+'</div>';
            row.insertCell(2).innerHTML = '<div class="tab-border-left up">'+data[0][i].change_per.toFixed(2)+'</div>';
            row.insertCell(3).innerHTML = '<div class="tab-border-left" style="color: '+colors_array[i]+';">'+data[0][i].impact.toFixed(2)+'</div>';
            
        }
        //Negative Impact
        for (i = 0; i < data[1].length; i++) {
            row = neg_mover_table.insertRow();
            row.classList.add("gridtab");
            row.style.textAlign='right';
            
            symbol = data[1][i].symbol;
            board = '.PUBLIC';
            symbol_board = symbol + board;
            
            row.insertCell(0).innerHTML = `<div class="bold" onclick="onCompanySelect('${symbol}','${symbol_board}')" data-symbol="${symbol_board}" align="left">${symbol}</div>`;
            row.insertCell(1).innerHTML = '<div class="tab-border-left">'+data[1][i].ltp+'</div>';
            row.insertCell(2).innerHTML = '<div class="tab-border-left down">'+data[1][i].change_per.toFixed(2)+'</div>';
            row.insertCell(3).innerHTML = '<div class="tab-border-left" style="color: '+reverse_colors_array[i]+';">'+data[1][i].impact.toFixed(2)+'</div>';
        }
        
    });
}

//  Tree-map-chart
var treeMapChart = echarts.init(document.getElementById('treemap-chart-container'));
var treeMapChartOption;


