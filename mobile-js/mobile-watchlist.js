$(document).ready(function () {
  getallwatchlist();
});

var clones;

// Create New Watchlist
function create_watchlist(element_id) {
  var table_id = element_id.replace('create_', '').replace(/\s+/g, '');
  var modal = $("#main-page-modal");
  var pageLoader = $('#page-loading-indicator').html();
  var url = "portfolio/add_watchlist/" + table_id;
  modal.modal({ show: true });
  modal.find('.modal-title').text('');
  modal.find('.modal-body').html(pageLoader).load(url);
}
// Remove Watchlist
function delete_watchlist() {
  // var select_id = element_id.replace('remove_', '').replace(/\s+/g, '');
  // var name = localStorage.getItem(system_username+'_mobile_layout_watchlist_selected');
  var name = $("#all_watchlists li").find("input:checked");

  var url = '/shared/removewatchlist/';
  Array.from(name).forEach(function (element) {
    // name = element.nextElementSibling.innerText;
    // console.log(name);
    name = $(element).closest('li').find('.watch-list').text();
    console.log(name);
    if (name != null && name != '') {
      $.get(url, { name: name })
        .done(function (data) {
          show_flash_messages(data, 'success');
          getallwatchlist();
        })
        .fail(function (data) {
          show_flash_messages(data.responseText, 'danger');
        });
    } else {
      show_flash_messages('No Watchlist Available', 'danger');
    }
  });
}
// Get Watchlist
function getallwatchlist() {
  $.get("/shared/getallwatchlist/", function (data) {
    $('#all_watchlists').html('');
    for (i = 0; i < data.length; i++) {
      $("#all_watchlists").append(`
        <li class="row mobile_watchlist_li mt-3 mb-3 pb-3">
              <span align="center" class="col-2 watchtist-checkbox-item" style="display: none;"><input type="checkbox" class="checkbox"/></span>
              <span  class="col-10  watch-list font-weight-bold" onclick="load_watchlist('${data[i]}');closeSideDrawer();" value="${data[i]}">${data[i]}</span>
        </li>
      `);
    }
    selected_value = localStorage.getItem(system_username + '_mobile_layout_watchlist_selected');
    exists = data.includes(selected_value);
    if (exists) {
      load_watchlist(selected_value);
    } else {
      load_watchlist(data[data.length - 1]);
    }

  });
}



// Add symbol to watchlist
function add_to_watchlist(instrument) {
  // var table_id = element_id.replace('add_', '');
  if (instrument != null) {
    var name = localStorage.getItem(system_username + '_mobile_layout_watchlist_selected');
    if (name != null && name != '') {
      var url = '/shared/addwatchlistitem/';
      $.get(url, { symbol: instrument, name: name })
        .done(function (data) {
          show_flash_messages(data, 'success');
          load_watchlist(name);
        })
        .fail(function (data) {
          show_flash_messages(data.responseText, 'danger');
        });
    } else {
      show_flash_messages('No Watchlist Found', 'danger');
    }
  }
}

// Add symbol to multiple watchlist
function add_to_multiple_watchlist(instrument, name) {
  // var table_id = element_id.replace('add_', '');
  if (instrument != null && instrument != '') {
  //   var name = localStorage.getItem(system_username + '_mobile_layout_watchlist_selected');
    if (name != null && name != '') {
      var url = '/shared/addwatchlistitem/';
      $.get(url, { symbol: instrument, name: name })
        .done(function (data) {
          $.getJSON("shared/checksymbolforwatchlist/", { instrument: instrument }, function (data) {
            if (data.length == 0) {
              $("#favorite-icon").html('<i class="fa fa-star-o" aria-hidden="true"></i>');
            }
            
          })
          //load_watchlist(name);
          show_flash_messages(data, 'success');
        })
        .fail(function (data) {
          show_flash_messages(data.responseText, 'danger');
        });
    } else {
      show_flash_messages('No Watchlist Found', 'danger');
    }
  }
}

// Remove symbol from watchlist
function remove_from_watchlist(instrument) {
  if (instrument != null) {
    var name = localStorage.getItem(system_username + '_mobile_layout_watchlist_selected');
    var url = '/shared/removewatchlistitem/';
    $.get(url, { symbol: instrument, name: name })
      .done(function (data) {
        show_flash_messages(data, 'success');
        load_watchlist(name);
      })
      .fail(function (data) {
        show_flash_messages(data.responseText, 'danger');
      });

  }
}

// Remove symbol from multiple watchlist
function remove_from_multiple_watchlist(instrument, name) {
  console.log(instrument)
  if (instrument != null) {
    // var name = localStorage.getItem(system_username + '_mobile_layout_watchlist_selected');
    var url = '/shared/removewatchlistitem/';
    $.get(url, { symbol: instrument, name: name })
      .done(function (data) {
        $.getJSON("shared/checksymbolforwatchlist/", { instrument: instrument }, function (data) {
          if (data.length == 0) {
            $("#favorite-icon").html('<i class="fa fa-star-o" aria-hidden="true"></i>');
          }
          load_watchlist(name);
        })
        show_flash_messages(data, 'success');
      })
      .fail(function (data) {
        show_flash_messages(data.responseText, 'danger');
      });

  }
}

var onCompanySelect = (symbol, symbol_board ,title) => {

  document.getElementById('global-top-bar').style.display = 'none'
  $("#main-content").css("padding-top", "0px");
  // load a html page into the main content area
  var pageLoadicon = $('#page-loading-indicator').html();
  $.get('analysis/mobile_stock_info/', { symbol: symbol, symbol_board: symbol_board ,title:title}, function (data) {
    $('#page-content').html(pageLoadicon).html(data);
  });
};


function load_watchlist(wlname) {
  localStorage.setItem(system_username + '_mobile_layout_watchlist_selected', wlname);
  var name = wlname;
  var url = '/shared/viewwatchlist/';
  $('#selected_watchlist').text('Watchlist: ' + wlname);
  $("#watchlist-full-list").html('');
  $.getJSON(url, {
    name: name
  }, function (data) {

    for (i = 0; i < data.result.length; i++) {
      symbol = data.result[i].split('.')[0];
      board = data.result[i].split('.')[1];
      symbol_board = symbol.replace(/[^a-zA-Z ]/g, '') + board;

      change = data.chg_list[i] == 0 ? '0.00' : data.chg_list[i];
      changeper = data.chgper_list[i] == 0 ? '0.00' : data.chgper_list[i];
      high = data.high_list[i] == 0 ? '-' : data.high_list[i];
      low = data.low_list[i] == 0 ? '-' : data.low_list[i];
      vol = data.vol_list[i] == 0 ? '-' : data.vol_list[i];
      trade = data.trade_list[i] == 0 ? '-' : data.trade_list[i];
      turnover = data.value_list[i] == 0 ? '-' : Number(data.value_list[i]).toLocaleString("en-IN");
      ltp = data.ltp_list[i] == 0 ? '-' : data.ltp_list[i];

      bidq = data.bidqty_list[i] == 0 ? '-' : data.bidqty_list[i];
      askq = data.askqty_list[i] == 0 ? '-' : data.askqty_list[i];
      bidp = data.bidprice_list[i] == 0 ? '-' : data.bidprice_list[i];
      askp = data.askprice_list[i] == 0 ? '-' : data.askprice_list[i];
      symname = data.result[i].replace(".", "");

      pos_neg = '';
      color_class = '';
      bg_class = '';

      if (data.chg_list[i] > 0) {
        color_class = 'up';
        pos_neg = '+';
        bg_class = 'positive';
      }
      if (data.chg_list[i] < 0) {
        color_class = 'down';
        pos_neg = '';
        bg_class = 'negative';
      }
      if (data.chg_list[i] == 0) {
        color_class = 'neutral';
        pos_neg = '';
        bg_class = 'nochange';
      }

      var parent = document.getElementById("watchlist-full-list")
      if (parent != undefined) {

        var item = document.createElement("li");
        item.classList.add('watchlist-mobile-table-row-style');
        // item.classList.add('position-relative');
        // item.classList.add('jss222');
        item.innerHTML = `
            <div onclick="onCompanySelect('${symbol}','${data.result[i]}','mobile_watchlist')" class="table-first-column watchlist-row-content-align row-content-start">
                  <div>
                     <div>
                      <span data-symbol="${data.result[i]}" class="watchlist-mobile-row-company-title">${symbol}</span>
                     </div>
                      <div> 
                          <div>
                            <span class="watchlist-mobile-row-first-column-sub-title ms-3">T: <span class="${symbol_board}_turnover watchlist-mobile-first-column-sub-value">${turnover}</span></span>&nbsp;
                            <span class="watchlist-mobile-row-first-column-sub-title">V: <span class="${symbol_board}_vol watchlist-mobile-first-column-sub-value">${vol}</span></span>&nbsp;
                          </div>
                            <br>
                           <div>
                            <span class="watchlist-mobile-row-first-column-sub-title">H: <span class="${symbol_board}_high watchlist-mobile-first-column-sub-value green">${high}</span></span>&nbsp;
                            <span class="watchlist-mobile-row-first-column-sub-title ms-3">L: <span class="${symbol_board}_low watchlist-mobile-first-column-sub-value red">${low}</span></span>
                           </div>
                      </div>
                  </div>
                    </div>
                    <div class="watchlist-table-middle-column watchlist-row-content-align">
                    </div>
                    
                    <div
                      class="watchlist-mobile-table-end-column watchlist-row-content-align row-content-end watchlist-mobile-price-column"
                    >
                      <span class="watchlist-mobile-row-title ${symbol_board}_ltp" style="color:white!important;">${ltp}</span>
                      <span class="watchlist-mobile-row-sub-title ${symbol_board}_chg">${change}</span>&nbsp;
                      <span class="watchlist-mobile-row-sub-title ${symbol_board}_chgper">${changeper}%</span>
                    </div>
                    <div
                      class="watchlist-mobile-table-end-column watchlist-row-content-align row-content-end watchlist-mobile-change-column"
                    >
                      <span class="watchlist-mobile-row-title ${symbol_board}_chg" style="color:white!important;">${change}</span>
                      <span class="watchlist-mobile-row-sub-title ${symbol_board}_ltp">${ltp}</span>&nbsp;
                      <span class="watchlist-mobile-row-sub-title ${symbol_board}_chgper">${changeper}%</span>
                    </div>
                    <div
                      class="watchlist-mobile-table-end-column watchlist-row-content-align row-content-end watchlist-mobile-perchange-column" 
                    >
                      <span class="watchlist-mobile-row-title ${symbol_board}_chgper" style="color:white!important;">${changeper}%</span>
                      <span class="watchlist-mobile-row-sub-title ${symbol_board}_ltp">${ltp}</span>&nbsp;
                      <span class="watchlist-mobile-row-sub-title ${symbol_board}_chg">${change}</span>
                    </div>
            `

        parent.appendChild(item);
        // loading.classList.remove('show');

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

        document.getElementById("dom-watchlist").appendChild(parent);
      }
    }
    clones = $("#watchlist-full-list li").clone(true);
  })

    .catch(error => {
      console.error('Error:', error);
    });
}

function toggleCheckbox() {

  var watchlist_elements = document.querySelectorAll(".watchtist-checkbox-item");
  watchlist_elements.forEach((element) => {
    if (element.style.display === "none") {
      element.style.display = "inline-block";
    } else {
      element.style.display = "none";
    }

  });
}


function open_remove_watchlist() {
  var all_ticker = [];
  var watchlist_elements = document.querySelectorAll(".watchlist-mobile-row-company-title");
  for (var i = 0; i < watchlist_elements.length; i++) {
    var watchlist_name = watchlist_elements[i].outerHTML;
    var watchlist_name = watchlist_name.split('">')[1].split('</span>')[0];
    var data_symbol = watchlist_elements[i].getAttribute("data-symbol"); // get data-symbol attribute value
    all_ticker.push({ name: watchlist_name, symbol: data_symbol }); // push name and symbol to all_ticker array
  }

  $('#page-content').load('portfolio/mobile_watchlist_remove', function () {
    var ul = document.getElementById("watchlist-delete");

    all_ticker.forEach((ticker) => {
      var item = document.createElement('li');
      item.classList.add("watchlist-table-row-style");
      item.classList.add("position-relative");
      item.classList.add("jss222");
      item.setAttribute("data-symbol", ticker.symbol);
      item.innerHTML = `
          <div class="table-first-column watchlist-row-content-align row-content-start">
            <input type="checkbox" class='checkbox mr-2' onchange="checkSelected()">
          </div>
          <div class="watchlist-mobile-edit-table-middle-column watchlist-row-content-align row-content-end">
            <span class="watchlist-mobile-row-title">${ticker.name}</span> 
          </div> 
        `;
      ul.appendChild(item);
    });
  }); // Redirect to watchlist remove
}

function open_add_watchlist()
{
    $('#page-content').load('portfolio/mobile_watchlist_add');
}



/*--------------- JS Coding for Watchlist done by Ashna----------------------*/
// document.getElementById('mobile-landscape-image').onclick = function () {
//   window.location.href = "watchlist-landscape";
// }

// document.getElementById('watchlist-remove-icon').onclick = function () {
//   window.location.href = "watchlist-edit";
// }

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
    $("#watchlist-full-list").html(clones);

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
  $("#watchlist-full-list li").sort(function (a, b) {

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

    return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;

  })
    .appendTo("#watchlist-full-list");
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
    $("#watchlist-full-list").html(clones);

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

  $("#watchlist-full-list li").sort(function (a, b) {

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

    return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;

  })
    .appendTo("#watchlist-full-list");
}


/*google.charts.load('current', {'packages':['corechart','gauge', 'bar','line']});
google.setOnLoadCallback(drawGraph);
function drawGraph(){
  var data1 = new google.visualization.DataTable();
  data1.addColumn('number', 'time');
  data1.addColumn('number', 'price');

  data1.addRows([
  [0, 0],   [1, 10],  [2, 23],  [3, 17],  [4, 18],  [5, 9],
  [6, 11],  [7, 27],  [8, 33],  [9, 40],  [10, 32], [11, 35],
  [12, 30], [13, 40], [14, 42], [15, 47], [16, 44], [17, 48],
  [18, 52], [19, 54]
  ]);
  
  var options1 = {
  chartArea: {'width': '100%', 'height': '100%'},
  width: 60,
  height: 20,
  colors: ['#00DB86'],
  areaOpacity: 0.2,
  backgroundColor: 'transparent',
  legend: {position: 'none'},
  hAxis: {baselineColor: 'none',
  textPosition: 'none',
  gridlines: {
          color: 'transparent'
      }}, 
  vAxis: {
  baselineColor: 'none',
  gridlines: {
          color: 'transparent'
      },
      textPosition:'none'}
  };

  var chart1 = new google.visualization.AreaChart(document.getElementById('chart1_div'));
 //var chart3 = new google.visualization.AreaChart(document.getElementById('chart3_div'));

  chart1.draw(data1, options1);
 //chart3.draw(data1, options1);

//   var data2 = new google.visualization.DataTable();
//   data2.addColumn('number', 'time');
//   data2.addColumn('number', 'price');

//   data2.addRows([
//   [0, 54],   [1, 52],  [2, 48],  [3, 44],  [4, 47],  [5, 42],
//   [6, 40],  [7, 30],  [8, 35],  [9, 32],  [10, 40], [11, 33],
//   [12, 27], [13, 11], [14, 9], [15, 18], [16, 17], [17, 23],
//   [18, 10], [19, 0]
//   ]);
  
//   var options2 = {
//   chartArea: {'width': '100%', 'height': '100%'},
//   width: 60,
//   height: 20,
//   colors: ['#00DB86'],
//   areaOpacity: 0.2,
//   backgroundColor: 'transparent',
//   legend: {position: 'none'},
//   hAxis: {baselineColor: 'none',
//   textPosition: 'none',
//   gridlines: {
//           color: 'transparent'
//       }}, 
//   vAxis: {
//   baselineColor: 'none',
//   gridlines: {
//           color: 'transparent'
//       },
//       textPosition:'none'}
//   };

//  var chart2 = new google.visualization.AreaChart(document.getElementById('chart2_div'));
//  var chart4 = new google.visualization.AreaChart(document.getElementById('chart4_div'));
  

//  chart2.draw(data2, options2);
//  chart4.draw(data2, options2);


}

/*---- JS Coding for Watchlist Modal ----*/

$("#watchlistModal").on("show.bs.modal", function (event) {
  var element = $(event.relatedTarget); // the li that triggered the modal to show
  var dynamic_text = element.text(); // Extract the value of the .text div inside that li

  var modal = $(this);
  $("#watchlist-modal-title").html(dynamic_text);
});

/*---- JS Coding for Watchlist Modal ----*/

$('.back-button-add-watchlist').on('click', function () {
  $(this).css("background-color", "linear-gradient(to left,#26d6e6,#67efb8)");
  $('#page-content').load('portfolio/mobile_watchlist'); // Redirect to watchlist
});

/*--------------- JS Coding for Watchlist done by Ashna----------------------*/
