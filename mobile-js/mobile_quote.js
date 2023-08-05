// Global Variables
var yesterday_closing = 0.0;
var total_share = 0.0;
var eps_annual_latest = 0.0;
var eps_ttm = 0.0;


// Get Numeric Value
var getNumericValue = (item_value) => {
  var numeric_value = Number(item_value);
  if (Number.isNaN(numeric_value)) return "-";
  return numeric_value.toFixed(2);
};

// Convert Million to Crore Value
var convertMillionToCrore = (item_value) => {
  var numeric_value = Number(item_value);
  if (Number.isNaN(numeric_value)) return "-";
  else {
    var crore_value = (numeric_value / 10).toFixed(2);
    return crore_value;
  }
};

// Convert to Crore Value
var convertToCrore = (item_value) => {
  var numeric_value = Number(item_value);
  if (Number.isNaN(numeric_value)) return "-";
  else {
    var crore_value = (numeric_value / 10000000).toFixed(2);
    return crore_value;
  }
};

// Get Actual Holding Shares
var getActualHoldingShares = (item_value) => {
  var numeric_value = Number(item_value);
  if (Number.isNaN(numeric_value)) return "-";
  else {
    var share_value = ((Number(total_share) * numeric_value) / 100).toFixed(2);
    return share_value;
  }
};

// Get Value Difference in Formatted String
var getValueDifferenceFormattedString = (item_value1, item_value2) => {
  var numeric_value1 = Number(item_value1);
  var numeric_value2 = Number(item_value2);
  var value_difference = 0.0;
  if (Number.isNaN(numeric_value1) && Number.isNaN(numeric_value2))
      return "(0.00)";
  else if (Number.isNaN(numeric_value2)) value_difference = (0.00);
  else if (Number.isNaN(numeric_value1)) value_difference = (0.00);
  else value_difference = numeric_value1 - numeric_value2;

  return value_difference > 0
      ? "(+" + value_difference.toFixed(2) + ")"
      : "(" + value_difference.toFixed(2) + ")";
};


var setCompanyAllBasicInformation = ({
  basic_info_list,
  directors_holdings_list,
  latest_annual_eps,
  financial_quarter_list,
}) => {
  setCompanyBasicInfo(basic_info_list[0]);
  setDirectorShareHoldings(directors_holdings_list);
  setLatestFinancialAnnualEPS(latest_annual_eps);
  setFinancialQuarterlyEPS(financial_quarter_list);
};

// Set Data for basic_info
var setCompanyBasicInfo = (data) => {
  document.getElementById("floor_data").innerHTML = DOMPurify.sanitize(data[17]);
  document.getElementById("whl52").innerHTML = DOMPurify.sanitize(
    data[3].toString() + '/' + data[4].toString()
  );
  document.getElementById("p_e").innerHTML = DOMPurify.sanitize(
    data[5].toString()
  );
  document.getElementById("reserve").innerHTML = DOMPurify.sanitize(
    convertMillionToCrore(data[6]) + "cr"
  );
  document.getElementById("nav").innerHTML = DOMPurify.sanitize(
    data[7].toString()
  );
  document.getElementById("dividend_yield").innerHTML = DOMPurify.sanitize(
    data[8].toString()
  );
  document.getElementById("year_end").innerHTML = DOMPurify.sanitize(
    data[9].toString()
  );
  document.getElementById("free_float").innerHTML = DOMPurify.sanitize(
    convertToCrore(data[11]) + "cr"
  );
  total_share = convertToCrore(data[12]);
  // console.log('Total Share:' + total_share);
  document.getElementById("total_share").innerHTML = DOMPurify.sanitize(
    total_share + "cr"
  );
  document.getElementById("market_cap").innerHTML = DOMPurify.sanitize(
    convertToCrore(data[13]) + "cr"
  );
  document.getElementById("paid_up_capital").innerHTML = DOMPurify.sanitize(
    convertMillionToCrore(data[14]) + "cr"
  );
  document.getElementById("authorized_capital").innerHTML = DOMPurify.sanitize(
    convertMillionToCrore(data[15]) + "cr"
  );
  
};

//Set Data for directors_share_holdings
var setDirectorShareHoldings = (data) => {
  document.getElementById("holding-subtitle").innerHTML = getFormattedDate(data[0][2]);
  document.getElementById("sponsor_director_latest").innerHTML =
    DOMPurify.sanitize(data[0][3] + "%");
  document.getElementById("govt_share_latest").innerHTML = DOMPurify.sanitize(
    data[0][4] + "%"
  );
  document.getElementById("institute_share_latest").innerHTML = DOMPurify.sanitize(
    data[0][5] + "%"
  );
  document.getElementById("foreign_share_latest").innerHTML = DOMPurify.sanitize(
    data[0][6] + "%"
  );
  document.getElementById("public_share_latest").innerHTML = DOMPurify.sanitize(
    data[0][7] + "%"
  );

  document.getElementById("sponsor_director").innerHTML = DOMPurify.sanitize(
    data[1][3] + "%"
  );
  document.getElementById("govt_share").innerHTML = DOMPurify.sanitize(
    data[1][4] + "%"
  );
  document.getElementById("institute_share").innerHTML = DOMPurify.sanitize(
    data[1][5] + "%"
  );
  document.getElementById("foreign_share").innerHTML = DOMPurify.sanitize(
    data[1][6] + "%"
  );
  document.getElementById("public_share").innerHTML = DOMPurify.sanitize(
    data[1][7] + "%"
  );

  document.getElementById("director_share_percentage").innerHTML =
    DOMPurify.sanitize(getActualHoldingShares(data[0][3]) + "cr");
  document.getElementById("govt_share_percentage").innerHTML = DOMPurify.sanitize(
    getActualHoldingShares(data[0][4]) + "cr"
  );
  document.getElementById("institute_share_percentage").innerHTML =
    DOMPurify.sanitize(getActualHoldingShares(data[0][5]) + "cr");
  document.getElementById("foreign_share_percentage").innerHTML =
    DOMPurify.sanitize(getActualHoldingShares(data[0][6]) + "cr");
  document.getElementById("public_share_percentage").innerHTML =
    DOMPurify.sanitize(getActualHoldingShares(data[0][7]) + "cr");

  document.getElementById("sponsor_director_change").innerHTML =
    DOMPurify.sanitize(getValueDifferenceFormattedString(data[0][3], data[1][3]));
  document.getElementById("govt_share_change").innerHTML = DOMPurify.sanitize(
    getValueDifferenceFormattedString(data[0][4], data[1][4])
  );
  document.getElementById("institute_share_change").innerHTML = DOMPurify.sanitize(
    getValueDifferenceFormattedString(data[0][5], data[1][5])
  );
  document.getElementById("foreign_share_change").innerHTML = DOMPurify.sanitize(
    getValueDifferenceFormattedString(data[0][6], data[1][6])
  );
  document.getElementById("public_share_change").innerHTML = DOMPurify.sanitize(
    getValueDifferenceFormattedString(data[0][7], data[1][7])
  );

  setValueDifferenceColor();
};

// Set Data for Cash and Stock Dividend
var getCashAndStockDividend = (div_data) => {
  var result = ["C", "S"];
  if (div_data) {
    var div_items = div_data.toString().split("|");
    if (div_items.length > 1) {
      result[0] = div_items[0].trim();
      result[1] = div_items[1].trim();
    } else {
      if (div_items[0].endsWith("C")) {
        result[0] = div_items[0].trim();
      } else if (div_items[0].endsWith("S")) {
        result[1] = div_items[0].trim();
      }
    }
  }
  return result;
};

var setCashStockDividend = ({ dividend_latest_list }) => {
  if (dividend_latest_list == undefined) return;
  var result = getCashAndStockDividend(dividend_latest_list);
  document.getElementById("dividend-cash").innerHTML = result[0];
  document.getElementById("dividend-stock").innerHTML = result[1];

};

// Set Data for latest_financial_annual_eps
var setLatestFinancialAnnualEPS = (data) => {
  eps_annual_latest = getNumericValue(data);
  document.getElementById("eps_annual_latest").innerHTML =
    DOMPurify.sanitize(eps_annual_latest);
};

// Set Data for financial_quarterly_eps
var setFinancialQuarterlyEPS = (data) => {    
    if (data == null) return;
    // check if Q2 date is greater than Q1 date then set Q2 as q2_latest
    // else set Q2 as q2_earlier
    var q1_latest = getNumericValue(data[0][2]);
    var q1_earlier = getNumericValue(data[1][2]);
    var q2_latest = '';
    var q2_earlier = '';
    var q3_latest = '';
    var q3_earlier = '';

    var q1_latest_date = getFormattedDate2(data[0][0]);
    var q2_latest_date = getFormattedDate2(data[2][0]);
    var q3_latest_date = getFormattedDate2(data[4][0]);

    if (q2_latest_date > q1_latest_date) {
        q2_latest = getNumericValue(data[2][2]);
        q2_earlier = getNumericValue(data[3][2]);
    } else {
        q2_latest = '-';
        q2_earlier = getNumericValue(data[2][2]);
    }

    if (q3_latest_date > q2_latest_date & q3_latest_date > q1_latest_date) {
        q3_latest = getNumericValue(data[4][2]);
        q3_earlier = getNumericValue(data[5][2]);
    } else {
        q3_latest = '-';
        q3_earlier = getNumericValue(data[4][2]);
    }

    document.querySelector(".q1_latest").innerHTML = DOMPurify.sanitize(q1_latest);
    document.querySelector(".q2_latest").innerHTML = DOMPurify.sanitize(q2_latest);
    document.querySelector(".q3_latest").innerHTML = DOMPurify.sanitize(q3_latest);
    document.getElementById("q1_earlier").innerHTML = DOMPurify.sanitize(q1_earlier);
    document.getElementById("q2_earlier").innerHTML = DOMPurify.sanitize(q2_earlier);
    document.getElementById("q3_earlier").innerHTML = DOMPurify.sanitize(q3_earlier);

    document.getElementById("q1_latest_diff").innerHTML = DOMPurify.sanitize(
        getValueDifferenceFormattedString(q1_latest, q1_earlier)
    );
    document.getElementById("q2_latest_diff").innerHTML = DOMPurify.sanitize(
        getValueDifferenceFormattedString(q2_latest, q2_earlier)
    );
    document.getElementById("q3_latest_diff").innerHTML = DOMPurify.sanitize(
        getValueDifferenceFormattedString(q3_latest, q3_earlier)
    );

    var count = 0;
    var q_ttm = 0.0;
    if (q1_latest != "-") {
        count++;
        q_ttm += Number(q1_latest);
    }
    if (q2_latest != "-") {
        count++;
        q_ttm += Number(q2_latest);
    }
    if (q3_latest != "-") {
        count++;
        q_ttm += Number(q3_latest);
    }

    eps_ttm = (q_ttm / count) * 4;
    document.querySelector(".eps_annual_ttm").innerHTML = Number.isNaN(eps_ttm)
    ? "-"
    : eps_ttm.toFixed(2);
    
    document.getElementById("eps_annual_ttm_diff").innerHTML = DOMPurify.sanitize(
      getValueDifferenceFormattedString(eps_ttm, eps_annual_latest)
      );

    setClass($('.eps_annual_ttm'), eps_ttm, 'down');
    setClass($('.q1_latest'), q1_latest, 'down');
    setClass($('.q2_latest'), q2_latest, 'down');
    setClass($('.q3_latest'), q3_latest, 'down');

    setValueDifferenceColor();
};

function setClass(elem, value, className) {
  if (value < 0) {
    elem.removeClass('up down neutral').addClass(className);
  } else {
    elem.removeClass('up down neutral').addClass('neutral');
  }
}

var setValueDifferenceColor = () => {
  $(".of_number_to_be_evaluated:contains('+')")
    .addClass("green")
    .removeClass("red");
  $(".of_number_to_be_evaluated:contains('-')")
    .addClass("red")
    .removeClass("green");
  $(".of_number_to_be_evaluated:contains('0.00')")
    .removeClass("red")
    .removeClass("green");
};
