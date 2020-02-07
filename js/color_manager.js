ColorsManager = function () {
    var isColorBlindnessModeEnabled = localStorage.getItem("colorBlindnessMode");
    if (isColorBlindnessModeEnabled == undefined) this.isColorBlindnessModeEnabled = false;
    else if (isColorBlindnessModeEnabled == 'true') this.isColorBlindnessModeEnabled = true;
    else this.isColorBlindnessModeEnabled = false;
}

ColorsManager.prototype.isColorBlindModeEnabled = function () {
    return this.isColorBlindnessModeEnabled;
}

ColorsManager.prototype.setColorBlindModeEnabled = function (enabled) {
    localStorage.setItem('colorBlindnessMode', enabled.toString());
    this.isColorBlindnessModeEnabled = enabled;
}

ColorsManager.prototype.getScatterplotColorSet = function () {
    if (this.isColorBlindModeEnabled()) {
        var color = {
            "Monday": '#1b9e77',
            "Tuesday": "#d95f02",
            "Wednesday": "#7570b3",
            "Thursday": "#e7298a",
            "Friday": "#66a61e",
            "Saturday": "#a6761d",
            "Sunday": "#666666"
          };
        return color;
    } else {
        var color = {
            "Monday": '#1b9e77',
            "Tuesday": "#d95f02",
            "Wednesday": "#7570b3",
            "Thursday": "#e7298a",
            "Friday": "#66a61e",
            "Saturday": "#a6761d",
            "Sunday": "#666666"
          };
    }
}

ColorsManager.prototype.getParallelHighlightColor = function () {
    if (this.isColorBlindModeEnabled()) return '#e41a1c';
    else return 'e41a1c';
}

ColorsManager.prototype.getParallelNormalColor = function () {
    if (this.isColorBlindModeEnabled()) return '#4daf4a';
    else return '#4daf4a';
}

ColorsManager.prototype.getMapHighlightColor = function () {
    if (this.isColorBlindModeEnabled()) return '#e41a1c';
    else return 'e41a1c';
}

ColorsManager.prototype.getMapNormalColor = function () {
    if (this.isColorBlindModeEnabled()) return '#4daf4a';
    else return '#4daf4a';
}

ColorsManager.prototype.getMapTerrainColor = function () {
    if (this.isColorBlindModeEnabled()) return "#a6cee3";
    else return "#a6cee3";
}

ColorsManager.prototype.getBarChartColor = function () {
    if (this.isColorBlindModeEnabled()) return "#fdb462";
    else return "#fdb462";
}

ColorsManager.prototype.getBoxplotColor = function () {
    if (this.isColorBlindModeEnabled()) return "#bebada";
    else return "#bebada";
}

ColorsManager.prototype.getHistogramColor = function () {
    if (this.isColorBlindModeEnabled()) return "#80b1d3";
    else return "#80b1d3";
}
var colorManager = new ColorsManager();
