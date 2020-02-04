var margin_map = { top: 10, right: 10, bottom: 10, left: 10 },
width_map = Math.round(clientWidth*0.25),
height_map = Math.round(clientHeight*0.32);

var svg_map = d3.select(".map_area")
    .append("svg")
    .attr("width", '100%')
    .attr("height", '100%')
    .append("g")
    .attr("transform", "translate(" + margin_map.left + "," + margin_map.top + ")");

var projection = d3.geoMercator()
    .center([10, 52])
    .scale(400)
    .translate([width_map / 2, height_map / 2])

var points_fire = []

orchestrator.addListener('dataReady', function (e) {
    data = orchestrator.data;
    function evalData() {
        return orchestrator.getDataFilteredByParallel();
    }

    var zoom = d3.zoom()
        .scaleExtent([1, 11])
        .on('zoom', zoomed);

    var last_zoom_transform;
    d3.json("./data/map.json", function (data) {
        //Drawing our map
        svg_map.append("g")
            .selectAll("path")
            .data(data.features)
            .enter()
            .append("path")
            .attr("fill", "#a6cee3")
            .attr("class", "map_path")
            .attr("d", d3.geoPath().projection(projection))
            .style("stroke", "black")
            .style("opacity", .3);

        svg_map.append('g').attr('class', 'circles_container').selectAll("circle")
            .data(evalData())
            .enter()
            .append("circle")
            .attr("cx", function (d) { return projection([+d["longitude"], +d["latitude"]])[0]; })
            .attr("cy", function (d) { return projection([+d["longitude"], +d["latitude"]])[1]; })
            .attr("r", 1.7)
            .style("fill", "#4daf4a")
            .attr("stroke", "#4daf4a")
            .attr("stroke-width", 3)
            .style("opacity", .6);

        svg_map.call(zoom);
        svg_map.call(zoom.transform, d3.zoomIdentity.scale(1.1))
        orchestrator.addListener('scatterplotBrushing', function (e) {
            svg_map.select(".circles_container").selectAll("circle").data(evalData()).transition().duration(130).attr('stroke', function (d) {
                if (orchestrator.filteringByScatterplot(d)) return '#e41a1c'
                else return "#4daf4a";
            }).style('fill', function (d) {
                if (orchestrator.filteringByScatterplot(d)) return '#e41a1c'
                else return "#4daf4a";
            });
        });

        orchestrator.addListener('parallelBrushing', function (e) {
            updatePointsEntries();
        });

        orchestrator.addListener('updatedDataFiltering', function (e) {
            updatePointsEntries();
        });

        function updatePointsEntries() {
            modifiedData = evalData();
            var u = svg_map.select(".circles_container").selectAll("circle").data(modifiedData);
            u.exit().remove();
            u.enter().append('circle')
                .attr("cx", function (d) { return projection([+d["longitude"], +d["latitude"]])[0]; })
                .attr("cy", function (d) { return projection([+d["longitude"], +d["latitude"]])[1]; })
                .attr('transform', last_zoom_transform)
                .attr("r", 0)
                .style("opacity", .6);

            svg_map.select(".circles_container").selectAll("circle").data(modifiedData).transition().duration(200)
                .attr("r", 1.7)
                .attr("cx", function (d) { return projection([+d["longitude"], +d["latitude"]])[0]; })
                .attr("cy", function (d) { return projection([+d["longitude"], +d["latitude"]])[1]; })
                .style('fill', function (d) {
                    if (orchestrator.filteringByScatterplot(d)) return '#e41a1c'
                    else return "#4daf4a";
                })
                .attr('stroke', function (d) {
                    if (orchestrator.filteringByScatterplot(d)) return '#e41a1c'
                    else return "#4daf4a";
                })
                .attr("stroke-width", 3)
        }
    });
    function zoomed() {
        last_zoom_transform = d3.event.transform;
        svg_map.selectAll('.map_path') // To prevent stroke width from scaling
            .attr('transform', last_zoom_transform);
        svg_map.select(".circles_container").selectAll("circle").attr('transform', last_zoom_transform);
    }
});