var svg_box_b3 = d3.select(".boxplot3")
    .append("svg")
    .attr("width", '100%')
    .attr("height", '100%')
    .append("g")
    .attr("transform", "translate(" + margin_box_b.left + "," + margin_box_b.top + ")");

orchestrator.addListener('dataReady', function (e) {
    data = evalData();
    var points_frp = [];
    data.forEach(elem => {
        points_frp.push(+elem["frp"]);
    });

    //Calculating median and quantiles for boxplot
    var data_sorted3 = points_frp.sort(d3.ascending);
    var first_quantile3 = d3.quantile(data_sorted3, .25);
    var median3 = d3.quantile(data_sorted3, .5);
    var third_quantile3 = d3.quantile(data_sorted3, .75);
    var interQuantileRange3 = third_quantile3 - first_quantile3;
    var min3 = first_quantile3 - 1.5 * interQuantileRange3;
    var max3 = first_quantile3 + 1.5 * interQuantileRange3;

    if (min3 < 0) min3 = 0;

    var center3 = 50;
    var width3 = 25;

    var low3;

    if (min3 - 10 < 0) {
        low3 = 0;
    }
    else {
        low3 = (min3 - 10);
    }

    var high3 = (max3 + 10);

    var y3 = d3.scaleLinear()
        .domain([low3, high3])
        .range([height_box_b, 0]);

    var yAxis3 = d3.axisLeft(y3);

    svg_box_b3.append("g").attr('class', "y_axis").call(yAxis3.ticks(8));

    svg_box_b3.append("line")
        .attr('class', "box_line_vertical")
        .attr("x1", center3)
        .attr("x2", center3)
        .attr("y1", y3(min3))
        .attr("y2", y3(max3))
        .attr("stroke", "black");

    svg_box_b3.append("rect")
        .attr('class', "box_rect")
        .attr("x", center3 - width3 / 2)
        .attr("y", y3(third_quantile3))
        .attr("height", (y3(first_quantile3) - y3(third_quantile3)))
        .attr("width", width3)
        .attr("stroke", "black")
        .style("fill", colorManager.getBoxplotColor());

    svg_box_b3.selectAll("wings")
        .data([min3, median3, max3])
        .enter()
        .append("line")
        .attr('class', "box_line_horizontal")
        .attr("x1", center3 - width3 / 2)
        .attr("x2", center3 + width3 / 2)
        .attr("y1", function (d) { return (y3(d)) })
        .attr("y2", function (d) { return (y3(d)) })
        .attr("stroke", "black");

    svg_box_b3.append("text")
        .attr("class", "label_boxplot")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin_box_b.left)
        .attr("x", 0 - (height_box_b / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Frp");

    orchestrator.addListener('parallelBrushing', function (e) {
        update();
    });

    orchestrator.addListener('updatedDataFiltering', function (e) {
        update();
    });

    function update() {
        data = evalData();
        var points_frp = [];
        data.forEach(elem => {
            points_frp.push(+elem["frp"]);
        });

        data_len = points_frp.length;
        if (data_len == 0) {
            svg_box_b3.select(".y_axis").style('display', "none");
            svg_box_b3.select('.box_line_vertical').style('display', "none");
            svg_box_b3.select('.box_rect').style('display', "none");
            svg_box_b3.selectAll('.box_line_horizontal').style('display', "none");
            return;
        }

        //Calculating median and quantiles for boxplot
        var data_sorted3 = points_frp.sort(d3.ascending);
        var first_quantile3 = d3.quantile(data_sorted3, .25);
        var median3 = d3.quantile(data_sorted3, .5);
        var third_quantile3 = d3.quantile(data_sorted3, .75);
        var interQuantileRange3 = third_quantile3 - first_quantile3;
        var min3 = first_quantile3 - 1.5 * interQuantileRange3;
        var max3 = first_quantile3 + 1.5 * interQuantileRange3;

        if (min3 < 0) min3 = 0;

        var center3 = 50;
        var width3 = 25;

        var low3;

        if (min3 - 10 < 0) {
            low3 = 0;
        }
        else {
            low3 = (min3 - 10);
        }

        var high3 = (max3 + 10);

        var y3 = d3.scaleLinear()
            .domain([low3, high3])
            .range([height_box_b, 0]);

        var yAxis3 = d3.axisLeft(y3);

        svg_box_b3.select(".y_axis").style("display", null).call(yAxis3.ticks(8));

        svg_box_b3.select('.box_line_vertical')
            .attr("x1", center3)
            .attr("x2", center3)
            .attr("y1", y3(min3))
            .attr("y2", y3(max3))
            .attr("stroke", "black")
            .style('display', null);

        svg_box_b3.select('.box_rect')
            .attr("x", center3 - width3 / 2)
            .attr("y", y3(third_quantile3))
            .attr("height", (y3(first_quantile3) - y3(third_quantile3)))
            .attr("width", width3)
            .attr("stroke", "black")
            .style("fill", colorManager.getBoxplotColor())
            .style('display', null);

        svg_box_b3.selectAll('.box_line_horizontal')
            .data([min3, median3, max3])
            .attr("x1", center3 - width3 / 2)
            .attr("x2", center3 + width3 / 2)
            .attr("y1", function (d) { return (y3(d)) })
            .attr("y2", function (d) { return (y3(d)) })
            .attr("stroke", "black")
            .style('display', null);
    }
    function evalData() {
        return orchestrator.getDataFilteredByParallel();
    }
})