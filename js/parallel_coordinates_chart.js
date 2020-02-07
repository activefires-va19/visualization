var margin_parallel = { top: 30, right: 30, bottom: 10, left: 25 },
  width_parallel = Math.round(clientWidth * 0.55),
  height_parallel = Math.round(clientHeight * 0.40);

var svg_parallel = d3.select(".parallel_area").append("svg")
  .attr("width", '100%')
  .attr("height", '100%')
  .append("g")
  .attr("transform", "translate(" + margin_parallel.left + "," + margin_parallel.top + ")");

function parse_hour_p(input) {
  h = input.substring(0, 2);
  mm = input.substring(2, 4);

  date = new Date();
  date.setHours(h);
  date.setMinutes(mm);

  return date;
}
var background;
var foreground;

function create_graph() {
  data = evalData();
  dimensions = [
    {
      name: "Country",
      key: "country"
    },
    {
      name: "Confidence",
      key: "confidence"
    },
    {
      name: "Brightness 21 (K)",
      key: "brightness"
    },
    {
      name: "Brightness 31 (K)",
      key: "bright_t31"
    },
    {
      name: "Frp",
      key: "frp"
    },

    {
      name: "Area (px)",
      key: "area"
    },
    {
      name: "Latitude",
      key: "latitude"
    },
    {
      name: "Time",
      key: "acq_time"
    },
  ];

  var y = {};
  var names = [];
  var bright_min = 99999999;
  var bright_max = -1;
  for (i in dimensions) {
    k = dimensions[i].key;
    names.push(dimensions[i].name);
    if (k == "country") {
      countries = [""];
      data.forEach(element => {
        if (!countries.includes(element[k])) {
          countries.push(element[k])
        }
      });
      countries.sort();
      countries.push("");

      y[k] = d3.scalePoint()
        .domain(countries)
        .range([0, height_parallel]);
    }
    else if (k == "acq_time") {
      var low = parse_hour_p("0000");
      var high = parse_hour_p("2359");
      y[k] = d3.scaleTime().domain([low, high]).range([height_parallel, 0]);
    }
    else if (k == "confidence") {
      y[k] = d3.scaleLinear().domain([0, 100]).range([height_parallel, 0]);
    }
    else if (k != "brightness" && k != "bright_t31") {
      y[k] = d3.scaleLinear()
        .domain(d3.extent(data, function (d) { return +d[k]; }))
        .range([height_parallel, 0]);
    }
  }
  for (j = 0; j < data.length; j++) {
    if (+data[j]["brightness"] < bright_min) bright_min = +data[j]["brightness"];
    if (+data[j]["bright_t31"] < bright_min) bright_min = +data[j]["bright_t31"];

    if (+data[j]["brightness"] > bright_max) bright_max = +data[j]["brightness"];
    if (+data[j]["bright_t31"] > bright_max) bright_max = +data[j]["bright_t31"];
  }

  y["brightness"] = d3.scaleLinear().domain([bright_min, bright_max]).range([height_parallel, 0]);
  y["bright_t31"] = d3.scaleLinear().domain([bright_min, bright_max]).range([height_parallel, 0]);

  x = d3.scalePoint()
    .range([0, width_parallel])
    .padding(1)
    .domain(names);

  function scalePointInverse(pos) {
    var xPos = pos;
    var domain = y["country"].domain();
    var range = y["country"].range();
    var rangePoints = d3.range(range[0], range[1], y["country"].step())
    var inverse = domain[d3.bisect(rangePoints, xPos)];

    return inverse;
  }

  function path(d) {
    points = [];
    for (i in dimensions) {
      n = dimensions[i].name;
      k = dimensions[i].key;
      if (k == "acq_time") {
        date = parse_hour_p(d[k]);
        points.push([x(n), y[k](date)]);
      }
      else {
        points.push([x(n), y[k](d[k])]);
      }

    }
    return d3.line()(points);
  }


  extents = dimensions.map(function (p) { return [0, 0]; });

  background = svg_parallel.append("g")
    .attr("class", "background")
    .selectAll("path")
    .data(data)
    .enter().append("path")
    .attr("d", path)
    .attr("class", "path_background");

  foreground = svg_parallel.append("g")
    .attr("class", "foreground")
    .selectAll("path")
    .data(data)
    .enter().append("path")
    .attr("d", path)
    .attr("class", "path_foreground")
    .style("stroke", _chooseColorByScatterplot);;

  var g = svg_parallel.selectAll("axis")
    .data(dimensions)
    .enter().append("g")
    .attr("class", "axis")
    .attr("transform", function (d) { return "translate(" + x(d.name) + ")"; })

  g.append("g")
    .attr("class", "axis")
    .each(function (d) { d3.select(this).call(d3.axisLeft().scale(y[d.key])); })
    .append("text")
    .style("text-anchor", "middle")
    .attr("y", -9)
    .text(function (d) { return d.name; })
    .style("fill", "black");


  g.append("g")
    .attr("class", "brush")
    .each(function (d) {
      d3.select(this).call(y[d.key].brush = d3.brushY().extent([[-8, 0], [8, height_parallel]]).
        on("start", brushstart).
        on("brush", brush)).
        on("click", cancelSelection)
    })
    .selectAll("rect")
    .attr("x", -8)
    .attr("width", 16);

  function brushstart() {
    d3.event.sourceEvent.stopPropagation();
  }


  function parallelFiltering(d) {
    value = dimensions.every(function (p, i) {
      if (extents[i][0] == 0 && extents[i][1] == 0) {
        return true;
      }
      if (p.key == "country") {
        ex0 = countries.indexOf(extents[i][0]);
        ex1 = countries.indexOf(extents[i][1]);
        value = countries.indexOf(d[p.key]);
        return ex1 >= value && value >= ex0;
      }
      if (p.key == "acq_time") {
        date = parse_hour_p(d[p.key]);
        return extents[i][1] <= date && date <= extents[i][0];
      }
      else {
        return extents[i][1] <= d[p.key] && d[p.key] <= extents[i][0];
      }

    });
    return value;
  }

  orchestrator.filteringByParallel = parallelFiltering;
  function brush() {

    for (i in dimensions) {
      if (d3.event.target == y[dimensions[i].key].brush) {
        if (dimensions[i].key == "country") {
          extents[i] = d3.event.selection.map(scalePointInverse, y[dimensions[i].key]);
        }
        else {
          extents[i] = d3.event.selection.map(y[dimensions[i].key].invert, y[dimensions[i].key]);
        }
      }
    }


    orchestrator.notifyParallelBrushing();
    foreground.style("display", function (d) {
      value = parallelFiltering(d);
      if (value) {
        return null;
      }
      return "none";
    });

  }

  function cancelSelection() {
    key = this.__data__.key;
    children = this.childNodes;
    hide = false;
    for (i = 0; i < children.length; i++) {
      if (children[i].__data__.type == 'selection' && children[i].y.animVal.value == 0) hide = true;
    }
    if (!hide) return;
    for (i in dimensions) {
      if (key == dimensions[i].key) {
        extents[i] = [0, 0];
        brush()
      }
    }
    orchestrator.notifyParallelBrushing();
  }

  function evalData() {
    return orchestrator.getDataFilteredByParallel();
  }
}
orchestrator.addListener('dataReady', function (e) {
  create_graph();
});

orchestrator.addListener('scatterplotBrushing', function (e) {
  foreground.style("stroke", _chooseColorByScatterplot);
});


orchestrator.addListener('updatedDataFiltering', function (e) {
  d3.select(".parallel_area").select("svg").remove();
  svg_parallel = d3.select(".parallel_area").append("svg")
    .attr("width", width_parallel + margin_parallel.left + margin_parallel.right)
    .attr("height", height_parallel + margin_parallel.top + margin_parallel.bottom)
    .append("g")
    .attr("transform", "translate(" + margin_parallel.left + "," + margin_parallel.top + ")");
  create_graph();

});

function _chooseColorByScatterplot(d) {
  if (orchestrator.filteringByScatterplot == undefined) return colorManager.getParallelNormalColor();
  value = orchestrator.filteringByScatterplot(d);
  if (value) {
    return colorManager.getParallelHighlightColor();
  }
  return colorManager.getParallelNormalColor();
}