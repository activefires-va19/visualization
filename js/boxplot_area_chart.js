var svg_box_b2 = d3.select(".boxplot2")
    .append("svg")
    .attr("width", '100%')
    .attr("height", '100%')
    .append("g")
    .attr("transform", "translate(" + margin_box_b.left + "," + margin_box_b.top + ")");

orchestrator.addListener('dataReady', function (e) {
    data = evalData();
    var area = [];
    data.forEach(elem => {
        area.push(+elem["area"]);
    });

    var data_sorted2 = area.sort(d3.ascending);
    var first_quantile2 = d3.quantile(data_sorted2, .25);
    var median2 = d3.quantile(data_sorted2, .5);
    var third_quantile2 = d3.quantile(data_sorted2, .75);
    var interQuantileRange2 = third_quantile2 - first_quantile2;
    var min2 = first_quantile2 - 1.5 * interQuantileRange2;
    var max2 = first_quantile2 + 1.5 * interQuantileRange2;

    if (min2 < 0) min2 = 0;

    var center2 = 50;
    var width2 = 25;

    var low2;

    if (min2 < 0) {
        low2 = 0;
    }
    else {
        low2 = min2;
    }

    var high2 = max2;

    var y2 = d3.scaleLinear()
        .domain([low2, high2])
        .range([height_box_b, 0]);

    var yAxis2 = d3.axisLeft(y2);

    y_axis_box2 = svg_box_b2.append("g").attr('class', "y_axis").call(yAxis2.ticks(6));

    y_axis_box2.selectAll("text").style("fill", colorManager.getTextColor());

    y_axis_box2.selectAll("line").style("stroke", colorManager.getAxesColor());

    y_axis_box2.select(".domain").style("stroke", colorManager.getAxesColor());

    svg_box_b2.append("line")
        .attr('class', "box_line_vertical")
        .attr("x1", center2)
        .attr("x2", center2)
        .attr("y1", y2(min2))
        .attr("y2", y2(max2))
        .attr("stroke", colorManager.getLineColor());

    svg_box_b2.append("rect")
        .attr('class', "box_rect")
        .attr("x", center2 - width2 / 2)
        .attr("y", y2(third_quantile2))
        .attr("height", (y2(first_quantile2) - y2(third_quantile2)))
        .attr("width", width2)
        .attr("stroke", colorManager.getLineColor())
        .style("fill", colorManager.getBoxplotColor());

    svg_box_b2.selectAll("wings").attr('class', "box_wings")
        .data([min2, median2, max2])
        .enter()
        .append("line")
        .attr('class', "box_line_horizontal")
        .attr("x1", center2 - width2 / 2)
        .attr("x2", center2 + width2 / 2)
        .attr("y1", function (d) { return (y2(d)) })
        .attr("y2", function (d) { return (y2(d)) })
        .attr("stroke", colorManager.getLineColor());

    svg_box_b2.append("text")
        .attr("id" , "label_area")
        .attr("class", "label_boxplot")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin_box_b.left)
        .attr("x", 0 - (height_box_b / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("fill", colorManager.getTextColor())
        .text("Area");

    orchestrator.addListener('parallelBrushing', function (e) {
        update();
    });

    orchestrator.addListener('updatedDataFiltering', function (e) {
        update();
    });


    orchestrator.addListener('colorChanged', function (e) {
        update();
    });


    function update() {
        data = evalData();
        var area = [];
        data.forEach(elem => {
            area.push(+elem["area"]);
        });
        var data_len = area.length;
        if (data_len == 0) {
            svg_box_b2.select(".y_axis").style('display', "none");
            svg_box_b2.select('.box_line_vertical').style('display', "none");
            svg_box_b2.select('.box_rect').style('display', "none");
            svg_box_b2.selectAll('.box_line_horizontal').style('display', "none");
            return;
        }
        var data_sorted2 = area.sort(d3.ascending);
        var first_quantile2 = d3.quantile(data_sorted2, .25);
        var median2 = d3.quantile(data_sorted2, .5);
        var third_quantile2 = d3.quantile(data_sorted2, .75);
        var interQuantileRange2 = third_quantile2 - first_quantile2;
        var min2 = first_quantile2 - 1.5 * interQuantileRange2;
        var max2 = first_quantile2 + 1.5 * interQuantileRange2;

        if (min2 < 0) min2 = 0;

        var center2 = 50;
        var width2 = 25;

        var low2;

        if (min2 < 0) {
            low2 = 0;
        }
        else {
            low2 = min2;
        }

        var high2 = max2;

        var y2 = d3.scaleLinear()
            .domain([low2, high2])
            .range([height_box_b, 0]);

        var yAxis2 = d3.axisLeft(y2);

        y_axis_box2 = svg_box_b2.select(".y_axis").style("display", null).call(yAxis2.ticks(6));

        y_axis_box2.selectAll("text").style("fill", colorManager.getTextColor());

        y_axis_box2.selectAll("line").style("stroke", colorManager.getAxesColor());

        y_axis_box2.select(".domain").style("stroke", colorManager.getAxesColor());

        svg_box_b2.select("#label_area").style("fill", colorManager.getTextColor());

        svg_box_b2.select('.box_line_vertical')
            .attr("x1", center2)
            .attr("x2", center2)
            .attr("y1", y2(min2))
            .attr("y2", y2(max2))
            .attr("stroke", colorManager.getLineColor())
            .style("display", null);

        svg_box_b2.select('.box_rect')
            .attr("x", center2 - width2 / 2)
            .attr("y", y2(third_quantile2))
            .attr("height", (y2(first_quantile2) - y2(third_quantile2)))
            .attr("width", width2)
            .attr("stroke", colorManager.getLineColor())
            .style("fill", colorManager.getBoxplotColor())
            .style("display", null);

        svg_box_b2.selectAll('.box_line_horizontal')
            .data([min2, median2, max2])
            .attr("x1", center2 - width2 / 2)
            .attr("x2", center2 + width2 / 2)
            .attr("y1", function (d) { return (y2(d)) })
            .attr("y2", function (d) { return (y2(d)) })
            .attr("stroke", colorManager.getLineColor())
            .style("display", null);
    }
    function evalData() {
        return orchestrator.getDataFilteredByParallel();
    }
});

