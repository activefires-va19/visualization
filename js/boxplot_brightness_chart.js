var margin_box_b = { top: 10, right: 60, bottom: 30, left: 50 },
    width_box_b = Math.round(clientWidth * 0.01),
    height_box_b = Math.round(clientHeight * 0.1);
var svg_box_b1 = d3.select(".boxplot1")
    .append("svg")
    .attr("width", '100%')
    .attr("height", '100%')
    .append("g")
    .attr("transform", "translate(" + margin_box_b.left + "," + margin_box_b.top + ")");

var channel = 1;

orchestrator.addListener('dataReady', function (e) {
    document.getElementById("c21").disabled = true;
    document.getElementById("c31").disabled = false;
    data = evalData();
    var points_brightness = [];
    var points_brightness_31k_ = [];
    data.forEach(elem => {
        points_brightness.push(+elem["brightness"]);
        points_brightness_31k_.push(+elem["bright_t31"]);
    });

    var data_sorted1 = points_brightness.sort(d3.ascending);
    var first_quantile1 = d3.quantile(data_sorted1, .25);
    var median1 = d3.quantile(data_sorted1, .5);
    var third_quantile1 = d3.quantile(data_sorted1, .75);
    var interQuantileRange1 = third_quantile1 - first_quantile1;
    var min1 = first_quantile1 - 1.5 * interQuantileRange1;
    var max1 = first_quantile1 + 1.5 * interQuantileRange1;

    if (min1 < 0) min1 = 0;

    var center1 = 50;
    var width1 = 25;

    var low1;

    var f1 = 0;
    if (max1 - min1 < 2) f1 = 0.5 * (max1 - min1);

    if (min1 - 1 + f1 < 0) {
        low1 = 0;
    }
    else {
        low1 = min1 - 1 + f1;
    }
    var high1 = max1 + 1 - f1;

    var y1 = d3.scaleLinear()
        .domain([low1, high1])
        .range([height_box_b, 0]);

    var yAxis = d3.axisLeft(y1);

    y_axis_box1 = svg_box_b1.append("g").attr('class', "y_axis").call(yAxis.ticks(6));

    y_axis_box1.selectAll("text").style("fill", colorManager.getTextColor());

    y_axis_box1.selectAll("line").style("stroke", colorManager.getAxesColor());

    y_axis_box1.select(".domain").style("stroke", colorManager.getAxesColor());

    svg_box_b1.append("line").attr('class', "box_line_vertical")
        .attr("x1", center1)
        .attr("x2", center1)
        .attr("y1", y1(min1))
        .attr("y2", y1(max1))
        .attr("stroke", colorManager.getLineColor());

    svg_box_b1.append("rect").attr('class', "box_rect")
        .attr("x", center1 - width1 / 2)
        .attr("y", y1(third_quantile1))
        .attr("height", (y1(first_quantile1) - y1(third_quantile1)))
        .attr("width", width1)
        .attr("stroke", colorManager.getLineColor())
        .style("fill", colorManager.getBoxplotColor());

    svg_box_b1.selectAll("wings").attr('class', "box_wings")
        .data([min1, median1, max1])
        .enter()
        .append("line")
        .attr('class', "box_line_horizontal")
        .attr("x1", center1 - width1 / 2)
        .attr("x2", center1 + width1 / 2)
        .attr("y1", function (d) { return (y1(d)) })
        .attr("y2", function (d) { return (y1(d)) })
        .attr("stroke", colorManager.getLineColor());

    svg_box_b1.append("text")
        .attr("id", "label_bright")
        .attr("class", "label_boxplot")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin_box_b.left)
        .attr("x", 0 - (height_box_b / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("fill", colorManager.getTextColor())
        .text("Brightness");


    orchestrator.addListener('parallelBrushing', function (e) {
        update(channel);
    });

    orchestrator.addListener('updatedDataFiltering', function (e) {
        update(channel);
    });


    orchestrator.addListener('colorChanged', function (e) {
        update(channel);
    });


    function update(num) {

        channel = num
        data = evalData();
        var points_brightness = [];
        var points_brightness_31k_ = [];
        data.forEach(elem => {
            points_brightness.push(+elem["brightness"]);
            points_brightness_31k_.push(+elem["bright_t31"]);
        });
        if (channel == 1) {
            selected_data_channel = points_brightness;
        }
        else {
            selected_data_channel = points_brightness_31k_;
        }
        var data_len = selected_data_channel.length;
        if (data_len == 0) {
            svg_box_b1.select(".y_axis").style('display', "none");
            svg_box_b1.select('.box_line_vertical').style('display', "none");
            svg_box_b1.select('.box_rect').style('display', "none");
            svg_box_b1.selectAll('.box_line_horizontal').style('display', "none");
            return;
        }
        var data_sorted1 = selected_data_channel.sort(d3.ascending);
        var first_quantile1 = d3.quantile(data_sorted1, .25);
        var median1 = d3.quantile(data_sorted1, .5);
        var third_quantile1 = d3.quantile(data_sorted1, .75);
        var interQuantileRange1 = third_quantile1 - first_quantile1;
        var min1 = first_quantile1 - 1.5 * interQuantileRange1;
        var max1 = first_quantile1 + 1.5 * interQuantileRange1;
        if (min1 < 0) min1 = 0;
        var center1 = 50;
        var width1 = 25;
        var low1;

        var f1 = 0;
        if (max1 - min1 < 2) f1 = 0.5 * (max1 - min1);

        if (min1 - 1 + f1 < 0) {
            low1 = 0;
        }
        else {
            low1 = min1 - 1 + f1;
        }
        var high1 = max1 + 1 - f1;

        var y1 = d3.scaleLinear()
            .domain([low1, high1])
            .range([height_box_b, 0]);

        var yAxis = d3.axisLeft(y1);
        svg_box_b1.select(".y_axis").transition().duration(150).style('display', null).call(yAxis.ticks(6));

        y_axis_box1 = svg_box_b1.select(".y_axis");

        y_axis_box1.selectAll("text").style("fill", colorManager.getTextColor());

        y_axis_box1.selectAll("line").style("stroke", colorManager.getAxesColor());

        y_axis_box1.select(".domain").style("stroke", colorManager.getAxesColor());

        svg_box_b1.select('.box_line_vertical')
            .attr("x1", center1)
            .attr("x2", center1)
            .attr("y1", y1(min1))
            .attr("y2", y1(max1))
            .attr("stroke", colorManager.getLineColor())
            .style('display', null);
        ;

        svg_box_b1.select('.box_rect')
            .attr("x", center1 - width1 / 2)
            .attr("y", y1(third_quantile1))
            .attr("height", (y1(first_quantile1) - y1(third_quantile1)))
            .attr("width", width1)
            .attr("stroke", colorManager.getLineColor())
            .style("fill", colorManager.getBoxplotColor()).style('display', null);;

        svg_box_b1.selectAll('.box_line_horizontal')
            .data([min1, median1, max1])
            .attr("x1", center1 - width1 / 2)
            .attr("x2", center1 + width1 / 2)
            .attr("y1", function (d) { return (y1(d)) })
            .attr("y2", function (d) { return (y1(d)) })
            .attr("stroke", colorManager.getLineColor())
            .style('display', null);

        if (channel == 1) {
            text_axis = "Brightness";
        }
        else {
            text_axis = "Brightness 31k";
        }

        svg_box_b1.select("#label_bright").remove();

        svg_box_b1.append("text")
            .attr("id", "label_bright")
            .attr("class", "label_boxplot")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin_box_b.left)
            .attr("x", 0 - (height_box_b / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("fill", colorManager.getTextColor())
            .text(text_axis);
    }

    function evalData() {
        return orchestrator.getDataFilteredByParallel();
    }

    d3.select("#c21").on("click", function () {
        document.getElementById("c21").disabled = true;
        document.getElementById("c31").disabled = false;
        update(1);

    });

    d3.select("#c31").on("click", function () {
        document.getElementById("c21").disabled = false;
        document.getElementById("c31").disabled = true;
        update(2);
    });

});


