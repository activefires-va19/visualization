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
    var color;
    if (this.isColorBlindModeEnabled()) {
        color = {
            "Monday": '#1468DC',
            "Tuesday": "#A1AFAF",
            "Wednesday": "#F0F032",
            "Thursday": "#C32C01",
            "Friday": "#A1DBFF",
            "Saturday": "#3B494A",
            "Sunday": "#FFA765"
        };
    } else {
        color = {
            "Monday": '#1b9e77',
            "Tuesday": "#d95f02",
            "Wednesday": "#7570b3",
            "Thursday": "#e7298a",
            "Friday": "#66a61e",
            "Saturday": "#a6761d",
            "Sunday": "#666666"
        };
    }
    return color;
}

ColorsManager.prototype.getParallelHighlightColor = function () {
    if (this.isColorBlindModeEnabled()) return '#fc8d62';
    else return '#e41a1c';
}

ColorsManager.prototype.getParallelNormalColor = function () {
    if (this.isColorBlindModeEnabled()) return '#66c2a5';
    else return '#4daf4a';
}

ColorsManager.prototype.getMapHighlightColor = function () {
    if (this.isColorBlindModeEnabled()) return '#fc8d62';
    else return '#e41a1c';
}

ColorsManager.prototype.getMapNormalColor = function () {
    if (this.isColorBlindModeEnabled()) return '#66c2a5';
    else return '#4daf4a';
}

ColorsManager.prototype.getMapTerrainColor = function () {
    if (this.isColorBlindModeEnabled()) return "#c2cce3";
    else return "#a6cee3";
}

ColorsManager.prototype.getBarChartColor = function () {
    if (this.isColorBlindModeEnabled()) return "#a6cee3";
    else return "#fdb462";
}

ColorsManager.prototype.getBoxplotColor = function () {
    if (this.isColorBlindModeEnabled()) return "#1f78b4";
    else return "#bebada";
}

ColorsManager.prototype.getHistogramColor = function () {
    if (this.isColorBlindModeEnabled()) return "#b2df8a";
    else return "#80b1d3";
}
var colorManager = new ColorsManager();
