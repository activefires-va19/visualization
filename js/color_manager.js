ColorsManager = function () {
    var isColorBlindnessModeEnabled = localStorage.getItem("colorBlindnessMode");
    var isDarkModeEnabled = localStorage.getItem("darkMode");
    if (isColorBlindnessModeEnabled == undefined) this._isColorBlindnessModeEnabled = false;
    else if (isColorBlindnessModeEnabled == 'true') this._isColorBlindnessModeEnabled = true;
    else this._isColorBlindnessModeEnabled = false;

    if (isDarkModeEnabled == undefined) this._isDarkModeEnabled = false;
    else if (isDarkModeEnabled == 'true') this._isDarkModeEnabled = true;
    else this._isDarkModeEnabled = false;
}

ColorsManager.prototype.isColorBlindModeEnabled = function () {
    return this._isColorBlindnessModeEnabled;
}

ColorsManager.prototype.isDarkModeEnabled = function () {
    return this._isDarkModeEnabled;
}

ColorsManager.prototype.setDarkModeEnabled = function (enabled) {
    localStorage.setItem('darkMode', enabled.toString());
    this._isDarkModeEnabled = enabled;
}

ColorsManager.prototype.setColorBlindModeEnabled = function (enabled) {
    localStorage.setItem('colorBlindnessMode', enabled.toString());
    this._isColorBlindnessModeEnabled = enabled;
}

ColorsManager.prototype.getScatterplotColorSet = function () {
    var color;
    if (this.isDarkModeEnabled()) {
        if (this.isColorBlindModeEnabled()) {
            color = {
                "Monday": '#2b77df',
                "Tuesday": "#6d8181",
                "Wednesday": "#F0F032",
                "Thursday": "#C32C01",
                "Friday": "#A1DBFF",
                "Saturday": "#FFFFFF",
                "Sunday": "#FFA765"
            };
        } else {
            color = {
                "Monday": '#1b9e77',
                "Tuesday": "#d95f02",
                "Wednesday": "#7570b3",
                "Thursday": "#e7298a",
                "Friday": "#66a61e",
                "Saturday": "#FFFFFF",
                "Sunday": "#a6761d"
            };
        }
    } else {
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
                "Saturday": "#666666",
                "Sunday": "#a6761d"
            };
        }
    }

    return color;
}

ColorsManager.prototype.getParallelHighlightColor = function () {
    if (this.isDarkModeEnabled()) {
        if (this.isColorBlindModeEnabled()) return '#fc8d62';
        else return '#e41a1c';
    } else {
        if (this.isColorBlindModeEnabled()) return '#fc8d62';
        else return '#e41a1c';
    }

}

ColorsManager.prototype.getParallelNormalColor = function () {
    if (this.isDarkModeEnabled()) {
        if (this.isColorBlindModeEnabled()) return '#66c2a5';
        else return '#4daf4a';
    } else {
        if (this.isColorBlindModeEnabled()) return '#66c2a5';
        else return '#4daf4a';
    }
}

ColorsManager.prototype.getParallelBackgroundColor = function () {
    if (this.isDarkModeEnabled()) {
        return '#595953';
    } else {
        return '#ddd';
    }
}


ColorsManager.prototype.getMapHighlightColor = function () {
    if (this.isDarkModeEnabled()) {
        if (this.isColorBlindModeEnabled()) return '#fc8d62';
        else return '#e41a1c';
    } else {
        if (this.isColorBlindModeEnabled()) return '#fc8d62';
        else return '#e41a1c';
    }
}

ColorsManager.prototype.getMapNormalColor = function () {
    if (this.isDarkModeEnabled()) {
        if (this.isColorBlindModeEnabled()) return '#66c2a5';
        else return '#4daf4a';
    } else {
        if (this.isColorBlindModeEnabled()) return '#66c2a5';
        else return '#4daf4a';
    }
}

ColorsManager.prototype.getMapTerrainColor = function () {
    if (this.isDarkModeEnabled()) {
        if (this.isColorBlindModeEnabled()) return "#c2cce3";
        else return "#a6cee3";
    } else {
        if (this.isColorBlindModeEnabled()) return "#c2cce3";
        else return "#a6cee3";
    }
}

ColorsManager.prototype.getMapPathColor = function () {
    if (this.isDarkModeEnabled()) {
        if (this.isColorBlindModeEnabled()) return "#c2cce3";
        else return "#a6cee3";
    } else {
        if (this.isColorBlindModeEnabled()) return "#c2cce3";
        else return "#a6cee3";
    }
}

ColorsManager.prototype.getBarChartColor = function () {
    if (this.isDarkModeEnabled()) {
        if (this.isColorBlindModeEnabled()) return "#a6cee3";
        else return "#fdb462";
    } else {
        if (this.isColorBlindModeEnabled()) return "#a6cee3";
        else return "#fdb462";
    }
}

ColorsManager.prototype.getBoxplotColor = function () {
    if (this.isDarkModeEnabled()) {
        if (this.isColorBlindModeEnabled()) return "#cc6500";
        else return "#984ea3";
    } else {
        if (this.isColorBlindModeEnabled()) return "#f4a582";
        else return "#bebada";
    }
}

ColorsManager.prototype.getHistogramColor = function () {
    if (this.isDarkModeEnabled()) {
        if (this.isColorBlindModeEnabled()) return "#b2df8a";
        else return "#80b1d3";
    } else {
        if (this.isColorBlindModeEnabled()) return "#b2df8a";
        else return "#80b1d3";
    }
}

ColorsManager.prototype.getTextColor = function () {
    if (this.isDarkModeEnabled()) return "#FFFFFF";
    else return "#000000";
}

ColorsManager.prototype.getAxesColor = function () {
    if (this.isDarkModeEnabled()) return "#FFFFFF";
    else return "#000000";
}

ColorsManager.prototype.getLineColor = function () {
    if (this.isDarkModeEnabled()) return "#FFFFFF";
    else return "#000000";
}

ColorsManager.prototype.getModeColor = function () {
    if (this.isDarkModeEnabled()) return "#1d1e21";
    else return "#FFFFFF";
}

ColorsManager.prototype.getHeaderBackgroundColor = function () {
    if (this.isDarkModeEnabled()) return "#383838";
    else return "#f3f3f3";
}

ColorsManager.prototype.getBorderColor = function () {
    if (this.isDarkModeEnabled()) return "#707070";
    else return "#808080";
}

ColorsManager.prototype.getMapBorderColor = function () {
    if (this.isDarkModeEnabled()) return "#bdbdbd";
    else return "#000000";
}

ColorsManager.prototype.getCircleSelectedBorderColor = function () {
    if (this.isDarkModeEnabled()) return "#d7d7d7";
    else return "#000000";
}

var colorManager = new ColorsManager();
setBlindnessButton();
setDarkModeButton();

function setBlindnessButton() {
    updateBlindnessImgStyle();
    document.getElementById('blind_button').addEventListener("click", function () {
        colorManager.setColorBlindModeEnabled(!colorManager.isColorBlindModeEnabled());
        updateBlindnessImgStyle();
        orchestrator.notifyColorChanged();
    });
}

function updateBlindnessImgStyle() {
    var blind_img = document.getElementById('blind_img');
    if (colorManager.isColorBlindModeEnabled() && !colorManager.isDarkModeEnabled()) blind_img.src = './res/blind_on.svg';
    else if (!colorManager.isColorBlindModeEnabled() && !colorManager.isDarkModeEnabled()) blind_img.src = './res/blind_off.svg';
    else if (colorManager.isColorBlindModeEnabled() && colorManager.isDarkModeEnabled()) blind_img.src = './res/blind_on_dark.svg';
    else blind_img.src = './res/blind_off_dark.svg';
}

function setDarkModeButton() {
    var darkmode_img = document.getElementById('darkmode_img');
    if (colorManager.isDarkModeEnabled()) darkmode_img.src = './res/darkmode_on.svg';
    else darkmode_img.src = './res/darkmode_off.svg';
    document.getElementById('darkmode_button').addEventListener("click", function () {
        colorManager.setDarkModeEnabled(!colorManager.isDarkModeEnabled());
        if (colorManager.isDarkModeEnabled()) darkmode_img.src = './res/darkmode_on.svg';
        else darkmode_img.src = './res/darkmode_off.svg';
        updateBlindnessImgStyle()
        orchestrator.notifyColorChanged();
    });
}