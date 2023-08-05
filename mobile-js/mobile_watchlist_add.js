$(document).ready(function () {
    global_search();
    getallwatchlist();
});

function global_search() {
    $('#instrument_add').on('keydown autocompleteselect', function (event, ui) {
        if (event.type === 'keydown' && event.keyCode !== 13) { // Ignore keydown events that are not the enter key
            return;
        }

        var instrument = ui ? ui.item.value : '';
        var symbol = instrument.split('.')[0];
        if (instrument === '') {
            return
        }

        var $existingLi = $('.mobile-global-resultBox ul li');
        if ($existingLi.length) { 
            $existingLi.html('<i class="fa fa-check pr-2" aria-hidden="true"></i>' + instrument)
        } else {
            $('.mobile-global-resultBox ul').append('<li><i class="fa fa-check pr-2" aria-hidden="true"></i>' + instrument + '</li>');
        }

        $(this).val('');
        return false;
    });

    $(".mobile-watchlist-add").click(function() {
        var instrumentValue = $(this).data('instrument');
        add_to_watchlist(instrumentValue);
    });
}

function getallwatchlist() {
    $.get("/shared/getallwatchlist/", function (data) {
      $('#all_add_watchlists').html('');
      for (i = 0; i < data.length; i++) {
        $("#all_add_watchlists").append(`
          <li class="row mobile_watchlist_li mt-3 mb-3 pb-3">
                <span align="center" class="col-2 watchtist-checkbox-item" style="display: none;"><input type="checkbox" class="checkbox"/></span>
                <input type="checkbox" class="checkbox"/><span  class="col-10  watch-list font-weight-bold" onclick="load_watchlist('${data[i]}');closeSideDrawer();" value="${data[i]}">${data[i]}</span>
          </li>
        `);
      }

    });
}

var isChecked = true;

document.getElementById('select-add-all').addEventListener('click', function() {
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = isChecked;
    }
    isChecked = !isChecked;
});

$('#add_watchlist').click(function () {
    var item = $('.mobile-global-resultBox ul li').text();
    var watchlists = $('#all_add_watchlists li').find('input:checked');
  
    Array.from(watchlists).forEach(function (element) {
        var name = $(element).closest('li').find('.watch-list').text();
        add_to_multiple_watchlist(item, name);
    });

  $('#page-content').load('portfolio/mobile_watchlist'); // Redirect to watchlist

});





