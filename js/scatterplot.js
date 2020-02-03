
var margin_scatter = { top: 10, right: 30, bottom: 30, left: 60 },
width_scatter = Math.round(clientWidth*0.20),
height_scatter = Math.round(clientHeight*0.32);

// append the svg object to the body of the page
var svg_scatter = d3.select(".scatterplot_area")
  .append("svg")
  .attr("width", '99%')
  .attr("height", '100%')
  .append("g")
  .attr("transform",
    "translate(" + margin_scatter.left + "," + margin_scatter.top + ")");

orchestrator.addListener('dataReady', function (e) {
  data = orchestrator.data;
  var max_x, min_x, max_y, min_y;
  for (i = 0; i < data.length; i++) {
    pca1 = parseFloat(data[i].PCA_component1);
    pca2 = parseFloat(data[i].PCA_component2);
    if (i == 0) {
      max_x = pca1;
      min_x = pca1;
      max_y = pca2;
      min_y = pca2;
    }
    else {
      if (pca1 > max_x) max_x = pca1;
      if (pca2 > max_y) max_y = pca2;
      if (pca1 < min_x) min_x = pca1;
      if (pca2 < min_y) min_y = pca2;
    }
    day = new Date(data[i].acq_date).getDay();
    if (day == 0) dayOfWeek = 'Monday';
    else if (day == 1) dayOfWeek = 'Tuesday';
    else if (day == 2) dayOfWeek = 'Wednesday';
    else if (day == 3) dayOfWeek = 'Thursday';
    else if (day == 4) dayOfWeek = 'Friday';
    else if (day == 5) dayOfWeek = 'Saturday';
    else dayOfWeek = 'Sunday';
    data[i].dayOfWeek = dayOfWeek;
  }
  var x = d3.scaleLinear()
    .domain([0, max_x + 5])
    .range([0, width_scatter]);
  svg_scatter.append("g")
    .attr("transform", "translate(0," + height_scatter + ")")
    .call(d3.axisBottom(x));

  svg_scatter.append("text")
    .attr("transform",
      "translate(" + (width_scatter / 2) + " ," +
      (height_scatter + margin_scatter.top + 20) + ")")
    .style("text-anchor", "middle")
    .text("Date");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, max_y + 5])
    .range([height_scatter, 0]);
  svg_scatter.append("g")
    .call(d3.axisLeft(y));

  // Color scale: give me a specie name, I return a color
  var color = {
    "Monday": '#1b9e77',
    "Tuesday": "#d95f02",
    "Wednesday": "#7570b3",
    "Thursday": "#e7298a",
    "Friday": "#66a61e",
    "Saturday": "#e6ab02",
    "Sunday": "#a6761d"
  };

  function evalData() {
    return orchestrator.getDataFilteredByParallel();
  }

  // Add dots
  var myCircle = svg_scatter.append('g').attr('class', 'circle_container')
    .selectAll("circle")
    .data(evalData())
    .enter()
    .append("circle")
    .attr("cx", function (d) { return x(d.PCA_component1); })
    .attr("cy", function (d) { return y(d.PCA_component2); })
    .attr("r", 4)
    .style("fill", function (d) { return color[d.dayOfWeek] })
    .style("opacity", 0.5);

  // Add brushing
  svg_scatter
    .call(d3.brush()                 // Add the brush feature using the d3.brush function
      .extent([[0, 0], [width_scatter, height_scatter]]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("start brush", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function
    )

  var scatterplot_brushing_last;

  function filteringByScatterplot(d) {
    brush_coords = scatterplot_brushing_last;
    if (brush_coords == undefined) return false;
    cx = x(d.PCA_component1);
    cy = y(d.PCA_component2);
    var x0 = brush_coords[0][0],
      x1 = brush_coords[1][0],
      y0 = brush_coords[0][1],
      y1 = brush_coords[1][1];
    return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
  }
  orchestrator.filteringByScatterplot = filteringByScatterplot;
  // Function that is triggered when brushing is performed
  function updateChart() {
    scatterplot_brushing_last = d3.event.selection;
    orchestrator.notifyScatterplotBrushing();
    svg_scatter.select('.circle_container').selectAll("circle").data(evalData()).classed("selected", function (d) {
      if (filteringByScatterplot(d)) return true;
      else return false;
    })
  }


  var legend = svg_scatter.selectAll('legend')
    .data(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
    .enter().append('g')
    .attr('class', 'legend')
    .attr('transform', function (d, i) { return 'translate(20,' + i * 20 + ')'; });

  legend.append('rect')
    .attr('x', width_scatter)
    .attr('width', 15)
    .attr('height', 15)
    .style('fill', function (d) { return color[d] });

  legend.append('text')
    .attr('x', width_scatter - 2)
    .attr('y', 9)
    .attr('dy', '.25em')
    .style('text-anchor', 'end')
    .text(function (d) { return d; });

  svg_scatter.append("text")
    .attr("class", "label_scatter")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin_scatter.left * 0.75)
    .attr("x", 0 - (height_scatter / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Y2");

  svg_scatter.append("text")
    .attr("class", "label_scatter")
    .attr("transform",
      "translate(" + (width_scatter / 2) + " ," +
      (height_scatter + margin_scatter.top + 20) + ")")
    .style("text-anchor", "middle")
    .text("Y1");

  orchestrator.addListener('parallelBrushing', function (e) {
    update_graph();
  });

  orchestrator.addListener('updatedDataFiltering', function (e) {
    update_graph();
  });

  function update_graph(){
    modifiedData = evalData();
    var u = svg_scatter.select('.circle_container').selectAll("circle").data(modifiedData);
    u.exit().remove();
    u.enter().append('circle')
      .attr("r", 0)
      .attr("cx", function (d) { return x(d.PCA_component1); })
      .attr("cy", function (d) { return y(d.PCA_component2); })
      .style("fill", function (d) { return color[d.dayOfWeek] })
      .style("opacity", 0.5).merge(u);

    svg_scatter.select('.circle_container').selectAll("circle").data(modifiedData).transition().duration(200)
      .attr("r", 4)
      .attr("cx", function (d) { return x(d.PCA_component1); })
      .attr("cy", function (d) { return y(d.PCA_component2); })
      .style("fill", function (d) { return color[d.dayOfWeek] })
      .style("opacity", 0.5)
      .attr('class', function (d) {
        if (filteringByScatterplot(d)) return 'selected'
        else return '';
      });
  }
});
