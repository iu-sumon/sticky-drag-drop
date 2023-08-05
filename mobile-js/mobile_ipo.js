$(document).ready(function () {
    get_mobile_ipo_data();
});

function populateFormFields(symbolInfo, prefix) {
    document.getElementById(`${prefix}_company_name`).value = symbolInfo.symbol;
    document.getElementById(`${prefix}_subscription_open`).value = symbolInfo.subscription_open;
    document.getElementById(`${prefix}_subscription_close`).value = symbolInfo.subscription_close;
    document.getElementById(`${prefix}_offer_price`).value = symbolInfo.offer_price;
    document.getElementById(`${prefix}_general_investment`).value = symbolInfo.general_investment;
    document.getElementById(`${prefix}_nrb_investment`).value = symbolInfo.nrb_investment;
    document.getElementById(`${prefix}_general_amount`).value = symbolInfo.general_amount;
    document.getElementById(`${prefix}_nav_per_share`).value = symbolInfo.nav_per_share;
    document.getElementById(`${prefix}_issue_manager`).value = symbolInfo.issue_manager;
    document.getElementById(`${prefix}_auditor`).value = symbolInfo.auditor;
    document.getElementById(`${prefix}_business_nature`).value = symbolInfo.business_nature;
}

// Mobile IPO Page Load
var onMobileIpoFormClick = (symbolInfo, id) => {
    // load a html page into the main content area
    if (id == 'closed-container') {
        $('#page-content').load('analysis/mobile_closed_ipo_form', function () {
            populateFormFields(symbolInfo, 'mobile');
        });
    } else {
        $('#page-content').load('analysis/mobile_ipo_form', function () {
            populateFormFields(symbolInfo, 'mobile');
        });
    }
};

$('.back-button-ipo').on('click', function () {
    $(this).css("background-color", "linear-gradient(to left,#26d6e6,#67efb8)");
    $('#page-content').load('mobile_home'); // Redirect to home
});


async function get_mobile_ipo_data() {
    try {
        var ongoingResponse = await fetch('ipo/ongoing_ipo');
        var ongoingData = await ongoingResponse.json();
        renderMobileIPOList(ongoingData, 'ongoing-container');

        var upcomingResponse = await fetch('ipo/upcoming_ipo');
        var upcomingData = await upcomingResponse.json();
        renderMobileIPOList(upcomingData, 'upcoming-container');

        var closedResponse = await fetch('ipo/closed_ipo');
        var closedData = await closedResponse.json();
        renderMobileIPOList(closedData, 'closed-container');
    } catch (error) {
        console.error(error);
    }
}
    

function renderMobileIPOList(data, id) {
    if (id == 'ongoing-container') $("#ongoing-title").html(`Ongoing ${data.symbol_info.length}`)
    if (id == 'upcoming-container') $("#upcoming-title").html(`Upcoming ${data.symbol_info.length}`)
    if (id == 'closed-container') $("#closed-title").html(`Closed ${data.symbol_info.length}`)

    var container = document.getElementById(id);

    for (var i = 0; i < data.symbol_info.length; i++) {
        var div1 = document.createElement('div');
        div1.className = 'd-flex justify-content-between align-items-center';
        div1.innerHTML = `
            <div class="pl-2 pt-2">
                <p class="ipo-t text-left">${id == 'closed-container' ? 'Closed on' : 'Closes on'} ${data.symbol_info[i].subscription_close}</p>
                <p class="ipo-v text-left">${data.symbol_info[i].symbol}</p>
            </div>
            <div class="pr-2">
                <p class="ipo-t text-right">Offer Price</p>
                <p class="ipo-v text-right">${data.symbol_info[i].offer_price}</p>
            </div>
        `;
        container?.appendChild(div1);

        var div2 = document.createElement('div');
        div2.className = 'd-flex justify-content-between align-items-center mt-2';
        div2.innerHTML = `
            <div class="pl-2">
                <p class="ipo-t text-left">Minimum Investment</p>
                <p class="ipo-v text-left">${data.symbol_info[i].general_investment} (GP) and ${data.symbol_info[i].nrb_investment} (NRB)</p>
            </div>
            <div class="pr-2" onclick='onMobileIpoFormClick(${JSON.stringify(data.symbol_info[i])}, ${JSON.stringify(id)})'>
                <button class="btn mobile-ipo-details-btn">Details</button>
            </div>
        `;
        container?.appendChild(div2);
    }
}


function addMobileIPO(event, form, url) {
    event.preventDefault();
  
    fetch(url, {
      method: 'POST',
      body: new FormData(form),
    })
      .then(response => response.json())
      .then(data => {
        //   show_flash_messages('IPO Submitted for ' + data.client_code, 'success');
          $('#page-content').load('analysis/mobile_ipo'); 
      })
      .catch(error => {
        console.error(error);
        show_flash_messages('Error Submitting IPO', 'danger');
      });
  }

var mobile_ipo_form = document.getElementById('mobile_ipo_form')
var mobile_closed_ipo_form = document.getElementById('mobile_closed_ipo_form')

mobile_ipo_form?.addEventListener('submit', event => {
    addMobileIPO(event, mobile_ipo_form, 'ipo/client_ipo/client_list');
});

mobile_closed_ipo_form?.addEventListener('submit', event => {
    addMobileIPO(event, mobile_closed_ipo_form, 'ipo/client_ipo/client_list');
});