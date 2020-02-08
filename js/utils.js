clientWidth = document.documentElement.clientWidth;
clientHeight = document.documentElement.clientHeight;
function getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    // Return array of year and week number
    return [d.getUTCFullYear(), weekNo];
}

function getDateOfISOWeek(w, y) {
    var simple = new Date(y, 0, 1 + (w - 1) * 7);
    var dow = simple.getDay();
    var ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
}

function setWeekSelectorMinMax(min, max) {
    var weekSelector = document.querySelector("input[name='year_week']");
    var minWeekText, maxWeekText;
    if (min[1].toString().length == 1) {
        minWeekText = "0" + min[1].toString();
    } else minWeekText = min[1];
    if (max[1].toString().length == 1) maxWeekText = "0" + max[1].toString();
    else maxWeekText = max[1];
    weekSelector.min = min[0] + '-W' + minWeekText;
    weekSelector.max = max[0] + '-W' + maxWeekText;
    weekSelector.value = weekSelector.max;
}