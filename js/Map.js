var margin_map = { top: 10, right: 10, bottom: 10, left: 10 },
    width_map = 600 - margin_map.left - margin_map.right,
    height_map = 400 - margin_map.top - margin_map.bottom;

var svg_map = d3.select(".map_area")
    .append("svg")
    .attr("width", width_map + margin_map.left + margin_map.right)
    .attr("height", height_map + margin_map.top + margin_map.bottom)
    .append("g")
    .attr("transform", "translate(" + margin_map.left + "," + margin_map.top + ")");

var projection = d3.geoMercator()
    .center([10, 42])
    .scale(400)
    .translate([width_map / 2, height_map / 2])

var points_fire = []

orchestrator.addListener('dataReady', function (e) {
    data = orchestrator.data;
    function evalData() {
        return orchestrator.getDataFilteredByParallel();
      }
    d3.json("./data/map.json", function (data) {
        //Drawing our map
        svg_map.append("g")
            .selectAll("path")
            .data(data.features)
            .enter()
            .append("path")
            .attr("fill", "#6fb1f3")
            .attr("d", d3.geoPath().projection(projection))
            .style("stroke", "black")
            .style("opacity", .3);

        svg_map.append('g').attr('class', 'circles_container').selectAll("circle")
            .data(evalData())
            .enter()
            .append("circle")
            .attr("cx", function (d) { return projection([+d["longitude"], +d["latitude"]])[0]; })
            .attr("cy", function (d) { return projection([+d["longitude"], +d["latitude"]])[1]; })
            .attr("r", 1)
            .style("fill", "FFA500")
            .attr("stroke", "#FFA500")
            .attr("stroke-width", 3)
            .attr("fill-opacity", .4);

        orchestrator.addListener('scatterplotBrushing', function (e) {
            svg_map.select(".circles_container").selectAll("circle").data(evalData()).transition().duration(130).attr('stroke', function (d) {
                if (orchestrator.filteringByScatterplot(d)) return 'red'
                else return "#FFA500";
            });
        });

        orchestrator.addListener('parallelBrushing', function (e) {
           updatePointsEntries();
        });

        orchestrator.addListener('updatedDataFiltering', function (e) {
            updatePointsEntries();
         });

        function updatePointsEntries(){
            modifiedData = evalData();
            var u = svg_map.select(".circles_container").selectAll("circle").data(modifiedData);
            u.exit().remove();
            u.enter().append('circle')
                .attr("cx", function (d) { return projection([+d["longitude"], +d["latitude"]])[0]; })
                .attr("cy", function (d) { return projection([+d["longitude"], +d["latitude"]])[1]; })
                .attr("r", 0)

            svg_map.select(".circles_container").selectAll("circle").data(modifiedData).transition().duration(200)
                .attr("r", 1)
                .attr("cx", function (d) { return projection([+d["longitude"], +d["latitude"]])[0]; })
                .attr("cy", function (d) { return projection([+d["longitude"], +d["latitude"]])[1]; })
                .attr("r", 1)
                .style("fill", "FFA500")
                .attr('stroke', function (d) {
                    if (orchestrator.filteringByScatterplot(d)) return 'red'
                    else return "#FFA500";
                })
                .attr("stroke-width", 3)
                .attr("fill-opacity", .4);
        }
    })
});