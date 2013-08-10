
var svg;
var indicadores_selecionados = ["numero.matriculas", "IFDM", "receita"];
//var cores = ["#A6CEE3","#1F78B4","#B2DF8A","#33A02C","#FB9A99","#E31A1C","#FFFF99","#FDBF6F","#FF7F00","#CAB2D6","#6A3D9A"];
//var cores = ["black","#C9C1FF","#A79BFF","#8A79FF","#6F5AFF","#5339FF","#3517FF","#2A0FDB","#301CB9","#3A29AA","#4638A7","#C9C1FF"];
var cores2 = ["#A6CEE3","#1F78B4","#B2DF8A","#33A02C","#FB9A99","#E31A1C","#905c18","#CAB2D6","#6A3D9A","#D539D8","#C67C20"];
var cores = ["#BDBDBD", "#BDBDBD", "#BDBDBD", "#BDBDBD", "#BDBDBD", "#BDBDBD", "#BDBDBD", "#BDBDBD", "#BDBDBD", "#BDBDBD", "#BDBDBD"]

var legenda = ["Indicador","Receita","Número Matrículas","IFDM*"];
	
var m = [30, 10, 10, 10],
    w = 960 - m[1] - m[3],
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

function parallel_graph(nome_cidade,indicador,lista_cidades,ano, div, nome_indicador){
	
	
	// if(indicadores_selecionados.length == 3 && (ano == "2011")){
		// indicadores_selecionados = indicadores_selecionados.slice(0,3);
		// if((ano == "2011")){
			// indicadores_selecionados.push(indicador);
			// if(legenda.length >= 3)legenda = [nome_indicador,"Receita","Número Matrículas","IFDM*"];
		// }else{
			// legenda = ["Receita","Número Matrículas","IFDM*"];
		// }
	// }else{
		// indicadores_selecionados = indicadores_selecionados.slice(0,3);
		// if((ano == "2011")){
			// indicadores_selecionados.push(indicador);
			// if(legenda.length >= 3)legenda = [nome_indicador,"Receita","Número Matrículas","IFDM*"];
		// }else{
			// legenda = ["Receita","Número Matrículas","IFDM*"];
		// }
	// }
	lista_cidades.push(nome_cidade);
	indicadores_selecionados = indicadores_selecionados.slice(0,3);
	console.log(indicadores_selecionados);
	console.log(indicadores_selecionados);
	
	if(indicadores_selecionados.length >= 3) {
		indicadores_selecionados = indicadores_selecionados.slice(0,3);
		console.log(indicadores_selecionados);
	}
	
	indicadores_selecionados.push(indicador);
	
	var container = d3.select(div);
	container.select("#plotSimilares").remove();
	svg = container.append("svg:svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
    .attr("id","plotSimilares")
    .append("svg:g")	
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

	d3.csv("data/numero.matriculas_IFDM_e_receita_agregados.csv", function(cidades) {
		
		cidades = cidades.filter(function(d){ return ((lista_cidades.indexOf(d.NOME_MUNICIPIO) > -1) && 
														d[indicadores_selecionados[0]] != "NA" && 
														d[indicadores_selecionados[1]] != "NA" &&
														d[indicadores_selecionados[2]] != "NA" &&
														d[indicadores_selecionados[3]] != "NA")});
		
		/*Inicio - Tamanho maximo do nome do indicador- iurygregory@gmail.com 08/08/2013 - */
		var MAX_LENGTH_INDICADOR = 30;
		if(nome_indicador.length > MAX_LENGTH_INDICADOR) {
			legenda = [nome_indicador.substring(0, MAX_LENGTH_INDICADOR) + " ...","Receita","Número Matrículas","IFDM*"];
		} else {
			legenda = [nome_indicador,"Receita","Número Matrículas","IFDM*"];
		}
		/*Fim - Tamanho maximo do nome do indicador- iurygregory@gmail.com 08/08/2013 - */
		
		
		//Inicio - giovanibarbosa@gmail.com 08/08/2013
		// Extract the list of dimensions and create a scale for each.
		x.domain(dimensions = d3.keys(cidades[0]).filter(function(d) {
			return (indicadores_selecionados.indexOf(d) > -1) && (y[d] = d3.scale.linear()
				.domain([(d3.min(cidades, function(p) {return (+p[d]); })),((d3.max(cidades, function(p) {return (+p[d]); })))])
				.range([h, 0]));
				
		  }));
		//Fim - giovanibarbosa@gmail.com 08/08/2013


		lista_cidades = (cidades.map(function(d){return (d.NOME_MUNICIPIO);}));
		
		foreground = svg.append("svg:g")
			.attr("class", "foreground")
			.selectAll("path")
			.data(cidades)
			.enter().append("svg:path")
			.attr("d", path);
		
		for(var i = 0; i < cidades.length; i++){
			if(cidades[i].NOME_MUNICIPIO == nome_cidade){
				svg.append("path")
				 .attr("class", "foreground")
				 .attr("d", path(cidades[i]))
				 .attr("fill","none")
				 .attr("stroke-width",3)
				 .attr("opacity", .7)
				 .attr("stroke", "black");
				 
				 svg.append("rect")
				.attr("class","rect")
				.attr("x", 690)
				.attr("y", i*20)
				.attr("width", 15)
				.attr("height", 3)
				.style("fill", "black");
			}else{
				svg.append("path")
					 .attr("class", "path_cidade")
					 .attr("d", path(cidades[i]))
					 .attr("id", "path-"+i)
					 .attr("fill","none")
					 .attr("stroke-width",3)
					 .attr("opacity", .7)
					 .attr("stroke", cores[i]);
					 
				svg.append("rect")
					.attr("class","cidade_leg")
					.attr("id", "rect-"+i)
					.attr("x", 690)
					.attr("y", i*20)
					.attr("width", 15)
					.attr("height", 3)
					.style("fill", cores[i]);
					
				/*Inicio - Mouseover mouseout - nailsonboaz@gmail.com 09/08/2013 - */
			
				
				 $('.path_cidade').mouseover(function () {  var x = $(this).attr("id").split("-")[1]; $( "#rect-"+x ).css("fill",cores2[x]); $( "#rect-"+x ).css("stroke",cores2[x]); $(this).css("stroke",cores2[x]); $(this).css("stroke-width", 5); });
				 $('.path_cidade').mouseout(function () { var x = $(this).attr("id").split("-")[1]; $( "#rect-"+x ).css("fill",cores[x]); $( "#rect-"+x ).css("stroke","none"); $(this).css("stroke",cores[x]); $(this).css("stroke-width", 3 ); });
				 
				 $('.cidade_leg').mouseover(function () { var x = $(this).attr("id").split("-")[1]; $( "#path-"+x ).css("stroke",cores2[x]); $( "#path-"+x ).css("stroke-width", 5 );   $(this).css("fill",cores2[x]); $(this).css("stroke",cores2[x]);  });
				 $('.cidade_leg').mouseout(function () { var x = $(this).attr("id").split("-")[1]; $( "#path-"+x ).css("stroke",cores[x]); $( "#path-"+x ).css("stroke-width", 3 );  $(this).css("fill",cores[x]); $(this).css("stroke","none");  });
				
				
				/*Fim - Mouseover mouseout - nailsonboaz@gmail.com 09/08/2013 - */
			}			
		}
		
		
		var legend = svg.selectAll("g.legend")
					.data(lista_cidades)
					.enter().append("svg:g")
					.attr("class", "legend")
					.attr("transform", function(d, i) { return "translate("+ 700 +"," + (i * 20) + ")"; });
					
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
			.attr("id", function(d,i){ return "indicador_titulo_" + i;})
			.attr("text-anchor", "middle")
			.attr("y", -9)
			.text(String);
		/*Inicio - tooltip indicador - iurygregory@gmail.com 10/08/2013*/
		$('#indicador_titulo_0')
		.on("mouseover", function(d) {
				d3.select("#tooltip").style("left", 100 + "px")
									 .style("top", 100 + "px")
									 .text(nome_indicador);
				d3.select("#tooltip").classed("hidden", false);
				console.log("entrou");
		})
		.on("mouseout",function(d){
				d3.select("#tooltip").classed("hidden", true);
				console.log("saiu");
				
		});
		
		
		/*Fim - tooltip indicador - iurygregory@gmail.com 10/08/2013*/
	
		svg.append("svg:text")
			.attr("x",685)
			.attr("y", 460)
			.style("font-size","10px")
			.text("*Índice FIRJAN de Desenvolvimento Municipal");


});
}