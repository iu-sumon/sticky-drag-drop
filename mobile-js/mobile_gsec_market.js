$(document).ready(function () {
    mobile_gsec_market();
});

var clones;


var onCompanySelect = (symbol, symbol_board, title) => {
    document.getElementById('global-top-bar').style.display = 'none'
    $("#main-content").css("padding-top", "0px");
    // load a html page into the main content area
    var pageLoadicon = $('#page-loading-indicator').html();
    $.get('analysis/mobile_stock_info/', { symbol: symbol, symbol_board: symbol_board ,title:title}, function (data) {
        $('#page-content').html(pageLoadicon).html(data);
    });
};


function mobile_gsec_market() {
    var gsec_list = document.getElementById("gsec_list");
    gsec_list.innerHTML = '';

    $.getJSON("/shared/mobile_gsec_market", function (data) {
        var color_class = '';
        var pos_neg = '';

        for (i = 0; i < data.gsec_symbol_list.length; i++) {

            symbol = data.gsec_symbol_list[i].symbol;
            board = data.gsec_symbol_list[i].board;
            symname = symbol + board;
            sym_board = symbol + "." + board;

            category = data.gsec_symbol_list[i].symbol_category;
            sector = data.gsec_symbol_list[i].sector;
            market_type = data.gsec_symbol_list[i].market_type;
            symbol_type = data.gsec_symbol_list[i].symbol_instr;

            ltp = data.gsec_ltp_list[i].ltp == null ? '-' : parseFloat(data.gsec_ltp_list[i].ltp);
            ycp = data.gsec_ltp_list[i].ycp == null ? '-' : parseFloat(data.gsec_ltp_list[i].ycp);
            change = data.gsec_ltp_list[i].ltp_change == null ? '-' : parseFloat(data.gsec_ltp_list[i].ltp_change);
            changeper = data.gsec_ltp_list[i].ltp_changeper == null ? '-' : parseFloat(data.gsec_ltp_list[i].ltp_changeper);


            if (data.gsec_eod_list.length > 0) {
                eod_obj = data.gsec_eod_list.find(idx => (idx.symbol == symbol && idx.board == board));
                if (eod_obj != undefined) {
                    high = eod_obj.high;
                    low = eod_obj.low;
                } else {
                    high = '-';
                    low = '-';
                }
            } else {
                high = '-';
                low = '-';
            }

            vol = data.gsec_ltp_list[i].total_qty == null ? '-' : Number(data.gsec_ltp_list[i].total_qty).toLocaleString("en-IN");
            value = data.gsec_ltp_list[i].total_value == null ? '-' : parseFloat(data.gsec_ltp_list[i].total_value);

            var value_tag = '';
            if (data.gsec_ltp_list[i].total_value != null) {
                if (value > 10000000) {
                    value = value / 10000000;
                    value_tag = 'cr';
                }
                value = Number(value).toLocaleString("en-IN");
            }

            if (change > 0) { color_class = 'up'; pos_neg = '+'; }
            else if (change < 0) { color_class = 'down'; pos_neg = ''; }
            else { color_class = 'neutral'; pos_neg = ''; }

            if (gsec_list != undefined) {

                var item = document.createElement("li");
                item.classList.add('watchlist-mobile-table-row-style');
                item.innerHTML = `
                <div onclick="onCompanySelect('${symbol}','${sym_board}','mobile_gsec_page')" class="table-first-column watchlist-row-content-align row-content-start">
                      <div>
                         <div>
                          <span data-board="${board}" data-sector="${sector}" data-category="${category}" data-market-type="${market_type}" data-symbol-type="${symbol_type}" class="watchlist-mobile-row-company-title">${symbol}</span>
                         </div>
                          <div> 
                              <div>
                                <span class="watchlist-mobile-row-first-column-sub-title ms-3">T: <span class="watchlist-mobile-first-column-sub-value">${value} ${value_tag}</span></span>&nbsp;
                                <span class="watchlist-mobile-row-first-column-sub-title">V: <span class="watchlist-mobile-first-column-sub-value">${vol}</span></span>&nbsp;
                              </div>
                                <br>
                               <div>
                                <span class="watchlist-mobile-row-first-column-sub-title">H: <span class="watchlist-mobile-first-column-sub-value">${high}</span></span>&nbsp;
                                <span class="watchlist-mobile-row-first-column-sub-title ms-3">L: <span class="watchlist-mobile-first-column-sub-value">${low}</span></span>
                               </div>
                          </div>
                      </div>
                </div>
                <div class="watchlist-table-middle-column watchlist-row-content-align">
                </div>
                
                <div
                    class="watchlist-mobile-table-end-column watchlist-row-content-align row-content-end watchlist-mobile-price-column"
                >
                    <span class="watchlist-mobile-row-title" style="color:white!important;">${ltp}</span>
                    <span class="watchlist-mobile-row-sub-title">${change}</span>&nbsp;
                    <span class="watchlist-mobile-row-sub-title">${changeper}%</span>
                </div>
                <div
                    class="watchlist-mobile-table-end-column watchlist-row-content-align row-content-end watchlist-mobile-change-column"
                >
                    <span class="watchlist-mobile-row-title" style="color:white!important;">${change}</span>
                    <span class="watchlist-mobile-row-sub-title">${ltp}</span>&nbsp;
                    <span class="watchlist-mobile-row-sub-title">${changeper}%</span>
                </div>
                <div
                    class="watchlist-mobile-table-end-column watchlist-row-content-align row-content-end watchlist-mobile-perchange-column" 
                >
                    <span class="watchlist-mobile-row-title" style="color:white!important;">${changeper}%</span>
                    <span class="watchlist-mobile-row-sub-title">${ltp}</span>&nbsp;
                    <span class="watchlist-mobile-row-sub-title">${change}</span>
                </div>
                `

                gsec_list.appendChild(item);

                $(".watchlist-mobile-change-column").each(function () {

                    var siblings_2 = $(this).siblings()[2]
                    var siblings_3 = $(this).siblings()[3]


                    if (parseFloat($(this).text()) < 0) {
                        $(this).addClass("negative-mobile");
                        $(siblings_2).addClass("negative-mobile");
                        $(siblings_3).addClass("negative-mobile");
                    }
                    else if (parseFloat($(this).text()) > 0) {
                        $(this).addClass("positive-mobile");
                        $(siblings_2).addClass("positive-mobile");
                        $(siblings_3).addClass("positive-mobile");
                    }
                    else if (parseFloat($(this).text()) == 0) {
                        $(this).addClass("no-change-mobile");
                        $(siblings_2).addClass("no-change-mobile");
                        $(siblings_3).addClass("no-change-mobile");
                    }
                });

                document.getElementById("dom-watchlist").appendChild(gsec_list);
            }
        }
        clones = $("#gsec_list li").clone(true);
    });
}


var counter = 1;
var endColumnTitle1 = document.getElementById("table-end-column-title");
$(document).on("click", ".watchlist-mobile-price-column, .watchlist-mobile-change-column, .watchlist-mobile-perchange-column",
    function () {

        var imageUp1 = document.getElementById("imageUpMobile");
        var imageDown1 = document.getElementById("imageDownMobile");

        var divs1 = document.querySelectorAll(".watchlist-mobile-price-column");
        var divs2 = document.querySelectorAll(".watchlist-mobile-change-column");
        var divs3 = document.querySelectorAll(".watchlist-mobile-perchange-column");

        if (counter == 1) {
            for (var div of divs3) {
                div.style.display = "none";
            }
            for (var div of divs1) {
                div.style.display = "flex";
            }
            endColumnTitle1.innerHTML = "Price";
        }

        if (counter == 2) {
            for (var div of divs2) {
                div.style.display = "flex";
            }
            for (var div of divs1) {
                div.style.display = "none";
            }
            endColumnTitle1.innerHTML = "Change";
        }

        if (counter == 3) {
            for (var div of divs3) {
                div.style.display = "flex";
            }
            for (var div of divs2) {
                div.style.display = "none";
            }
            endColumnTitle1.innerHTML = "%Change";
        }

        counter++;

        if (counter == 4) {
            counter = 1;
        }

        if (imageUp1.style.color == 'rgb(0, 0, 255)') {
            sortListAsce();
            // document.getElementsByClassName("list")[0]
        }
        else if (imageDown1.style.color == 'rgb(0, 0, 255)') {
            sortListDesc();
            // document.getElementsByClassName("list")[0]
        }
    }
);

function sortAscending() {
    var endColumnTitle2 = document.getElementById("table-end-column-title").innerHTML;
    var imageUp2 = document.getElementById("imageUpMobile");
    var imageDown2 = document.getElementById("imageDownMobile");
    imageDown2.style.color = "rgb(128, 128, 128)";

    if (imageUp2.style.color == "rgb(128, 128, 128)") {

        $("#imageUpMobile").css("color", "rgb(0, 0, 255)");
        sortListAsce();
        //document.getElementsByClassName("list")[0]
    }

    else if (imageUp2.style.color == "rgb(0, 0, 255)") {

        $("#imageUpMobile").css("color", "rgb(128, 128, 128)");
        $("#gsec_list").html(clones);

        // google.setOnLoadCallback(drawGraph);

        if (endColumnTitle2 == "Change") {
            $(".watchlist-mobile-price-column").hide();
            $(".watchlist-mobile-perchange-column").hide();
            $(".watchlist-mobile-change-column").show();
            $(".watchlist-mobile-change-column").css("display", "flex");
        }

        else if (endColumnTitle2 == "%Change") {
            $(".watchlist-mobile-change-column").hide();
            $(".watchlist-mobile-price-column").hide();
            $(".watchlist-mobile-perchange-column").show();
            $(".watchlist-mobile-perchange-column").css("display", "flex");
        }

        else if (endColumnTitle2 == "Price") {
            $(".watchlist-mobile-change-column").hide();
            $(".watchlist-mobile-perchange-column").hide();
            $(".watchlist-mobile-price-column").show();
            $(".watchlist-mobile-price-column").css("display", "flex");
        }
    }

}

function sortListAsce() {
    $("#gsec_list li").sort(function (a, b) {

        var endColumnTitle3 = document.getElementById("table-end-column-title").innerHTML;
        var selectColumn1;

        if (endColumnTitle3 == "Price") {
            selectColumn1 = ".watchlist-mobile-price-column > .watchlist-mobile-row-title";
        }

        else if (endColumnTitle3 == "Change") {
            selectColumn1 = ".watchlist-mobile-change-column > .watchlist-mobile-row-title";
        }

        else {
            selectColumn1 = ".watchlist-mobile-perchange-column > .watchlist-mobile-row-title";

        }

        var aValue = parseFloat($(a).find(selectColumn1).text().replace(/,/g, ""));
        var bValue = parseFloat($(b).find(selectColumn1).text().replace(/,/g, ""));

        aValue = isNaN(aValue) ? 0 : aValue;
        bValue = isNaN(bValue) ? 0 : bValue;

        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;

    })
        .appendTo("#gsec_list");
}


function sortDescending() {

    var endColumnTitle4 = document.getElementById("table-end-column-title").innerHTML;
    var imageDown3 = document.getElementById("imageDownMobile");
    var imageUp3 = document.getElementById("imageUpMobile");
    imageUp3.style.color = "rgb(128, 128, 128)";

    if (imageDown3.style.color == "rgb(128, 128, 128)") {

        $("#imageDownMobile").css("color", "rgb(0, 0, 255)");
        sortListDesc();
        //document.getElementsByClassName("list")[0]
    }

    else if (imageDown3.style.color == "rgb(0, 0, 255)") {

        $("#imageDownMobile").css("color", "rgb(128, 128, 128)");
        $("#gsec_list").html(clones);

        // google.setOnLoadCallback(drawGraph);

        if (endColumnTitle4 == "Change") {
            $(".watchlist-mobile-price-column").hide();
            $(".watchlist-mobile-perchange-column").hide();
            $(".watchlist-mobile-change-column").show();
            $(".watchlist-mobile-change-column").css("display", "flex");
        }

        else if (endColumnTitle4 == "%Change") {
            $(".watchlist-mobile-change-column").hide();
            $(".watchlist-mobile-price-column").hide();
            $(".watchlist-mobile-perchange-column").show();
            $(".watchlist-mobile-perchange-column").css("display", "flex");
        }

        else if (endColumnTitle4 == "Price") {
            $(".watchlist-mobile-change-column").hide();
            $(".watchlist-mobile-perchange-column").hide();
            $(".watchlist-mobile-price-column").show();
            $(".watchlist-mobile-price-column").css("display", "flex");
        }

    }

}


function sortListDesc() {

    $("#gsec_list li").sort(function (a, b) {

        var endColumnTitle5 = document.getElementById("table-end-column-title").innerHTML;
        var selectColumn2;

        if (endColumnTitle5 == "Price") {
            selectColumn2 = ".watchlist-mobile-price-column > .watchlist-mobile-row-title";
        }

        else if (endColumnTitle5 == "Change") {
            selectColumn2 = ".watchlist-mobile-change-column > .watchlist-mobile-row-title";
        }

        else {
            selectColumn2 = ".watchlist-mobile-perchange-column > .watchlist-mobile-row-title";
        }


        var aValue = parseFloat($(a).find(selectColumn2).text().replace(/,/g, ""));
        var bValue = parseFloat($(b).find(selectColumn2).text().replace(/,/g, ""));

        aValue = isNaN(aValue) ? 0 : aValue;
        bValue = isNaN(bValue) ? 0 : bValue;
        
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;

    })
        .appendTo("#gsec_list");
}

$('.back-button-gsec-mkt').on('click', function () {
    $(this).css("background-color", "linear-gradient(to left,#26d6e6,#67efb8)");
    $('#page-content').load('mobile_home'); // Redirect to home
});