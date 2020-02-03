var margin_h = { top: 10, right: 30, bottom: 20, left: 50 },
  width_h = Math.round(clientWidth*0.25),
  height_h = Math.round(clientHeight*0.31);

var svg_h = d3.select(".histo_area")
  .append("svg")
  .attr("width", '100%')
  .attr("height", '94%')
  .append("g")
  .attr("transform", "translate(" + margin_h.left + "," + margin_h.top + ")");

var parseHour = d3.timeParse("%H%M");
var parseDays = d3.timeParse("%Y-%m-%d-%H%M");
var events_hour = [];
var events_days = [];
var x_h, y_h;
var selected_h = 1;

function parse_hour_h(e) {
  var today = new Date();
  
  hh = e.substring(0, 2);
  mm = e.substring(2, 4);
  today.setHours(hh);
  today.setMinutes(mm);

  return today;
}

orchestrator.addListener('dataReady', function (e) {
  data = evalData();
  data.forEach(e => {
    events_hour.push(parse_hour_h(e["acq_time"]));
    events_days.push(parseDays(e["acq_date"] + "-"+e['acq_time']));
  });

  events_days.sort(function (a, b) { return a.getTime() - b.getTime() });
  low_h = parse_hour_h("0000");
  high_h = parse_hour_h("2359");
  ticks = 24;


  x_h = d3.scaleTime()
    .domain([low_h, high_h])
    .range([0, width_h]);

  svg_h.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height_h + ")")
    .style("font-size","9px")
    .call(d3.axisBottom(x_h));

  var histogram = d3.histogram()
    .value(function (d) { return d; })
    .domain(x_h.domain())
    .thresholds(x_h.ticks(ticks));

  var bins = histogram(events_hour);

  y_h = d3.scaleLinear().range([height_h, 0]);

  y_h.domain([0, d3.max(bins, function (d) { return d.length; })]);

  svg_h.append("g").attr("class", "y-axis").call(d3.axisLeft(y_h));

  svg_h.selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
    .attr("class", "histo_bars")
    .attr("x", 1)
    .attr("transform", function (d) { return "translate(" + x_h(d.x0) + "," + y_h(d.length) + ")"; })
    .attr("width", function (d) { return x_h(d.x1) - x_h(d.x0) - 1; })
    .attr("height", function (d) { return height_h - y_h(d.length); })
    .style("fill", "#80b1d3")

  function update_histogram(num) {

    selected_h = num;
    data = evalData();

    events_days = [];
    events_hour = [];
    data.forEach(e => {
      events_hour.push(parse_hour_h(e['acq_time']));
      events_days.push(parseDays(e["acq_date"] + "-" + e["acq_time"]));
    });
    events_days.sort(function (a, b) { return a.getTime() - b.getTime() });
    if (selected_h == 1) {
      low_h = parse_hour_h("0000");
      high_h = parse_hour_h("2359");
      ticks = 24;
      selected_set = events_hour;
    }
    else {
      day_l = events_days[0].getDate();
      month_l = events_days[0].getMonth() + 1;
      year_l = events_days[0].getFullYear();
      if (month_l == 13) {
        month_l = 1;
        year_l += 1;
      }
      string_l = String(year_l) + "-" + String(month_l) + "-" + String(day_l) + "-" + "0000";

      day_h = events_days[events_days.length - 1].getDate();
      month_h = events_days[events_days.length - 1].getMonth() + 1;
      year_h = events_days[events_days.length - 1].getFullYear();
      if (month_h == 13) {
        month_h = 1;
        year_h += 1;
      }
      string_h = String(year_h) + "-" + String(month_h) + "-" + String(day_h) + "-" + "2359";

      low_h = parseDays(string_l);
      high_h = parseDays(string_h);
      ticks = 24;
      selected_set = events_days;
    }


    x_h.domain([low_h, high_h]);

    var histogram = d3.histogram()
      .value(function (d) { return d; })
      .domain(x_h.domain())
      .thresholds(x_h.ticks(ticks));

    var bins = histogram(selected_set);
    y_h.domain([0, d3.max(bins, function (d) { return d.length; })]);

    svg_h.select(".x-axis").transition().duration(1).call(d3.axisBottom(x_h));

    svg_h.select(".y-axis").transition().duration(1).call(d3.axisLeft(y_h));

    var u = svg_h.selectAll(".histo_bars").data(bins);
    u.exit().remove();

    svg_h.selectAll("rect").data(bins).enter()
      .append("rect")
      .attr("x", 1)
      .attr("class", "histo_bars")
      .style("fill", "#6fb1f3")
      .attr("width", function (d) { return x_h(d.x1) - x_h(d.x0) - 1; })
      .attr("height", 0)
      .attr("transform", function (d) { return "translate(" + x_h(d.x0) + "," + y_h(d.length) + ")"; })
      .style('opacity', 0);


    svg_h.selectAll(".histo_bars").data(bins).transition().duration(200)
      .attr("x", 1)
      .attr("class", "histo_bars")
      .attr("transform", function (d) { return "translate(" + x_h(d.x0) + "," + y_h(d.length) + ")"; })
      .attr("width", function (d) { return x_h(d.x1) - x_h(d.x0) - 1; })
      .attr("height", function (d) { return height_h - y_h(d.length); })
      .style("fill", "#80b1d3")
      .style('opacity', 1);
  }

  orchestrator.addListener('parallelBrushing', function (e) {
    update_histogram(selected_h);
  });

  orchestrator.addListener('updatedDataFiltering', function (e) {
    update_histogram(selected_h);
  });

  d3.select("#hours").on("click", function () {
    update_histogram(1);
  });

  d3.select("#week").on("click", function () {
    update_histogram(2);
  });

  function evalData() {
    return orchestrator.getDataFilteredByParallel();
  }
});