Orchestrator = function () {
    this.dataLoaded = false;
    this.dataOriginal = [];
    this.dataWeekly = [];
    this.data = []
    this.filteredByParallel = undefined;
    this.listenersContainer = new EventTarget();
    this.filteringByScatterplot = undefined;
    this.filteringByParallel = undefined;
    this.aqua = true;
    this.terra = true;
    this.day = true;
    this.night = true;
}
Orchestrator.prototype.loadData = function () {
    _obj = this;
    d3.csv("./data/out_modis_20200129.csv", function (loadedData) {
        var max_week = undefined;
        var min_week = undefined;
        for (i = 0; i < loadedData.length; i++) {
            date = new Date(loadedData[i].acq_date);
            day = date.getDay();
            week_year = getWeekNumber(date);
            if (max_week == undefined) {
                max_week = week_year;
                min_week = week_year;
            } else {
                if (week_year[0] < min_week[0]) min_week = week_year;
                else if (week_year[0] == min_week[0] && week_year[1] < min_week[1]) min_week = week_year;
                if (week_year[0] > max_week[0]) max_week = week_year;
                else if (week_year[0] == max_week[0] && week_year[1] > max_week[1]) max_week = week_year;
            }
            if (day == 0) dayOfWeek = 'Monday';
            else if (day == 1) dayOfWeek = 'Tuesday';
            else if (day == 2) dayOfWeek = 'Wednesday';
            else if (day == 3) dayOfWeek = 'Thursday';
            else if (day == 4) dayOfWeek = 'Friday';
            else if (day == 5) dayOfWeek = 'Saturday';
            else dayOfWeek = 'Sunday';
            loadedData[i].dayOfWeek = dayOfWeek;
            loadedData[i].area = parseFloat(loadedData[i].scan) * parseFloat(loadedData[i].track);
            _obj.dataOriginal.push(loadedData[i])
        }
        for (i = 0; i < loadedData.length; i++) {
            foundWeek = getWeekNumber(new Date(loadedData[i].acq_date));
            if (max_week[0] == foundWeek[0] && max_week[1] == foundWeek[1]) {
                _obj.data.push(loadedData[i])
                _obj.dataWeekly.push(loadedData[i])
            }
        }
        setWeekSelectorMinMax(min_week, max_week);
        var weekSelector = document.querySelector("input[name='year_week']");
        weekSelector.addEventListener('change', function () {
            orchestrator.triggerWeekFilterEvent(getDateOfISOWeek(weekSelector.value.split("-W")[1],weekSelector.value.split("-")[0]));
        });
        loadedData.columns.push("dayOfWeek");
        loadedData.columns.push("area");
        _obj.dataLoaded = true;
        _obj.listenersContainer.dispatchEvent(new Event('dataReady'))
    })
}

Orchestrator.prototype.addListener = function (nameEvent, functionz) {
    if (this.dataLoaded && nameEvent == 'dataReady') functionz();
    else this.listenersContainer.addEventListener(nameEvent, functionz);
}

Orchestrator.prototype.notifyScatterplotBrushing = function () {
    this.listenersContainer.dispatchEvent(new Event('scatterplotBrushing'));
}

Orchestrator.prototype.notifyParallelBrushing = function () {
    if (this.filteredByParallel == undefined) this.filteredByParallel = [];
    else this.filteredByParallel.splice(0, this.filteredByParallel.length);
    for (i = 0; i < this.data.length; i++) {
        if (this.filteringByParallel != undefined && this.filteringByParallel(this.data[i])) this.filteredByParallel.push(this.data[i]);
    }
    this.listenersContainer.dispatchEvent(new Event('parallelBrushing'));
}

Orchestrator.prototype.notifyWeekChanged = function () {
    this.listenersContainer.dispatchEvent(new Event('weekChanged'));
}

Orchestrator.prototype.getDataFilteredByParallel = function () {
    if (this.filteredByParallel == undefined) return this.data;
    else return this.filteredByParallel;
}

Orchestrator.prototype.triggerFilterEvent = function () {
    this.data.splice(0, this.data.length);
    for (i = 0; i < this.dataWeekly.length; i++) {
        if (((this.dataWeekly[i].satellite == 'T' && this.terra) || (this.dataWeekly[i].satellite == 'A' && this.aqua))
            && ((this.dataWeekly[i].daynight == 'D' && this.day) || (this.dataWeekly[i].daynight == 'N' && this.night))) this.data.push(this.dataWeekly[i]);
    }
    if (this.filteredByParallel == undefined) this.filteredByParallel = [];
    else this.filteredByParallel.splice(0, this.filteredByParallel.length);
    for (i = 0; i < this.data.length; i++) {
        this.filteredByParallel.push(this.data[i]);
    }
    this.notifyWeekChanged();
    this.listenersContainer.dispatchEvent(new Event('updatedDataFiltering'));
}

Orchestrator.prototype.triggerWeekFilterEvent = function (selectedWeek) {
    selectedWeek = getWeekNumber(selectedWeek);
    this.dataWeekly.splice(0, this.dataWeekly.length);
    for (i = 0; i < this.dataOriginal.length; i++) {
        d = this.dataOriginal[i];
        foundWeek = getWeekNumber(new Date(d.acq_date));
        if (selectedWeek[0] == foundWeek[0] && selectedWeek[1] == foundWeek[1]) this.dataWeekly.push(d);
    }
    this.triggerFilterEvent();
}

var orchestrator = new Orchestrator();
orchestrator.loadData();

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

orchestrator.addListener("dataReady", function(e){
    data = orchestrator.data;
    update_statistics(data);
});

orchestrator.addListener("weekChanged", function(e){
    data = orchestrator.data;
    update_statistics(data);
});

function update_statistics(data){
    tot = data.length;
    acqua_n = 0;
    terra_n = 0;

    day_n = 0;
    night_n = 0;

    for(i = 0; i < data.length; i++){
        if(data[i]["satellite"] == "A"){
            acqua_n += 1;
        }
        else{
            terra_n += 1;
        }

        if(data[i]["daynight"] == "D"){
            day_n += 1;
        }
        else{
            night_n += 1;
        }
    }

    acqua_p = Math.floor( (acqua_n/tot)*100);
    terra_p = Math.floor( (terra_n/tot)*100);
    day_p = Math.floor( (day_n/tot)*100);
    night_p = Math.floor( (night_n/tot)*100);

    if(acqua_p + terra_p < 100) acqua_p += 1;
    if(day_p + night_p < 100) day_p += 1;


    d3.select("#terra_text").html("Terra ("+String(terra_p)+"%)");
    d3.select("#acqua_text").html("Acqua ("+String(acqua_p)+"%) &nbsp &nbsp");
    d3.select("#day_text").html("Day ("+String(day_p)+"%)");
    d3.select("#night_text").html("Night ("+String(night_p)+"%)&nbsp &nbsp");
}