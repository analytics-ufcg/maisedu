var dataset = [];
var dados_cidade = [];

//variaveis usadas para plotar os dados
var dados_estado = [];
var dados_micro = [];
var dados_meso = [];
var val_y;
var micro = "";
var meso = "";

//function getMenuOption(sel) {
//    var value = sel.options[sel.selectedIndex].value;
	//rawdata = dataset.filter(function(i){return i.NOME_MUNICIPIO == value;})/
//};

var parseDate = d3.time.format("%Y").parse;	

function plotSeries(cidade,indicador) {
	if((cidade != "") && (indicador != null)){
		val_y = new Array();
			d3.csv("data/tabela_com_todos_os_indicadores_selecionados_e_desvios.csv" , function (data){
			data.forEach(function(d){
				d.ANO = parseDate(d.ANO);
				if(d.NOME_MUNICIPIO == cidade & d[indicador] != "NA"){
					val_y.push(parseFloat(d[indicador]));
					meso = d.NOME_MESO;
					micro = d.NOME_MICRO;
				}
			});
			dados_cidade = data.filter(function(i){return i.NOME_MUNICIPIO == cidade & i[indicador] != "NA";});
		});
		
		d3.csv("data/medianas_para_todos_os_indicadores_agrupados_por_ano_e_regiao.csv" , function (data){
			data.forEach(function(d){
				d.ANO = parseDate(d.ANO);
				if((d.REGIAO == "Paraíba" | d.REGIAO == micro | d.REGIAO == meso) & d[indicador] != "NA"){
					val_y.push(parseFloat(d[indicador]));
				}
			});
			dados_estado = data.filter(function(i){return i.REGIAO == "Paraíba" & i[indicador] != "NA";});
			dados_micro = data.filter(function(i){return i.REGIAO == micro & i[indicador] != "NA";});
			dados_meso = data.filter(function(i){return i.REGIAO == meso & i[indicador] != "NA";});//

			plotGraph(indicador);
		});
	};
};

function plotGraph(indicador){//(nome_indicador){

	if(dados_cidade.length != 0){
		var margin = {top: 30, right: 120, bottom: 40, left: 60},
			width = 800 - margin.left - margin.right,
			height = 400 - margin.top - margin.bottom;
		
		var svg = d3.select("#div_series").select("svg");

		if (svg[0][0] != null){
			svg.style("hidden","none")
				.transition();
			svg.remove();
		}
		
		svg = d3.select("#div_series").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		
		var x = d3.time.scale()
			.range([0, width]);

		var y = d3.scale.linear()
			.range([height, 0]);

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom")
			.ticks(6);
			
		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");

		var line = d3.svg.line()
			.x(function(d) { return x(d.ANO); })
			.y(function(d) { return y(parseFloat(d[indicador]));});

		x.domain(d3.extent(dados_estado, function(d) { return d.ANO; }));
		y.domain([d3.min(val_y),d3.max(val_y)]);
		
		svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis);

		svg.append("g")
		  .attr("class", "y axis")
		  .call(yAxis)
		  .append("text")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 7)
		  .attr("dy", ".90em")
		  .style("text-anchor", "end");

		//plotando as linhas  
		svg.append("path")
		  .datum(dados_cidade) //municipio
		  .attr("class", "line")
		  .attr("d", line)
		  .style("stroke","blue");
		  
		svg.append("path")
		  .datum(dados_estado) //estado
		  .attr("class", "line")
		  .attr("d", line)
		  .style("stroke","red");
		
		svg.append("path")
		  .datum(dados_micro) //microrregiao
		  .attr("class", "line")
		  .attr("d", line)
		  .style("stroke","orange");
		  
		svg.append("path")
		  .datum(dados_meso) //mesorregiao
		  .attr("class", "line")
		  .attr("d", line)
		  .style("stroke","green");
		
		//plotando os pontos
		svg.selectAll('.dot')
			.data(dados_cidade)//municipio
			.attr('class', 'data-point')
			.enter().append("circle")
			.style('fill', "blue")
			.attr('cx', function(d) { return x(d.ANO) })
			.attr('cy', function(d) { return y(d[indicador]) })
			.attr('r', 4)
			.on("mouseover", function(d) {

				//Get the values for tooltip position
				var xPosition = parseFloat(d3.select(this).attr("cx")) + 100;
				var yPosition = parseFloat(d3.select(this).attr("cy")) + 450 ;

				//Update the tooltip position and value
				d3.select("#tooltip").style("left", xPosition + "px")
				.style("top", yPosition + "px")
				.select("#value").text(d[indicador]);

				//Show the tooltip
				d3.select("#tooltip").classed("hidden", false);})

			.on("mouseout", function() {//Hide the tooltip
					d3.select("#tooltip").classed("hidden", true);
			});
		
		svg.selectAll('.dot')
			.data(dados_estado)//estado
			.attr('class', 'data-point')
			.enter().append("circle")
			.style('fill', "red")
			.attr('cx', function(d) { return x(d.ANO) })
			.attr('cy', function(d) { return y(d[indicador]) })
			.attr('r', 4)
			.on("mouseover", function(d) {

				//Get the values for tooltip position
				var xPosition = parseFloat(d3.select(this).attr("cx")) + 100;
				var yPosition = parseFloat(d3.select(this).attr("cy")) + 450 ;

				//Update the tooltip position and value
				d3.select("#tooltip").style("left", xPosition + "px")
				.style("top", yPosition + "px")
				.select("#value").text(d[indicador]);

				//Show the tooltip
				d3.select("#tooltip").classed("hidden", false);})

			.on("mouseout", function() {//Hide the tooltip
					d3.select("#tooltip").classed("hidden", true);
			});

		
		svg.selectAll('.dot')
			.data(dados_micro)//micro
			.attr('class', 'data-point')
			.enter().append("circle")
			.style('fill', "orange")
			.attr('cx', function(d) { return x(d.ANO) })
			.attr('cy', function(d) { return y(d[indicador]) })
			.attr('r', 4)
			.on("mouseover", function(d) {

				//Get the values for tooltip position
				var xPosition = parseFloat(d3.select(this).attr("cx")) + 100;
				var yPosition = parseFloat(d3.select(this).attr("cy")) + 450;

				//Update the tooltip position and value
				d3.select("#tooltip").style("left", xPosition + "px")
				.style("top", yPosition + "px")
				.select("#value").text(d[indicador]);

				//Show the tooltip
				d3.select("#tooltip").classed("hidden", false);})

			.on("mouseout", function() {//Hide the tooltip
					d3.select("#tooltip").classed("hidden", true);
			});		
		
		svg.selectAll('.dot')
			.data(dados_meso)//meso
			.attr('class', 'data-point')
			.enter().append("circle")
			.style('fill', "green")
			.attr('cx', function(d) { return x(d.ANO);})
			.attr('cy', function(d) { return y(d[indicador]);})
			.attr('r', 4)
			.on("mouseover", function(d) {

				//Get the values for tooltip position
				var xPosition = parseFloat(d3.select(this).attr("cx")) + 100;
				var yPosition = parseFloat(d3.select(this).attr("cy")) + 450 ;

				//Update the tooltip position and value
				d3.select("#tooltip").style("left", xPosition + "px")
				.style("top", yPosition + "px")
				.select("#value").text(d[indicador]);

				//Show the tooltip
				d3.select("#tooltip").classed("hidden", false);})

			.on("mouseout", function() {//Hide the tooltip
					d3.select("#tooltip").classed("hidden", true);
			});	
	
		//legenda do grafico
		
		svg.append("text")
		.attr("class", "titulo_grafico")
		.text("Evolução do " + nomeIndicador(indicador));
		
		
		svg.append("circle")
			.style("fill", "blue")
			.attr("r", 4)
			.attr("cx", 645)
			.attr("cy", 300);
		
		svg.append("circle")
			.style("fill", "red")
			.attr("r", 4)
			.attr("cx", 645)
			.attr("cy", 315);
			
		svg.append("circle")
			.style("fill", "orange")
			.attr("r", 4)
			.attr("cx", 645)
			.attr("cy", 330);
			
		svg.append("circle")
			.style("fill", "green")
			.attr("r", 4)
			.attr("cx", 645)
			.attr("cy", 345);
		
		svg.append("text")
			.attr("x", 650)
			.attr("y", 302)
			.text(cidade);
		svg.append("text")
			.attr("x", 650)
			.attr("y", 317)
			.text("Paraíba");
		svg.append("text")
			.attr("x", 650)
			.attr("y", 332)
			.text("Microrregião");
		svg.append("text")
			.attr("x", 650)
			.attr("y", 347)
			.text("Mesorregião");
		
	}
}