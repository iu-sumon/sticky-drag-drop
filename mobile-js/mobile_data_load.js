var premium_row_columns = 4; // Visible 1-4 coloumns for non premium user 
var premium_row_columns_holding = 7; // Visible 0-7 coloumns for non premium user 

function setProfileData(data) {
  var profile = [];
  for (var i = 0; i < 12; profile[i++] = "-");

  if (data != "" && data[0].length == 12) {
      profile = data[0];
  }



  document.getElementById("profile_sector").innerText = profile[0];
  document.getElementById("profile_employee").innerText = profile[1];
  document.getElementById("profile_company_profile").innerText = profile[2];
  document.getElementById("profile_address").innerText = profile[3];
  document.getElementById("profile_contact").innerText = profile[4];
  document.getElementById("profile_fax").innerText = profile[5];
  document.getElementById("profile_email").innerText = profile[6];
  document.getElementById("profile_web_address").innerText = profile[7];
  document.getElementById("profile_company_secretary_name").innerText =
      profile[8];
  document.getElementById("profile_secretary_cell_no").innerText = profile[9];
  document.getElementById("profile_secretary_telephone_no").innerText =
      profile[10];
  document.getElementById("profile_secretary_email").innerText = profile[11];
};

var setDividendDataTable = ({ dividend }) => {
  var dividend_table = $("#corp-actions-dividends-table");
  $("#corp-actions-dividends-table tr").remove();
  for (var i = 0; i < dividend?.length; i++) {
    var d = dividend[i];
    var tr;
    if (i === 0) {
      tr = `<tr class="dividends-data-table-row data-table-head-bg thead-bg">`;
      if (d.length > 1) {
        for (var j = 0; j < d.length; j++) {
          tr += `<td class="dividends-data-table-row-column">
                                    ${d[j]}
                                </td>`;
        }
      }
      tr += `</tr>`;
    } else {
      tr = `<tr class="dividends-data-table-row">`;
      if (d.length > 1) {
        for (var j = 0; j < d.length; j++) {
          if (j === 0 || j === 2) {
            tr += `<td class="dividends-data-table-row-column">
                                      <span>${getFormattedDate(d[j])}</span>
                                  </td>`;
          } else {
            tr += `<td class="dividends-data-table-row-column">
                                      <span>${d[j]}</span>
                                  </td>`;
          }
        }
      }
      tr += `</tr>`;
    }
    dividend_table.append(tr);
  }
};

var setInsiderActivityDataTable = ({ activity }) => {
  var activity_table = $("#corp-actions-insider-activity-table");
    $("#corp-actions-insider-activity-table tr").remove();

    for (var i = 0; i < activity.length; i++) {
        var d = activity[i];
        var tr;
        if (i === 0) {
            tr = `<tr class="insider-activity-data-table-row data-table-head-bg thead-bg">`;
            if (d.length > 1) {
                for (var j = 0; j < d.length; j++) {
                    tr += `<td class="insider-activity-data-table-row-column data-table-head-bg">
                                      ${d[j]}
                                  </td>`;
                }
            }
            tr += `</tr>`;
        } else {
            tr = `<tr class="insider-activity-data-table-row"">`;
            if (d.length > 1) {
                for (var j = 0; j < d.length; j++) {
                    if (j === 0) {
                        tr += `<td class="insider-activity-data-table-row-column">                                    
                                      <span>${getFormattedDate(d[j])}</span>
                                  </td>`;
                    } else {
                        tr += `<td class="insider-activity-data-table-row-column">
                                      <span>${d[j]}</span>
                                  </td>`;
                    }
                }
            }
            tr += `</tr>`;
        }
        activity_table.append(tr);
    }
};

var mobile_holding_premium_card = document.getElementById("mobile-holding-premium-card");
function setHoldingTable(data) {
  var table = $('#holding-table');
  $("#holding-table tr").remove()
  if(data.length == 0)
  {
    if (mobile_holding_premium_card != null) {
      mobile_holding_premium_card.style.display = "none";
    }
  }
  else
  {
    for (var i = 0; i < data.length; i++) {
      var d = data[i];
      var tr;
      if (i === 0) {
          tr = `
              <tr class="data-table-row data-table-head-bg">
                  <th class="data-table-row-first">
                      ${d[0]}
                  </th>`; 
          if (d.length > 1) {
              for (var j = 1; j < d.length; j++) {
                  for (var k = 0; k < d[j].length; k++) {
                    if (system_user_premium == 'True') {
                      tr += `<th class="data-table-row-column long data-table-head-bg">
                      ${getFormattedDate(d[j][k])}
                      </th>`; 
                      if (mobile_holding_premium_card != null) {
                        mobile_holding_premium_card.style.display = "none";
                      }
                    }
                    else
                    {
                      if (k <= premium_row_columns_holding) {
                        tr += `<th class="data-table-row-column long data-table-head-bg">
                        ${getFormattedDate(d[j][k])}
                        </th>`; 
                      }
                      else
                      {
                        tr += `<th class="data-table-row-column long data-table-head-bg blur_data_table">
                        ${getFormattedDate(d[j][k])}
                        </th>`; 
                      }
                      if (mobile_holding_premium_card != null) {
                            mobile_holding_premium_card.style.display = "block";
                      }
                    }
                     
                  }
              }
          }
          tr += `</tr>`;
      } else {
          tr = `
              <tr class="data-table-row">
                  <td class="data-table-row-first">
                      ${d[0]}
                  </td>`; 
          if (d.length > 1) {
              for (var j = 1; j < d.length; j++) {
                  for (var k = 0; k < d[j].length; k++) {
                    if (system_user_premium == 'True') {
                      tr += `<td class="data-table-row-column long">
                      ${d[j][k]}
                     </td>`; 
                     if (mobile_holding_premium_card != null) {
                      mobile_holding_premium_card.style.display = "none";
                    }
                    }
                    else
                    {
                      if (k <= premium_row_columns_holding)
                      {
                        tr += `<td class="data-table-row-column long">
                        ${d[j][k]}
                      </td>`; 
                      }
                      else
                      {
                        tr += `<td class="data-table-row-column long blur_data_table">
                        ${d[j][k]}
                        </td>`; 
                      }
                      if (mobile_holding_premium_card != null) {
                        mobile_holding_premium_card.style.display = "block";
                      }
                    }
                     
                  }
              }
          }
          tr += `</tr>`;
      }
      table.append(tr);
  }
  }
 
}

var setFinancialQuarterlyGraph = ({ quarterly }, tabText) => {
  var eps = [];
  var equity = [];
  var net_debt = [];
  var cfps = [];
  var bvps = [];
  var roe = [];
  var roa = [];

  for (var i = 0; i < quarterly.quarter_date?.length; i++) {
    var yoy1 = quarterly.eps != null ? calculateYoY(quarterly.eps, i, 0) : [];
    var yoy2 = quarterly.equity != null ? calculateYoY(quarterly.equity, i, 0) : [];
    var yoy3 = quarterly.net_debt != null ? calculateYoY(quarterly.net_debt, i, 0) : [];
    var yoy4 = quarterly.cfps != null ? calculateYoY(quarterly.cfps, i, 0) : [];
    var yoy5 = quarterly.bvps != null ? calculateYoY(quarterly.bvps, i, 0) : [];
    var yoy6 = quarterly.ROE != null ? calculateYoY(quarterly.ROE, i, 0) : [];
    var yoy7 = quarterly.ROA != null ? calculateYoY(quarterly.ROA, i, 0) : [];
    
    eps.push(yoy1);
    equity.push(yoy2);
    net_debt.push(yoy3);
    cfps.push(yoy4);
    bvps.push(yoy5);
    roe.push(yoy6);
    roa.push(yoy7);
  }

  financialChartOption.xAxis.data = quarterly.quarter_date;

  if (tabText == "EPS") {
    financialChartOption.series[0].data = quarterly.eps;
    financialChartOption.series[1].data = eps;
    financialChartOption.legend.data = ["EPS {%}", "YoY {%}"];
    financialChartOption.series[0].name = "EPS {%}";
  } else if (tabText == "ROA") {
    financialChartOption.series[0].data = quarterly.ROA;
    financialChartOption.series[1].data = roa;
    financialChartOption.legend.data = ["ROA {%}", "YoY {%}"];
    financialChartOption.series[0].name = "ROA {%}";
  } else if (tabText == "ROE") {
    financialChartOption.series[0].data = quarterly.ROE;
    financialChartOption.series[1].data = roe;
    financialChartOption.legend.data = ["ROE {%}", "YoY {%}"];
    financialChartOption.series[0].name = "ROE {%}";
  } else if (tabText == "Net Debt") {
    financialChartOption.series[0].data = quarterly.net_debt;
    financialChartOption.series[1].data = net_debt;
    financialChartOption.legend.data = ["Net Debt {%}", "YoY {%}"];
    financialChartOption.series[0].name = "Net Debt {%}";
  } else if (tabText == "Equity") {
    financialChartOption.series[0].data = quarterly.equity;
    financialChartOption.series[1].data = equity;
    financialChartOption.legend.data = ["Total Equity {%}", "YoY {%}"];
    financialChartOption.series[0].name = "Total Equity {%}";
  } else if (tabText == "CFPS") {
    financialChartOption.series[0].data = quarterly.cfps;
    financialChartOption.series[1].data = cfps;
    financialChartOption.legend.data = ["CFPS {%}", "YoY {%}"];
    financialChartOption.series[0].name = "CFPS {%}";
  } else if (tabText == "BVPS") {
    financialChartOption.series[0].data = quarterly.bvps;
    financialChartOption.series[1].data = bvps;
    financialChartOption.legend.data = ["BVPS {%}", "YoY {%}"];
    financialChartOption.series[0].name = "BVPS {%}";
  }

  financialChartOption.dataZoom[0].start = 70;
  financialChartOption.dataZoom[0].end = 100;

  financialChart.setOption(financialChartOption);
};

var setFinancialAnnualGraph = ({ annual }, tabText) => {
  var eps = [];
  var equity = [];
  var net_debt = [];
  var cfps = [];
  var bvps = [];
  var roe = [];
  var roa = [];

  for (var i = 0; i < annual.year_value?.length; i++) {
    var yoy1 = annual.eps != null ? calculateYoY(annual.eps, i, 0) : [];
    var yoy2 = annual.equity != null ? calculateYoY(annual.equity, i, 0) : [];
    var yoy3 = annual.net_debt != null ? calculateYoY(annual.net_debt, i, 0) : [];
    var yoy4 = annual.cfps != null ? calculateYoY(annual.cfps, i, 0) : [];
    var yoy5 = annual.bvps != null ? calculateYoY(annual.bvps, i, 0) : [];
    var yoy6 = annual.ROE != null ? calculateYoY(annual.ROE, i, 0) : [];
    var yoy7 = annual.ROA != null ? calculateYoY(annual.ROA, i, 0) : [];
    
    eps.push(yoy1);
    equity.push(yoy2);
    net_debt.push(yoy3);
    cfps.push(yoy4);
    bvps.push(yoy5);
    roe.push(yoy6);
    roa.push(yoy7);
  }

  financialChartOption.xAxis.data = annual.year_value;
  if (tabText == "EPS") {
    financialChartOption.series[0].data = annual.eps;
    financialChartOption.series[1].data = eps;
    financialChartOption.legend.data = ["EPS {%}", "YoY {%}"];
    financialChartOption.series[0].name = "EPS {%}";
  } else if (tabText == "ROA") {
    financialChartOption.series[0].data = annual.ROA;
    financialChartOption.series[1].data = roa;
    financialChartOption.legend.data = ["ROA {%}", "YoY {%}"];
    financialChartOption.series[0].name = "ROA {%}";
  } else if (tabText == "ROE") {
    financialChartOption.series[0].data = annual.ROE;
    financialChartOption.series[1].data = roe;
    financialChartOption.legend.data = ["ROE {%}", "YoY {%}"];
    financialChartOption.series[0].name = "ROE {%}";
  } else if (tabText == "Net Debt") {
    financialChartOption.series[0].data = annual.net_debt;
    financialChartOption.series[1].data = net_debt;
    financialChartOption.legend.data = ["Net Debt {%}", "YoY {%}"];
    financialChartOption.series[0].name = "Net Debt {%}";
  } else if (tabText == "Equity") {
    financialChartOption.series[0].data = annual.equity;
    financialChartOption.series[1].data = equity;
    financialChartOption.legend.data = ["Total Equity {%}", "YoY {%}"];
    financialChartOption.series[0].name = "Total Equity {%}";
  } else if (tabText == "CFPS") {
    financialChartOption.series[0].data = annual.cfps;
    financialChartOption.series[1].data = cfps;
    financialChartOption.legend.data = ["CFPS {%}", "YoY {%}"];
    financialChartOption.series[0].name = "CFPS {%}";
  } else if (tabText == "BVPS") {
    financialChartOption.series[0].data = annual.bvps;
    financialChartOption.series[1].data = bvps;
    financialChartOption.legend.data = ["BVPS {%}", "YoY {%}"];
    financialChartOption.series[0].name = "BVPS {%}";
  }

  financialChartOption.dataZoom[0].start = 50;
  financialChartOption.dataZoom[0].end = 100;

  financialChart.setOption(financialChartOption);
};

var setIncomeStatementQuarterlyGraph = (
  {
    quarterly: {
      quarterly_operating,
      quarterly_dates,
      quarterly_net_income,
      quarterly_revenue,
    },
  },
  tabText
) => {
  if (quarterly_dates) {
    var arr = [];
    incomeStatementChartOption.xAxis.data = quarterly_dates;
    if (tabText == "Revenue") {
      for (var i = 0; i < quarterly_dates.length; i++) {
        var yoy = calculateYoY(quarterly_revenue, i, 0);
        arr.push(yoy);
      }

      quarterly_revenue = quarterly_revenue.map(row => row === '-' ? 0 : row);
      incomeStatementChartOption.series[0].data = quarterly_revenue;
      incomeStatementChartOption.series[0].name = "Revenue (BDT)";
      incomeStatementChartOption.legend.data = ["Revenue (BDT)", "YoY(%)"];
    } else if (tabText == "Operating Income") {
      for (var i = 0; i < quarterly_dates.length; i++) {
        var yoy = calculateYoY(quarterly_operating, i, 0);
        arr.push(yoy);
      }

      quarterly_operating = quarterly_operating.map(row => row === '-' ? 0 : row);
      incomeStatementChartOption.series[0].data = quarterly_operating;
      incomeStatementChartOption.series[0].name = "Operating Income (BDT)";
      incomeStatementChartOption.legend.data = [
        "Operating Income (BDT)",
        "YoY(%)",
      ];
    } else if (tabText == "Net Income") {
      for (var i = 0; i < quarterly_dates.length; i++) {
        var yoy = calculateYoY(quarterly_net_income, i, 0);
        arr.push(yoy);
      }

      quarterly_net_income = quarterly_net_income.map(row => row === '-' ? 0 : row);
      incomeStatementChartOption.series[0].data = quarterly_net_income;
      incomeStatementChartOption.series[0].name = "Net Income (BDT)";
      incomeStatementChartOption.legend.data = ["Net Income (BDT)", "YoY(%)"];
    }
    incomeStatementChartOption.series[1].data = arr;
    incomeStatementChartOption.dataZoom[0].start = 70;
		incomeStatementChartOption.dataZoom[0].end = 100;
    incomeStatementChart.setOption(incomeStatementChartOption);
  }
};


var setIncomeStatementAnnualGraph = (
  {
    annual: {
      annual_net_income,
      annual_dates,
      annual_operating,
      annual_revenue,
    },
  },
  tabText
) => {
  if (annual_dates) {
    var arr = [];

    if (tabText == "Net Income") {
      for (var i = 0; i < annual_dates.length; i++) {
        var yoy = calculateYoY(annual_net_income, i, 0);
        arr.push(yoy);
      }

      annual_net_income = annual_net_income.map(row => row === '-' ? 0 : row);
      incomeStatementChartOption.series[0].data = annual_net_income;
      incomeStatementChartOption.series[1].data = arr;
      incomeStatementChartOption.series[0].name = "Net Income (BDT)";
      incomeStatementChartOption.legend.data = ["Net Income (BDT)", "YoY(%)"];
    } else if (tabText == "Revenue") {
      for (var i = 0; i < annual_dates.length; i++) {
        var yoy = calculateYoY(annual_revenue, i, 0);
        arr.push(yoy);
      }

      annual_revenue = annual_revenue.map(row => row === '-' ? 0 : row);
      incomeStatementChartOption.series[0].data = annual_revenue;
      incomeStatementChartOption.series[1].data = arr;
      incomeStatementChartOption.series[0].name = "Revenue (BDT)";
      incomeStatementChartOption.legend.data = ["Revenue (BDT)", "YoY(%)"];
    } else if (tabText == "Operating Income") {
      for (var i = 0; i < annual_dates.length; i++) {
        var yoy = calculateYoY(annual_operating, i, 0);
        arr.push(yoy);
      }

      annual_operating = annual_operating.map(row => row === '-' ? 0 : row);
      incomeStatementChartOption.series[0].data = annual_operating;
      incomeStatementChartOption.series[1].data = arr;
      incomeStatementChartOption.series[0].name = "Operating Income (BDT)";
      incomeStatementChartOption.legend.data = [
        "Operating Income (BDT)",
        "YoY(%)",
      ];
    }
    incomeStatementChartOption.xAxis.data = annual_dates;
    incomeStatementChartOption.dataZoom[0].start = 30;
		incomeStatementChartOption.dataZoom[0].end = 100;
    incomeStatementChart.setOption(incomeStatementChartOption);
  }
};


var mobile_income_premium_card = document.getElementById("mobile-income-premium-card");

function setFinancialIncomeStatementStatements({ annual: { annual_statement }, quarterly: { quarterly_statement } }) {
  var data;
  var annual_statement_table = $(
      "#scrolling-container-income-statement-annual-table"
  );
  $("#scrolling-container-income-statement-annual-table tr").remove();
  if (annual_statement) {
      if (annual_statement.length == 0) {
        if (mobile_income_premium_card != null) {
          mobile_income_premium_card.style.display = "none";
         }
      }
      else {
          for (var i = 0; i < annual_statement.length; i++) {
              var tr;
              if (i === 0) {
                  tr = `
              <tr class="data-table-row data-table-head-bg">
              <th class="data-table-row-first scroll-row-income-annual">
              Items
              </th>`;
                  var d = annual_statement[i];
                  for (var j = 1; j < d.length; j++) {
                      if (system_user_premium == 'True') {
                          tr += `
                          <th class="data-table-row-column long">
                              YoY
                          </th>
                          <th class="data-table-row-column long">
                              ${d[j]}
                          </th>
                        `;
                        if (mobile_income_premium_card != null) {
                          mobile_income_premium_card.style.display = "none";
                        }
                      }
                      else {
                          if (j <= premium_row_columns) {
                              tr += `
                           <th class="data-table-row-column long">
                               YoY
                           </th>
                           <th class="data-table-row-column long">
                               ${d[j]}
                           </th>
                         `;
                          }
                          else {
                              tr += `
                           <th class="data-table-row-column long blur_data_table">
                               YoY
                           </th>
                           <th class="data-table-row-column long blur_data_table">
                               ${d[j]}
                           </th>
                         `;
                          }
                          if (mobile_income_premium_card != null) {
                            mobile_income_premium_card.style.display = "block";
                        }
                      }
                  }

                  tr += "</tr>";
              } else {
                  var d = annual_statement[i];
                  tr = `
                      <tr class="data-table-row">
                          <td class="data-table-row-first scroll-row-income-annual data-table-row-bg parentInactive" id="parentTrBalSheetAnnual">
                              ${d[0]}
                          </td>`;
                  for (var j = 1; j < d.length; j++) {
                      // yoy = calculateYoY(d, j, 1);
                      if (d[j] == 'NM' || d[j] == '-') { data = '-' } else data = parseFloat((d[j]).replace(',', '')).toFixed(1);
                      // subtract data with previous data
                      if (j > 1 & data != '-') {
                          var yoy = (d[j - 1] == 'NM' || d[j - 1] == '-') ? 0.0 : parseFloat((data - parseFloat((d[j - 1]).replace(',', ''))).toFixed(1));
                          yoy = Math.abs(yoy)
                      } else {
                          var yoy = 0.0;
                      }
                      if (system_user_premium == 'True') {
                          tr += `
                          <td class="data-table-row-column long">
                              <span class="">${yoy}</span>
                          </td>
                          <td class="data-table-row-column long">
                              <span class="">${data}</span>
                          </td>
                        `;
                        if (mobile_income_premium_card != null) {
                          mobile_income_premium_card.style.display = "none";
                        }
                      }
                      else {
                          if (j <= premium_row_columns) {
                              tr += `
                              <td class="data-table-row-column long">
                                  <span class="">${yoy}</span>
                              </td>
                              <td class="data-table-row-column long">
                                  <span class="">${data}</span>
                              </td>
                            `;
                          }
                          else {
                              tr += `
                              <td class="data-table-row-column long blur_data_table">
                                  <span class="">${yoy}</span>
                              </td>
                              <td class="data-table-row-column long blur_data_table">
                                  <span class="">${data}</span>
                              </td>
                            `;
                          }
                          if (mobile_income_premium_card != null) {
                            mobile_income_premium_card.style.display = "block";
                        }
                      }
                  }

                  tr += "</tr>";
              }
              annual_statement_table.append(tr);
          }
      }
  }
 
  var quarterly_statement_table = $(
      "#scrolling-container-income-statement-quarterly-table"
  );
  $("#scrolling-container-income-statement-quarterly-table tr").remove();
  if (quarterly_statement) {
      if (quarterly_statement.length == 0) {
          if (mobile_income_premium_card != null) {
              mobile_income_premium_card.style.display = "none";
          }

      }
      else {
          for (var i = 0; i < quarterly_statement.length; i++) {
              var tr;
              if (i === 0) {
                  tr = `
              <tr class="data-table-row data-table-head-bg">
              <th class="data-table-row-first scroll-row-income-quarter">
              Items
              </th>`;
                  var d = quarterly_statement[i];
                  for (var j = 1; j < d.length; j++) {
                      if (system_user_premium == 'True') {
                          tr += `
                          <th class="data-table-row-column long">
                              YoY
                          </th>
                          <th class="data-table-row-column long">
                              ${d[j]}
                          </th>
                        `;
                          if (mobile_income_premium_card != null) {
                              mobile_income_premium_card.style.display = "none";
                          }
                      }
                      else {

                          if (j <= premium_row_columns) {
                              tr += `
                           <th class="data-table-row-column long">
                               YoY
                           </th>
                           <th class="data-table-row-column long">
                               ${d[j]}
                           </th>
                         `;
                          }
                          else {
                              tr += `
                           <th class="data-table-row-column long blur_data_table">
                               YoY
                           </th>
                           <th class="data-table-row-column long blur_data_table">
                               ${d[j]}
                           </th>
                         `;
                          }
                          if (mobile_income_premium_card != null) {
                             mobile_income_premium_card.style.display = "block";
                          }
                      }
                  }

                  tr += "</tr>";
              } else {
                  var d = quarterly_statement[i];
                  tr = `
                      <tr class="data-table-row">
                          <td class="data-table-row-first scroll-row-income-quarter data-table-row-bg parentInactive" id="parentTrBalSheetAnnual">
                              ${d[0]}
                          </td>`;
                  for (var j = 1; j < d.length; j++) {
                      // yoy = calculateYoY(d, j, 1);
                      if (d[j] == 'NM' || d[j] == '-') { data = '-' } else data = parseFloat((d[j]).replace(',', '')).toFixed(1);
                      // subtract data with previous data
                      if (j > 1 & data != '-') {
                          var yoy = (d[j - 1] == 'NM' || d[j - 1] == '-') ? 0.0 : parseFloat((data - parseFloat((d[j - 1]).replace(',', ''))).toFixed(1));
                          yoy = Math.abs(yoy)
                      } else {
                          var yoy = 0.0;
                      }

                      if (system_user_premium == 'True') {
                          tr += `
                          <td class="data-table-row-column long">
                              <span class="">${yoy}</span>
                          </td>
                          <td class="data-table-row-column long">
                              <span class="">${data}</span>
                          </td>
                        `;
                          if (mobile_income_premium_card != null) {
                              mobile_income_premium_card.style.display = "none";
                          }
                      }
                      else {
                          if (j <= premium_row_columns) {
                              tr += `
                              <td class="data-table-row-column long">
                                  <span class="">${yoy}</span>
                              </td>
                              <td class="data-table-row-column long">
                                  <span class="">${data}</span>
                              </td>
                            `;
                          }
                          else {
                              tr += `
                              <td class="data-table-row-column long blur_data_table">
                                  <span class="">${yoy}</span>
                              </td>
                              <td class="data-table-row-column long blur_data_table">
                                  <span class="">${data}</span>
                              </td>
                            `;
                          }
                          if (mobile_income_premium_card != null) {
                              mobile_income_premium_card.style.display = "block";
                          }
                      }
                  }

                  tr += "</tr>";
              }
              quarterly_statement_table.append(tr);
          }
      }
  }
}


var mobile_balance_premium_card = document.getElementById("mobile-balance-premium-card");

function setFinancialBalanceSheetStatements({ annual_statement, quarterly_statement }) {
  var data;
  var annual_statement_table = $("#scrolling-container-balance-sheet-annual-table");
  $("#scrolling-container-balance-sheet-annual-table tr").remove();
  if (annual_statement) {
      if (annual_statement.length == 0) {
        if (mobile_balance_premium_card != null) {
          mobile_balance_premium_card.style.display = "none";
      }
      }
      else {
          for (var i = 0; i < annual_statement.length; i++) {
              var tr;
              if (i === 0) {
                  tr = `
                <tr class="data-table-row data-table-head-bg">
                <th class="data-table-row-first scroll-row-balance-annual">
                Items
                </th>`;
                  var d = annual_statement[i];
                  for (var j = 1; j < d.length; j++) {
                      if (system_user_premium == 'True') {
                          tr += `
                          <th class="data-table-row-column long">
                              YoY
                          </th>
                          <th class="data-table-row-column long">
                              ${d[j]}
                          </th>
                        `;
                        if (mobile_balance_premium_card != null) {
                          mobile_balance_premium_card.style.display = "none";
                      }
                      }
                      else {
                          if (j <= premium_row_columns) {
                              tr += `
                           <th class="data-table-row-column long">
                               YoY
                           </th>
                           <th class="data-table-row-column long">
                               ${d[j]}
                           </th>
                         `;
                          }
                          else {
                              tr += `
                           <th class="data-table-row-column long blur_data_table">
                               YoY
                           </th>
                           <th class="data-table-row-column long blur_data_table">
                               ${d[j]}
                           </th>
                         `;
                          }
                          if (mobile_balance_premium_card != null) {
                            mobile_balance_premium_card.style.display = "block";
                        }
                      }
                  }

                  tr += "</tr>";
              } else {
                  var d = annual_statement[i];
                  tr = `
                        <tr class="data-table-row">
                            <td class="data-table-row-first scroll-row-balance-annual data-table-row-bg parentInactive" id="parentTrBalSheetAnnual">
                                ${d[0]}
                            </td>`;
                  for (var j = 1; j < d.length; j++) {
                      // yoy = calculateYoY(d, j, 1);
                      if (d[j] == 'NM' || d[j] == '-') { data = '-' } else data = parseFloat((d[j]).replace(',', '')).toFixed(1);
                      // subtract data with previous data
                      if (j > 1 & data != '-') {
                          var yoy = (d[j - 1] == 'NM' || d[j - 1] == '-') ? 0.0 : parseFloat((data - parseFloat((d[j - 1]).replace(',', ''))).toFixed(1));
                          yoy = Math.abs(yoy)
                      } else {
                          var yoy = 0.0;
                      }
                      if (system_user_premium == 'True') {
                          tr += `
                          <td class="data-table-row-column long">
                              <span class="">${yoy}</span>
                          </td>
                          <td class="data-table-row-column long">
                              <span class="">${data}</span>
                          </td>
                          `;
                          if (mobile_balance_premium_card != null) {
                            mobile_balance_premium_card.style.display = "none";
                        }
                      }
                      else {
                          if (j <= premium_row_columns) {
                              tr += `
                              <td class="data-table-row-column long">
                                  <span class="">${yoy}</span>
                              </td>
                              <td class="data-table-row-column long">
                                  <span class="">${data}</span>
                              </td>
                              `;
                          }
                          else {
                              tr += `
                              <td class="data-table-row-column long blur_data_table">
                                  <span class="">${yoy}</span>
                              </td>
                              <td class="data-table-row-column long blur_data_table">
                                  <span class="">${data}</span>
                              </td>
                              `;
                          }
                          if (mobile_balance_premium_card != null) {
                            mobile_balance_premium_card.style.display = "block";
                        }
                      }
                  }

                  tr += "</tr>";
              }
              annual_statement_table.append(tr);
          }
      }

  }
 
  var quarterly_statement_table = $("#scrolling-container-balance-sheet-quarterly-table");
  $("#scrolling-container-balance-sheet-quarterly-table tr").remove();
  if (quarterly_statement) {
      if (quarterly_statement.length == 0) {
        if (mobile_balance_premium_card != null) {
          mobile_balance_premium_card.style.display = "none";
      }
      }
      else {
          for (var i = 0; i < quarterly_statement.length; i++) {
              var tr;
              if (i === 0) {
                  tr = `
                <tr class="data-table-row data-table-head-bg">
                <th class="data-table-row-first scroll-row-balance-quarter">
                Items
                </th>`;
                  var d = quarterly_statement[i];
                  for (var j = 1; j < d.length; j++) {
                      if (system_user_premium == 'True') {
                          tr += `
                          <th class="data-table-row-column long">
                              YoY
                          </th>
                          <th class="data-table-row-column long">
                              ${d[j]}
                          </th>
                        `;
                        if (mobile_balance_premium_card != null) {
                          mobile_balance_premium_card.style.display = "none";
                      }
                      }
                      else {
                          if (j <= premium_row_columns) {
                              tr += `
                           <th class="data-table-row-column long">
                               YoY
                           </th>
                           <th class="data-table-row-column long">
                               ${d[j]}
                           </th>
                         `;
                          }
                          else {
                              tr += `
                           <th class="data-table-row-column long blur_data_table">
                               YoY
                           </th>
                           <th class="data-table-row-column long blur_data_table">
                               ${d[j]}
                           </th>
                         `;
                          }
                          if (mobile_balance_premium_card != null) {
                              mobile_balance_premium_card.style.display = "block";
                        }
                      }
                  }

                  tr += "</tr>";
              } else {
                  var d = quarterly_statement[i];
                  tr = `
                        <tr class="data-table-row">
                            <td class="data-table-row-first scroll-row-balance-quarter data-table-row-bg parentInactive" id="parentTrBalSheetAnnual">
                                ${d[0]}
                            </td>`;
                  for (var j = 1; j < d.length; j++) {
                      // yoy = calculateYoY(d, j, 1);
                      if (d[j] == 'NM' || d[j] == '-') { data = '-' } else data = parseFloat((d[j]).replace(',', '')).toFixed(1);
                      // subtract data with previous data
                      if (j > 1 & data != '-') {
                          var yoy = (d[j - 1] == 'NM' || d[j - 1] == '-') ? 0.0 : parseFloat((data - parseFloat((d[j - 1]).replace(',', ''))).toFixed(1));
                          yoy = Math.abs(yoy)
                      } else {
                          var yoy = 0.0;
                      }

                      if (system_user_premium == 'True') {
                          tr += `
                          <td class="data-table-row-column long">
                              <span class="">${yoy}</span>
                          </td>
                          <td class="data-table-row-column long">
                              <span class="">${data}</span>
                          </td>
                        `;
                        if (mobile_balance_premium_card != null) {
                          mobile_balance_premium_card.style.display = "none";
                        }
                      }
                      else {
                          if (j <= premium_row_columns) {
                              tr += `
                              <td class="data-table-row-column long">
                                  <span class="">${yoy}</span>
                              </td>
                              <td class="data-table-row-column long">
                                  <span class="">${data}</span>
                              </td>
                            `;
                          }
                          else {
                              tr += `
                              <td class="data-table-row-column long blur_data_table">
                                  <span class="">${yoy}</span>
                              </td>
                              <td class="data-table-row-column long blur_data_table">
                                  <span class="">${data}</span>
                              </td>
                            `;
                          }
                          if (mobile_balance_premium_card != null) {
                            mobile_balance_premium_card.style.display = "block";
                        }
                      }
                  }

                  tr += "</tr>";
              }
              quarterly_statement_table.append(tr);
          }
      }

  }
}

var setBalanceSheetAnnualGraph = ({ annual }) => {
  var axis_data = [];
  var assets_data = [];
  var liabilities_data = [];
  var equity_data = [];

  if (annual) {
    annual = annual.map(row => [row[0], row[1] === '-' ? 0 : row[1], row[2] === '-' ? 0 : row[2], row[3] === '-' ? 0 : row[3]]);

    axis_data = [...axis_data, ...annual.map(row => row[0])];
    assets_data = [...assets_data, ...annual.map(row => row[1])];
    liabilities_data = [...liabilities_data, ...annual.map(row => row[2])];
    equity_data = [...equity_data, ...annual.map(row => row[3])];
  }
  balanceSheetChartOption.xAxis.data = axis_data;
  balanceSheetChartOption.legend.data = ["Total Assets(B BDT)", "Total Liabilities(B BDT)", "Total Equity(%)"];
  balanceSheetChartOption.series[0].name = "Total Assets(B BDT)";
  balanceSheetChartOption.series[1].name = "Total Liabilities(B BDT)";
  balanceSheetChartOption.series[2].name = "Total Equity(%)";
  balanceSheetChartOption.series[0].data = assets_data;
  balanceSheetChartOption.series[1].data = liabilities_data;
  balanceSheetChartOption.series[2].data = equity_data;
  balanceSheetChartOption.dataZoom[0].start = 60;
  balanceSheetChartOption.dataZoom[0].end = 100;
  balanceSheetChart.setOption(balanceSheetChartOption);
};

var setBalanceSheetQuarterlyGraph = ({ quarterly }) => {
  var axis_data = [];
  var assets_data = [];
  var liabilities_data = [];
  var equity_data = [];
  if (quarterly) {
    quarterly = quarterly.map(row => [row[0], row[1] === '-' ? 0 : row[1], row[2] === '-' ? 0 : row[2], row[3] === '-' ? 0 : row[3]]);

    axis_data = [...axis_data, ...quarterly.map(row => row[0])];
    assets_data = [...assets_data, ...quarterly.map(row => row[1])];
    liabilities_data = [...liabilities_data, ...quarterly.map(row => row[2])];
    equity_data = [...equity_data, ...quarterly.map(row => row[3])];
  }
  balanceSheetChartOption.xAxis.data = axis_data;
  balanceSheetChartOption.legend.data = [
    "Total Assets(B BDT)",
    "Total Liabilities(B BDT)",
    "Total Equity(%)",
  ];
  balanceSheetChartOption.series[0].name = "Total Assets(B BDT)";
  balanceSheetChartOption.series[1].name = "Total Liabilities(B BDT)";
  balanceSheetChartOption.series[2].name = "Total Equity(%)";
  balanceSheetChartOption.series[0].data = assets_data;
  balanceSheetChartOption.series[1].data = liabilities_data;
  balanceSheetChartOption.series[2].data = equity_data;
  balanceSheetChartOption.dataZoom[0].start = 80;
  balanceSheetChartOption.dataZoom[0].end = 100;
  balanceSheetChart.setOption(balanceSheetChartOption);
};

var setCashFlowQuarterlyGraph = (
  {
    quarterly: {
      quarterly_operating,
      quarterly_dates,
      quarterly_financing,
      quarterly_investing,
    },
  },
  tabText
) => {
  if (quarterly_dates) {
    var arr = [];

    if (tabText == "Operating") {
      for (var i = 0; i < quarterly_dates.length; i++) {
        var yoy = calculateYoY(quarterly_operating, i, 0);
        arr.push(yoy);
      }

      quarterly_operating = quarterly_operating.map(row => row === '-' ? 0 : row);
      cashFlowChartOption.series[0].data = quarterly_operating;
      cashFlowChartOption.legend.data = ["Operating (B BDT)", "YoY(%)"];
      cashFlowChartOption.series[0].name = "Operating (B BDT)";
    } else if (tabText == "Investing") {
      for (var i = 0; i < quarterly_dates.length; i++) {
        var yoy = calculateYoY(quarterly_investing, i, 0);
        arr.push(yoy);
      }

      quarterly_investing = quarterly_investing.map(row => row === '-' ? 0 : row);
      cashFlowChartOption.series[0].data = quarterly_investing;
      cashFlowChartOption.legend.data = ["Investing (B BDT)", "YoY(%)"];
      cashFlowChartOption.series[0].name = "Investing (B BDT)";
    } else if (tabText == "Financing") {
      for (var i = 0; i < quarterly_dates.length; i++) {
        var yoy = calculateYoY(quarterly_financing, i, 0);
        arr.push(yoy);
      }

      quarterly_financing = quarterly_financing.map(row => row === '-' ? 0 : row);
      cashFlowChartOption.series[0].data = quarterly_financing;
      cashFlowChartOption.legend.data = ["Financing (B BDT)", "YoY(%)"];
      cashFlowChartOption.series[0].name = "Financing (B BDT)";
    }
    cashFlowChartOption.xAxis.data = quarterly_dates;
    cashFlowChartOption.series[1].data = arr;
    cashFlowChartOption.dataZoom[0].start = 80;
    cashFlowChartOption.dataZoom[0].end = 100;
    cashFlowChart.setOption(cashFlowChartOption);
  }
};

var setCashFlowAnnualGraph = (
  {
    annual: {
      annual_operating,
      annual_dates,
      annual_financing,
      annual_investing,
    },
  },
  tabText
) => {
  if (annual_dates) {
    var arr = [];

    if (tabText == "Operating") {
      for (var i = 0; i < annual_dates.length; i++) {
        var yoy = calculateYoY(annual_operating, i, 0);
        arr.push(yoy);
      }

      annual_operating = annual_operating.map(row => row === '-' ? 0 : row);
      cashFlowChartOption.series[0].data = annual_operating;
      cashFlowChartOption.legend.data = ["Operating (B BDT)", "YoY(%)"];
      cashFlowChartOption.series[0].name = "Operating (B BDT)";
    } else if (tabText == "Investing") {
      for (var i = 0; i < annual_dates.length; i++) {
        var yoy = calculateYoY(annual_investing, i, 0);
        arr.push(yoy);
      }

      annual_investing = annual_investing.map(row => row === '-' ? 0 : row);
      cashFlowChartOption.series[0].data = annual_investing;
      cashFlowChartOption.legend.data = ["Investing (B BDT)", "YoY(%)"];
      cashFlowChartOption.series[0].name = "Investing (B BDT)";
    } else if (tabText == "Financing") {
      for (var i = 0; i < annual_dates.length; i++) {
        var yoy = calculateYoY(annual_financing, i, 0);
        arr.push(yoy);
      }

      annual_financing = annual_financing.map(row => row === '-' ? 0 : row);
      cashFlowChartOption.series[0].data = annual_financing;
      cashFlowChartOption.legend.data = ["Financing (B BDT)", "YoY(%)"];
      cashFlowChartOption.series[0].name = "Financing (B BDT)";
    }

    cashFlowChartOption.xAxis.data = annual_dates;
    cashFlowChartOption.series[1].data = arr;
    cashFlowChartOption.dataZoom[0].start = 30;
    cashFlowChartOption.dataZoom[0].end = 100;
    cashFlowChart.setOption(cashFlowChartOption);
  }
};


var mobile_cash_premium_card = document.getElementById("mobile-cash-premium-card");

function setFinancialCashFlowStatements({ annual: { annual_statement }, quarterly: { quarterly_statement } }) {
  var data;
  var annual_statement_table = $("#scrolling-container-cash-flow-annual-table");
  $("#scrolling-container-cash-flow-annual-table tr").remove();
  if (annual_statement) {
      if (annual_statement.length == 0) {
        if (mobile_cash_premium_card != null) {
          mobile_cash_premium_card.style.display = "none";
      }

      }
      else {
          for (var i = 0; i < annual_statement.length; i++) {
              var tr;
              if (i === 0) {
                  tr = `
                <tr class="data-table-row data-table-head-bg">
                <th class="data-table-row-first scroll-row-cash-annual">
                Items
                </th>`;
                  var d = annual_statement[i];
                  for (var j = 1; j < d.length; j++) {
                      if (system_user_premium == 'True') {
                          tr += `
                          <th class="data-table-row-column long">
                              YoY
                          </th>
                          <th class="data-table-row-column long">
                              ${d[j]}
                          </th>
                        `;
                        if (mobile_cash_premium_card != null) {
                          mobile_cash_premium_card.style.display = "none";
                      }

                      }
                      else {
                          if (j <= premium_row_columns) {
                              tr += `
                           <th class="data-table-row-column long">
                               YoY
                           </th>
                           <th class="data-table-row-column long">
                               ${d[j]}
                           </th>
                         `;
                          }
                          else {
                              tr += `
                           <th class="data-table-row-column long blur_data_table">
                               YoY
                           </th>
                           <th class="data-table-row-column long blur_data_table">
                               ${d[j]}
                           </th>
                         `;
                          }
                          if (mobile_cash_premium_card != null) {
                            mobile_cash_premium_card.style.display = "block";
                        }

                      }
                  }

                  tr += "</tr>";
              } else {
                  var d = annual_statement[i];
                  tr = `
                        <tr class="data-table-row">
                            <td class="data-table-row-first scroll-row-cash-annual data-table-row-bg parentInactive" id="parentTrBalSheetAnnual">
                                ${d[0]}
                            </td>`;
                  for (var j = 1; j < d.length; j++) {
                      // yoy = calculateYoY(d, j, 1);
                      if (d[j] == 'NM' || d[j] == '-') { data = '-' } else data = parseFloat((d[j]).replace(',', '')).toFixed(1);
                      // subtract data with previous data
                      if (j > 1 & data != '-') {
                          var yoy = (d[j - 1] == 'NM' || d[j - 1] == '-') ? 0.0 : parseFloat((data - parseFloat((d[j - 1]).replace(',', ''))).toFixed(1));
                          yoy = Math.abs(yoy)
                      } else {
                          var yoy = 0.0;
                      }
                      if (system_user_premium == 'True') {
                          tr += `
                          <td class="data-table-row-column long">
                              <span class="">${yoy}</span>
                          </td>
                          <td class="data-table-row-column long">
                              <span class="">${data}</span>
                          </td>
                        `;
                        if (mobile_cash_premium_card != null) {
                          mobile_cash_premium_card.style.display = "none";
                        }

                      }
                      else {
                          if (j <= premium_row_columns) {
                              tr += `
                              <td class="data-table-row-column long">
                                  <span class="">${yoy}</span>
                              </td>
                              <td class="data-table-row-column long">
                                  <span class="">${data}</span>
                              </td>
                            `;
                          }
                          else {
                              tr += `
                              <td class="data-table-row-column long blur_data_table">
                                  <span class="">${yoy}</span>
                              </td>
                              <td class="data-table-row-column long blur_data_table">
                                  <span class="">${data}</span>
                              </td>
                            `;
                          }
                          if (mobile_cash_premium_card != null) {
                            mobile_cash_premium_card.style.display = "block";
                        }

                      }
                  }

                  tr += "</tr>";
              }
              annual_statement_table.append(tr);
          }
      }

  }

  var quarterly_statement_table = $("#scrolling-container-cash-flow-quarterly-table");
  $("#scrolling-container-cash-flow-quarterly-table tr").remove();
  if (quarterly_statement) {
      if (quarterly_statement.length == 0) {
        if (mobile_cash_premium_card != null) {
          mobile_cash_premium_card.style.display = "none";
      }

      }
      else {
          for (var i = 0; i < quarterly_statement.length; i++) {
              var tr;
              if (i === 0) {
                  tr = `
            <tr class="data-table-row data-table-head-bg">
            <th class="data-table-row-first scroll-row-cash-quarter">
            Items
            </th>`;
                  var d = quarterly_statement[i];
                  for (var j = 1; j < d.length; j++) {
                      if (system_user_premium == 'True') {
                          tr += `
                          <th class="data-table-row-column long">
                              YoY
                          </th>
                          <th class="data-table-row-column long">
                              ${d[j]}
                          </th>
                        `;
                        if (mobile_cash_premium_card != null) {
                          mobile_cash_premium_card.style.display = "none";
                      }
                      }
                      else {
                          if (j <= premium_row_columns) {
                              tr += `
                           <th class="data-table-row-column long">
                               YoY
                           </th>
                           <th class="data-table-row-column long">
                               ${d[j]}
                           </th>
                         `;
                          }
                          else {
                              tr += `
                           <th class="data-table-row-column long blur_data_table">
                               YoY
                           </th>
                           <th class="data-table-row-column long blur_data_table">
                               ${d[j]}
                           </th>
                         `;
                          }
                          if (mobile_cash_premium_card != null) {
                            mobile_cash_premium_card.style.display = "block";
                        }
                      }
                  }

                  tr += "</tr>";
              } else {
                  var d = quarterly_statement[i];
                  tr = `
                    <tr class="data-table-row">
                        <td class="data-table-row-first scroll-row-cash-quarter data-table-row-bg parentInactive" id="parentTrBalSheetAnnual">
                            ${d[0]}
                        </td>`;
                  for (var j = 1; j < d.length; j++) {
                      // yoy = calculateYoY(d, j, 1);
                      if (d[j] == 'NM' || d[j] == '-') { data = '-' } else data = parseFloat((d[j]).replace(',', '')).toFixed(1);
                      // subtract data with previous data
                      if (j > 1 & data != '-') {
                          var yoy = (d[j - 1] == 'NM' || d[j - 1] == '-') ? 0.0 : parseFloat((data - parseFloat((d[j - 1]).replace(',', ''))).toFixed(1));
                          yoy = Math.abs(yoy)
                      } else {
                          var yoy = 0.0;
                      }
                      if (system_user_premium == 'True') {
                          tr += `
                      <td class="data-table-row-column long">
                          <span class="">${yoy}</span>
                      </td>
                      <td class="data-table-row-column long">
                          <span class="">${data}</span>
                      </td>
                    `;
                      if (mobile_cash_premium_card != null) {
                        mobile_cash_premium_card.style.display = "none";
                      }

                      }
                      else {
                          if (j <= premium_row_columns) {
                              tr += `
                          <td class="data-table-row-column long">
                              <span class="">${yoy}</span>
                          </td>
                          <td class="data-table-row-column long">
                              <span class="">${data}</span>
                          </td>
                        `;
                          }
                          else {
                              tr += `
                          <td class="data-table-row-column long blur_data_table">
                              <span class="">${yoy}</span>
                          </td>
                          <td class="data-table-row-column long blur_data_table">
                              <span class="">${data}</span>
                          </td>
                        `;
                          }
                          if (mobile_cash_premium_card != null) {
                            mobile_cash_premium_card.style.display = "block";
                        }
                      }
                  }

                  tr += "</tr>";
              }
              quarterly_statement_table.append(tr);
          }
      }
  }
}

$(document).on("click", "#parentTrIncStatementQuarter", function () {
  $(".parentInactive").not(this).removeClass("parentInactive");
  $(this).toggleClass("parentActive");
  if ($(this).hasClass("parentActive")) {
    $(".childTrIncStatementQuarter").show();
  } else {
    $(".childTrIncStatementQuarter").hide();
  }
});

$(document).on("click", "#parentTrSecondIncStatementQuarter", function () {
  $(".parentInactive").not(this).removeClass("parentInactive");
  $(this).toggleClass("parentActive");
  if ($(this).hasClass("parentActive")) {
    $(".childTrSecondIncStatementQuarter").show();
  } else {
    $(".childTrSecondIncStatementQuarter").hide();
  }
});

$(document).on("click", "#parentTrIncStatementAnnual", function () {
  $(".parentInactive").not(this).removeClass("parentInactive");
  $(this).toggleClass("parentActive");
  if ($(this).hasClass("parentActive")) {
    $(".childTrIncStatementAnnual").show();
  } else {
    $(".childTrIncStatementAnnual").hide();
  }
});

$(document).on("click", "#parentTrSecondIncStatementAnnual", function () {
  $(".parentInactive").not(this).removeClass("parentInactive");
  $(this).toggleClass("parentActive");
  if ($(this).hasClass("parentActive")) {
    $(".childTrSecondIncStatementAnnual").show();
  } else {
    $(".childTrSecondIncStatementAnnual").hide();
  }
});

$(document).on("click", "#parentTrBalSheetQuarter", function () {
  $(".parentInactive").not(this).removeClass("parentInactive");
  $(this).toggleClass("parentActive");
  if ($(this).hasClass("parentActive")) {
    $(".childTrBalSheetQuarter").show();
  } else {
    $(".childTrBalSheetQuarter").hide();
  }
});

$(document).on("click", "#parentTrSecondBalSheetQuarter", function () {
  $(".parentInactive").not(this).removeClass("parentInactive");
  $(this).toggleClass("parentActive");
  if ($(this).hasClass("parentActive")) {
    $(".childTrSecondBalSheetQuarter").show();
  } else {
    $(".childTrSecondBalSheetQuarter").hide();
  }
});

$(document).on("click", "#parentTrThirdBalSheetQuarter", function () {
  $(".parentInactive").not(this).removeClass("parentInactive");
  $(this).toggleClass("parentActive");
  if ($(this).hasClass("parentActive")) {
    $(".childTrThirdBalSheetQuarter").show();
  } else {
    $(".childTrThirdBalSheetQuarter").hide();
  }
});

$(document).on("click", "#parentTrFourthBalSheetQuarter", function () {
  $(".parentInactive").not(this).removeClass("parentInactive");
  $(this).toggleClass("parentActive");
  if ($(this).hasClass("parentActive")) {
    $(".childTrFourthBalSheetQuarter").show();
  } else {
    $(".childTrFourthBalSheetQuarter").hide();
  }
});

$(document).on("click", "#parentTrFifthBalSheetQuarter", function () {
  $(".parentInactive").not(this).removeClass("parentInactive");
  $(this).toggleClass("parentActive");
  if ($(this).hasClass("parentActive")) {
    $(".childTrFifthBalSheetQuarter").show();
  } else {
    $(".childTrFifthBalSheetQuarter").hide();
  }
});

$(document).on("click", "#parentTrBalSheetAnnual", function () {
  $(".parentInactive").not(this).removeClass("parentInactive");
  $(this).toggleClass("parentActive");
  if ($(this).hasClass("parentActive")) {
    $(".childTrBalSheetAnnual").show();
  } else {
    $(".childTrBalSheetAnnual").hide();
  }
});

$(document).on("click", "#parentTrSecondBalSheetAnnual", function () {
  $(".parentInactive").not(this).removeClass("parentInactive");
  $(this).toggleClass("parentActive");
  if ($(this).hasClass("parentActive")) {
    $(".childTrSecondBalSheetAnnual").show();
  } else {
    $(".childTrSecondBalSheetAnnual").hide();
  }
});

$(document).on("click", "#parentTrThirdBalSheetAnnual", function () {
  $(".parentInactive").not(this).removeClass("parentInactive");
  $(this).toggleClass("parentActive");
  if ($(this).hasClass("parentActive")) {
    $(".childTrThirdBalSheetAnnual").show();
  } else {
    $(".childTrThirdBalSheetAnnual").hide();
  }
});

$(document).on("click", "#parentTrFourthBalSheetAnnual", function () {
  $(".parentInactive").not(this).removeClass("parentInactive");
  $(this).toggleClass("parentActive");
  if ($(this).hasClass("parentActive")) {
    $(".childTrFourthBalSheetAnnual").show();
  } else {
    $(".childTrFourthBalSheetAnnual").hide();
  }
});

$(document).on("click", "#parentTrFifthBalSheetAnnual", function () {
  $(".parentInactive").not(this).removeClass("parentInactive");
  $(this).toggleClass("parentActive");
  if ($(this).hasClass("parentActive")) {
    $(".childTrFifthBalSheetAnnual").show();
  } else {
    $(".childTrFifthBalSheetAnnual").hide();
  }
});

$(document).on("click", "#parentTrCashFlowQuarter", function () {
  $(".parentInactive").not(this).removeClass("parentInactive");
  $(this).toggleClass("parentActive");
  if ($(this).hasClass("parentActive")) {
    $(".childTrCashFlowQuarter").show();
  } else {
    $(".childTrCashFlowQuarter").hide();
  }
});

$(document).on("click", "#parentTrSecondCashFlowQuarter", function () {
  $(".parentInactive").not(this).removeClass("parentInactive");
  $(this).toggleClass("parentActive");
  if ($(this).hasClass("parentActive")) {
    $(".childTrSecondCashFlowQuarter").show();
  } else {
    $(".childTrSecondCashFlowQuarter").hide();
  }
});

$(document).on("click", "#parentTrThirdCashFlowQuarter", function () {
  $(".parentInactive").not(this).removeClass("parentInactive");
  $(this).toggleClass("parentActive");
  if ($(this).hasClass("parentActive")) {
    $(".childTrThirdCashFlowQuarter").show();
  } else {
    $(".childTrThirdCashFlowQuarter").hide();
  }
});

$(document).on("click", "#parentTrCashFlowAnnual", function () {
  $(".parentInactive").not(this).removeClass("parentInactive");
  $(this).toggleClass("parentActive");
  if ($(this).hasClass("parentActive")) {
    $(".childTrCashFlowAnnual").show();
  } else {
    $(".childTrCashFlowAnnual").hide();
  }
});

$(document).on("click", "#parentTrSecondCashFlowAnnual", function () {
  $(".parentInactive").not(this).removeClass("parentInactive");
  $(this).toggleClass("parentActive");
  if ($(this).hasClass("parentActive")) {
    $(".childTrSecondCashFlowAnnual").show();
  } else {
    $(".childTrSecondCashFlowAnnual").hide();
  }
});

$(document).on("click", "#parentTrThirdCashFlowAnnual", function () {
  $(".parentInactive").not(this).removeClass("parentInactive");
  $(this).toggleClass("parentActive");
  if ($(this).hasClass("parentActive")) {
    $(".childTrThirdCashFlowAnnual").show();
  } else {
    $(".childTrThirdCashFlowAnnual").hide();
  }
});
