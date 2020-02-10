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
    d3.csv("./data/dataset.csv", function (loadedData) {
        shuffleArray(loadedData);
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
            loadedData[i].area = parseFloat(loadedData[i].area)
            loadedData[i].acq_time = loadedData[i].acq_time.replace(':', '');
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

Orchestrator.prototype.notifyUpdatedDataFiltering = function () {
    this.listenersContainer.dispatchEvent(new Event('updatedDataFiltering'));
}

Orchestrator.prototype.notifyColorChanged = function () {
    this.listenersContainer.dispatchEvent(new Event('colorChanged'));
}

Orchestrator.prototype.getDataFilteredByParallel = function () {
    if (this.filteredByParallel == undefined) return this.data;
    else return this.filteredByParallel;
}

Orchestrator.prototype.getWeeklyFilteredData = function () {
    return this.data;
}

Orchestrator.prototype.triggerFilterEvent = function () {
    this._updateDataFromWeek();
    this.notifyUpdatedDataFiltering();
}

Orchestrator.prototype.triggerWeekFilterEvent = function (selectedWeek) {
    selectedWeek = getWeekNumber(selectedWeek);
    this.dataWeekly.splice(0, this.dataWeekly.length);
    for (i = 0; i < this.dataOriginal.length; i++) {
        d = this.dataOriginal[i];
        foundWeek = getWeekNumber(new Date(d.acq_date));
        if (selectedWeek[0] == foundWeek[0] && selectedWeek[1] == foundWeek[1]) this.dataWeekly.push(d);
    }
    this._updateDataFromWeek();
    this.notifyWeekChanged();
    this.notifyUpdatedDataFiltering();
}

Orchestrator.prototype._updateDataFromWeek = function () {
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
}
var orchestrator = new Orchestrator();
orchestrator.loadData();