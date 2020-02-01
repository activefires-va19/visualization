
var margin_b = { top: 20, right: 20, bottom: 20, left: 120 },
    width_b = 550 - margin_b.left - margin_b.right,
    height_b = 400 - margin_b.top - margin_b.bottom;

var svg_b = d3.select(".pie_area")
    .append("svg")
    .attr("width", width_b + margin_b.left + margin_b.right)
    .attr("height", height_b + margin_b.top + margin_b.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin_b.left + "," + margin_b.top + ")");

d3.csv("./data/out_modis_20200129.csv", function (data) {

    dict = {};
    for (i = 0; i < data.length; i++) {
        key_d = data[i]["Country"];
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
    console.log(t10)
    var t10_country = [];
    for (i = 0; i < 10; i++) {
        t10_country.push(t10[i][0]);
    }

    var x_b = d3.scaleLinear()
        .domain([0, items[0][1] + 5])
        .range([0, width_b]);

    svg_b.append("g")
        .attr("transform", "translate(0," + height_b + ")")
        .call(d3.axisBottom(x_b))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    var y_b = d3.scaleBand()
        .range([0, height_b])
        .domain(t10_country)
        .padding(.1);
    svg_b.append("g")
        .call(d3.axisLeft(y_b))

    svg_b.selectAll("rect")
        .data(t10)
        .enter()
        .append("rect")
        .attr("x", x_b(0))
        .attr("y", function (d) { return y_b(d[0]); })
        .attr("width", function (d) { return x_b(d[1]); })
        .attr("height", y_b.bandwidth())
        .attr("fill", "#6fb1f3")
});