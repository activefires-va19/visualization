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
        for (i = 0; i < loadedData.length; i++) {
            day = new Date(loadedData[i].acq_date).getDay();
            if (day == 0) dayOfWeek = 'Monday';
            else if (day == 1) dayOfWeek = 'Tuesday';
            else if (day == 2) dayOfWeek = 'Wednesday';
            else if (day == 3) dayOfWeek = 'Thursday';
            else if (day == 4) dayOfWeek = 'Friday';
            else if (day == 5) dayOfWeek = 'Saturday';
            else dayOfWeek = 'Sunday';
            loadedData[i].dayOfWeek = dayOfWeek;
            loadedData[i].area = parseFloat(loadedData[i].scan)*parseFloat(loadedData[i].track);
            _obj.dataOriginal.push(loadedData[i])
            _obj.data.push(loadedData[i])
            _obj.dataWeekly.push(loadedData[i])
        }
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

Orchestrator.prototype.notifyOtherHighlight = function () {
    this.listenersContainer.dispatch(new Event('otherHighlight'));
}

Orchestrator.prototype.notifyDataChanged = function () {
    this.listenersContainer.dispatch(new Event('dataChanged'));
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
    this.listenersContainer.dispatchEvent(new Event('updatedDataFiltering'));
}


var orchestrator = new Orchestrator();
orchestrator.loadData();

var checkboxTerra = document.querySelector("input[name='terra']");
checkboxTerra.checked=true;
checkboxTerra.addEventListener( 'change', function() {
    orchestrator.terra = this.checked;
    orchestrator.triggerFilterEvent();
});

var checkboxAqua = document.querySelector("input[name='aqua']");
checkboxAqua.checked=true;
checkboxAqua.addEventListener( 'change', function() {
    orchestrator.aqua = this.checked;
    orchestrator.triggerFilterEvent();
});

var checkboxDay = document.querySelector("input[name='day']");
checkboxDay.checked=true;
checkboxDay.addEventListener( 'change', function() {
    orchestrator.day = this.checked;
    orchestrator.triggerFilterEvent();
});

var checkboxNight = document.querySelector("input[name='night']");
checkboxNight.checked=true;
checkboxNight.addEventListener( 'change', function() {
    orchestrator.night = this.checked;
    orchestrator.triggerFilterEvent();
});

clientWidth = document.documentElement.clientWidth;
clientHeight = document.documentElement.clientHeight;