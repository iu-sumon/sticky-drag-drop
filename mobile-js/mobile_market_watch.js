$(document).ready(function () {
    mobile_load_screener();
    var swiper4 = new Swiper('.swiper-menubar', {
        spaceBetween: 10,
        slidesPerView: 4,
        freeMode: true,
        direction: 'horizontal',
        loop: false
    });
});

var screener_clones;

var screener_list = document.getElementById("screener_list");
var block_list = document.getElementById("block_list");
var gsec_list = document.getElementById("gsec_list");


var onCompanySelect = (symbol, symbol_board, title) => {
    document.getElementById('global-top-bar').style.display = 'none'
    $("#main-content").css("padding-top", "0px");
    // load a html page into the main content area
    var pageLoadicon = $('#page-loading-indicator').html();
    $.get('analysis/mobile_stock_info/', { symbol: symbol, symbol_board: symbol_board ,title:title}, function (data) {
        $('#page-content').html(pageLoadicon).html(data);
    });
};

var buttons = document.querySelectorAll(".mobile-stock-btns-sm");
buttons.forEach((button) => {
    button.addEventListener("click", () => {
        buttons.forEach((btn) => {
            btn.classList.remove("active-mkt-btn");
        });
        button.classList.add("active-mkt-btn");
    });
});

function openmodal_top_execution(input) {
    $("#topwindowModal").modal("show");
    $(".modal-backdrop").hide();
    $(".top_execution_mode")
        .unbind()
        .click(function (event) {
            $(input).val($(this).text());
            var toplist = $(this).text();
            $.getJSON("shared/market_watch_top_list/", { toplist: toplist }, function (data) {
                screener_list.innerHTML = '';
                build_list(screener_list, data.ltp_list, data.eod_list)
            });
            $("#topwindowModal").modal("hide");
        });
}

function openmodal_board_execution(input) {
    $("#boardwindowModal").modal("show");
    $(".modal-backdrop").hide();
    $(".board_execution_mode")
        .unbind()
        .click(function (event) {
            $(input).val($(this).text());
            
            var board = $(this).attr("data-board").toUpperCase();
            $.getJSON("shared/market_board/", { board: board }, function (data) {
                screener_list.innerHTML = '';
                build_list(screener_list, data.ltp_list, data.eod_list)
            });
            $("#boardwindowModal").modal("hide");
        });
}

function openmodal_sector_execution(input) {
    $("#sectorwindowModal").modal("show");
    $(".modal-backdrop").hide();
    $(".sector_execution_mode")
        .unbind()
        .click(function (event) {
            $(input).val($(this).text());

            var sector = $(this).text();
            $.getJSON("shared/market_watch_filter/", { sector: sector }, function (data) {
                screener_list.innerHTML = '';
                build_list(screener_list, data.ltp_list, data.eod_list)
            });
            $("#sectorwindowModal").modal("hide");
        });
}

function openmodal_category_execution(input) {
    $("#categorywindowModal").modal("show");
    $(".modal-backdrop").hide();
    $(".category_execution_mode")
        .unbind()
        .click(function (event) {
            $(input).val($(this).text());

            var category = $(this).text().toUpperCase();
            $.getJSON("shared/market_watch_filter/", { category: category }, function (data) {
                screener_list.innerHTML = '';
                build_list(screener_list, data.ltp_list, data.eod_list)
            });
            $("#categorywindowModal").modal("hide");
        });
}
function openmodal_market_execution(input) {
    $("#marketwindowModal").modal("show");
    $(".modal-backdrop").hide();
    $(".market_execution_mode")
        .unbind()
        .click(function (event) {
            $(input).val($(this).text());

            var market_type = $(this).attr("market-type").toUpperCase();
            $.getJSON("shared/market_watch_filter/", { type: market_type }, function (data) {
                screener_list.innerHTML = '';
                build_list(screener_list ,data.ltp_list, data.eod_list)
            });
            $("#marketwindowModal").modal("hide");
        });
}


$('.screener_sort').click(function (e) {
    e.preventDefault();

    if ($(this).attr('id') == 'block_btn') {
        $('#screener_list').hide();
        $('#gsec_list').hide();
        $('#block_list').show();
        $('.mkt-select-container').hide();

        var board = $(this).val();
        $("li.watchlist-mobile-table-row-style").each(function () {
            var li_board = $(this).find(".watchlist-mobile-row-company-title").attr("data-board");
            $(this).toggle(li_board === board || board === 'PUBLIC');
        });
    } else if ($(this).attr('id') == 'gsec_btn') {
        $('#screener_list').hide();
        $('#block_list').hide();
        $('#gsec_list').show();
        $('.mkt-select-container').hide();

        var board = $(this).val();
        $("li.watchlist-mobile-table-row-style").each(function () {
            var li_board = $(this).find(".watchlist-mobile-row-company-title").attr("data-board");
            $(this).toggle(li_board === board || board === 'PUBLIC');
        });
    } else {
        $('#block_list').hide();
        $('#gsec_list').hide();
        $('#screener_list').show();
        $('.mkt-select-container').show();

        var symbol_instr = $(this).val().toUpperCase();
        $.getJSON("shared/market_watch_filter/", { instr: symbol_instr }, function (data) {
            screener_list.innerHTML = '';
            build_list(screener_list, data.ltp_list, data.eod_list)
        });
    }
});

// mobile load screener
function mobile_load_screener() {
    var url = '/shared/loadscreener/';
   
    screener_list.innerHTML = '';
    block_list.innerHTML = '';
    gsec_list.innerHTML = '';
   
    $.getJSON(url, function (data) {
        today = new Date();
        // Get Board List
        $("#select_board").empty();
        $.each(data.board_list, function (index, value) {
            var boardOption = $("<p>").addClass("board_execution_mode m-0").text(value);
            boardOption.attr("data-board", value);
            if (value == 'PUBLIC') {
                boardOption.text('MAIN');
                boardOption.attr("data-board", 'PUBLIC');
            } else {
                boardOption.attr("data-board", value);
            }
            // console.log(boardOption)
            $("#select_board").append(boardOption);
        });
        
        // Get Sector List
        $("#filter_sector").empty();
        $.each(data.sector_list, function (index, value) {
            var sectorOption = $("<p>").addClass("sector_execution_mode m-0").text(value);
            $("#filter_sector").append(sectorOption);
        });
       
        // Get Category List
        $("#filter_category").empty();
        $.each(data.category_list, function (index, value) {
            var categoryOption = $("<p>").addClass("category_execution_mode m-0").text(value);
            $("#filter_category").append(categoryOption);
        });
        
        // Build Screener List
        build_list(screener_list, data.ltp_list, data.eod_list);
        screener_clones = $("#screener_list li").clone(true);

        // Build Block List
        build_list(block_list, data.block_ltp_list, data.block_eod_list);
        block_clones = $("#block_list li").clone(true);
        
        // Build GSEC List
        build_list(gsec_list, data.gsec_ltp_list, data.gsec_eod_list);
        gsec_clones = $("#gsec_list li").clone(true);
    });
}


function build_list(screener_list, ltp_list, eod_list) {
    var color_class = '';
    var pos_neg = '';
    var items_per_load = 50;

    load_items(0, items_per_load);

    var sentinel = document.createElement('li');
    sentinel.classList.add('sentinel');
    screener_list.appendChild(sentinel);

    var observer = new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting) {
          var visible_items = screener_list.children.length - 1; 
          load_items(visible_items, items_per_load);
        }
    });
    observer.observe(sentinel);

    function load_items(start, count) {
        for (var i = start; i < start + count && i < ltp_list.length; i++) {
          
        symbol = ltp_list[i].symbol;
        board = ltp_list[i].board;
        symname = symbol + board;
        sym_board = symbol + "." + board;

        ltp = ltp_list[i].ltp == null ? '-' : parseFloat(ltp_list[i].ltp);
        ycp = ltp_list[i].ycp == null ? '-' : parseFloat(ltp_list[i].ycp);
        change = ltp_list[i].ltp_change == null ? '-' : parseFloat(ltp_list[i].ltp_change);
        changeper = ltp_list[i].ltp_changeper == null ? '-' : parseFloat(ltp_list[i].ltp_changeper);


        if (eod_list.length > 0) {
            eod_obj = eod_list.find(idx => (idx.symbol == symbol && idx.board == board));
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

        vol = ltp_list[i].total_qty == null ? '-' : Number(ltp_list[i].total_qty).toLocaleString("en-IN");
        value = ltp_list[i].total_value == null ? '-' : parseFloat(ltp_list[i].total_value);

        var value_tag = '';
        if (ltp_list[i].total_value != null) {
            if (value > 10000000) {
                value = value / 10000000;
                value_tag = 'cr';
            }
            value = Number(value).toLocaleString("en-IN");
        }

        if (change > 0) { color_class = 'up'; pos_neg = '+'; }
        else if (change < 0) { color_class = 'down'; pos_neg = ''; }
        else { color_class = 'neutral'; pos_neg = ''; }

        if (screener_list != undefined) {

            var item = document.createElement("li");
            item.classList.add('watchlist-mobile-table-row-style');
            item.innerHTML = `
                <div onclick="onCompanySelect('${symbol}','${sym_board}', 'mobile_market_watch')" class="table-first-column watchlist-row-content-align row-content-start">
                      <div>
                         <div>
                          <span data-board="${board}" class="watchlist-mobile-row-company-title">${symbol}</span>
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

            screener_list.appendChild(item);

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

            document.getElementById("dom-watchlist").appendChild(screener_list);
        }
          screener_list.insertBefore(item, sentinel);
        }
    }
}



// for sorted list
// if screener list function call should be like this sorted_build_list(screener_list, data.screener_sorted_list)
// if block list function call should be like this sorted_build_list(block_list, data.block_sorted_list)
// if gsec list function call should be like this sorted_build_list(gsec_list, data.gsec_sorted_list)
function sorted_build_list(list, data, col_name) {
    console.log(col_name)
    var color_class = '';
    var pos_neg = '';
    var items_per_load = 50;

    load_items(0, items_per_load);

    var sentinel = document.createElement('li');
    sentinel.classList.add('sentinel');
    list.appendChild(sentinel);

    var observer = new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting) {
          var visible_items = list.children.length - 1; 
          load_items(visible_items, items_per_load);
        }
    });
    observer.observe(sentinel);

    function load_items(start, count) {
        for (var i = start; i < start + count && i < data.length; i++) {
          
            symbol = data[i].symbol;
            board = data[i].board;
            symname = symbol + board;
            sym_board = symbol + "." + board;

            ltp = data[i].ltp;
            change = data[i].ltp_change;
            changeper = data[i].ltp_changeper;
            
            high = data[i].high;
            low = data[i].low;

            vol = data[i].total_qty.toLocaleString("en-IN");
            value = data[i].total_value;

            var value_tag = '';
            if (data[i].total_value != '-') {
                if (value > 10000000) {
                    value = value / 10000000;
                    value_tag = 'cr';
                }
                value = Number(value).toLocaleString("en-IN");
            }

            if (change > 0) { color_class = 'up'; pos_neg = '+'; }
            else if (change < 0) { color_class = 'down'; pos_neg = ''; }
            else { color_class = 'neutral'; pos_neg = ''; }

            if (list != undefined) {

                var item = document.createElement("li");
                item.classList.add('watchlist-mobile-table-row-style');
                if (col_name == "Price") {
                    item.innerHTML = `
                        <div onclick="onCompanySelect('${symbol}','${sym_board}', 'mobile_market_watch')" class="table-first-column watchlist-row-content-align row-content-start">
                            <div>
                                <div>
                                <span data-board="${board}" class="watchlist-mobile-row-company-title">${symbol}</span>
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
                            class="watchlist-mobile-table-end-column watchlist-row-content-align row-content-end watchlist-mobile-price-column" style="display: flex;"
                        >
                            <span class="watchlist-mobile-row-title" style="color:white!important;">${ltp}</span>
                            <span class="watchlist-mobile-row-sub-title">${change}</span>&nbsp;
                            <span class="watchlist-mobile-row-sub-title">${changeper}%</span>
                        </div>
                        `
                        $(".watchlist-mobile-price-column").each(function () {

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
                }
                else if(col_name == "Change"){
                    item.innerHTML = `
                        <div onclick="onCompanySelect('${symbol}','${sym_board}', 'mobile_market_watch')" class="table-first-column watchlist-row-content-align row-content-start">
                            <div>
                                <div>
                                <span data-board="${board}" class="watchlist-mobile-row-company-title">${symbol}</span>
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
                            class="watchlist-mobile-table-end-column watchlist-row-content-align row-content-end watchlist-mobile-change-column" style="display: flex;"
                        >
                            <span class="watchlist-mobile-row-title" style="color:white!important;">${change}</span>
                            <span class="watchlist-mobile-row-sub-title">${ltp}</span>&nbsp;
                            <span class="watchlist-mobile-row-sub-title">${changeper}%</span>
                        </div>
                        `
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
                }
                else {
                    item.innerHTML = `
                        <div onclick="onCompanySelect('${symbol}','${sym_board}', 'mobile_market_watch')" class="table-first-column watchlist-row-content-align row-content-start">
                            <div>
                                <div>
                                <span data-board="${board}" class="watchlist-mobile-row-company-title">${symbol}</span>
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
                            class="watchlist-mobile-table-end-column watchlist-row-content-align row-content-end watchlist-mobile-perchange-column" style="display: flex;"
                        >
                            <span class="watchlist-mobile-row-title" style="color:white!important;">${changeper}%</span>
                            <span class="watchlist-mobile-row-sub-title">${ltp}</span>&nbsp;
                            <span class="watchlist-mobile-row-sub-title">${change}</span>
                        </div>
                        `
                        $(".watchlist-mobile-perchange-column").each(function () {

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
                }
              
                list.appendChild(item);

                document.getElementById("dom-watchlist").appendChild(list);
            }
            list.insertBefore(item, sentinel);
        }
    }
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
            sortListAsce(endColumnTitle1.innerHTML);
            // document.getElementsByClassName("list")[0]
        }
        else if (imageDown1.style.color == 'rgb(0, 0, 255)') {
            sortListDesc(endColumnTitle1.innerHTML);
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
        sortListAsce(endColumnTitle2);
        //document.getElementsByClassName("list")[0]
    }

    else if (imageUp2.style.color == "rgb(0, 0, 255)") {

        $("#imageUpMobile").css("color", "rgb(128, 128, 128)");
        $("#screener_list").html(screener_clones);

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

function sortListAsce(endColumnTitle2) {

    if (endColumnTitle2 == "Price") {
        col_name = 'ltp'
    }

    else if (endColumnTitle2 == "Change") {
        col_name = 'ltp_change'
    }

    else {
        col_name = 'ltp_changeper'
    }

    $.get('shared/market_screener_sorting/', { 'sort_type': 'ASC', 'col_name': col_name }, function(data) {
        data = JSON.parse(data);
        
        screener_list.innerHTML = '';
        sorted_build_list(screener_list, data.screener_sorted_list, endColumnTitle2);
    });
}


function sortDescending() {

    var endColumnTitle4 = document.getElementById("table-end-column-title").innerHTML;
    var imageDown3 = document.getElementById("imageDownMobile");
    var imageUp3 = document.getElementById("imageUpMobile");
    imageUp3.style.color = "rgb(128, 128, 128)";

    if (imageDown3.style.color == "rgb(128, 128, 128)") {

        $("#imageDownMobile").css("color", "rgb(0, 0, 255)");
        sortListDesc(endColumnTitle4);
        //document.getElementsByClassName("list")[0]
    }

    else if (imageDown3.style.color == "rgb(0, 0, 255)") {

        $("#imageDownMobile").css("color", "rgb(128, 128, 128)");
        $("#screener_list").html(screener_clones);

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


function sortListDesc(endColumnTitle4) {

    if (endColumnTitle4 == "Price") {
        col_name = 'ltp'
    }

    else if (endColumnTitle4 == "Change") {
        col_name = 'ltp_change'
    }

    else {
        col_name = 'ltp_changeper'
    }

    $.get('shared/market_screener_sorting/', { 'sort_type': 'DESC', 'col_name': col_name }, function(data) {
        data = JSON.parse(data);
    
        screener_list.innerHTML = '';
        console.log(endColumnTitle4)
        sorted_build_list(screener_list, data.screener_sorted_list, endColumnTitle4);
    });
}

$('.back-button-mkt-watch').on('click', function () {
    $(this).css("background-color", "linear-gradient(to left,#26d6e6,#67efb8)");
    $('#page-content').load('mobile_home'); // Redirect to home
});
