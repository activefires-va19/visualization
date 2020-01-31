var margin_h = {top: 10, right: 30, bottom: 20, left: 50},
    width_h = 600 - margin_h.left - margin_h.right,
    height_h = 400 - margin_h.top - margin_h.bottom;

var svg_h = d3.select(".histo_area")
  .append("svg")
  .attr("width", width_h + margin_h.left + margin_h.right)
  .attr("height", height_h + margin_h.top + margin_h.bottom)
  .append("g")
  .attr("transform", "translate(" + margin_h.left + "," + margin_h.top + ")");

d3.csv("./data/out_modis_20200129.csv", function(data) {

  var parseHour = d3.timeParse("%H%M");

  events_hour = [];

  data.forEach( e => {
    events_hour.push(parseHour(e["acq_time"]));
  });

  low_h = parseHour("0000");
  high_h = parseHour("2359");

  var x_h = d3.scaleTime()
      .domain([low_h, high_h])
      .range([0, width_h]);

  svg_h.append("g")
      .attr("transform", "translate(0," + height_h + ")")
      .call(d3.axisBottom(x_h));

  var histogram = d3.histogram()
      .value(function(d) { return d; })
      .domain(x_h.domain())
      .thresholds(x_h.ticks(24));

  var bins = histogram(events_hour);
 
  var y_h = d3.scaleLinear().range([height_h, 0]);

  y_h.domain([0, d3.max(bins, function(d) { return d.length; })]);

  svg_h.append("g").call(d3.axisLeft(y_h));

  svg_h.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + x_h(d.x0) + "," + y_h(d.length) + ")"; })
        .attr("width", function(d) { return x_h(d.x1) - x_h(d.x0)-1 ; })
        .attr("height", function(d) { return height_h - y_h(d.length); })
        .style("fill", "#6fb1f3")
});