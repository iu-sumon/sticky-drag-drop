$(document).ready(function () {
    global_search();
});


var onCompanySelect = (symbol, symbol_board) => {
    document.getElementById('global-top-bar').style.display = 'none'
    $("#main-content").css("padding-top", "0px");
    // load a html page into the main content area
    var pageLoadicon = $('#page-loading-indicator').html();
    $.get('analysis/mobile_stock_info/', { symbol: symbol, symbol_board: symbol_board }, function (data) {
        $('#page-content').html(pageLoadicon).html(data);
    });
};


function global_search() {
    var instruments = JSON.parse(localStorage.getItem(system_username+'_instruments')) || [];

    for (var i = 0; i < instruments.length; i++) {
        (function(index) { // Use a closure to capture the value of i
            $.getJSON('shared/checksymbolforwatchlist/', {instrument : instruments[index]}, function (data) {
                if (data.length > 0) {
                    $('.mobile-global-resultBox ul').append('<li class="d-flex justify-content-between align-items-center"><span>' + instruments[index] + '</span>' +'<span class="mr-4" data-instrument="' + instruments[index] + '"><i class="fa fa-check" aria-hidden="true"></i></span></li>');
                } else {
                    $('.mobile-global-resultBox ul').append('<li class="d-flex justify-content-between align-items-center"><span>' + instruments[index] + '</span>' +'<span class="mobile-watchlist-add mr-4" data-instrument="' + instruments[index] + '"><i class="fa fa-plus-circle" aria-hidden="true"></i></span></li>');
                }
            });
        })(i); // Invoke the closure with the current value of i
    }

    $('.mobile-global-resultBox ul').on('click', 'li', function () {
        var instrument = $(this).text();
        var symbol = instrument.split('.')[0];
        onCompanySelect(symbol, instrument)
    });

    $('#instrument').on('keydown autocompleteselect', function (event, ui) {
        if (event.type === 'keydown' && event.keyCode !== 13) { // Ignore keydown events that are not the enter key
            return;
        }

        var instrument = ui ? ui.item.value : '';
        var symbol = instrument.split('.')[0];
        if (instrument === '') {
            return
        }
        onCompanySelect(symbol, instrument)

        var alreadyAppended = false;

        $('.mobile-global-resultBox ul li').each(function () {
            if ($(this).text() === instrument) { // Check if the instrument is already in the list
                alreadyAppended = true;
                return false; // Exit the loop early
            }
        });

        if (!alreadyAppended) { // Only append the instrument if it's not already in the list
            // console.log(instrument);
            $('.mobile-global-resultBox ul').append('<li>' + instrument + '</li>');
            instruments.push(instrument);
            localStorage.setItem(system_username+'_instruments', JSON.stringify(instruments));
        }

        $(this).val('');
        return false;
    });

    $('.mobile-global-resultBox ul').on('click', '.mobile-watchlist-add', function() {
        var instrumentValue = $(this).data('instrument');
        add_to_watchlist(instrumentValue);
    });


}

$('.back-button-global').on('click', function () {
    $(this).css("background-color", "linear-gradient(to left,#26d6e6,#67efb8)");
    document.getElementById('global-top-bar').style.display= 'block'
    $("#main-content").css("padding-top", "48px");
    $('#page-content').load('mobile_home'); // Redirect to home
});


