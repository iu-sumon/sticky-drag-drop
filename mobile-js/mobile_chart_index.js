


//INDEX Chart buttons
$(document).ready(function() {
    show_mobile_index_tab();
});

$(document).on('click', '.indextab', function (e) {
    e.preventDefault();
    var borderclass = $(this).data('borderclass');
    var indexname = $(this).data('indexname');
    
    $('.indextab').removeClass().addClass('indextab');
    $(this).removeClass('').addClass('indextab active_index '+borderclass);
   
    reinit_index_chart(indexname+'.INDEX');
});

function show_mobile_index_tab(){
    
    // Show Index Values on Left Side
    $.getJSON("shared/getindexvalue/", {xcg:'DSE'}, function (data) {
    $('#index_list').html('');
    // DEV TODO - Only Show first 4 indexes. Need to change style to support all indexes.
    for (x=0; x < 4; x++){
        var color_class = '';
        var arrow_class = '';
        var border_class = '';
        var pos_neg = '';
        var border_color = '#006eff';

        if (data[x].index_change == null) data[x].index_change = 0;
        if (data[x].index_changeper == null) data[x].index_changeper = 0;

        if(data[x].index_change > 0){
            color_class = 'up';
            arrow_class = 'fa fa-arrow-up';
            border_class = 'uptab';
            pos_neg = '+';
        }
        if(data[x].index_change == 0){
            color_class = 'neutral';
            arrow_class = '';
            border_class = 'nctab';
            pos_neg = '';
        }
        if(data[x].index_change < 0){
            color_class = 'down';
            arrow_class = 'fa fa-arrow-down';
            border_class = 'downtab';
            pos_neg = '';
        }
        if (x == 0){
            active_tab = 'active_index'+' '+border_class;
            $('.chart_tab').hide();
            // $('#'+data[x].index_name.toLowerCase()+'charttab').show();
        } else {
            active_tab = '';
        }
        
        if (data[x].index_name == 'DSEX') border_color = '#006eff';
        if (data[x].index_name == 'DSES') border_color = '#00bfb6';
        if (data[x].index_name == 'DS30') border_color = '#cd03ff';
        if (data[x].index_name == 'CDSET') border_color = '#ffd900';

        $('#index_list').append(`
            <td id="${data[x].index_name}_tab" style="border-left-color:${border_color}; border-left-style: solid; border-left-width: 4px;" data-indexname="${data[x].index_name}" data-borderclass="${border_class}" class="indextab ${active_tab}">
                <div class="idxinfo" style="font-size: 1rem;"><b>${data[x].index_name}</b></div>
                <div class="idxinfo ${data[x].index_name}_value">${data[x].index_value.toFixed(2)}</div>
                <div class="idxinfo">
                    <span class="${data[x].index_name}_chg ${color_class}">
                        ${pos_neg}${data[x].index_change.toFixed(2)}
                    </span>
                    <span class="${data[x].index_name}_chgper ${color_class}">
                        (${pos_neg}${data[x].index_changeper.toFixed(2)}%)
                    </span>
                    <i class="${data[x].index_name}_arrow ${color_class} ${arrow_class}"></i>
                </div>
            </td>
            `);
    }

    
});

}

function draw_adv_dec_chart(data_dse) {
    var font_color = getComputedStyle(document.documentElement).getPropertyValue('--font-muted');
    var grid_color = getComputedStyle(document.documentElement).getPropertyValue('--chart-grid-color');
    var bg_color = getComputedStyle(document.documentElement).getPropertyValue('--chart-bg-color');
    
    var options2 = {
        series: [{
        data: data_dse
        }],
        chart: {
        animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
            enabled: true,
            delay: 150
        },
        dynamicAnimation: {
            enabled: true,
            speed: 350
        }
        },
        type: 'bar',
        height: 250,
        stacked: false,
        toolbar: {
        show: false,
        },
        zoom: {
        enabled: false
        },
    },
    tooltip: {
        enabled: false,
        onDatasetHover: {
        highlightDataSeries: false,
        },
    },
    responsive: [{
        breakpoint: 480,
        options: {
        legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0
        }
        }
    }],
    plotOptions: {
        bar: {
        horizontal: false,
        distributed: true,
        dataLabels:{position: 'top'},
        columnWidth: '45%',

        },
    },
    dataLabels: {
        style: {
        colors: ['#C43627','#C43627','#C43627','#C43627','#C43627','#9CA1B5','#009D64','#009D64','#009D64','#009D64','#009D64']
        },
        offsetY: -20,
    },
    yaxis: {
        show: false,
        labels: {
        show: false,
        style: {
            colors: font_color
        },
        },
        title: {
        text: 'ISSUES TRADED',
        rotate: 90,
        offsetX: 0,
        offsetY: 0,
        style: {
            color: font_color,
            fontWeight: 'bold',
            cssClass: 'apexcharts-yaxis-title',
        },
        },
    },
    xaxis: {
        type: 'category',
        categories: ['<-10%','-10-7%','-7-5%','-5-2%','-2-0%','0','0-2%','2-5%','5-7%','7-10%','>10%'],
        labels: {
            show: true,
            style: {
            colors:  font_color,
            fontWeight:  'bold',
            },
        },
    },
    colors: ['#C43627','#C43627','#C43627','#C43627','#C43627','#9CA1B5','#009D64','#009D64','#009D64','#009D64','#009D64'],
    legend: {
        show: false,
        labels: {
        colors: font_color
        },
        position: 'bottom',
        itemMargin: {
        horizontal: 5,
        vertical: 15
        },
    },
    fill: {
        opacity: 1
    },
    grid: {
        show: false,
    }
    };

    var chart2 = new ApexCharts(document.querySelector("#marketstat"), options2);
    chart2.render();

}


function show_sector_stats(posval,negval,nutval,divname,optionnum,chartnum){
    var font_color = getComputedStyle(document.documentElement).getPropertyValue('--font-muted');
    optionnum = {
        series: [{
        data: [negval]
        },{
        data: [nutval]
        },{
        data: [posval]
        }],
        chart: {
        animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
            enabled: true,
            delay: 150
        },
        dynamicAnimation: {
            enabled: true,
            speed: 350
        }
        },
        type: 'bar',
        height: 80,
        width: '100%',
        stacked: true,
        stackType: '100',
        toolbar: {
        show: false,
        },
        zoom: {
        enabled: false
        },
    },
    tooltip: {
        enabled: false,
        onDatasetHover: {
        highlightDataSeries: false,
        },
    },
    plotOptions: {
        bar: {
        horizontal: true,
        distributed: false,
        dataLabels:{position: 'middle'},
        barHeight: '25%',

        },
    },
    dataLabels: {
        enabled: true,
        style: {
        colors: ['#C43627','#9CA1B5','#009D64']
        },
        offsetY: 20,
    },
    yaxis: {
        show: false,
        labels: {
        show: false,
        style: {
            colors: font_color
        },
        },
        axisBorder: {
        show: false,
        color: '#78909C',
        offsetX: 0,
        offsetY: 0
        },
        axisTicks: {
        show: false,
        },
    },
    xaxis: {
        type: 'category',
        categories: ['declined','neutral','advanced'],
        labels: {
            show: false,
            style: {
            colors:  font_color,
            fontWeight:  'bold',
            },
        },
        axisBorder: {
            show: false,
            color: '#78909C',
            offsetX: 0,
            offsetY: 0
        },
        axisTicks: {
            show: false,
        },
    },
    colors: ['#C43627','#9CA1B5','#009D64'],
    legend: {
        show: false,
        labels: {
        colors: font_color
        },
        position: 'bottom',
        itemMargin: {
        horizontal: 5,
        vertical: 15
        },
    },
    fill: {
        opacity: 1
    },
    grid: {
        show: false,
        
    }
    };

    var chartnum = new ApexCharts(document.querySelector("#"+divname), optionnum);
    chartnum.render();
}

