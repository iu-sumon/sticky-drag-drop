//Top Sectors by Gainer Chart
var topSectorGainerChart = echarts.init(document.getElementById('traded_sectors_by_gainer'), 'null', {
    width: 400,
    height: 290
});

$(document).ready(function() {
    drawSectorGainChart();
    setTimeout(function () {autorefresh_sectorgainchart();}, 5000);
});