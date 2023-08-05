// Check or Uncheck All checkboxes
var isChecked = true;

document.getElementById('select-all').addEventListener('click', function() {
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = isChecked;
    }
    isChecked = !isChecked;
    checkSelected();
  });

function checkSelected() {
  var itemsSelected = $("#watchlist-delete li input[type='checkbox']:checked").length;
  document.getElementById("selected").innerHTML = itemsSelected + " selected";
}

$('#remove').click(function () {
  var items = $('#watchlist-delete li').find('input:checked');

  $.each(items, function (index, value) {
    var symbol = $(this).closest('li').data('symbol');
    remove_from_watchlist(symbol);
  });

  items.closest('li').remove();
  $("#checkall").prop("checked", false);
  checkSelected();
});

$('.back-button-remove-watchlist').on('click', function () {
  $(this).css("background-color", "linear-gradient(to left,#26d6e6,#67efb8)");
  $('#page-content').load('portfolio/mobile_watchlist'); // Redirect to watchlist
});
