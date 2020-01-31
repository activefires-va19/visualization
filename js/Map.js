var margin_map = { top: 10, right: 30, bottom: 10, left: 50 },
    width_map = 600 - margin_map.left - margin_map.right,
    height_map = 400 - margin_map.top - margin_map.bottom;

var svg_map = d3.select(".map_area")
    .append("svg")
    .attr("width", width_map + margin_map.left + margin_map.right)
    .attr("height", height_map + margin_map.top + margin_map.bottom)
    .append("g")
    .attr("transform", "translate(" + margin_map.left + "," + margin_map.top + ")");

var projection = d3.geoMercator()
    .center([2, 47])                
    .scale(400)                  
    .translate([ width_map/2, height_map/2 ])

d3.json("./data/map.js", function(data){


    map_countries = ["Albania","Algeria","Austria","Belarus",
                    "Belgium","Bosnia and Herzegovina","Bulgaria","Bulgaria","Croatia","Cyprus",
                    "Czech Republic","England","France","Germany",
                    "Greece","Hungary","Italy","Kosovo",
                    "Moldova","Montenegro","Macedonia",
                    "Poland","Portugal","Romania","Serbia","Slovenia","Slovakia",
                    "Spain","Switzerland",
                    "Tunisia","Turkey",
                    "Ukraine","United Kingdom"];

    data.features = data.features.filter( function(d){return map_countries.includes(d.properties.name)} )

    //Drawing our map
    svg_map.append("g")
        .selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        .attr("fill", "#6fb1f3")
        .attr("d", d3.geoPath().projection(projection))
        .style("stroke", "black")
        .style("opacity", .3)
})