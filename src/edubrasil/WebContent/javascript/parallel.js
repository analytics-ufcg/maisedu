
var svg;
var indicadores_selecionados = ["numero.matriculas", "IFDM", "receita", "INDICADOR_7"];
var lista_cidades = ["Alagoa Grande","Alagoa Nova","Alagoinha","Arara","Areia","Bananeiras","Campina Grande","Itabaiana","Mulungu","Patos"];
var cores = ["#A6CEE3","#1F78B4","#B2DF8A","#33A02C","#FB9A99","#E31A1C","#FDBF6F","#FF7F00","#CAB2D6","#6A3D9A","#FFFF99","#FFED6F"];
var legenda = ["Indicador","Número Matrículas","IFDM","Receita"];
var cidade = "";
	
var m = [30, 10, 10, 10],
    w = 860 - m[1] - m[3],
    h = 500 - m[0] - m[2];

var x = d3.scale.ordinal().rangePoints([0, 770], 1),
    y = {},
    dragging = {};

var line = d3.svg.line(),
    axis = d3.svg.axis().orient("left"),
    foreground;

function position(d) {
  var v = dragging[d];
  return v == null ? x(d) : v;
}


// Returns the path for a given data point.
function path(d) { 
  return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
}

function parallel_graph(nome_cidade){//, lista_cidades){
	console.log(cidade);
	svg = d3.select("#div_parallel_lines").append("svg:svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
	.append("svg:g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

	d3.csv("data/numero.matriculas_IFDM_e_receita_agregados.csv", function(cidades) {
	
		// Extract the list of dimensions and create a scale for each.
		  x.domain(dimensions = d3.keys(cidades[0]).filter(function(d) {
			return (indicadores_selecionados.indexOf(d) > -1) && (y[d] = d3.scale.linear()
				.domain([0,Math.round(d3.max(cidades, function(p) {return +p[d]; }))])
				.range([h, 0]));
				
		  }));
  
		cidades = cidades.filter(function(d){ return ((lista_cidades.indexOf(d.NOME_MUNICIPIO) > -1) && d[indicadores_selecionados[1]] != "NA" && d[indicadores_selecionados[0]] != "NA")});
		foreground = svg.append("svg:g")
			.attr("class", "foreground")
			.selectAll("path")
			.data(cidades)
			.enter().append("svg:path")
			.attr("d", path);
		
		for(var i = 0; i < cidades.length; i++){
			svg.append("path")
			 .attr("class", "foreground")
			 .attr("d", path(cidades[i]))
			 .attr("fill","none")
			 .attr("stroke-width",3)
			 .attr("stroke", cores[i]);
			 
			 svg.append("rect")
			.attr("class","rect")
			.attr("x", 730)
			.attr("y", i*20)
			.attr("width", 20)
			.attr("height", 3)
			.style("fill", cores[i]);
		}
		
		
		var legend = svg.selectAll("g.legend")
					.data(lista_cidades)
					.enter().append("svg:g")
					.attr("class", "legend")
					.attr("transform", function(d, i) { return "translate("+ 750 +"," + (i * 20) + ")"; });
					
		legend.append("svg:text")
			.attr("x", 12)
			.attr("dy", ".31em")
			.text(function(d) { return d; });

		  // Add a group element for each dimension.
		var g = svg.selectAll(".dimension")
			.data(dimensions)
			.enter().append("svg:g")
			.attr("class", "dimension")
			.attr("transform", function(d) { return "translate(" + x(d) + ")"; });

		  // Add an axis and title.
		g.append("svg:g")
			.attr("class", "axis")
			.each(function(d) { d3.select(this).call(axis.scale(y[d])); })
			.append("svg:text")
			.data(legenda)
			.attr("text-anchor", "middle")
			.attr("y", -9)
			.text(String);

});
}