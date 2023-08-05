
$(document).ready(function() {
    //Symbol-News Hide
    $("#symbol-news-content").hide();
    fetch_news();
});

//Get Symbol Market News Button
$('#sym_news').click(function(e){
    e.preventDefault();
    if($('#instrument').val() != null){
        sym_news();
        $('#all-news-content').hide()
        $('#symbol-news-content').toggle();
        $('#all_news').removeClass('widget-btn-active');
        $('#sym_news').toggleClass('widget-btn-active');
    }
});
//Get all Market News Button
$('#all_news').click(function(e){
    e.preventDefault();
    fetch_news();
    $('#symbol-news-content').hide()
    $('#all-news-content').toggle();
    $('#sym_news').removeClass('widget-btn-active');
    $('#all_news').toggleClass('widget-btn-active');
});
//Get all Market News
function fetch_news(){
    $.get("/shared/getallnews/", function (data) {
        if(data.length > 0){
            $("#all-news-content ul").empty(); 
            for (i = 0; i < data.length; i++) {
                news_ref = data[i].news_ref;
                news_title = data[i].news_title;
                news_date = data[i].news_date;
                news_text = data[i].news_text;
                news_type = data[i].news_type;
                last_update = data[i].last_update;

                var news_li = document.createElement('li');
                news_li.className = 'news-list tab-border-bottom list-align text-title';
                news_li.setAttribute('onclick', `openmodal_today_news(${JSON.stringify(data[i])})`);

                //News Table
                news_li.innerHTML = `
                <div class="d-felx flex-column">
                <div class="d-flex justify-content-start align-items-center" style="font-size: 12px;font-weight: 500;">
                    <div>${news_ref}</div>&nbsp;&nbsp;·&nbsp;&nbsp;
                    <div>${news_type}</div>&nbsp;&nbsp;·&nbsp;&nbsp;
                    <div>
                        ${last_update}
                    </div>
                </div>
                <div class="news-text" style="
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 93%;
                color: var(--font-muted);">
                    ${news_text}
                </div>
                
                </div>
                `

                $("#all-news-content ul").append(news_li);

                if (i == 0) {
                    flashnum($(".newstitle"));
                }
            }
        }
    });
}
//Get Symbol Market News
function sym_news(ticker=null){
    $("#symbol-news-content").empty();
    if(ticker == null){
        if($('#instrument').val() != null){
            var symbol_split = $("#instrument").val().split(".");
            var symbol = symbol_split[0];
            var board = symbol_split[1];
            $.get("/shared/getsymbolnews/", {inst:symbol}, function (data) {
                if(data.length > 0){
                    for (i = 0; i < data.length; i++) {
                        news_ref = data[i].news_ref;
                        news_title = data[i].news_title;
                        news_date = data[i].news_date;
                        news_text = data[i].news_text;
                        news_type = data[i].news_type;
                        
                        //News Table
                        $("#symbol-news-content").append('\
                            <div class="newstitle">News Ref: <b>' + news_ref + '</b></div>\
                            <div>News Type: ' + news_type + '</div>\
                            <div>Title: ' + news_title + '</div>\
                            <br>\
                            <div>' + news_text + '</div>\
                            <br>\
                            <div>Post Date: ' + news_date + '</div>\
                            <br><br>');
                        if (i == 0){
                            flashnum($(".newstitle"));
                        }
                    }
                }
            });
        }
    } else {
        $.get("/shared/getsymbolnews/", {inst:ticker}, function (data) {
            if(data.length > 0){
                for (i = 0; i < data.length; i++) {
                    news_ref = data[i].news_ref;
                    news_title = data[i].news_title;
                    news_date = data[i].news_date;
                    news_text = data[i].news_text;
                    news_type = data[i].news_type;
                    
                    //News Table
                    $("#symbol-news-content").append('\
                        <div class="newstitle">News Ref: <b>' + news_ref + '</b></div>\
                        <div>News Type: ' + news_type + '</div>\
                        <div>Title: ' + news_title + '</div>\
                        <br>\
                        <div>' + news_text + '</div>\
                        <br>\
                        <div>Post Date: ' + news_date + '</div>\
                        <br><br>');
                    if (i == 0){
                        flashnum($(".newstitle"));
                    }
                }
            }
        });
    }
    
}


function openmodal_today_news(input) {
    $("#today-modal-table").modal("show");

    $("#exampleModalLongTitle").html(input.news_type+' · '+input.last_update);
    $(".modal-header h6").html(input.news_title);
    $(".modal-body .news-modal-body").html(input.news_text);

    $(".insider-modal-close-btn")
        .unbind()
        .click(function (event) {
            $("#today-modal-table").modal("hide");
        });
}

$('.back-button-news').on('click', function () {
    $(this).css("background-color", "linear-gradient(to left,#26d6e6,#67efb8)");
    $('#page-content').load('mobile_home'); // Redirect to home
});
