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
					meso = d.NOME_MESO;
					micro = d.NOME_MICRO;
				}else if(d[indicador] != "NA"){
					val_y.push(parseFloat(d[indicador]));
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
	//versao colorida//
	// var cor_cidade = d3.rgb(117, 112, 179);
	// var cor_estado = d3.rgb(231, 41, 138);
	// var cor_meso = d3.rgb(217, 95, 2);
	// var cor_micro = d3.rgb(27, 158, 119);
	//versao bw//
	// var cor_cidade = d3.rgb(136, 86, 167);
	// var cor_estado = d3.rgb(126,126,126);
	// var cor_meso = d3.rgb(86,86,86);
	// var cor_micro = d3.rgb(60,60,60);
	//versao_original//
	var cor_cidade = "blue";
	var cor_estado = "red";
	var cor_meso = "orange";
	var cor_micro = "green";
	
	
	if(dados_cidade.length != 0){
		var margin = {top: 30, right: 120, bottom: 40, left: 60},
			width = 800 - margin.left - margin.right,
			height = 400 - margin.top - margin.bottom;
		
		var maxYear = d3.max(dados_estado.map(function(d){return parseInt(d.ANO);}));
		var minYear = d3.min(dados_estado.map(function(d){return parseInt(d.ANO);}));
		
		var svg = d3.select("#div_series").select("svg");

		if (svg[0][0] != null){
			svg.style("hidden","none")
				.transition();
			svg.remove();
		}
		
		svg = d3.select("#div_series").append("svg")
			.attr("width", width + margin.left + margin.right + 150)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + (margin.left + 50) + "," + margin.top + ")");
		
		
		var x = d3.time.scale()
			.range([0, width]);

		var y = d3.scale.linear()
			.domain([0, d3.max(val_y)])
			.range([height, 0]);

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom")
			.ticks(4);
			
		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");

		var line = d3.svg.line()
			.x(function(d) { return x(d.ANO); })
			.y(function(d) { return y(parseFloat(d[indicador]));});
		
		minYear = (d3.min(d3.extent(dados_estado, function(d){return d.ANO;})));
		maxYear = (d3.max(d3.extent(dados_estado, function(d){return d.ANO;})));
		
		
		if(minYear == maxYear){
			var min = minYear.getFullYear() - 4;
			min = min.toString();
			console.log(min);
			x.domain([parseDate(min), maxYear]);
		}else{
			x.domain([minYear,maxYear]);
		}
		
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
		  .style("stroke",cor_cidade);
		  
		svg.append("path")
		  .datum(dados_estado) //estado
		  .attr("class", "line")
		  .attr("d", line)
		  .style("stroke",cor_estado);
		
		svg.append("path")
		  .datum(dados_micro) //microrregiao
		  .attr("class", "line")
		  .attr("d", line)
		  .style("stroke",cor_micro);
		  
		svg.append("path")
		  .datum(dados_meso) //mesorregiao
		  .attr("class", "line")
		  .attr("d", line)
		  .style("stroke",cor_meso);
		
		//plotando os pontos
		svg.selectAll('.dot')
			.data(dados_cidade)//municipio
			.attr('class', 'data-point')
			.enter().append("circle")
			.style('fill', cor_cidade)
			.attr('cx', function(d) { return x(d.ANO);})
			.attr('cy', function(d) { return y(d[indicador]);})
			.attr('r', 4)
			.on("mouseover", function(d) {

				//Get indicator value and tranform to float
				var valorIndicador = parseFloat(d[indicador]);
				
				//Get the values for tooltip position
				var xPosition = parseFloat(d3.select(this).attr("cx")) + 100;
				var yPosition = parseFloat(d3.select(this).attr("cy")) + 450 ;

				//Update the tooltip position and value
				d3.select("#tooltip").style("left", xPosition + "px")
				.style("top", yPosition + "px")
				.select("#value").text(valorIndicador.toFixed(2));//cidade + " : " +valorIndicador.toFixed(2));

				//Show the tooltip
				d3.select("#tooltip").classed("hidden", false);})

			.on("mouseout", function() {//Hide the tooltip
					d3.select("#tooltip").classed("hidden", true);
			});
		
		svg.selectAll('.dot')
			.data(dados_estado)//estado
			.attr('class', 'data-point')
			.enter()
			.append("circle")
			.style('fill', cor_estado)
			.attr('cx', function(d) { return x(d.ANO);})
			.attr('cy', function(d) { return y(d[indicador]);})
			.attr('r', 4)
			.on("mouseover", function(d) {
				
				//Get indicator value and tranform to float
				var valorIndicador = parseFloat(d[indicador]);

				//Get the values for tooltip position
				var xPosition = parseFloat(d3.select(this).attr("cx")) + 100;
				var yPosition = parseFloat(d3.select(this).attr("cy")) + 450 ;

				//Update the tooltip position and value
				d3.select("#tooltip").style("left", xPosition + "px")
				.style("top", yPosition + "px")
				.select("#value").text(valorIndicador.toFixed(2));//"Estado : " + valorIndicador.toFixed(2));

				//Show the tooltip
				d3.select("#tooltip").classed("hidden", false);})

			.on("mouseout", function() {//Hide the tooltip
					d3.select("#tooltip").classed("hidden", true);
			});

		
		svg.selectAll('.dot')
			.data(dados_micro)//micro
			.attr('class', 'data-point')
			.enter().append("circle")
			.style('fill', cor_micro)
			.attr('cx', function(d) { return x(d.ANO);})
			.attr('cy', function(d) { return y(d[indicador]);})
			.attr('r', 4)
			.on("mouseover", function(d) {
				
				//Get indicator value and tranform to float
				var valorIndicador = parseFloat(d[indicador]);

				//Get the values for tooltip position
				var xPosition = parseFloat(d3.select(this).attr("cx")) + 100;
				var yPosition = parseFloat(d3.select(this).attr("cy")) + 450;

				//Update the tooltip position and value
				d3.select("#tooltip").style("left", xPosition + "px")
				.style("top", yPosition + "px")
				.select("#value").text(valorIndicador.toFixed(2));//"Microrregião : " + valorIndicador.toFixed(2));

				//Show the tooltip
				d3.select("#tooltip").classed("hidden", false);})

			.on("mouseout", function() {//Hide the tooltip
					d3.select("#tooltip").classed("hidden", true);
			});		
		
		svg.selectAll('.dot')
			.data(dados_meso)//meso
			.attr('class', 'data-point')
			.enter().append("circle")
			.style('fill', cor_meso)
			.attr('cx', function(d) { return x(d.ANO);})
			.attr('cy', function(d) { return y(d[indicador]);})
			.attr('r', 4)
			.on("mouseover", function(d) {
				
				//Get indicator value and tranform to float
				var valorIndicador = parseFloat(d[indicador]);

				//Get the values for tooltip position
				var xPosition = parseFloat(d3.select(this).attr("cx")) + 100;
				var yPosition = parseFloat(d3.select(this).attr("cy")) + 450 ;

				//Update the tooltip position and value
				d3.select("#tooltip").style("left", xPosition + "px")
				.style("top", yPosition + "px")
				.select("#value").text(valorIndicador.toFixed(2));//"Mesorregião : " + valorIndicador.toFixed(2));

				//Show the tooltip
				d3.select("#tooltip").classed("hidden", false);})

			.on("mouseout", function() {//Hide the tooltip
					d3.select("#tooltip").classed("hidden", true);
			});	
		
		svg.append("circle")
			.style("fill", cor_cidade)
			.attr("r", 4)
			.attr("cx", 645)
			.attr("cy", 110);
		
		svg.append("circle")
			.style("fill", cor_estado)
			.attr("r", 4)
			.attr("cx", 645)
			.attr("cy", 125);
			
		svg.append("circle")
			.style("fill", cor_meso)
			.attr("r", 4)
			.attr("cx", 645)
			.attr("cy", 140);
			
		svg.append("circle")
			.style("fill", cor_micro)
			.attr("r", 4)
			.attr("cx", 645)
			.attr("cy", 155);
		
		svg.append("text")
			.attr("x", 650)
			.attr("y", 112)
			.attr("font-weight", "bold")
			.text(cidade);
		
		svg.append("text")
			.attr("x", 650)
			.attr("y", 127)
			.attr("font-weight", "bold")
			.text("Paraíba");
		
		svg.append("text")
			.attr("x", 650)
			.attr("y", 142)
			.attr("font-weight", "bold")
			.text("Microrregião");
		
		svg.append("text")
			.attr("x", 650)
			.attr("y", 157)
			.attr("font-weight", "bold")
			.text("Mesorregião");		
	}
}
