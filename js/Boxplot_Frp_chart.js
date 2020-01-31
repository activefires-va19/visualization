var svg_box_b3 = d3.select(".box3")
    .append("svg")
    .attr("width", width_box_b + margin_box_b.left + margin_box_b.right)
    .attr("height", height_box_b + margin_box_b.top + margin_box_b.bottom)
    .append("g")
    .attr("transform", "translate(" + margin_box_b.left + "," + margin_box_b.top + ")");

orchestrator.addListener('dataReady', function (e) {
    data = orchestrator.data;
    var points_frp = [];
    data.forEach(elem => {
        points_frp.push(+elem["frp"]);
    });

    var data_sorted3 = points_frp.sort(d3.ascending);
    var first_quantile3 = d3.quantile(data_sorted3, .25);
    var median3 = d3.quantile(data_sorted3, .5);
    var third_quantile3 = d3.quantile(data_sorted3, .75);
    var interQuantileRange3 = third_quantile3 - first_quantile3;
    var min3 = first_quantile3 - 1.5 * interQuantileRange3;
    var max3 = first_quantile3 + 1.5 * interQuantileRange3;

    var center3 = 50;
    var width3 = 25;

    var y3 = d3.scaleLinear()
        .domain([(min3 - 10), (max3 + 10)])
        .range([height_box_b, 0]);

    var yAxis3 = d3.axisLeft(y3);

    svg_box_b3.append("g").call(yAxis3.ticks(8));

    svg_box_b3.append("line")
        .attr("x1", center3)
        .attr("x2", center3)
        .attr("y1", y3(min3))
        .attr("y2", y3(max3))
        .attr("stroke", "black");

    svg_box_b3.append("rect")
        .attr("x", center3 - width3 / 2)
        .attr("y", y3(third_quantile3))
        .attr("height", (y3(first_quantile3) - y3(third_quantile3)))
        .attr("width", width3)
        .attr("stroke", "black")
        .style("fill", "#6fb1f3");

    svg_box_b3.selectAll("wings")
        .data([min3, median3, max3])
        .enter()
        .append("line")
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
})