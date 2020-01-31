var svg_box_b2 = d3.select(".box2")
    .append("svg")
    .attr("width", width_box_b + margin_box_b.left + margin_box_b.right)
    .attr("height", height_box_b + margin_box_b.top + margin_box_b.bottom)
    .append("g")
    .attr("transform", "translate(" + margin_box_b.left + "," + margin_box_b.top + ")");

orchestrator.addListener('dataReady', function (e) {
    data = orchestrator.data;
    var points_brightness_31k = [];
    data.forEach(elem => {
        points_brightness_31k.push(+elem["bright_t31"]);
    });

    var data_sorted2 = points_brightness_31k.sort(d3.ascending);
    var first_quantile2 = d3.quantile(data_sorted2, .25);
    var median2 = d3.quantile(data_sorted2, .5);
    var third_quantile2 = d3.quantile(data_sorted2, .75);
    var interQuantileRange2 = third_quantile2 - first_quantile2;
    var min2 = first_quantile2 - 1.5 * interQuantileRange2;
    var max2 = first_quantile2 + 1.5 * interQuantileRange2;

    if(min2 < 0) min2 = 0;

    var center2 = 50;
    var width2 = 25;

    var low2;

    if(min2 - 10 < 0){
        low2 = 0;
    }
    else{
        low2 = (min2 - 10);
    }

    var high2 = (max2 + 10);

    var y2 = d3.scaleLinear()
        .domain([low2, high2])
        .range([height_box_b, 0]);

    var yAxis2 = d3.axisLeft(y2);

    svg_box_b2.append("g").call(yAxis2.ticks(8));

    svg_box_b2.append("line")
        .attr("x1", center2)
        .attr("x2", center2)
        .attr("y1", y2(min2))
        .attr("y2", y2(max2))
        .attr("stroke", "black");

    svg_box_b2.append("rect")
        .attr("x", center2 - width2 / 2)
        .attr("y", y2(third_quantile2))
        .attr("height", (y2(first_quantile2) - y2(third_quantile2)))
        .attr("width", width2)
        .attr("stroke", "black")
        .style("fill", "#6fb1f3");

    svg_box_b2.selectAll("wings")
        .data([min2, median2, max2])
        .enter()
        .append("line")
        .attr("x1", center2 - width2 / 2)
        .attr("x2", center2 + width2 / 2)
        .attr("y1", function (d) { return (y2(d)) })
        .attr("y2", function (d) { return (y2(d)) })
        .attr("stroke", "black");

    svg_box_b2.append("text")
        .attr("class", "label_boxplot")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin_box_b.left)
        .attr("x", 0 - (height_box_b / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Brightness 31k");
})