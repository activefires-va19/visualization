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
                "Saturday": "#a6761d",
                "Sunday": "#666666"
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
        if (this.isColorBlindModeEnabled()) return "#1f78b4";
        else return "#bebada";
    } else {
        if (this.isColorBlindModeEnabled()) return "#1f78b4";
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

ColorsManager.prototype.getBorderColor = function () {
    if (this.isDarkModeEnabled()) return "#FFFFFF";
    else return "#808080";
}

var colorManager = new ColorsManager();
setBlindnessButton();
setDarkModeButton();

function setBlindnessButton() {
    var blind_img = document.getElementById('blind_img');
    if (colorManager.isColorBlindModeEnabled()) blind_img.src = './res/blind_on.svg';
    else blind_img.src = './res/blind_off.svg';
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