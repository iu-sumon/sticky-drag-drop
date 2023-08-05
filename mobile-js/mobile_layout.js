function openmodal_global_profile(input) {
    $("#global-profile-modal").modal("show");
    $('.modal-backdrop').hide();
  }

  function renderPortfolio()
  {
    $('#page-content').load('portfolio/mobile_portfolio');
  }

  function openSearch()
  {
    $('#page-content').load('analysis/mobile_global_search');
    document.getElementById('global-top-bar').style.display= 'none'
    $("#main-content").css("padding-top", "0px");
  }

  