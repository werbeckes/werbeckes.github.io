var width = 960;
var height = 500;

var projection = d3.geo.albersUsa()
  .translate([width/2, height/2])    // translate to center of screen
  .scale([1000]);                    // scale things down so see entire US

var path = d3.geo.path().projection(projection);

var svg = d3.select("body")
  .append("svg")
	.attr("width", width)
	.attr("height", height);

var states = svg.append( "g" )
	.attr("class", "states");

var div = d3.select("body")
		    .append("div")
    		.attr("class", "tooltip")
    		.style("opacity", 0);

d3.json("http://werbeckes.github.io/slpStatsMap/us.json", function (collection) {
   states.selectAll("path")
     .data(collection.features)
     .enter().append("path")
     .attr("class","state")
		 .attr("id", function(d) { return d.properties.name })
     .attr("d", path)

var blue = rgb(101,201,197);
var orange = rgb(247,135,133);
var yellow = rgb(251,211,99);

d3.csv("http://werbeckes.github.io/slpStatsMap/stateData.csv", function(data) {
	for (var i = 0; i < data.length; i++) {

		var stateName = data[i].name;
		var caseload = +data[i].caseload;
		var salary = +data[i].salary;
		var happiness = +data[i].happiness;
		var color = 255 - parseInt(data[i].responses);
		var tooltipHtml = "<h4>"+stateName+"</h4>"
			+ "<p>caseload: "+caseload+"</p>"
			+ "<p>salary: "+salary+"</p>"
			+ "<p>happiness: "+happiness+"</p>";

		var state = d3.select("#"+stateName)
			.attr("fill", "rgb(255,"+color+","+color+")")
			.on("mouseover", function(d) {
				div.transition().duration(200).style("opacity",0.9);
				div.html(d.properties.tooltipHtml)
				.style("left", (d3.event.pageX)+"px")
					.style("top", (d3.event.pageY)+"px");
			});
		state.data()[0].properties.tooltipHtml = tooltipHtml;
	}
});
});
