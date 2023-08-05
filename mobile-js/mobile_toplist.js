
function get_topgainer(){
	$.get('shared/gettopgainer/', function(data) {
		$("#topgainer_table tbody tr").remove();
		$('#changeperlabel').css("color", "var(--font-color)");
		var stock_table = document.getElementById('topgainer_table').getElementsByTagName('tbody')[0];

		for (i = 0; i < data.length; i++) {

			symbol = data[i].symbol;
			ltp = data[i].ltp;
			ycp = data[i].ycp;
			change = data[i].ltp_change;
			change_per = data[i].ltp_changeper;
			volume = data[i].total_qty;
			value = data[i].total_value;
			trades = data[i].total_trades;
			board = '.PUBLIC';
			symbol_board = symbol + board;

			//Stock Table
			row = stock_table.insertRow();
			row.classList.add("gridtab");
			row.style.textAlign='right';
			
		
			row.insertCell(0).innerHTML = `<div class="bold" onclick="onCompanySelect('${symbol}','${symbol_board}')" data-symbol="${symbol_board}" align="left">${symbol}</div>`;
			row.insertCell(1).innerHTML = '<div class="tab-border-left">'+ltp+'</div>';
			row.insertCell(2).innerHTML = '<div class="tab-border-left up">'+change+'</div>';
			row.insertCell(3).innerHTML = '<div class="tab-border-left up">'+change_per+'</div>';
		}
	
	});
}


function get_toploser(){
	$.get('shared/gettoploser/', function(data) {
		
		$("#toploser_table tbody tr").remove(); 
		$('#changeperlabel').css("color", "var(--font-color)");
		var stock_table = document.getElementById('toploser_table').getElementsByTagName('tbody')[0];

		
		for (i = 0; i < data.length; i++) {

			symbol = data[i].symbol;
			ltp = data[i].ltp;
			ycp = data[i].ycp;
			change = data[i].ltp_change;
			change_per = data[i].ltp_changeper;
			volume = data[i].total_qty;
			value = data[i].total_value;
			trades = data[i].total_trades;
			board = '.PUBLIC';
			symbol_board = symbol + board;

			//Stock Table
			row = stock_table.insertRow();
			row.classList.add("gridtab");
			row.style.textAlign='right';
			
			row.insertCell(0).innerHTML = `<div class="bold" onclick="onCompanySelect('${symbol}','${symbol_board}')" data-symbol="${symbol_board}" align="left">${symbol}</div>`;
			row.insertCell(1).innerHTML = '<div class="tab-border-left">'+ltp+'</div>';
			row.insertCell(2).innerHTML = '<div class="tab-border-left down">'+change+'</div>';
			row.insertCell(3).innerHTML = '<div class="tab-border-left down">'+change_per+'</div>';
			
		}
	});
}


function get_toptrade(){
	$.get('shared/gettoptrade/', function(data) {
		
		var color_array = ['#36ff40','#36ff40',
		'#6bfa2c','#6bfa2c',
		'#8bf416','#8bf416',
		'#a4ee00','#a4ee00',
		'#b9e800','#b9e800',
		'#cbe200','#cbe200',
		'#dbdb00','#dbdb00',
		'#e9d506','#e9d506',
		'#f5ce1c','#f5ce1c',
		'#ffc82c','#ffc82c'];

		$("#toptrade_table tbody tr").remove(); 
		$('#tradelabel').css("color", "var(--font-color)");
		$('#changeperlabel').css("color", "var(--font-color)");
		var stock_table = document.getElementById('toptrade_table').getElementsByTagName('tbody')[0];

		for (i = 0; i < data.length; i++) {
			symbol = data[i].symbol;
			ltp = data[i].ltp;
			ycp = data[i].ycp;
			change = data[i].ltp_change;
			change_per = data[i].ltp_changeper;
			volume = data[i].total_qty;
			value = data[i].total_value;
			trades = data[i].total_trades;
			board = '.PUBLIC';
			symbol_board = symbol + board;

			//Stock Table
			row = stock_table.insertRow();
			row.classList.add("gridtab");
			row.style.textAlign='right';
			
			row.insertCell(0).innerHTML = `<div class="bold" onclick="onCompanySelect('${symbol}','${symbol_board}')" data-symbol="${symbol_board}" align="left">${symbol}</div>`;
			row.insertCell(1).innerHTML = '<div class="tab-border-left">'+ltp+'</div>';
			if(change >= 0){
			row.insertCell(2).innerHTML = '<div class="tab-border-left up">'+change_per+'</div>';
			}
			if(change < 0){
			row.insertCell(2).innerHTML = '<div class="tab-border-left down">'+change_per+'</div>';
			}
			row.insertCell(3).innerHTML = '<div class="tab-border-left" style="color: '+color_array[i]+';">'+Number(trades).toLocaleString("en-IN")+'</div>';
		}
			
		
	});
}
function get_topvalue(){
	$.get('shared/gettopvalue/', function(data) {
		
		var color_array = ['#36ff40','#36ff40',
		'#6bfa2c','#6bfa2c',
		'#8bf416','#8bf416',
		'#a4ee00','#a4ee00',
		'#b9e800','#b9e800',
		'#cbe200','#cbe200',
		'#dbdb00','#dbdb00',
		'#e9d506','#e9d506',
		'#f5ce1c','#f5ce1c',
		'#ffc82c','#ffc82c'];

		$("#topvalue_table tbody tr").remove(); 
		$('#valuelabel').css("color", "var(--font-color)");
		$('#changeperlabel').css("color", "var(--font-color)");
		var stock_table = document.getElementById('topvalue_table').getElementsByTagName('tbody')[0];

		for (i = 0; i < data.length; i++) {
			symbol = data[i].symbol;
			ltp = data[i].ltp;
			ycp = data[i].ycp;
			change = data[i].ltp_change;
			change_per = data[i].ltp_changeper;
			volume = data[i].total_qty;
			value = data[i].total_value;
			trades = data[i].total_trades;
			board = '.PUBLIC';
			symbol_board = symbol + board;

			if (value > 10000000){
				value = value/10000000;
				value = Number(value).toLocaleString('en-IN')+' cr';
			} else {
				value = Number(value).toLocaleString('en-IN');
			}

			//Stock Table
			row = stock_table.insertRow();
			row.classList.add("gridtab");
			row.style.textAlign='right';
			
			row.insertCell(0).innerHTML = `<div class="bold" onclick="onCompanySelect('${symbol}','${symbol_board}')" data-symbol="${symbol_board}" align="left">${symbol}</div>`;
			row.insertCell(1).innerHTML = '<div class="tab-border-left">'+ltp+'</div>';
			if(change >= 0){
			row.insertCell(2).innerHTML = '<div class="tab-border-left up">'+change_per+'</div>';
			}
			if(change < 0){
			row.insertCell(2).innerHTML = '<div class="tab-border-left down">'+change_per+'</div>';
			}
			row.insertCell(3).innerHTML = '<div class="tab-border-left" style="color: '+color_array[i]+';">'+value+'</div>';
			
		}
			
		
	});
}
function get_topvolume(){
	$.get('shared/gettopvolume/', function(data) {
		
		var color_array = ['#36ff40','#36ff40',
		'#6bfa2c','#6bfa2c',
		'#8bf416','#8bf416',
		'#a4ee00','#a4ee00',
		'#b9e800','#b9e800',
		'#cbe200','#cbe200',
		'#dbdb00','#dbdb00',
		'#e9d506','#e9d506',
		'#f5ce1c','#f5ce1c',
		'#ffc82c','#ffc82c'];

		$("#topvolume_table tbody tr").remove(); 
		$('#volumelabel').css("color", "var(--font-color)");
		$('#changeperlabel').css("color", "var(--font-color)");
		var stock_table = document.getElementById('topvolume_table').getElementsByTagName('tbody')[0];

		for (i = 0; i < data.length; i++) {
			symbol = data[i].symbol;
			ltp = data[i].ltp;
			ycp = data[i].ycp;
			change = data[i].ltp_change;
			change_per = data[i].ltp_changeper;
			volume = data[i].total_qty;
			value = data[i].total_value;
			trades = data[i].total_trades;
			board = '.PUBLIC';
			symbol_board = symbol + board;

			//Stock Table
			row = stock_table.insertRow();
			row.classList.add("gridtab");
			row.style.textAlign='right';
			
			row.insertCell(0).innerHTML = `<div class="bold" onclick="onCompanySelect('${symbol}','${symbol_board}')" data-symbol="${symbol_board}" align="left">${symbol}</div>`;
			row.insertCell(1).innerHTML = '<div class="tab-border-left">'+ltp+'</div>';
			if(change >= 0){
			row.insertCell(2).innerHTML = '<div class="tab-border-left up">'+change_per+'</div>';
			}
			if(change < 0){
			row.insertCell(2).innerHTML = '<div class="tab-border-left down">'+change_per+'</div>';
			}
			row.insertCell(3).innerHTML = '<div class="tab-border-left" style="color: '+color_array[i]+';">'+Number(volume).toLocaleString("en-IN")+'</div>';
			
		}
			
	});
}

function autorefresh_toplist(){
	//Auto Refresh Data
	if(topgainer_interval != null)clearInterval(topgainer_interval);
	if(toploser_interval != null)clearInterval(topgainer_interval);
	if(toptrade_interval != null)clearInterval(topgainer_interval);
	if(topvalue_interval != null)clearInterval(topgainer_interval);
	if(topvolume_interval != null)clearInterval(topgainer_interval);
	
	if(itch_market_status == 'OPEN'){
		topgainer_interval = setInterval(function () {get_topgainer();}, update_interval_sec*1000);
		toploser_interval = setInterval(function () {get_toploser();}, update_interval_sec*1000);
		toptrade_interval = setInterval(function () {get_toptrade();}, update_interval_sec*1000);
		topvalue_interval = setInterval(function () {get_topvalue();}, update_interval_sec*1000);
		topvolume_interval = setInterval(function () {get_topvolume();}, update_interval_sec*1000);
	}
}	


