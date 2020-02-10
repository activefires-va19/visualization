
var margin_b = { top: 27, right: 20, bottom: 0, left: 100 },
    width_b = Math.round(clientWidth * 0.25),
    height_b = Math.round(clientHeight * 0.31);

var svg_b = d3.select(".bar_area")
    .append("svg")
    .attr("width", '100%')
    .attr("height", '100%')
    .append("g")
    .attr("transform",
        "translate(" + margin_b.left + "," + margin_b.top + ")");

orchestrator.addListener('dataReady', function (e) {

    data = data = evalData();

    dict = {};
    for (i = 0; i < data.length; i++) {
        key_d = data[i]["country"];
        if (typeof dict[key_d] != "undefined") {
            dict[key_d] += 1;
        }
        else {
            dict[key_d] = 1;
        }
    }

    var items = Object.keys(dict).map(function (key) {
        return [key, dict[key]];
    });

    items.sort(function (first, second) {
        return second[1] - first[1];
    });

    var t10 = items.slice(0, 10);
    var t10_country = [];
    for (i = 0; i < t10.length; i++) {
        t10_country.push(t10[i][0]);
    }

    var x_b = d3.scaleLinear()
        .domain([0, items[0][1] + 5])
        .range([0, width_b]);

    x_axis_bar = svg_b.append("g")
        .attr("class", "x-axis_b")
        .attr("transform", "translate(0," + height_b + ")")
        .call(d3.axisBottom(x_b));

    x_axis_bar.selectAll("text")
        .attr("transform", "translate(2,0)")
        .style("text-anchor", "middle")
        .style("fill", colorManager.getTextColor())
        .style("font-size", "9px");

    x_axis_bar.selectAll("line")
        .style("stroke", colorManager.getAxesColor());

    x_axis_bar.select(".domain")
        .style("stroke", colorManager.getAxesColor());


    var y_b = d3.scaleBand()
        .range([0, height_b])
        .domain(t10_country)
        .padding(.1);

    y_axis_bar = svg_b.append("g")
        .attr("class", "y-axis_b")
        .call(d3.axisLeft(y_b));

    y_axis_bar.selectAll("text")
        .attr("class", "text_bar")
        .attr("transform", "rotate(-30)")
        .style("text-anchor", "end")
        .style("fill", colorManager.getTextColor())
        .style("font-size", "9px");

    y_axis_bar.selectAll("line")
        .style("stroke", colorManager.getAxesColor());

    y_axis_bar.select(".domain")
        .style("stroke", colorManager.getAxesColor());


    svg_b.selectAll("rect")
        .data(t10)
        .enter()
        .append("rect")
        .attr("class", "bar_rect")
        .attr("x", x_b(0))
        .attr("y", function (d) { return y_b(d[0]); })
        .attr("width", function (d) { return x_b(d[1]); })
        .attr("height", y_b.bandwidth())
        .attr("fill", colorManager.getBarChartColor())

    function update_bar() {
        data = evalData();

        dict = {};
        for (i = 0; i < data.length; i++) {
            key_d = data[i]["country"];
            if (typeof dict[key_d] != "undefined") {
                dict[key_d] += 1;
            }
            else {
                dict[key_d] = 1;
            }
        }

        items = Object.keys(dict).map(function (key) {
            return [key, dict[key]];
        });

        items.sort(function (first, second) {
            return second[1] - first[1];
        });

        if (items.length > 10) {
            t10 = items.slice(0, 10);
        }
        else {
            t10 = items;
        }

        t10_country = [];
        top_elem = 10;

        if (t10.length < 10) top_elem = t10.length;

        for (i = 0; i < top_elem; i++) {
            t10_country.push(t10[i][0]);
        }

        if (items.length != 0) {
            x_b.domain([0, items[0][1] + 5]);
        }
        else {
            x_b.domain([0, 5]);
        }

        y_b.domain(t10_country);

        x_axis_bar = svg_b.select(".x-axis_b")
            .call(d3.axisBottom(x_b));

        x_axis_bar.selectAll("text")
            .style("fill", colorManager.getTextColor())
            .style("text-anchor", "end");

        x_axis_bar.selectAll("line")
            .style("stroke", colorManager.getAxesColor());

        x_axis_bar.select(".domain")
            .style("stroke", colorManager.getAxesColor());
        

        y_axis_bar = svg_b.select(".y-axis_b")
            .call(d3.axisLeft(y_b));
        
        y_axis_bar.selectAll("text")
            .attr("class", "text_bar")
            .attr("transform", "rotate(-30)")
            .style("text-anchor", "end")
            .style("fill", colorManager.getTextColor())
            .style("font-size", "9px");
        
        y_axis_bar.selectAll("line")
            .style("stroke", colorManager.getAxesColor());

        y_axis_bar.select(".domain")
            .style("stroke", colorManager.getAxesColor());

        var v = svg_b.selectAll(".bar_rect").data(t10);
        v.exit().remove();

        svg_b.selectAll("rect").data(t10).enter()
            .append("rect")
            .attr("class", "bar_rect")
            .attr("x", x_b(0))
            .attr("y", function (d) { return y_b(d[0]); })
            .attr("width", function (d) { return x_b(d[1]); })
            .attr("height", y_b.bandwidth())
            .attr("fill", colorManager.getBarChartColor())
            .style('opacity', 0);

        svg_b.selectAll(".bar_rect").data(t10).transition().duration(200)
            .attr("x", x_b(0))
            .attr("y", function (d) { return y_b(d[0]); })
            .attr("width", function (d) { return x_b(d[1]); })
            .attr("height", y_b.bandwidth())
            .attr("fill", colorManager.getBarChartColor())
            .style('opacity', 1);
    }

    function evalData() {
        return orchestrator.getDataFilteredByParallel();
    }

    orchestrator.addListener('parallelBrushing', function (e) {
        update_bar();
    });


    orchestrator.addListener('updatedDataFiltering', function (e) {
        update_bar();
    });

    orchestrator.addListener('colorChanged', function (e) {
        update_bar();
    });
});