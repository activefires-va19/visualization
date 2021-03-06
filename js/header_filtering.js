var checkboxTerra = document.querySelector("input[name='terra']");
checkboxTerra.checked = true;
checkboxTerra.addEventListener('change', function () {
    orchestrator.terra = this.checked;
    orchestrator.triggerFilterEvent();
});

var checkboxAqua = document.querySelector("input[name='aqua']");
checkboxAqua.checked = true;
checkboxAqua.addEventListener('change', function () {
    orchestrator.aqua = this.checked;
    orchestrator.triggerFilterEvent();
});

var checkboxDay = document.querySelector("input[name='day']");
checkboxDay.checked = true;
checkboxDay.addEventListener('change', function () {
    orchestrator.day = this.checked;
    orchestrator.triggerFilterEvent();
});

var checkboxNight = document.querySelector("input[name='night']");
checkboxNight.checked = true;
checkboxNight.addEventListener('change', function () {
    orchestrator.night = this.checked;
    orchestrator.triggerFilterEvent();
});


var weekSelector = document.querySelector("input[name='year_week']");
weekSelector.addEventListener('change', function () {
    orchestrator.triggerWeekFilterEvent(getDateOfISOWeek(weekSelector.value.split("-W")[1], weekSelector.value.split("-")[0]));
});

orchestrator.addListener("dataReady", function (e) {
    data = orchestrator.data;
    update_statistics(data);
});

orchestrator.addListener("weekChanged", function (e) {
    data = orchestrator.dataWeekly;
    update_statistics(data);
});

orchestrator.addListener("colorChanged", function (e) {
   color_elements(true);
});

function update_statistics(data) {
    tot = data.length;
    acqua_n = 0;
    terra_n = 0;

    day_n = 0;
    night_n = 0;

    for (i = 0; i < data.length; i++) {
        if (data[i]["satellite"] == "A") {
            acqua_n += 1;
        }
        else {
            terra_n += 1;
        }

        if (data[i]["daynight"] == "D") {
            day_n += 1;
        }
        else {
            night_n += 1;
        }
    }

    acqua_p = Math.floor((acqua_n / tot) * 100);
    terra_p = Math.floor((terra_n / tot) * 100);
    day_p = Math.floor((day_n / tot) * 100);
    night_p = Math.floor((night_n / tot) * 100);

    if (acqua_p + terra_p < 100) acqua_p += 1;
    if (day_p + night_p < 100) day_p += 1;

    if (!Number.isNaN(terra_p)) d3.select("#terra_text").html("Terra (" + String(terra_p) + "%)");
    else d3.select("#terra_text").html("Terra");
    if (!Number.isNaN(acqua_p)) d3.select("#aqua_text").html("Aqua (" + String(acqua_p) + "%) &nbsp &nbsp");
    else d3.select("#aqua_text").html("Aqua &nbsp &nbsp");
    if (!Number.isNaN(day_p)) d3.select("#day_text").html("Day (" + String(day_p) + "%)");
    else d3.select("#day_text").html("Day");
    if (!Number.isNaN(night_p)) d3.select("#night_text").html("Night (" + String(night_p) + "%)&nbsp &nbsp");
    else d3.select("#night_text").html("Night &nbsp &nbsp");
}

function color_elements(animate){
    var duration = 0;
    if (animate) duration = 300;
    d3.select("body").transition().duration(duration).style("background-color", colorManager.getModeColor());
    d3.select(".header").transition().duration(duration).style("background-color", colorManager.getHeaderBackgroundColor());
    d3.selectAll("p").transition().duration(duration).style("color", colorManager.getTextColor());
    d3.selectAll("b").transition().duration(duration).style("color", colorManager.getTextColor());
    d3.select(".header").style("border-bottom", "1px solid " + colorManager.getBorderColor());
    d3.select(".map_area").style("border", "2px solid " + colorManager.getBorderColor());
    d3.select(".histo_area").style("border", "2px solid " + colorManager.getBorderColor());
    d3.select(".bar_area").style("border", "2px solid " + colorManager.getBorderColor());
    d3.select(".parallel_area").style("border", "2px solid " + colorManager.getBorderColor());
    d3.select(".box_area").style("border", "2px solid " + colorManager.getBorderColor());
    d3.select(".scatterplot_area").style("border", "2px solid " + colorManager.getBorderColor());
}

d3.select(window).on("load", color_elements);