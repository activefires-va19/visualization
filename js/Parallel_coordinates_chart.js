var margin = {top: 30, right: 10, bottom: 10, left: 0},
  width = 700 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

var svg = d3.select(".parallel").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform","translate(" + margin.left + "," + margin.top + ")");

var selected =[]

d3.csv("./data/out_modis_20200129.csv", function(data) {
  dimensions = [
    {
      name: "Country",
      key: "Country"
    },
    {
      name: "Confidence",
      key: "confidence"
    },
    
    {
      name: "Brightness 31k",
      key: "bright_t31"
    },
    {
      name: "Brightness",
      key: "brightness"
    },
    {
      name: "Time",
      key: "acq_time"
    },
    {
      name: "Frp",
      key: "frp"
    }];

  var y = {};
  var names = [];
  var background;
  var foreground;
  for (i in dimensions) {
    k = dimensions[i].key;
    names.push(dimensions[i].name);
    if(k == "Country"){
      countries = [""];
      data.forEach(element => {
        if(!countries.includes(element[k])){
          countries.push(element[k])
        }
      });
      countries.sort();
      countries.push("");
    
      y[k] = d3.scalePoint()
      .domain(countries)
      .range([0, height]);
    }
    else{
      y[k] = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return +d[k]; }) )
      .range([height, 0]);
    }
  }

  x = d3.scalePoint()
    .range([0, width])
    .padding(1)
    .domain(names);

  function scalePointInverse(pos) {
    var xPos = pos;
    var domain = y["Country"].domain(); 
    var range = y["Country"].range();
    var rangePoints = d3.range(range[0], range[1], y["Country"].step())
    var inverse = domain[d3.bisect(rangePoints, xPos)];

    return inverse;
  }

  function path(d) {
    points = [];
    for(i in dimensions){
      n = dimensions[i].name
      k = dimensions[i].key
      points.push([x(n), y[k](d[k])]);        
    }
    return d3.line()(points);
  }


  extents = dimensions.map(function(p) { return [0,0]; });

  background = svg.append("g")
      .attr("class", "background")
    .selectAll("path")
      .data(data)
    .enter().append("path")
      .attr("d", path);

  foreground = svg.append("g")
      .attr("class", "foreground")
    .selectAll("path")
      .data(data)
    .enter().append("path")
      .attr("d", path);

  var g = svg.selectAll("axis")
    .data(dimensions)
    .enter().append("g")
    .attr("class", "axis")
    .attr("transform", function(d) { return "translate(" + x(d.name) + ")"; })

  g.append("g")
    .attr("class", "axis")
    .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d.key])); })
    .append("text")
    .style("text-anchor", "middle")
    .attr("y", -9)
    .text(function(d) { return d.name; })
    .style("fill", "black");


  g.append("g")
    .attr("class", "brush")
    .each(function(d) {
    d3.select(this).call(y[d.key].brush = d3.brushY().extent([[-8, 0], [8,height]]).
    on("start", brushstart).
    on("brush", brush)).
    on("click", fix)})
    .selectAll("rect")
    .attr("x", -8)
    .attr("width", 16);

  function brushstart() {
    d3.event.sourceEvent.stopPropagation();
  }
  
  function brush() {    
    
    for(i in dimensions){
      if(d3.event.target==y[dimensions[i].key].brush) {
          if(dimensions[i].key == "Country"){
            extents[i]=d3.event.selection.map(scalePointInverse, y[dimensions[i].key]);
          }
          else{
            extents[i]=d3.event.selection.map(y[dimensions[i].key].invert,y[dimensions[i].key]);
          }
      }
    }
    
    selected = []

    foreground.style("display", function(d) {
      value = dimensions.every(function(p, i) {
        if(extents[i][0]==0 && extents[i][1]==0) {
          return true;
        }
        if(p.key == "Country"){
          ex0 = countries.indexOf(extents[i][0]);
          ex1 = countries.indexOf(extents[i][1]);
          value = countries.indexOf(d[p.key]);
          return ex1 >= value && value >= ex0;
        }
        else{
          return extents[i][1] <= d[p.key] && d[p.key] <= extents[i][0];
        }
        
      })

      if(value){
        selected.push(d);
        return null;
      }

      return  "none";
    });
    
  }

  function fix(){
    key = this.__data__.key
    for(i in dimensions){
        if(key == dimensions[i].key){
          extents[i] = [0,0];
          brush()
        } 
    }
  }
})