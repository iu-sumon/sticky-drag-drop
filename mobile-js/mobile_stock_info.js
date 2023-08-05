$(document).ready(function () {
    mobile_stock_info();
});
var elementText = $("#mobile-stk-info-title").text();
var pageTitle =['mobile_sme_page','mobile_atb_page','mobile_gsec_page']

$('#backToHomepage').on('click', function () {
    if(pageTitle.includes(elementText))
    {
        $('#page-content').load('shared/' + elementText);
    }
    else if(elementText == 'mobile_market_watch')
    {
        $('#page-content').load('analysis/mobile_market_watch');
    }
    else
    {
        $('#page-content').load('portfolio/mobile_watchlist'); // Redirect to watchlist
    } 
    document.getElementById('global-top-bar').style.display= 'block'
    $("#main-content").css("padding-top", "48px");
});

function placeorder(symbol_board, side){
    $.get('live_orders/mobile_trade', { side: side, symbol_board: symbol_board }, function (data) {
        $('#page-content').html(data);
        $('#order_instrument').val(symbol_board).trigger('change');
        $('#order_side').attr('value', side).trigger('change');

        if(side=="SELL")        
        {
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
function mobile_stock_info() {
    var ticker = $("#companyTitle").data('symbol');
    var symbol = $("#companyTitle").text();

    $.getJSON("shared/checksymbolforwatchlist/", { instrument: ticker }, function (data) {
        if (data.length > 0) {
            $("#favorite-icon").html('<i class="fa fa-star stock-fa-start" aria-hidden="true"></i>');
        } else {
            $("#favorite-icon").html('<i class="fa fa-star-o" aria-hidden="true"></i>');
        }
    })

    fetch(`shared/getquotedata/${symbol}`)
        .then((res) => res.json())
        .then((data) => {
            setCompanyAllBasicInformation(data);
            setCashStockDividend(data);
        })
        .catch((err) => {
            console.log(err);
        });
    
    $.get("/shared/symbolpricedata/", { symbol: ticker }, function (data) {
        var board = data.board;
        var symbol_board = data.symbol.replace(/[^a-zA-Z ]/g, '') + board;
        var ltp = parseFloat(data.ltp);
        var ycp = parseFloat(data.ycp);
        var chg_per = data.ltp_changeper != null ? parseFloat(data.ltp_changeper) : 0;
        var chg_net = data.ltp_change != null ? parseFloat(data.ltp_change) : 0;
        var pos_neg = '';
        var clean_price = ltp;

        $('.quote_price').removeClass().addClass('quote_price '+ symbol_board + '_ltp');
        $('.quote_change').removeClass().addClass('quote_change '+ symbol_board + '_chg');
        $('.quote_changeper').removeClass().addClass('quote_changeper '+ symbol_board + '_chgper');
        $('.quote_open').removeClass().addClass('quote_open '+ symbol_board + '_open');
        $('.quote_high').removeClass().addClass('quote_high '+ symbol_board + '_high');
        $('.quote_low').removeClass().addClass('quote_low '+ symbol_board + '_low');
        $('.quote_prevclose').removeClass().addClass('quote_prevclose '+ symbol_board + '_ycp');
        $('.quote_volume').removeClass().addClass('quote_volume '+ symbol_board + '_vol');
        $('.quote_value').removeClass().addClass('quote_value '+ symbol_board + '_turnover');
        $('.quote_buyvolume').removeClass().addClass('quote_buyvolume '+ symbol_board + '_buyqty');
        $('.quote_sellvolume').removeClass().addClass('quote_sellvolume '+ symbol_board + '_sellqty');
        $('.bidPerQ').removeClass().addClass('bidPerQ '+ symbol_board + '_bidqper');
        $('.askPerQ').removeClass().addClass('askPerQ '+ symbol_board + '_askqper');
        
        if (chg_net > 0) {
            pos_neg = '+';
            $('.quote_price').removeClass('up down neutral').addClass('up');
            $('.quote_change').removeClass('up down neutral').addClass('up');
            $('.quote_changeper').removeClass('up down neutral').addClass('up');
        }
        if (chg_net < 0) {
            pos_neg = '';
            $('.quote_price').removeClass('up down neutral').addClass('down');
            $('.quote_change').removeClass('up down neutral').addClass('down');
            $('.quote_changeper').removeClass('up down neutral').addClass('down');
        }
        if (chg_net == 0) {
            pos_neg = '';
            $('.quote_price').removeClass('up down neutral').addClass('neutral');
            $('.quote_change').removeClass('up down neutral').addClass('neutral');
            $('.quote_changeper').removeClass('up down neutral').addClass('neutral');
        }

        $('.quote_code').html('<span>' + data.symbol + '</span>&nbsp;&nbsp;\
        <span class="td-btn"><button onclick="show_alert_window(this)" id="alert_'+ data.symbol + '" class="wlalert has-tooltip" title="Set Alert"><i class="fa fa-bell"></i></button></span>');
        $('.quote_full').text(data.company_name);
        $('.quote_price').text(ltp);
        $('.quote_price').val(ltp);
        $('.quote_change').text(pos_neg + chg_net);
        $('.quote_change').val(chg_net);
        $('.quote_changeper').text(pos_neg + chg_per + '%')
        $('.quote_changeper').val(chg_per)
        $('.quote_sector').text('Sector: ' + data.sector + ' | Category: ' + data.symbol_category + ' | Type: ' + data.symbol_instr);

        if (data.open > ycp) {
            $('.quote_open').removeClass('up down neutral').addClass('up');
        }
        if (data.open < ycp) {
            $('.quote_open').removeClass('up down neutral').addClass('down');
        }
        if (data.open == ycp) {
            $('.quote_open').removeClass('up down neutral').addClass('neutral');
        }
        

        $('.quote_open').text(data.open == undefined ? '-' : data.open);
        $('.quote_open').val(data.open == undefined ? 0 : data.open);
        $('.quote_high').text(data.high == undefined ? '-' : data.high);
        $('.quote_high').val(data.high == undefined ? 0 : data.high);
        $('.quote_low').text(data.low == undefined ? '-' : data.low);
        $('.quote_low').val(data.low == undefined ? 0 : data.low);
        $('.quote_prevclose').text(ycp);
        $('.quote_prevclose').val(ycp);
        $('.quote_circuit_up').text(data.circuit_up == undefined ? '-' : data.circuit_up);
        $('.quote_circuit_down').text(data.circuit_down == undefined ? '-' : data.circuit_down);

        $('.quote_volume').text(data.total_qty == null ? 0 : data.total_qty);
        $('.quote_volume').val(data.total_qty == null ? 0 : data.total_qty)
        $('.quote_value').text(Number(data.total_value).toLocaleString("en-IN"));
        $('.quote_value').val(data.total_value);
        $('.quote_buyvolume').text(data.buy_qty == null ? 0 : data.buy_qty);
        $('.quote_sellvolume').text(data.sell_qty == null ? 0 : data.sell_qty);
        
        // var buy_percent =  (data.buy_qty/data.total_qty)*100;
        // var sell_percent =  (data.sell_qty/data.total_qty)*100;
        
        // update_market_depth_bar(buy_percent, sell_percent);

        var quote_general = document.getElementById('quote_general');        
        if(quote_general != null){
            quote_general.style.display = (board == 'YIELDDBT' || board == 'BUYDBT')? 'none' : 'block';
        }
        
        var quote_bond = document.getElementById('quote_bond');
        if(quote_bond != null){
            quote_bond.style.display = (board == 'YIELDDBT' || board == 'BUYDBT')? 'block' : 'none';
        }

        if(board == 'YIELDDBT' || board == 'BUYDBT'){
            fetch(`shared/getgsecdata/${symbol}`)
                .then((res) => res.json())
                .then((data) => {
                    var today = new Date();
                    var face_value = parseInt(data[4].data_value);
                    var coupon_rate_percent = parseFloat(data[8].data_value)/100;
                    var year_basis = parseInt(data[14].data_value);
                    var maturity_date = new Date(data[11].data_value);
                    var issue_date = new Date(data[7].data_value);
                    var coupon_freq = parseInt(data[10].data_value);
                    var tenure = data[6].data_value;
                    var market_lot = parseInt(data[5].data_value);
                    var outstanding_shares = parseInt((data[2].data_value).replace(/,/g, ''));
                    var market_cap = clean_price * outstanding_shares / 10000000;

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
                    
                    var order_yield = price_to_yield(period, semi_annual_coupon_payment, clean_price, face_value, coupon_freq);
                    
                    if($('.yield_window').is(":visible")){
                        $('.yield_window').attr("data-period", period);
                        $('.yield_window').attr("data-couponpayment", semi_annual_coupon_payment);
                        $('.yield_window').attr("data-facevalue", face_value);
                        $('.yield_window').attr("data-couponfreq", coupon_freq);
                        $('#dirty_price').text('');
                        $('#accr_int').text(accr_int);
                    }
                    
                    var rem_mat = getFormatedStringFromDays(days_to_maturity);
                    
                    document.getElementById('yield').innerHTML = order_yield.toFixed(4) + '%';
                    document.getElementById('coup_rate').innerHTML = data[8].data_value + '%' ;
                    document.getElementById('rem_mat').innerHTML = rem_mat;
                    document.getElementById('bond_tenure').innerHTML = tenure;
                    document.getElementById('market_lot').innerHTML = market_lot;
                    document.getElementById('coup_freq').innerHTML = coupon_freq;
                    document.getElementById('mat_date').innerHTML = data[11].data_value;
                    document.getElementById('issue_date').innerHTML = data[7].data_value;
                    document.getElementById('bond_market_cap').innerHTML = market_cap.toFixed(2).toLocaleString('en-IN') + ' cr';
                    

                })
                .catch((err) => {
                    console.log(err);
                });
        }

        $('[name="option-text"]').on("change", () => {
            var val;
            val = $('[name="option-text"]:checked')
                .closest("label")
                .text()
                .replace(/\s/g, "");
            document.getElementById("text-parent").innerText = val;
            var tabText1 = document.getElementById("text-tab1").innerText;
            var tabText2 = document.getElementById("text-tab2").innerText;
            var tabText3 = document.getElementById("text-tab3").innerText;
            var count1 = 0;
            var count2 = 0;
            var count3 = 0;
            var count4 = 0;
        
            if (
                (tabText1 == "EPS" ||
                    tabText1 == "ROA" ||
                    tabText1 == "ROE" ||
                    tabText1 == "BVPS" ||
                    tabText1 == "Net Debt" ||
                    tabText1 == "Equity" ||
                    tabText1 == "CFPS") &&
                document
                    .getElementById("financial-quarter-eps")
                    .classList.contains("lazyloaded") &&
                count1 == 0
            ) {
                count1++;
                loadChart(tabText1, val, symbol);
            }
        
            if (
                (tabText2 == "Net Income" ||
                    tabText2 == "Revenue" ||
                    tabText2 == "Operating Income") &&
                document
                    .getElementById("net-income-quarter")
                    .classList.contains("lazyloaded") &&
                count2 == 0
            ) {
                count2++;
                loadChartIncome(tabText2, val, symbol);
            }
            if (
                (tabText3 == "Operating" ||
                    tabText3 == "Investing" ||
                    tabText3 == "Financing") &&
                document
                    .getElementById("cash-flow-operating-quarter")
                    .classList.contains("lazyloaded") &&
                count3 == 0
            ) {
                count3++;
                loadChartCashFlow(tabText3, val, symbol);
            }
        
            if (
                document
                    .getElementById("balance-sheet-quarter")
                    .classList.contains("lazyloaded") &&
                count4 == 0
            ) {
                count4++;
                loadChartBalanceSheet(val, symbol);
            }
        });

        var items = document.querySelectorAll(".fintab");

        items.forEach((item) => {
            item.addEventListener("click", (e) => {
                document.getElementById("text-tab1").innerText = e.target.textContent;

                var tabText1 = document.getElementById("text-tab1").innerText;

                var val = document.getElementById("text-parent").innerText;

                if (
                    tabText1 == "EPS" ||
                    tabText1 == "ROA" ||
                    tabText1 == "ROE" ||
                    tabText1 == "BVPS" ||
                    tabText1 == "Net Debt" ||
                    tabText1 == "Equity" ||
                    tabText1 == "CFPS" ||
                    tabText1 == "Dividend"
                ) {
                    loadChart(tabText1, val, symbol);
                }
            });
        });

        var items2 = document.querySelectorAll(".fintab2");

        items2.forEach((item) => {
            item.addEventListener("click", (e) => {
                document.getElementById("text-tab2").innerText = e.target.textContent;

                var tabText2 = document.getElementById("text-tab2").innerText;
                var val = document.getElementById("text-parent").innerText;

                if (
                    tabText2 == "Net Income" ||
                    tabText2 == "Revenue" ||
                    tabText2 == "Operating Income"
                ) {
                    loadChartIncome(tabText2, val, symbol);
                }
            });
        });

        var items3 = document.querySelectorAll(".fintab3");

        items3.forEach((item) => {
            item.addEventListener("click", (e) => {
                document.getElementById("text-tab3").innerText = e.target.textContent;

                var tabText3 = document.getElementById("text-tab3").innerText;
                var val = document.getElementById("text-parent").innerText;

                if (
                    tabText3 == "Operating" ||
                    tabText3 == "Investing" ||
                    tabText3 == "Financing"
                ) {
                    loadChartCashFlow(tabText3, val, symbol);
                }
            });
        });
        getmktdepth(symbol+'.'+board);
        getOthersData(symbol);
        initializeLazyLoad();
        updateFinancialInfo(symbol);
        var chartsymbol = $("#companyTitle").data('symbol');
        setTimeout(reinit_chart(chartsymbol), 2000);

    });
    
    getNewsData(symbol);
}

function getmktdepth(target_symbol){
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
                <td id="stock-arrow-icon" class="bidAndask-middle-column-value">
                    <div>
                        <i class="fa fa-angle-double-down stock-info-icon-up-down"></i> 
                    </div>
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
            <tr class="bidAndask-row">
                <td class="bid-sl-value">3</td>
                <td class=" bidQ-column-value ${symbol_board}_db6"></td>
                <td class=" bid-column-value ${symbol_board}_db5"></td>
                <td class="bidAndask-middle-column-value"></td>
                <td class="ask-column-value ${symbol_board}_ds5"></td>
                <td class="askQ-column-value ${symbol_board}_ds6"></td>
                <td class="ask-sl-value">3</td>
            </tr>
            <tr class="bidAndask-row">
                <td class="bid-sl-value">4</td>
                <td class=" bidQ-column-value ${symbol_board}_db8"></td>
                <td class=" bid-column-value ${symbol_board}_db7"></td>
                <td class="bidAndask-middle-column-value"></td>
                <td class="ask-column-value ${symbol_board}_ds7"></td>
                <td class="askQ-column-value ${symbol_board}_ds8"></td>
                <td class="ask-sl-value">4</td>
            </tr>
            <tr class="bidAndask-row">
                <td class="bid-sl-value">5</td>
                <td class=" bidQ-column-value ${symbol_board}_db10"></td>
                <td class=" bid-column-value ${symbol_board}_db9"></td>
                <td class="bidAndask-middle-column-value"></td>
                <td class="ask-column-value ${symbol_board}_ds9"></td>
                <td class="askQ-column-value ${symbol_board}_ds10"></td>
                <td class="ask-sl-value">5</td>
            </tr>
            <tr class="bidAndask-row">
                <td class="bid-sl-value">6</td>
                <td class=" bidQ-column-value ${symbol_board}_db12"></td>
                <td class=" bid-column-value ${symbol_board}_db11"></td>
                <td class="bidAndask-middle-column-value"></td>
                <td class="ask-column-value ${symbol_board}_ds11"></td>
                <td class="askQ-column-value ${symbol_board}_ds12"></td>
                <td class="ask-sl-value">6</td>
            </tr>
            <tr class="bidAndask-row">
                <td class="bid-sl-value">7</td>
                <td class=" bidQ-column-value ${symbol_board}_db14"></td>
                <td class=" bid-column-value ${symbol_board}_db13"></td>
                <td class="bidAndask-middle-column-value"></td>
                <td class="ask-column-value ${symbol_board}_ds13"></td>
                <td class="askQ-column-value ${symbol_board}_ds14"></td>
                <td class="ask-sl-value">7</td>
            </tr>
            <tr class="bidAndask-row">
                <td class="bid-sl-value">8</td>
                <td class=" bidQ-column-value ${symbol_board}_db16"></td>
                <td class=" bid-column-value ${symbol_board}_db15"></td>
                <td class="bidAndask-middle-column-value"></td>
                <td class="ask-column-value ${symbol_board}_ds15"></td>
                <td class="askQ-column-value ${symbol_board}_ds16"></td>
                <td class="ask-sl-value">8</td>
            </tr>
            <tr class="bidAndask-row">
                <td class="bid-sl-value">9</td>
                <td class=" bidQ-column-value ${symbol_board}_db18"></td>
                <td class=" bid-column-value ${symbol_board}_db17"></td>
                <td class="bidAndask-middle-column-value"></td>
                <td class="ask-column-value ${symbol_board}_ds17"></td>
                <td class="askQ-column-value ${symbol_board}_ds18"></td>
                <td class="ask-sl-value">9</td>
            </tr>
            <tr class="bidAndask-row">
                <td class="bid-sl-value">10</td>
                <td class=" bidQ-column-value ${symbol_board}_db20"></td>
                <td class=" bid-column-value ${symbol_board}_db19"></td>
                <td class="bidAndask-middle-column-value"></td>
                <td class="ask-column-value ${symbol_board}_ds19"></td>
                <td class="askQ-column-value ${symbol_board}_ds20"></td>
                <td class="ask-sl-value">10</td>
            </tr>
            `);

            $('#stock-arrow-icon').click(function() {
                $(this).children().children().toggleClass("fa-rotate-180");
                $(".bidAndask-row").toggle();
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
            update_market_depth_bar(buy_percent, sell_percent)
        }
    });

}

function update_market_depth_bar(buy_percent, sell_percent){

    if (isNaN(buy_percent) && isNaN(sell_percent)) {

        $('.bidPerQ').text('50%');
        $('.askPerQ').text('50%');
        
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
             $('.bidPerQ').text(buy_percent.toFixed(2)+'%');
             $('.askPerQ').text(sell_percent.toFixed(2)+'%');
        }
      }
  
    
}

var getOthersData = async (symbol) => {
    try {
        var dividend_url = `analysis/stock_analysis/corporate_action_dividend/${symbol}`;
        var insider_url = `analysis/stock_analysis/corporate_action_insider_activity/${symbol}`;
        var profile_url = `analysis/stock_analysis/company_profile/${symbol}`;
        var holding_url = `analysis/stock_analysis/holdings/${symbol}`;

        var results = await Promise.all([
            fetch(dividend_url),
            fetch(insider_url),
            fetch(profile_url),
            fetch(holding_url),
        ]);
        var promises = results.map((result) => result.json());
        var data = await Promise.all(promises);
        if (data[0].dividend.length > 0) {
            setDividendDataTable(data[0]);
            setInsiderActivityDataTable(data[1]);
            setProfileData(data[2]);
            setHoldingTable(data[3].table);
            holdingsBarOption.dataset.source = data[3].graph;
            holdingsBar.setOption(holdingsBarOption);
        }
    } catch (err) {
        console.error(err);
    }
};


function updateFinancialInfo(symbol) {
    var val;
    var count1 = 0;
    var count2 = 0;
    var count3 = 0;
    var count4 = 0;
    var tabText1, tabText2, tabText3;

    var chartArray = document.querySelectorAll(".chart");

    chartArray.forEach((cht) => {
        cht.addEventListener("lazybeforeunveil", () => {
            tabText1 = document.getElementById("text-tab1").innerText;
            tabText2 = document.getElementById("text-tab2").innerText;
            tabText3 = document.getElementById("text-tab3").innerText;
            if (cht.id == "financial-quarter-eps" && count1 == 0) {
                count1++;
                val = document.getElementById("text-parent").innerText;
                loadChart(tabText1, val, symbol);
            }
            if (cht.id == "net-income-quarter" && count2 == 0) {
                count2++;
                val = document.getElementById("text-parent").innerText;
                loadChartIncome(tabText2, val, symbol);
            }
            if (cht.id == "balance-sheet-quarter" && count3 == 0) {
                count3++;
                val = document.getElementById("text-parent").innerText;
                loadChartBalanceSheet(val, symbol);
            }
            if (cht.id == "cash-flow-operating-quarter" && count4 == 0) {
                count4++;
                val = document.getElementById("text-parent").innerText;
                loadChartCashFlow(tabText3, val, symbol);
            }
        });
    });
}


var initializeLazyLoad = () => {
    var elements = document.querySelectorAll(".chart");
    elements.forEach((element) => {
        if (element.classList.contains("lazyloaded")) {
            element.classList.remove("lazyloaded");
            element.classList.add("lazyload");
        }
    });
};


// -- Company - Financial
var loadChart = async (tabText, val, symbol) => {
    try {
        var financial_response = await fetch(
            `analysis/mobile_stock_info/financial/${symbol}`
        );
        var financial_data = await financial_response.json();
        if (val == "Quarterly") {
            setFinancialQuarterlyGraph(financial_data, tabText);
        } else {
            setFinancialAnnualGraph(financial_data, tabText);
        }

        var cash_stock = await fetch('analysis/mobile_stock_info/cash_stock_dividend/' + symbol);
        var cash_stock_data = await cash_stock.json();
        DividendsChartOption.xAxis.data = cash_stock_data.year_value
        DividendsChartOption.series[0].data = cash_stock_data.cash_dividend
        DividendsChartOption.series[1].data = cash_stock_data.bonus_dividend
        DividendsChart.setOption(DividendsChartOption);

    } catch (err) {
        console.error(err);
    }
};

// -- Company - Income Statement
var loadChartIncome = async (tabText, val, symbol) => {
    try {
        var income_response = await fetch(
            `analysis/stock_analysis/income_statement/${symbol}`
        );
        var income_data = await income_response.json();
        setFinancialIncomeStatementStatements(income_data);
        if (val == "Quarterly") {
            setIncomeStatementQuarterlyGraph(income_data, tabText);
        } else {
            setIncomeStatementAnnualGraph(income_data, tabText);
        }
    } catch (err) {
        console.error(err);
    }
};

// -- Company - Balance Sheet
var loadChartBalanceSheet = async (val, symbol) => {
    try {
        var balance_response = await fetch(`analysis/stock_analysis/balance_sheet/${symbol}`);
        var balance_data = await balance_response.json();
        setFinancialBalanceSheetStatements(balance_data);

        if (val == "Quarterly") {
            setBalanceSheetQuarterlyGraph(balance_data);
        } else {
            setBalanceSheetAnnualGraph(balance_data);
        }
    } catch (err) {
        console.error(err);
    }
};

// // -- Company - Cash Flow
var loadChartCashFlow = async (tabText, val, symbol) => {
    try {
        var cash_response = await fetch(`analysis/stock_analysis/cash_flow/${symbol}`);
        var cash_data = await cash_response.json();
        setFinancialCashFlowStatements(cash_data);
        if (val == "Quarterly") {
            setCashFlowQuarterlyGraph(cash_data, tabText);
        } else {
            setCashFlowAnnualGraph(cash_data, tabText);
        }
    } catch (err) {
        console.error(err);
    }
};

function openmodal_start_list(selected_ticker) {
    if ($("#favorite-icon i").hasClass("fa-star")) {
            $.getJSON("shared/checksymbolforwatchlist/", { instrument: selected_ticker }, function (data) {
                $("#watchlist-remove-modal").modal("show");
                // console.log(data)
                $('#all_added_watchlists').html('');
                    for (i = 0; i < data.length; i++) {
                        $("#myModalLabelRemove").html(selected_ticker)
                        $("#all_added_watchlists").append(`
                        <li class="row mobile_watchlist_li mt-3 mb-3 pb-3">
                                <span align="center" class="col-2 watchtist-checkbox-item" style="display: none;"><input type="checkbox" class="checkbox"/></span>
                                <input type="checkbox" class="checkbox"/><span  class="col-10  watchlists font-weight-bold" value="${selected_ticker}">${data[i]}</span>
                        </li>
                    `);
                    
                    }
            })
    } else {
        $.get("/shared/getallwatchlist/", function (data) {
            $("#watchlist-add-modal").modal("show");
            $('#view_all_watchlists').html('');
            for (i = 0; i < data.length; i++) {
                $("#myModalLabelAdd").html(selected_ticker)
                $("#view_all_watchlists").append(`
                <li class="row mobile_watchlist_li mt-3 mb-3 pb-3">
                    <span align="center" class="col-2 watchtist-checkbox-item" style="display: none;"><input type="checkbox" class="checkbox"/></span>
                    <input type="checkbox" class="checkbox"/><span  class="col-10  watch-list-add font-weight-bold" onclick="load_watchlist('${data[i]}');closeSideDrawer();" value="${data[i]}">${data[i]}</span>
                </li>
              `);
            }
      
        });
    }
}


function getNewsData(selected_news_ticker) {
    fetch(`analysis/stock_analysis/news/${selected_news_ticker}`)
        .then(res => res.json())
        .then(data => {
            setNewsData(data);
            makeLI(data)
        })
        .catch(err => {
            console.log(err);
        })
}

function setNewsData(data) {
    var newsDiv = document.querySelector("#nav-news");
    newsDiv.innerHTML = "";
    for (var i = 1; i < data.news.length; i++) {
        var news_item = JSON.stringify(data.news[i]);
        news_item = news_item.replace(/'/g, "");
        var newsItemList = document.createElement("ul");
        newsItemList.classList.add("list-group");
        newsItemList.innerHTML = `
        <li class="news-list list-align text-title" onclick='openmodal_news_table(${news_item});'>
            <div class="list-color list-style">${data.news[i][3]}</div>
            <div class="list-sub-item">${data.news[i][2]}&nbsp;&nbsp;·&nbsp;&nbsp;${data.news[i][0]}</div>
        </li>
        `;
        newsDiv.appendChild(newsItemList);
    }
}


function openmodal_news_table(input) {
    $("#insider-modal-table").modal("show");

    $("#exampleModalLongTitle").html(input[2]+' · '+input[0]);
    $(".modal-header h6").html(input[1]);
    $(".modal-body .news-modal-body").html(input[3]);

    $(".insider-modal-close-btn")
    .unbind()
    .click(function (event) {
        $("#insider-modal-table").modal("hide");
    });
}


// Check or Uncheck All checkboxes
var isCheckedRemove = true;

document.getElementById('select-all-watchlist').addEventListener('click', function() {
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = isCheckedRemove;
    }
    isCheckedRemove = !isCheckedRemove;
    // checkSelected();
});


$('#remove-from-watchlist').click(function () {

  var items = $('#all_added_watchlists li').find('input:checked');
  var symbol = $('#watchlist-remove-modal .modal-title').text();
  
  $.each(items, function (index, value) {
    var name = $(value).closest('li').find('.watchlists').text();
    // console.log(symbol)
    // console.log(name)
    remove_from_multiple_watchlist(symbol, name);
  });

  items.closest('li').remove();
  $("#checkall").prop("checked", false);
  $("#watchlist-remove-modal").modal("hide");

});

var isCheckedAdd = true;

document.getElementById('select-all-watchlist-add').addEventListener('click', function() {
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = isCheckedAdd;
    }
    isCheckedAdd = !isCheckedAdd;
});

$('#add-to-watchlist').click(function () {
  var items = $('#view_all_watchlists li').find('input:checked');
  $.each(items, function (index, value) {
    var symbol = $('#watchlist-add-modal .modal-add-title').text();
    var name = $(value).closest('li').find('.watch-list-add').text();
    add_to_multiple_watchlist(symbol, name);
  });

  items.closest('li').remove();
  $("#checkalladd").prop("checked", false);
  $("#watchlist-add-modal").modal("hide");

});
