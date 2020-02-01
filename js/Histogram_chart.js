var margin_h = {top: 10, right: 30, bottom: 20, left: 50},
    width_h = 600 - margin_h.left - margin_h.right,
    height_h = 400 - margin_h.top - margin_h.bottom;

var svg_h = d3.select(".histo_area")
  .append("svg")
  .attr("width", width_h + margin_h.left + margin_h.right)
  .attr("height", height_h + margin_h.top + margin_h.bottom)
  .append("g")
  .attr("transform", "translate(" + margin_h.left + "," + margin_h.top + ")");

var parseHour = d3.timeParse("%H%M");
var parseDays = d3.timeParse("%Y-%m-%d-%H%M");
var events_hour = [];
var events_days = [];

orchestrator.addListener('dataReady', function (e) {
  data = orchestrator.data;
  data.forEach( e => {
  events_hour.push(parseHour(e["acq_time"]));
  events_days.push(parseDays(e["acq_date"]+"-"+e["acq_time"]));
  });
  update_histogram(events_days);
  //update_histogram(events_hour);
});


function update_histogram(data_selected){
  if(data_selected == events_hour){
    low_h = parseHour("0000");
    high_h = parseHour("2359");
    ticks = 24;
  }
  else{
    low_h = events_days[0];
    high_h = events_days[events_days.length-1];
    ticks = 72;
  }
  

  var x_h = d3.scaleTime()
      .domain([low_h, high_h])
      .range([0, width_h]);

  svg_h.append("g")
      .attr("transform", "translate(0," + height_h + ")")
      .call(d3.axisBottom(x_h));

  var histogram = d3.histogram()
      .value(function(d) { return d; })
      .domain(x_h.domain())
      .thresholds(x_h.ticks(ticks));

  var bins = histogram(data_selected);
 
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
}