// Initialize Invested Sector Chart on Div
var InvestedSectorChart = echarts.init(document.getElementById('traded_sectors'), 'null', {
    width: 350,
    height: 400
});


$(document).ready(function() {
    drawInvestedSector();
    setTimeout(function () {autorefresh_investedsector();}, 5000);
});