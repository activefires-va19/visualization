Orchestrator = function () {
    this.dataLoaded = false;
    this.data = []
    this.highlightBrush = []
    this.highlighOthers = []
    this.listenersContainer = new EventTarget();
    this.filteringByScatterplot = undefined;
    this.filteringByParallel = undefined;
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
            _obj.data.push(loadedData[i])
        }
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
    this.listenersContainer.dispatchEvent(new Event('parallelBrushing'));
}

Orchestrator.prototype.notifyOtherHighlight = function () {
    this.listenersContainer.dispatch(new Event('otherHighlight'));
}

Orchestrator.prototype.notifyDataChanged = function () {
    this.listenersContainer.dispatch(new Event('dataChanged'));
}

var orchestrator = new Orchestrator();
orchestrator.loadData();