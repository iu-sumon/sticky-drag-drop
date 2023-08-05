//Code for DARK/LIGHT Mode
var toggleSwitch = document.querySelector('.ld-theme-switch input[type="checkbox"]');
toggleSwitch.checked = true;
var getcurrentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : 'dark';
//Check local saved user preference for theme mode dark/light
if (getcurrentTheme) {
    if (getcurrentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
    else{
        toggleSwitch.checked = false;
    }
    
}

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark'); //add this
    }
    else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light'); //add this
    }    
    var getTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : 'dark';

    if($('#index_tv_chart').length > 0){
        change_index_chart_theme(getTheme);
    }
    if($('#tv_chart_container').length > 0 || $('#tv_chart_container_advanced').length > 0){
        change_chart_theme(getTheme);
    }
}

toggleSwitch.addEventListener('change', switchTheme, false);