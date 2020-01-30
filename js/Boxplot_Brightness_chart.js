var margin_box_b = {top: 10, right: 30, bottom: 30, left: 50},
    width_box_b = 180 - margin_box_b.left - margin_box_b.right,
    height_box_b = 130 - margin_box_b.top - margin_box_b.bottom;

var svg_box_b1 = d3.select(".box1")
    .append("svg")
    .attr("width", width_box_b + margin_box_b.left + margin_box_b.right)
    .attr("height", height_box_b + margin_box_b.top + margin_box_b.bottom)
    .append("g")
    .attr("transform","translate(" + margin_box_b.left + "," + margin_box_b.top + ")");

d3.csv("./data/out_modis_20200129.csv", function(data) {

    var points_brightness = [];
    data.forEach( elem => {
        points_brightness.push(+elem["brightness"]);
    });
  
    var data_sorted1 = points_brightness.sort(d3.ascending);
    var first_quantile1 = d3.quantile(data_sorted1, .25);
    var median1 = d3.quantile(data_sorted1, .5);
    var third_quantile1 = d3.quantile(data_sorted1, .75);
    var interQuantileRange1 = third_quantile1 - first_quantile1;
    var min1 = first_quantile1 - 1.5 * interQuantileRange1;
    var max1 = first_quantile1 + 1.5 * interQuantileRange1;

    var center1 = 50;
    var width1 = 25;
    
    var y1 = d3.scaleLinear()
        .domain([(min1-10) , (max1+10)])
        .range([height_box_b, 0]);

    var yAxis = d3.axisLeft(y1);

    svg_box_b1.append("g").call(yAxis.ticks(8));	 

    svg_box_b1.append("line")
        .attr("x1", center1)
        .attr("x2", center1)
        .attr("y1", y1(min1) )
        .attr("y2", y1(max1) )
        .attr("stroke", "black");

    svg_box_b1.append("rect")
        .attr("x", center1 - width1/2)
        .attr("y", y1(third_quantile1) )
        .attr("height", (y1(first_quantile1)-y1(third_quantile1)) )
        .attr("width", width1 )
        .attr("stroke", "black")
        .style("fill", "#6fb1f3");

    svg_box_b1.selectAll("wings")
        .data([min1, median1, max1])
        .enter()
        .append("line")
        .attr("x1", center1-width1/2)
        .attr("x2", center1+width1/2)
        .attr("y1", function(d){ return(y1(d))} )
        .attr("y2", function(d){ return(y1(d))} )
        .attr("stroke", "black");

    svg_box_b1.append("text")
        .attr("class", "label_boxplot")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin_box_b.left)
        .attr("x", 0 - (height_box_b / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Brightness"); 
})