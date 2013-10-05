var dados_cidade = [];

//variaveis usadas para plotar os dados
var dados_estado = [];
var dados_micro = [];
var dados_meso = [];
var data_temporaria = [];
var data_temporaria_mediana = [];
var val_y;
var micro = "";
var meso = "";
var porcentagem = ["INDICADOR_62","INDICADOR_329","INDICADOR_333","INDICADOR_181","INDICADOR_182","INDICADOR_188","INDICADOR_189","INDICADOR_289","INDICADOR_290","INDICADOR_202"]
var reais = ["INDICADOR_7"]

//function getMenuOption(sel) {
//    var value = sel.options[sel.selectedIndex].value;
	//rawdata = dataset.filter(function(i){return i.NOME_MUNICIPIO == value;})/
//};

var parseDate = d3.time.format("%Y").parse;	


/*Inicio - funcao para formatar os números - iury - 30/09*/
function formatNum(numero) {
    var n= numero.toString().split(".");
    n[0] = n[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return n.join(",");
}
/*Fim - funcao para formatar os números - iury - 30/09*/

//Inicio - henriquerzo@gmail.com - 18/09/2013
function plotSeries(cidade,indicador, dataset, dataset_medianas) {

	data_temporaria = dataset;
	data_temporaria_mediana = dataset_medianas;

	if((cidade != "") && (indicador != null)){
		val_y = new Array();

		data_temporaria.forEach(function(d){
			d.ANO = parseDate(d.ANO);
			if(d.NOME_MUNICIPIO == cidade & d[indicador] != "NA"){
				meso = d.NOME_MESO;
				micro = d.NOME_MICRO;
				val_y.push(parseFloat(d[indicador]));
			}else if(d[indicador] != "NA"){
				val_y.push(parseFloat(d[indicador]));
			}
		});
		dados_cidade = data_temporaria.filter(function(i){return i.NOME_MUNICIPIO == cidade & i[indicador] != "NA";});
		

		data_temporaria_mediana.forEach(function(d){
			d.ANO = parseDate(d.ANO);
			if((d.REGIAO == "Paraíba" | d.REGIAO == micro | d.REGIAO == meso) & d[indicador] != "NA"){
				val_y.push(formatNum(parseFloat(d[indicador])));//mudei aqui
			}
		});
		dados_estado = data_temporaria_mediana.filter(function(i){return i.REGIAO == "Paraíba" & i[indicador] != "NA";});
		dados_micro = data_temporaria_mediana.filter(function(i){return i.REGIAO == micro & i[indicador] != "NA";});
		dados_meso = data_temporaria_mediana.filter(function(i){return i.REGIAO == meso & i[indicador] != "NA";});//
		
		plotGraph(indicador);

		data_temporaria.forEach(function(d){
			if(typeof(d.ANO) != "string") {
				d.ANO = (d.ANO).getFullYear().toString();
			}
		});
		data_temporaria_mediana.forEach(function(d){
			if(typeof(d.ANO) != "string") {
				d.ANO = (d.ANO).getFullYear().toString();
			}			
		});
		//Fim - henriquerzo@gmail.com - 18/09/2013
		
	};

};

Array.prototype.contains = function(element){
    return this.indexOf(element) > -1;
};

function plotGraph(indicador){//(nome_indicador){
	//versao colorida//
	var cor_cidade = d3.rgb(197,27,125);
	var cor_estado = d3.rgb(37,52,148);
	var cor_meso = d3.rgb(44,127,184);
	var cor_micro = d3.rgb(65,182,196);
	
	
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
			.orient("left")
			.tickFormat(function(d){return formatNum(d);});

		var line = d3.svg.line()
			.x(function(d) { return x(d.ANO); })
			.y(function(d) { return y(parseFloat(d[indicador]));});
		
		minYear = (d3.min(d3.extent(dados_estado, function(d){return d.ANO;})));
		maxYear = (d3.max(d3.extent(dados_estado, function(d){return d.ANO;})));
		
		
		if(minYear == maxYear){
			var min = minYear.getFullYear() - 4;
			min = min.toString();
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


		/*Inicio - unidade no eixo Y - iurygregory@gmail.com 28/09*/
		if(porcentagem.contains(indicador)){
			svg.append("text")
			  .attr("transform","rotate(-90)")
			  .attr("y",0-margin.left)
			  .attr("x",0 - (height/2))
			  .attr("dy","1em")
			  .attr("text-anchor","middle")
			  .text("Porcentagem (%)")
			  .attr("font-size", "12px");

		}else{
			if(reais.contains(indicador)){
				svg.append("text")
				  .attr("transform","rotate(-90)")
				  .attr("y",0-margin.left)
				  .attr("x",0 - (height/2))
				  .attr("dy","1em")
				  .attr("text-anchor","middle")
				  .text("Gastos em Reais")
				  .attr("font-size", "12px");
			}else{
				// caso de adicionar novas coisas ao eixo
			}
		}
		/*Fim- unidade no eixo Y - iurygregory@gmail.com 28/09*/

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
				/*Inicio - unidade no tooltip cidade - iurygregory@gmail.com 28/09*/
				/* - formatacao de valores no tooltip cidade - 30/09 */
				if(porcentagem.contains(indicador)){
				d3.select("#tooltip").style("left", xPosition + "px")
				.style("top", yPosition + "px")
				.select("#value").text(formatNum(valorIndicador.toFixed(2))+"%");
				}else{
					if(reais.contains(indicador)){
					d3.select("#tooltip").style("left", xPosition + "px")
					.style("top", yPosition + "px")
					.select("#value").text(formatNum(valorIndicador.toFixed(2))+ " Reais");
					}else{
					d3.select("#tooltip").style("left", xPosition + "px")
					.style("top", yPosition + "px")
					.select("#value").text(formatNum(valorIndicador.toFixed(2)));
					}
				}
				/*Fim - unidade no tooltip cidade - iurygregory@gmail.com 28/09*/
				/* - formatacao de valores no tooltip cidade - 30/09 */

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
				/*Inicio - unidade tooltip - iury - 29/09*/
				/* - formatacao de valores no tooltip  - 30/09 */
				if(porcentagem.contains(indicador)){
				d3.select("#tooltip").style("left", xPosition + "px")
				.style("top", yPosition + "px")
				.select("#value").text(formatNum(valorIndicador.toFixed(2))+"%");
				}else{
					if(reais.contains(indicador)){
					d3.select("#tooltip").style("left", xPosition + "px")
					.style("top", yPosition + "px")
					.select("#value").text(formatNum(valorIndicador.toFixed(2))+ " Reais");
					}else{
					d3.select("#tooltip").style("left", xPosition + "px")
					.style("top", yPosition + "px")
					.select("#value").text(formatNum(valorIndicador.toFixed(2)));
					}
				}
				/*Fim - unidade tooltip - iury - 29/09*/
				/* - formatacao de valores no tooltip cidade - 30/09 */


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
				/*Inicio - unidade tooltip - iury - 29/09*/
				/* - formatacao de valores no tooltip - 30/09 */
				if(porcentagem.contains(indicador)){
				d3.select("#tooltip").style("left", xPosition + "px")
				.style("top", yPosition + "px")
				.select("#value").text(formatNum(valorIndicador.toFixed(2))+"%");
				}else{
					if(reais.contains(indicador)){
					d3.select("#tooltip").style("left", xPosition + "px")
					.style("top", yPosition + "px")
					.select("#value").text(formatNum(valorIndicador.toFixed(2))+ " Reais");
					}else{
					d3.select("#tooltip").style("left", xPosition + "px")
					.style("top", yPosition + "px")
					.select("#value").text(formatNum(valorIndicador.toFixed(2)));
					}
				}
				/*Fim - unidade tooltip - iury - 29/09*/
				/* - formatacao de valores no tooltip  - 30/09 */
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

				/*Inicio - unidade tooltip - iury - 29/09*/
				/* - formatacao de valores no tooltip- 30/09 */
				if(porcentagem.contains(indicador)){
				d3.select("#tooltip").style("left", xPosition + "px")
				.style("top", yPosition + "px")
				.select("#value").text(formatNum(valorIndicador.toFixed(2))+"%");
				}else{
					if(reais.contains(indicador)){
					d3.select("#tooltip").style("left", xPosition + "px")
					.style("top", yPosition + "px")
					.select("#value").text(formatNum(valorIndicador.toFixed(2))+ " Reais");
					}else{
					d3.select("#tooltip").style("left", xPosition + "px")
					.style("top", yPosition + "px")
					.select("#value").text(formatNum(valorIndicador.toFixed(2)));
					}
				}
				/*Fim - unidade tooltip - iury - 29/09*/
				/* - formatacao de valores no tooltip - 30/09 */
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
