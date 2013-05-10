function plotIndicadores() {

	//Width and height
	var w = 600;
	var h = 250;
	
	d3.csv("data.csv", function(error, data) {
	  var ageNames = d3.keys(data[0]).filter(function(key) { return key !== "State"; });

	  data.forEach(function(d) {
	    d.ages = ageNames.map(function(name) { return {name: name, value: +d[name]}; });
	  });

	  x0.domain(data.map(function(d) { return d.State; }));
	  x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
	  y.domain([0, d3.max(data, function(d) { return d3.max(d.ages, function(d) { return d.value; }); })]);

	  svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis);

	  svg.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	    .append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("Population");

	  var state = svg.selectAll(".state")
	      .data(data)
	    .enter().append("g")
	      .attr("class", "g")
	      .attr("transform", function(d) { return "translate(" + x0(d.State) + ",0)"; });

	  state.selectAll("rect")
	      .data(function(d) { return d.ages; })
	    .enter().append("rect")
	      .attr("width", x1.rangeBand()-10)
	      .attr("x", function(d) { return x1(d.name); })
	      .attr("y", function(d) { return y(d.value); })
	      .attr("height", function(d) { return height - y(d.value); })
	      .style("fill", function(d) { return color(d.name); });

	  var legend = svg.selectAll(".legend")
	      .data(ageNames.slice().reverse())
	    .enter().append("g")
	      .attr("class", "legend")
	      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	  legend.append("rect")
	      .attr("x", width - 18)
	      .attr("width", 18)
	      .attr("height", 18)
	      .style("fill", color);

	  legend.append("text")
	      .attr("x", width - 24)
	      .attr("y", 9)
	      .attr("dy", ".35em")
	      .style("text-anchor", "end")
	      .text(function(d) { return d; });

	});
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
	
	var ind_names = ["Part. despesa e encargos educação(%)", "IDEB - 5º ano do ensino fundamental", "IDEB - 9º ano do ensino fundamental", 
"Taxa de analfabetismo", "Taxa de atendimento escolar", "Taxa abandono total - fundamental(%)", "Taxa de abandono - ensino médio(%)",
"Taxa aprovação total - fundamental(%)", "Taxa de aprovação - ensino médio (%)", "Percentual docentes formação superior(%)", 
"Percentual de docentes temporários", "Índice precariedade infraestrutura", "Razão aluno por docente", "Despesa educação aluno", "Índice eficiência educação básica"];
	 
	var div_buttons = d3.select("#div_indicador_options");
	
	
	div_buttons.selectAll("input").data(ind_names).enter().append("input").attr("type","button").attr("class","button").attr("value", function (d){return d;});
	div_buttons.on("click", function() {
		sortBars();
	});
};

