function plotIndicadores() {

	//Width and height
	var w = 600;
	var h = 250;

	var dataset = [ 5, 10, 13, 19];

	var xScale = d3.scale.ordinal().domain(d3.range(dataset.length))
	.rangeRoundBands([ 0, w ], 0.05);

	var yScale = d3.scale.linear().domain([ 0, d3.max(dataset) ])
	.range([ 0, h ]);

	//Create SVG element
	var svg = d3.select("#div_indicador").append("svg")
	.attr("width", w).attr("height", h);

	//Create bars
	svg.selectAll("rect").data(dataset).enter().append("rect").attr(
			"x", function(d, i) {
				return xScale(i);
			}).attr("y", function(d) {
				return h - yScale(d);
			}).attr("width", xScale.rangeBand()).attr("height", function(d) {
				return yScale(d);
			}).attr("fill", function(d) {
				return "rgb(0, 0, " + (d * 10) + ")";
			}).on(
					"mouseover",
					function(d) {

						//Get this bar's x/y values, then augment for the tooltip
						var xPosition = parseFloat(d3.select(this).attr("x"))
						+ xScale.rangeBand() / 2;
						var yPosition = parseFloat(d3.select(this).attr("y"))
						/ 2 + h / 2;

						//Update the tooltip position and value
						d3.select("#tooltip").style("left", xPosition + "px")
						.style("top", yPosition + "px")
						.select("#value").text(d);

						//Show the tooltip
						d3.select("#tooltip").classed("hidden", false);

					}).on("mouseout", function() {

						//Hide the tooltip
						d3.select("#tooltip").classed("hidden", true);

					}).on("click", function() {
						sortBars();
					});
	
	//Define sort order flag
	var sortOrder = false;

	//Define sort function
	var sortBars = function() {

		//Flip value of sortOrder
		sortOrder = !sortOrder;

		svg.selectAll("rect").sort(function(a, b) {
			if (sortOrder) {
				return d3.ascending(a, b);
			} else {
				return d3.descending(a, b);
			}
		}).transition().delay(function(d, i) {
			return i * 50;
		}).duration(1000).attr("x", function(d, i) {
			return xScale(i);
		});

	};
	
	var ind_names = ["a", "b"];

	var div_buttons = d3.select("#div_indicador_options");
	
	//fix me organizar botao com indicador
	div_buttons.selectAll("button").data(ind_names).enter().append("button").text(ind_names).attr("value","Sort!").on("click", function() {
		sortBars();
	});

};

