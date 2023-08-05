var colors = ["#5470C6", "#91CC75"];
var symbolSize = 10;
var mobile_stock_exchange, mobile_stock_board, mobile_stock_option, mobile_stock_sector;

$(document).ready(() => {

	//console.log('DOC READY!!!');
	mobile_stock_exchange = { value: 'DSE' }; //document.getElementById("stock_exchange");
	mobile_stock_board = document.getElementById("mobile_home_stock_board");
	mobile_stock_option = document.getElementById("mobile_home_stock_option");
	mobile_stock_sector = document.getElementById("mobile_home_select_sector");
	//mobile_stock_exchange.addEventListener("change", setTreeMapData);
	//console.log('TreeMap: ', mobile_stock_exchange, mobile_stock_board, mobile_stock_option, mobile_stock_sector);
	if (mobile_stock_board !== null && typeof mobile_stock_board !== "undefined") {
		mobile_stock_board.addEventListener("change", function () {
			localStorage.setItem('selectedBoard', mobile_stock_board.value);
			setTreeMapData(localStorage.getItem('selectedSector'));
		});
		var selectedBoard = localStorage.getItem('selectedBoard');
		if (selectedBoard) {
			mobile_stock_board.value = selectedBoard;
		}
	}
	if (mobile_stock_option !== null && typeof mobile_stock_option !== "undefined") {
		mobile_stock_option.addEventListener("change", function () {
			localStorage.setItem('selectedOption', mobile_stock_option.value);
			setTreeMapData(localStorage.getItem('selectedSector'));
		});
		var selectedOption = localStorage.getItem('selectedOption');
		if (selectedOption) {
			mobile_stock_option.value = selectedOption;
		}
	}
	if (mobile_stock_sector !== null && typeof mobile_stock_sector !== "undefined") {
		mobile_stock_sector.addEventListener("change", function () {
			// set event value to localStorage for next page load
			localStorage.setItem('selectedSector', mobile_stock_sector.value);
			setTreeMapData(localStorage.getItem('selectedSector'));
		});
	}

	// Initial deafulat treemap load
	setTreeMapData(localStorage.getItem('selectedSector') || '');
	if(treemap_interval != null)clearInterval(treemap_interval);
	if(itch_market_status == 'OPEN'){
		treemap_interval = setInterval(function () {setTreeMapData(localStorage.getItem('selectedSector') || '');}, 5000);
	}

	addSectorToDOM(localStorage.getItem('selectedSector'));
});

	// analystRating
	// var analystRatingOption = {
	// 	color: colors,
	// 	backgroundColor: 'rgba(255, 255, 255, 0)',
	// 	tooltip: {
	// 		trigger: "axis",
	// 		axisPointer: {
	// 			type: "cross",
	// 		},
	// 	},
	// 	grid: {
	// 		right: "20%",
	// 	},
	// 	legend: {
	// 		data: ["Analyst Rating"],
	// 		textStyle: {
	// 			color: "#808080"
	// 		}
	// 	},
	// 	xAxis: {
	// 		type: "category",
	// 		axisLabel: {
	// 			textStyle: {
	// 				color: "#808080"
	// 			}
	// 		},
	// 		axisTick: {
	// 			alignWithLabel: true,
	// 		},
	// 		show: true,
	// 		alignTicks: true,
	// 		axisLine: {
	// 			show: true,
	// 			lineStyle: {
	// 				color: colors[0],
	// 			},
	// 		},
	// 		data: ["Strong Buy", "Buy", "Hold", "Underperform", "Sell"],
	// 	},
	// 	yAxis: [
	// 		{
	// 			show: false,
	// 			alignTicks: true,
	// 			axisLine: {
	// 				show: true,
	// 				lineStyle: {
	// 					color: colors[0],
	// 				},
	// 			},
	// 		},

	// 	],
	// 	series: [
	// 		{
	// 			name: "Analyst Rating",
	// 			type: "bar",
	// 			barWidth: "60%",
	// 			label: {
	// 				show: true,
	// 				position: 'top',
	// 				color: '#808080'
	// 			},
	// 			data: [58.33, 41.67, 0.0, 0.0, 0.0],
	// 		},
	// 	],
	// };

	// var analystRatingDiv = document.getElementById("analystRating");
	// if (analystRatingDiv !== null && typeof analystRatingDiv !== "undefined") {
	// 	var analystRating = echarts.init(analystRatingDiv);		
	// 	analystRating.setOption(analystRatingOption);
	// }

	// analystBar
	// var analystBarOption = {
	// 	color: colors,
	// 	backgroundColor: 'rgba(255, 255, 255, 0)',
	// 	tooltip: {
	// 		trigger: "axis",
	// 		axisPointer: {
	// 			type: "cross",
	// 		},
	// 	},
	// 	grid: {
	// 		right: "20%",
	// 	},
	// 	legend: {
	// 		data: ["Analyst Rating"],
	// 		textStyle: {
	// 			color: "#808080"
	// 		}
	// 	},
	// 	xAxis: [
	// 		{
	// 			show: false,
	// 			alignTicks: true,
	// 			axisLine: {
	// 				show: true,
	// 				lineStyle: {
	// 					color: colors[0],
	// 				},
	// 			},
	// 		},

	// 	],
	// 	yAxis: {
	// 		type: "category",
	// 		axisLabel: {
	// 			textStyle: {
	// 				color: "#808080"
	// 			}
	// 		},
	// 		axisLine: {
	// 			show: true,
	// 			lineStyle: {
	// 				color: colors[1],
	// 			},
	// 		},
	// 		axisTick: {
	// 			alignWithLabel: true,
	// 		},
	// 		show: true,
	// 		alignTicks: true,
	// 		// axisLine: {
	// 		// show: true,
	// 		// lineStyle: {
	// 		//       color: colors[0],
	// 		//     },
	// 		//   },
	// 		data: ["High", "Average", "Low"],
	// 	},

	// 	series: [
	// 		{
	// 			name: "Analyst Rating",
	// 			type: "bar",
	// 			barWidth: "40%",
	// 			markLine: {
	// 				label: {
	// 					show: true,
	// 					color: "#808080"
	// 				},
	// 				data: [
	// 					{
	// 						type: "average",
	// 						name: "Average",
	// 						position: "bottom",
	// 					},
	// 				],
	// 			},
	// 			label: {
	// 				show: true,
	// 				position: "right",
	// 				color: '#808080'
	// 			},
	// 			data: [3900.0, 3372.67, 3150.0],
	// 		},
	// 	],
	// };

	// var analystBarDiv = document.getElementById("analystBar");
	// if (analystBarDiv !== null && typeof analystBarDiv !== "undefined") {
	// 	var analystBar = echarts.init(analystBarDiv);		
	// 	analystBar.setOption(analystBarOption);
	// }

	//  overFlowDistributionPie
	var overFlowDistributionPieOption = {
		backgroundColor: 'rgba(255, 255, 255, 0)',
		tooltip: {
			trigger: "item",
			formatter: "{a} <br/>{b}: {c} ({d}%)",
		},
		series: [
			{
				name: "Orders",
				type: "pie",
				radius: ["40%", "70%"],
				avoidLabelOverlap: false,
				label: {
					show: false,
					position: "center",
					color: '#808080'
				},
				emphasis: {
					label: {
						show: true,
						// fontSize: '40',
						fontWeight: "bold",
					},
				},
				labelLine: {
					show: false,
				},
				data: [
					{
						value: 1048,
						name: "InFlow Large",
					},
					{
						value: 735,
						name: "InFlow Medium",
					},
					{
						value: 580,
						name: "InFlow Small",
					},
					{
						value: 1048,
						name: "OutFlow Large",
					},
					{
						value: 735,
						name: "OutFlow Medium",
					},
					{
						value: 580,
						name: "OutFlow Small",
					},
				],
			},
		],
	};

	var overFlowDistributionPieDiv = document.getElementById("overFlowDistributionPie");
	if (overFlowDistributionPieDiv !== null && typeof overFlowDistributionPieDiv !== "undefined") {
		var overFlowDistributionPie = echarts.init(overFlowDistributionPieDiv);
		overFlowDistributionPie.setOption(overFlowDistributionPieOption);
	}

	//  overFlowDistributionOrders
	var labelTop = {
		position: "top",
	};
	var overFlowDistributionOrdersOption = {
		backgroundColor: 'rgba(255, 255, 255, 0)',
		tooltip: {
			trigger: "axis",
			axisPointer: {
				type: "shadow",
			},
			formatter: params => {
				var tar;
				if (params[1].value !== "-") {
					tar = params[1];
				} else {
					tar = params[0];
				}
				return tar.name + "<br/>" + tar.seriesName + " : " + tar.value;
			},
		},
		legend: {
			data: ["Buy", "Sell"],
			textStyle: {
				color: "#808080"
			}
		},
		grid: {
			left: "3%",
			right: "4%",
			bottom: "5%",
			containLabel: true,
		},
		xAxis: {
			type: "category",
			axisLabel: {
				textStyle: {
					color: "#808080"
				}
			},
			data: ["04/14", "04/18", "04/19", "04/20", "04/21"],
		},
		yAxis: {
			type: "value",
			show: false,
		},
		series: [
			{
				name: "Placeholder",
				type: "bar",
				stack: "Total",
				itemStyle: {
					borderColor: "transparent",
					color: "transparent",
				},
				emphasis: {
					itemStyle: {
						borderColor: "transparent",
						color: "transparent",
					},
				},
				// data: [0, 900, 1245, 1530, 1376]
			},
			{
				name: "Buy",
				type: "bar",
				stack: "Total",
				label: {
					show: true,
					position: "top",
					color: "#808080"
				},
				data: [124, "-", 345, "-", 206],
			},
			{
				name: "Sell",
				type: "bar",
				stack: "Total",
				label: {
					show: true,
					position: "bottom",
					color: "#808080"
				},
				data: ["-", -111, "-", -188, "-"],
			},
		],
	};

	var overFlowDistributionOrdersDiv = document.getElementById("overFlowDistributionOrders");
	if (overFlowDistributionOrdersDiv !== null && typeof overFlowDistributionOrdersDiv !== "undefined") {
		var overFlowDistributionOrders = echarts.init(overFlowDistributionOrdersDiv);
		overFlowDistributionOrders.setOption(overFlowDistributionOrdersOption);
	}

	// market-depth-bar
	var marketDepthBarOption = {
		grid: {
			left: 10,
			right: 5,
			width: "90%",
			height: "50%",
			top: 1,
			bottom: 1,
			containLabel: false
		},

		xAxis: {
			type: 'value',
			splitLine: {
				show: false,
			},
			axisLabel: {
				show: false
			}
		},
		yAxis: {
			type: 'category',
			axisLabel: {
				show: false
			},
			axisTick: {
				show: false
			},
			splitLine: {
				show: false,
			},
			axisLine: {
				show: false
			}
		},
		series: [
			{
				name: 'BID Quantity',
				type: 'bar',
				stack: 'total',
				color: '#0CAF82',
				barWidth: '40%',
				itemStyle: {
					emphasis: {
						barBorderRadius: [20]
					},
					normal: {
						barBorderRadius: [20, 20, 20, 20]
					}
				},
				label: {
					show: false
				},
				emphasis: {
					focus: 'series'
				},
				data: [50]
			},
			{
				name: 'ASK Quantity',
				type: 'bar',
				stack: 'total',
				color: '#FE3957',
				barWidth: '40%',
				itemStyle: {
					emphasis: {
						barBorderRadius: [20]
					},
					normal: {
						barBorderRadius: [20, 20, 20, 20]
					}
				},
				label: {
					show: false
				},
				emphasis: {
					focus: 'series'
				},
				data: [50]
			}
		]
	}

	var marketDepthBarDiv = document.getElementById("market-depth-bar");
	if (marketDepthBarDiv !== null && typeof marketDepthBarDiv !== "undefined") {
		var marketDepthBar = echarts.init(marketDepthBarDiv);		
		marketDepthBar.setOption(marketDepthBarOption);
	}

	//  holdings-bar
	var holdingsBarOption = {
		backgroundColor: 'rgba(255, 255, 255, 0)',
		tooltip: {
			trigger: "axis",
			axisPointer: {
				// Use axis to trigger tooltip
				type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
			},
		},
		legend: {
			textStyle: {
				color: "#808080"
			}
		},
		dataset: {
			source: [],
		},
		grid: {
			top: "10%",
			left: "3%",
			right: "4%",
			bottom: "52%",
			containLabel: true,
		},
		xAxis: {
			gridIndex: 0,
			axisLabel: {
				textStyle: {
					color: "#808080"
				}
			},
			splitLine: {
				show: true,
				lineStyle: {
					color: [
						"rgba(170,170,170,0.15)"
					]
				}
			},
			// type: 'value'
		},
		yAxis: {
			type: "category",
			axisLabel: {
				textStyle: {
					color: "#808080"
				}
			}
		},
		series: [
			{
				name: 'Sponsor/Director',
				type: "bar",
				stack: "total",
				seriesLayoutBy: "row",
				label: {
					show: true,
					color: "#808080"
				},
				emphasis: {
					focus: "series",
				},
				itemStyle: {
					borderColor: "transparent",
					color: "#0ba68a",
				},
				// data: [320, 302, 301, 334, 390, 330, 320, 301, 334, 390, 330, 320]
			},
			{
				name: 'Govt',
				type: "bar",
				stack: "total",
				seriesLayoutBy: "row",
				label: {
					show: true,
					color: "#808080"
				},
				emphasis: {
					focus: "series",
				},
				itemStyle: {
					borderColor: "transparent",
					color: "#6C0BA9",
				},
				// data: [120, 132, 101, 134, 90, 230, 210, 301, 334, 390, 330, 320]
			},
			{
				name: 'Institute',
				type: "bar",
				stack: "total",
				seriesLayoutBy: "row",
				label: {
					show: true,
					color: "#808080"
				},
				emphasis: {
					focus: "series",
				},
				// data: [220, 182, 191, 234, 290, 330, 310, 301, 334, 390, 330, 320]
			},
			{
				name: 'Foreign',
				type: "bar",
				stack: "total",
				seriesLayoutBy: "row",
				label: {
					show: true,
					color: "#808080"
				},
				emphasis: {
					focus: "series",
				},
				itemStyle: {
					borderColor: "transparent",
					color: "#ffbc00",
				},
				// data: [150, 212, 201, 154, 190, 330, 410, 301, 334, 390, 330, 320]
			},
			{
				name: 'Public',
				type: "bar",
				stack: "total",
				seriesLayoutBy: "row",
				label: {
					show: true,
					color: "#808080"
				},
				emphasis: {
					focus: "series",
				},
				itemStyle: {
					borderColor: "transparent",
					color: "#fa3364",
				},
				// data: [820, 832, 901, 934, 1290, 1330, 1320, 301, 334, 390, 330, 320]
			},
		],
	};

	var holdingsBarDiv = document.getElementById("holdings-bar");
	if (holdingsBarDiv !== null && typeof holdingsBarDiv !== "undefined") {
		var holdingsBar = echarts.init(holdingsBarDiv);		
		holdingsBar.setOption(holdingsBarOption);
		holdingsBar.setOption({
			series: {
				type: "pie",
				id: "pie",
				radius: "30%",
				center: ["50%", "65%"],
				color: ["#0ba68a", "#6C0BA9", '#5c7bd9', "#ffbc00", "#fa3364"],
				emphasis: {
					focus: "self",
				},
				label: {
					formatter: "{b}: {@[" + 1 + "]} ({d}%)",
					color: "#808080"
				},
				encode: {
					itemName: "product",
					value: 1,
					tooltip: 1,
				},
			},
		});	
		holdingsBar.on("updateAxisPointer", event => {
			var xAxisInfo = event.axesInfo[0];
			if (xAxisInfo) {
				var dimension = xAxisInfo.value;
				holdingsBar.setOption({
					series: {
						type: "pie",
						id: "pie",
						radius: "30%",
						center: ["50%", "65%"],
						emphasis: {
							focus: "self",
						},
						label: {
							formatter: "{b}: {@[" + dimension + "]} ({d}%)",
							color: "#808080"
						},
						encode: {
							itemName: "product",
							value: dimension,
							tooltip: dimension,
						},
					},
				});
			}
		});
	}

	//  financial-quarter
	var financialChartOption = {
		color: colors,
		backgroundColor: 'rgba(255, 255, 255, 0)',
		tooltip: {},
		dataZoom: [{
			type: 'inside',
			start: 0,
			preventDefaultMouseMove: false
			// zoomOnMouseWheel: false
		}],
		legend: {
			data: [],
			textStyle: {
				color: "#808080"
			}
		},
		xAxis: {
			axisLabel: {
				textStyle: {
					color: "#808080"
				}
			},
			data: [],
		},
		yAxis: {
			axisLabel: {
				textStyle: {
					color: "#808080"
				}
			},
			splitLine: {
				show: true,
				lineStyle: {
					color: [
						"rgba(170,170,170,0.15)"
					]
				}
			},
			// show: false,
		},
		series: [
			{
				name: "",
				type: "bar",
				barWidth: "20px",
				itemStyle: {
					normal: {}
				},
				data: [], // 15.29, 19.26, 20.99, 27.69
			},
			{
				name: "YoY {%}",
				type: "line",
				symbolSize: symbolSize,
				symbol: "circle",
				data: [], // 15.88, 19.29, 23.47, 27.10
			},
		],
	};

	var financialChartDiv = document.getElementById("financial-quarter-eps");
	if (financialChartDiv !== null && typeof financialChartDiv !== "undefined") {
		var financialChart = echarts.init(financialChartDiv);		
	}

	// Dividends Chart
	var DividendsChartOption = {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				// Use axis to trigger tooltip
				type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
			}
		},
		legend: {
			textStyle: {
				color: "#808080"
			}
		},
		grid: {
			left: '1%',
			right: '14%',
			bottom: '13%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			data: ['2015', '2016', '2017', '2018', '2019', '2020', '2021']
		},
		yAxis: {
			type: 'value',
			show: false

		},
		series: [
			{
				name: 'Cash',
				// color: "#0CAF82",
				type: 'bar',
				stack: 'total',
				label: {
					show: true,
					rotate: 90,
					color: '#000',
					fontSize: 9,
					fontWeight: '700',
					formatter: function (params) {
						// console.log(params)
						var arr = [
							params.seriesName.slice(0, 1),
							params.value +
							'%'

						];
						return arr.join('\n');
					}
				},
				emphasis: {
					focus: 'series'
				},
				data: [20, 30, 31, 34, 90, 30, 32]
			},
			{
				name: 'Stock',
				// color: "#FE3957",
				type: 'bar',
				stack: 'total',
				label: {
					show: true,
					rotate: 90,
					color: '#000',
					fontSize: 9,
					fontWeight: '700',
					formatter: function (params) {
						// console.log(params)
						var arr = [
							params.seriesName.slice(0, 1),
							params.value +
							'%'

						];
						return arr.join('\n');
					}
				},
				emphasis: {
					focus: 'series'
				},
				data: [12, 13, 11, 34, 90, 30, 10]


			}
		]
	};

	var dividendsChartDiv = document.getElementById("financial-dividend-chart");
	if (dividendsChartDiv !== null && typeof dividendsChartDiv !== "undefined") {
		var DividendsChart = echarts.init(dividendsChartDiv);		
	}

	//  income-quarter
	var incomeStatementChartOption = {
		color: colors,
		backgroundColor: 'rgba(255, 255, 255, 0)',
		tooltip: {
			trigger: "axis",
			axisPointer: {
				type: "cross",
			},
		},
		dataZoom: [{
			type: 'inside',
			start: 0,
			preventDefaultMouseMove: false
			// zoomOnMouseWheel: false
		}],
		grid: {
			right: "20%",
		},
		legend: {
			data: [],
			textStyle: {
				color: "#808080"
			}
		},
		xAxis: {
			type: "category",
			axisTick: {
				alignWithLabel: true,
			},
			axisLabel: {
				textStyle: {
					color: "#808080"
				}
			},
			show: true,
			alignTicks: true,
			axisLine: {
				show: true,
				lineStyle: {
					color: colors[0],
				},
			},
			data: [],
		},
		yAxis: [
			{
				show: false,
				alignTicks: true,
				axisLine: {
					show: true,
					lineStyle: {
						color: colors[0],
					},
				},
			},
			{
				show: false,
				alignTicks: true,
				axisLine: {
					show: true,
					lineStyle: {
						color: colors[1],
					},
				},
			},
		],
		series: [
			{
				name: "",
				type: "bar",
				barWidth: "60%",
				yAxisIndex: 0,
				label: {
					show: true,
					position: "top",
					color: "#808080"
				},
				data: [], // 56.29, 17.26, 18.99, 18.69
			},
			{
				name: "YoY(%)",
				type: "line",
				symbolSize: symbolSize,
				symbol: "circle",
				yAxisIndex: 1,
				data: [], // 0.00, 162.29, 166.29, 68.10
			},
		],
	};

	var incomeStatementChartDiv = document.getElementById("net-income-quarter");
	if (incomeStatementChartDiv !== null && typeof incomeStatementChartDiv !== "undefined") {
		var incomeStatementChart = echarts.init(incomeStatementChartDiv);		
	}

	//  balance-sheet-quarter
	var balanceSheetChartOption = {
		color: colors,
		backgroundColor: 'rgba(255, 255, 255, 0)',
		tooltip: {
			trigger: "axis",
			axisPointer: {
				type: "cross",
			},
		},
		dataZoom: [{
			type: 'inside',
			start: 0,
			preventDefaultMouseMove: false
			// zoomOnMouseWheel: false
		}],
		grid: {
			right: "20%",
		},
		legend: {
			data: [],
			textStyle: {
				color: "#808080"
			}
		},
		xAxis: {
			type: "category",
			axisTick: {
				alignWithLabel: true,
			},
			axisLabel: {
				textStyle: {
					color: "#808080"
				}
			},
			show: true,
			alignTicks: true,
			axisLine: {
				show: true,
				lineStyle: {
					color: colors[0],
				},
			},
			data: [],
		},
		yAxis: [
			{
				show: false,
				alignTicks: true,
				axisLine: {
					show: true,
					lineStyle: {
						color: colors[0],
					},
				},
			},
			{
				show: false,
				alignTicks: true,
				axisLine: {
					show: true,
					lineStyle: {
						color: colors[1],
					},
				},
			},
		],
		series: [
			{
				name: "",
				type: "bar",
				barWidth: "20%",
				yAxisIndex: 0,
				label: {
					show: true,
					position: "top",
					color: "#808080"
				},
				data: [], // 15.29, 17.26, 18.99, 18.69
			},
			{
				name: "",
				type: "bar",
				barWidth: "20%",
				yAxisIndex: 0,
				label: {
					show: true,
					position: "top",
					color: "#808080"
				},
				data: [], // 15.29, 17.26, 18.99, 18.69
			},
			{
				name: "",
				type: "line",
				symbolSize: symbolSize,
				symbol: "circle",
				color: "yellow",
				yAxisIndex: 1,
				data: [], // 0.00, 162.29, 166.29, 68.10
			},
		],
	};

	var balanceSheetChartDiv = document.getElementById("balance-sheet-quarter");
	if (balanceSheetChartDiv !== null && typeof balanceSheetChartDiv !== "undefined") {
		var balanceSheetChart = echarts.init(balanceSheetChartDiv);		
	}

	//  cash-flow-chart
	var cashFlowChartOption = {
		color: colors,
		dataZoom: [{
			type: 'inside',
			start: 0,
			preventDefaultMouseMove: false
			// zoomOnMouseWheel: false
		}],
		backgroundColor: 'rgba(255, 255, 255, 0)',
		tooltip: {
			trigger: "axis",
			axisPointer: {
				type: "cross",
			},
		},
		grid: {
			right: "20%",
		},
		legend: {
			data: [],
			textStyle: {
				color: "#808080"
			}
		},
		xAxis: {
			type: "category",
			axisTick: {
				alignWithLabel: true,
			},
			axisLabel: {
				textStyle: {
					color: "#808080"
				}
			},
			show: true,
			alignTicks: true,
			axisLine: {
				show: true,
				lineStyle: {
					color: colors[0],
				},
			},
			data: [],
		},
		yAxis: [
			{
				show: false,
				alignTicks: true,
				axisLine: {
					show: true,
					lineStyle: {
						color: colors[0],
					},
				},
			},
			{
				show: false,
				alignTicks: true,
				axisLine: {
					show: true,
					lineStyle: {
						color: colors[1],
					},
				},
			},
		],
		series: [
			{
				name: "",
				type: "bar",
				barWidth: "60%",
				yAxisIndex: 0,
				label: {
					show: true,
					position: "top",
					color: "#808080"
				},
				data: [], // 15.29, 17.26, 18.99, 18.69
			},
			{
				name: "YoY(%)",
				type: "line",
				symbolSize: symbolSize,
				symbol: "circle",
				yAxisIndex: 1,

				data: [], // 0.00, 162.29, 166.29, 68.10, 35.11
			},
		],
	};

	var cashFlowChartDiv = document.getElementById("cash-flow-operating-quarter");
	if (cashFlowChartDiv !== null && typeof cashFlowChartDiv !== "undefined") {
		var cashFlowChart = echarts.init(cashFlowChartDiv);		
	}




// export { holdingsBarOption, holdingsBar, financialChart, financialChartOption, incomeStatementChart, incomeStatementChartOption, balanceSheetChart, balanceSheetChartOption, cashFlowChart, cashFlowChartOption };

//  Tree-map-chart
function setTreeMapData(selectedSector) {
	let stock_sector_selected = selectedSector || 'All';
	if (mobile_stock_board !== null && typeof mobile_stock_board !== "undefined" && mobile_stock_option !== null && typeof mobile_stock_option !== "undefined") {
		fetch(`analysis/stock_analysis/tree/${mobile_stock_exchange.value}/${mobile_stock_board.value}/${mobile_stock_option.value}/${stock_sector_selected}`)
			.then(res => res.json())
			.then(data => {
				let treeData = data.treedata;
				if (mobile_stock_option.value === "MARKETCAP") {
					treeData.map(obj => ({
					  name: obj.name,
					  children: obj.children.sort((a, b) => b?.value.reduce((acc, val) => acc + val, 0) - a?.value.reduce((acc, val) => acc + val, 0))
					}));
					treeData.sort((a, b) => b.children[0]?.value.reduce((acc, val) => acc + val, 0) - a.children[0]?.value.reduce((acc, val) => acc + val, 0));
				}
				// console.log(sectors);
				// console.log(treeData);
				getTreeMapChart(treeData);
			})
			.catch((err) => {
				console.log(err);
			});
	}
}

// Added All Sector 
function addSectorToDOM(stock_sector_selected) {
	$("#mobile_home_select_sector").empty();
	fetch(`analysis/stock_analysis/tree/${mobile_stock_exchange.value}/${mobile_stock_board.value}/${mobile_stock_option.value}/All`)
		.then(res => res.json())
		.then(data => {
			let treeData = data.treedata;
			let sectors = treeData.map(obj => obj.name);
			// console.log(sectors);
			if (sectors.length == 0) {
				$("#mobile_home_select_sector").empty();
			}
			else {
				var parent = document.getElementById("mobile_home_select_sector")
				if (parent !== null && typeof parent !== "undefined") {
					var item = document.createElement("option");
					item.innerHTML = `All`;
					parent?.appendChild(item);
					for (i = 0; i < sectors.length; i++) {
						item = document.createElement("option");
						item.innerHTML = `${sectors[i]}`;
						parent?.appendChild(item);
					}
					//console.log(stock_sector_selected);
					parent.value = (sectors.indexOf(stock_sector_selected) !== -1) ? stock_sector_selected : "All";
				}
			}
		})
		.catch((err) => {
			console.log(err);
		});
}

function getTreeMapChart(data) {
	var visualMin = -50;
	var visualMax = 50;
	var visualMinBound = -50;
	var visualMaxBound = 50;

	convertData(data);

	function convertData(originList) {
		var min = Infinity;
		var max = -Infinity;

		for (var i = 0; i < originList.length; i++) {

			var node = originList[i];
			var childrenNode = node.children;

			if (childrenNode) {

				for (child in childrenNode) {
					var value = childrenNode[child].value;

					if (value[2] != null && value[2] > 0) {
						value[3] = echarts.number.linearMap(value[2], [0, max], [visualMaxBound, visualMax], true);
					}

					else if (value[2] != null && value[2] < 0) {
						value[3] = echarts.number.linearMap(value[2], [min, 0], [visualMin, visualMinBound], true);
					}

					else {
						value[3] = 0;
					}

					if (!isFinite(value[3])) {
						value[3] = 0;
					}
				}
			}
		}
	}

	function isValidNumber(num) {
		return num != null && isFinite(num);
	}

	treeMapChart.setOption(
		(treeMapChartOption = {
			tooltip: {
				formatter: function (info) {
					var select_3 = document.getElementById("mobile_home_stock_option");
					var text_3 = select_3.options[select_3.selectedIndex].text;

					var value = info.value;
					var amount = value[0];
					if (amount > 10000000) {
						amount /= 10000000;
						amount += " cr"
					}
					amount = amount.toFixed(2);
					var ltp_amount= value[1];
					var last_value = value[2];
					var text = text_3[0].toUpperCase() + text_3.toLowerCase().slice(1);
			
					var isVisible = isValidNumber(ltp_amount) && (isValidNumber(last_value))
			
					if(isVisible)
					{
					  ltp_amount += " BDT"
			
					  return [
						'<div class="tooltip-title">' + echarts.format.encodeHTML(info.name) + "</div>",
						(text == "Change" ? "" : text+": &nbsp;&nbsp;" + amount + "<br>"),
						"LTP Amount: &nbsp;&nbsp;" + ltp_amount + "<br>",
						"Change: &nbsp;&nbsp;" + last_value + "%",
					  ].join("");
					}
				},
				show: true,
				trigger: 'item',
				// position: 'left',
			},
			series: [
				{
					top: 5,
					left: 10,
					right: 10,
					type: 'treemap',
					roam: false,
					sort: false,
					label: {
						show: true,
						formatter: "{b}",
					},
					breadcrumb: {
						show: false
					},
					upperLabel: {
						show: true,
						height: 20,
						color: '#fff'

					},
					itemStyle: {
						borderColor: "#fff",
					},
					visualMin: visualMin,
					visualMax: visualMax,
					visualDimension: 3,
					nodeClick: false,
					levels: [
						{
							itemStyle: {
								borderWidth: 3,
								borderColor: "#303035",
								gapWidth: 3,
							},
						},
						{
							color: ["#FE3957", "#aaa", "#0CAF82"],
							colorMappingBy: "value",
							itemStyle: {
								gapWidth: 1,
								borderColor: "rgba(24,24,26, 0.1)",
							},
						},
					],
					data: data
				}
			]
		}))
}

//Mobile Index Chart
// var base = +new Date(1968, 9, 3);
// var oneDay = 24 * 3600 * 1000;
// var date = [];
// var data = [Math.random() * 300];
// for (var i = 1; i < 20000; i++) {
//   var now = new Date((base += oneDay));
//   date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
//   data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
// }
// //  cash-flow-chart
// var mobileIndexChartOption = { 
// 	  tooltip: {
// 		trigger: 'axis',
// 		position: function (pt) {
// 		  return [pt[0], '10%'];
// 		}
// 	},
// 	xAxis: {
// 	  type: 'category',
// 	  boundaryGap: false,
// 	  data: date
// 	},
// 	yAxis: {
// 	  type: 'value',
// 	  boundaryGap: [0, '100%'],
// 	  splitLine: {
// 		show: true,
// 		lineStyle: {
// 			color: [
// 				"rgba(170,170,170,0.15)"
// 			]
// 		}
// 	},
// 	},
// 	dataZoom: [{
// 		type: 'inside',
// 		start: 0,
//         end: 75,
// 		preventDefaultMouseMove: false
// 	}],
// 	series: [
// 	  {
// 		name: 'Fake Data',
// 		type: 'line',
// 		symbol: 'none',
// 		sampling: 'lttb',
// 		itemStyle: {
// 			color: 'rgb(255, 70, 131)'
// 		  },
// 		  areaStyle: {
// 			color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
// 			  {
// 				offset: 0,
// 				color: 'rgb(255, 158, 68)'
// 			  },
// 			  {
// 				offset: 1,
// 				color: 'rgb(255, 70, 131)'
// 			  }
// 			])
// 		  },
// 		  data: data
// 		}
// 	  ]
// 	};


// var mobileIndexChartDiv = document.getElementById("mobile_index_chart");
// if (mobileIndexChartDiv !== null && typeof mobileIndexChartDiv !== "undefined") {
// 	var mobileIndexChart = echarts.init(mobileIndexChartDiv);		
// }

// mobileIndexChart.setOption(mobileIndexChartOption);