// $(document).ready(function() {
//     get_mobile_corporate_events();
// });

function get_mobile_corporate_events(date){
    var url = '/mobile_home/get_mobile_corp_events/?date=' + date;
    var actual_color = '';
    var impact_color = '';
    var mobile_economic_table = document.getElementById('mobile_economic_table').getElementsByTagName('tbody')[0];
    $.getJSON(url, function (data) {
        $("#mobile_economic_table tbody tr").remove(); 
        data.forEach(function(item, index, arr) {
            row = mobile_economic_table.insertRow();
            row.classList.add("gridtab");
            row.style.textAlign='left';
            row.insertCell(0).innerHTML = '<div class="tab-border-left">'+item.symbol+'</div>';
            impact_color = '';
            if (item.impact.toLowerCase() == 'high'){
                impact_color = 'text-danger';
            }
            else if (item.impact.toLowerCase() == 'medium'){
                impact_color = 'text-warning';
            }
            else if (item.impact.toLowerCase() == 'low'){
                impact_color = 'text-success';
            }
            else{
                impact_color = '';
            }
    
            actual = item.actual || '-';
            forecast = item.forecast || '-';
            previous = item.previous || '-';
            actual_color = getProperCSS(item.actual, item.previous);

            row.insertCell(1).innerHTML = '<div class="tab-border-left bold ' + impact_color + '" title="' + item.impact.toUpperCase() + ' Impact"><i class="fa fa-industry"></i></div>';
            row.insertCell(2).innerHTML = '<div class="tab-border-left">' + item.title + '</div>';
            row.insertCell(3).innerHTML = '<div class="tab-border-left bold ' + actual_color + '">' + actual + '</div>';
            // row.insertCell(4).innerHTML = '<div class="tab-border-left">' + forecast + '</div>';
            row.insertCell(4).innerHTML = '<div class="tab-border-left">' + previous + '</div>';
        });
    });
}

function getProperCSS(actual, previous) {
    try {
        actual_color = '';
        if (actual != null && previous != null) {
            act = actual.replace('%C', '');
            prev = previous.replace('%C', '');

            if (act != '-' && prev == '-') {
                prev = '0.0';
            }

            if (parseFloat(act) > parseFloat(prev)) {
                actual_color = 'text-success';
            }
            else if (parseFloat(act) < parseFloat(prev)) {
                actual_color = 'text-danger';
            } else {
                actual_color = '';
            }
        }
        return actual_color;
    }
    catch {
        return '';
    }
}

$('.backToMarkets').on('click', function () {
    $('#page-content').load('mobile_home');
});