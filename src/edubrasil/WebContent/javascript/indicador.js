var dataset = [];
var rawdata = [];
var dicionario = [];
var cidade = "";
var duration = 1000;
var w = 800;
var h = 350;

//Recebe uma cidade e pinta os botoes
function getMenuOption(selection) {
	//limpa containers
	cleanContainers();
	
    cidade = selection.options[selection.selectedIndex].value;
	plotSeries(cidade);
	rawdata = dataset.filter(function(i){return i.NOME_MUNICIPIO == cidade;});	
	
	dicionario.sort(function (a, b) {
    			return getDesvio(a.desvio) - getDesvio(b.desvio);
	});
	d3.selectAll(".indicador")
	.data(dicionario)
	.transition()
	.delay(function(d, i) {
		return i * 50;
	})//.duration(1000)
	.attr("class", function(d) {
          return "indicador " + getButtonColor(d.desvio);
    })
	.attr("value", function (d){return d.name;})
	.attr("id", function (d, i){return d.id;});	
	
   // plotIndicadores("");
   // plotSeries(""); 
   // plotSeries(value); 
   // plotIndicadores(value);   
    
};

/*function plotNome(indicador){
	d3.selectAll("svg")
	.enter()
	.text(indicador.name);
}*/

function cleanContainers(){
	d3.selectAll("svg")
    .remove();
}

Array.prototype.unique = function() {
    var o = {}, i, l = this.length, r = [];
    for(i=0; i<l;i+=1) o[this[i]] = this[i];
    for(i in o) r.push(o[i]);
    return r;
};

//Retorna o valor do desvio
function getDesvio(colunaDesvio) {
	valor = getRecentValueIndicadorColuna(colunaDesvio);
	if (valor == "NA" ) {
		return 10;
	}else{
		return parseFloat(valor);
	}
}


//Carrega arquivo inicial e os botoes
function loadData() {
	d3.csv("data/tabela_com_todos_os_indicadores_selecionados_e_desvios.csv" , function (data){
		
		dataset = data;
		
		//compara unicode characters
		function sortComparer(a,b){
			return a.localeCompare(b);
		};
		
		var cities = data.map(function(d){return d.NOME_MUNICIPIO;}).unique().sort(sortComparer);
		//adiciona um vazio dentro do array
		cities.unshift("");
		
		var myList = d3.selectAll("#myList");
		
		myList.selectAll("option").data(cities).enter().append("option")
		.attr("value",function(d){return d;})
		.attr("label",function(d){return d;});
	
	});
	loadUpButtons();
};


//Carrega os botoes da parte de cima
function loadUpButtons() {
	d3.csv("data/dicionario.csv" , function (data){
		dicionario = data;
		var div_buttons = d3.select("#div_indicador_options");	
		
		div_buttons.selectAll("input")
		.data(data)
		.enter()
		.append("input")
		.attr("type","button")
		.attr("value", function (d){return d.name;})
		.attr("id", function (d, i){return d.id;})
        .attr("class", "indicador indicador_cinza")
		.on("click", function(d) {
			plotIndicadores(d.id);
			plotSeries(cidade,d.id);
		});
	});
	d3.select("#indicador_titulo")
	.append(p)
	.text("Selecione Uma Cidade");
	
}

//Pode retornar NA se não houver nenhum ano disponivel para o Indicador
function getRecentValueIndicadorColuna(colunaDesvio) {
	var maxYear = rawdata.filter(function(d){return d[colunaDesvio] != "NA";}).map(function(d){return parseInt(d.ANO);});
	if (maxYear.length == 0) {
		return "NA";
	}
	else {
		maxYear = d3.max(maxYear);
		var currentYearData = rawdata.filter(function(d){return d.ANO == maxYear;})[0];
		return currentYearData[colunaDesvio];
	}
}

//Retorna a cor do Botao
function getButtonColor(colunaDesvio) {
	valor = getRecentValueIndicadorColuna(colunaDesvio);
	if (valor == "NA" ) {
        return "indicador_cinza";
//		return "gray";
	}
	else if (parseFloat(valor) == -2) {
        return "indicador_amarelo";
        //return "#FFCC00";
	}
	else if (parseFloat(valor) == -3) {
		return "indicador_laranja";
        //return "#FF6600";
	}
	else if (parseFloat(valor) <= -4) {
		return "indicador_vermelho";
        //return "#FF0000";
	}
	else if (parseFloat(valor) >= 3) {
        return "indicador_verde";
//		return "green";
	}
	else {
        return "indicador_branco";
		//return "#E0E0E0";
	}
}

//Plota grafico
function plotIndicadores(indicador) {
// e se todos forem NAs?
	
	//Width and height
	
	
	if(rawdata.length != 0){
		
		
		var maxYear = d3.max(rawdata.filter(function(d){return d[indicador] != "NA";}).map(function(d){return parseInt(d.ANO)}));
		var currentYearData = rawdata.filter(function(d){return d.ANO == maxYear;})[0];
		var subset = [10, parseFloat(currentYearData[indicador])];
		
		//Create SVG element
		var svg = d3.select("#div_indicador").select("svg");
		var estado = dataset.filter(function(d){return d[indicador] != "NA" & d.ANO == currentYearData.ANO;});
		var meso = dataset.filter(function(d){return d[indicador] != "NA" & d.NOME_MESO == currentYearData.NOME_MESO & d.ANO == currentYearData.ANO;});
		
		var micro = dataset.filter(function(d){return d[indicador] != "NA" & d.NOME_MICRO == currentYearData.NOME_MICRO & d.ANO == currentYearData.ANO;});
		
		var line_estado = [{'x' : d3.min(estado,function(d){return parseFloat(d[indicador])}) , 'y' : 100},
						   {'x':(d3.max(estado,function(d){return parseFloat(d[indicador])})), 'y' : 100}];
					
		var line_meso =[{'x' : d3.min(meso,function(d){return parseFloat(d[indicador])}) , 'y' : 185}, 
						{'x': (d3.max(meso,function(d){return parseFloat(d[indicador])})), 'y' : 185}];
		
		var line_micro = [{'x' :d3.min(micro,function(d){return parseFloat(d[indicador])}) , 'y' : 270},
						  {'x': (d3.max(micro,function(d){return parseFloat(d[indicador])})), 'y' : 270}];
		
		if(indicador == "INDICADOR_7"){
			line_estado = [{'x' : d3.min(estado,function(d){return parseFloat(d[indicador])/100}) , 'y' : 100},
						   {'x':(d3.max(estado,function(d){return parseFloat(d[indicador])/100})), 'y' : 100}];
					
			line_meso =[{'x' : d3.min(meso,function(d){return parseFloat(d[indicador])/100}) , 'y' : 185}, 
						{'x': (d3.max(meso,function(d){return parseFloat(d[indicador])/100})), 'y' : 185}];
		
			line_micro = [{'x' :d3.min(micro,function(d){return parseFloat(d[indicador])/100}) , 'y' : 270},
						  {'x': (d3.max(micro,function(d){return parseFloat(d[indicador])/100})), 'y' : 270}];
		}
		
		var teste;
		if (svg[0][0] == null){
			
			var svg = d3.select("#div_indicador").append("svg").attr("width", w).attr("height", h);
			
			//eixo das barras
			plot_ranges(svg, line_estado, 100);
			plot_ranges(svg, line_estado, 185);
			plot_ranges(svg, line_estado, 270);
			
			
			//barras cinzas equivalentes ao valor das regioes
			//plot_bars(svg, line_estado, line_estado, 100,currentYearData[indicador]);
			plot_bars(svg , line_estado, line_meso, 185,currentYearData[indicador]);
			plot_bars(svg , line_estado, line_micro, 270,currentYearData[indicador]);

			//barra com as cores dos indicadores
			
			plot_desvios_barras(svg,estado, indicador,100, parseFloat(currentYearData[indicador]));


			svg.append("text")
			.attr("y", 60)
			.style("text-align", "middle")
			.text("Gráfico para indicador " + indicador + " referente ao ano " + currentYearData.ANO);
			
		
			svg.append("text")
				.attr("y", 100)
				.style("text-align", "right")
				.text("Paraíba");
			
			svg.append("text")
				.style("text-align", "right")
				.attr("y", 187)
				.text(currentYearData.NOME_MESO);
				
			svg.append("text")
				.attr("y", 272)
				.text(currentYearData.NOME_MESO);
			
		}else{

			svg.selectAll("g").transition()
				 .remove();
			
			svg.selectAll("line").transition()
				 .remove();
			
			svg.selectAll("rect").transition()
				 .remove();
			
			svg.selectAll("text").transition()
				 .remove();
			
			//eixo das barras
			plot_ranges(svg, line_estado, 100);
			plot_ranges(svg, line_estado, 185);
			plot_ranges(svg, line_estado, 270);
			
			
			//barras cinzas equivalentes ao valor das regioes
			//plot_bars(svg, line_estado, line_estado, 100,currentYearData[indicador]);
			plot_bars(svg , line_estado, line_meso, 185,currentYearData[indicador]);
			plot_bars(svg , line_estado, line_micro, 270,currentYearData[indicador]);

			//barra com as cores dos indicadores
			plot_desvios_barras(svg,estado, indicador,100,parseFloat(currentYearData[indicador]));
			

			svg.append("text")
			.attr("y", 60)
			.style("text-align", "middle")
			.text("Gráfico para indicador " + indicador + " referente ao ano " + currentYearData.ANO);
			
			
			svg.append("text")
				.attr("y", 100)
				.text("Paraíba");
			
			svg.append("text")
				.attr("y", 187)
				.text(currentYearData.NOME_MESO);
				
			svg.append("text")
				.attr("y", 272)
				.text(currentYearData.NOME_MICRO);

		}
	}else{
		d3.select("svg").remove();
	}
	
}

function plot_desvios_barras(svg,dados_estado, indicador, y0, valor_cidade){
	//DESVIOS_MELHOR_ ou DESVIOS_NEUTRO ou DESVIOS_PIOR

	var valores_nulos = ["-1","NA","1","2"];
	
	var cinza = dados_estado.filter(function(d){return(valores_nulos.indexOf(d["DESVIOS_MELHOR_" + indicador]) > -1 |
														  valores_nulos.indexOf(d["DESVIOS_NEUTRO_" + indicador]) > -1 |
														  valores_nulos.indexOf(d["DESVIOS_PIOR_" + indicador]) > -1)});
	
	var amarelo = dados_estado.filter(function(d){return(d["DESVIOS_MELHOR_" + indicador] == "-2" |
														  d["DESVIOS_NEUTRO_" + indicador] == "-2" |
														  d["DESVIOS_PIOR_" + indicador] == "-2")});
														  
	var laranja = dados_estado.filter(function(d){return(d["DESVIOS_MELHOR_" + indicador] == "-3" |
														  d["DESVIOS_NEUTRO_" + indicador] == "-3" |
														  d["DESVIOS_PIOR_" + indicador] == "-3")});

	var vermelho = dados_estado.filter(function(d){return(d["DESVIOS_MELHOR_" + indicador] == "-4" |
														  d["DESVIOS_NEUTRO_" + indicador] == "-4" |
														  d["DESVIOS_PIOR_" + indicador] == "-4")});														
	
	var verde = dados_estado.filter(function(d){return(d["DESVIOS_MELHOR_" + indicador] == "3" |
														  d["DESVIOS_NEUTRO_" + indicador] == "3" |
														  d["DESVIOS_PIOR_" + indicador] == "3")});
	
	var x1 = d3.scale.linear()
          .domain([(d3.min(dados_estado,function(d){return parseFloat(d[indicador])})),(d3.max(dados_estado,function(d){return parseFloat(d[indicador])}))])
          .range([120, 650]);

	//linhas com cores referentes aos desvios do indicador
	svg.append("line")
		   .attr("x1", x1(d3.min(dados_estado,function(d){return parseFloat(d[indicador])})))
		   .attr("x2", x1(d3.max(dados_estado,function(d){return parseFloat(d[indicador])})))
		   .attr("y1",(y0))
		   .attr("y2",(y0))
		   .transition().duration(duration)
		   .style("stroke",d3.rgb("#768d87"))
		   .attr("stroke-width",10);
	
	 svg.append("line")
		   .attr("x1", x1(d3.min(cinza,function(d){return parseFloat(d[indicador])})))
		   .attr("x2", x1(d3.max(cinza,function(d){return parseFloat(d[indicador])})))
		   .attr("y1",(y0))
		   .attr("y2",(y0))
		   .transition().duration(duration)
		   .style("stroke",d3.rgb("#E0E0E0"))
		   .attr("stroke-width",10);
	
	 svg.append("line")
		   .attr("x1", x1(d3.min(amarelo,function(d){return parseFloat(d[indicador])})))
		   .attr("x2", x1(d3.max(amarelo,function(d){return parseFloat(d[indicador])})))
		   .attr("y1",(y0))
		   .attr("y2",(y0))
		   .transition().duration(duration)
		   .style("stroke",d3.rgb("#FFCC00"))
		   .attr("stroke-width",10);
		   
	svg.append("line")
		   .attr("x1", x1(d3.min(laranja,function(d){return parseFloat(d[indicador])})))
		   .attr("x2", x1(d3.max(laranja,function(d){return parseFloat(d[indicador])})))
		   .attr("y1",(y0))
		   .attr("y2",(y0))
		   .transition().duration(duration)
		   .style("stroke",d3.rgb("#FF6600"))
		   .attr("stroke-width",10);
		   
	svg.append("line")
		   .attr("x1", x1(d3.min(vermelho,function(d){return parseFloat(d[indicador])})))
		   .attr("x2", x1(d3.max(vermelho,function(d){return parseFloat(d[indicador])})))
		   .attr("y1",(y0))
		   .attr("y2",(y0))
		   .transition().duration(duration)
		   .style("stroke",d3.rgb("#FF0000"))
		   .attr("stroke-width",10);
	
	svg.append("line")
		   .attr("x1", x1(d3.min(verde,function(d){return parseFloat(d[indicador])})))
		   .attr("x2", x1(d3.max(verde,function(d){return parseFloat(d[indicador])})))
		   .attr("y1",(y0))
		   .attr("y2",(y0))
		   .transition().duration(duration)
		   .style("stroke",d3.rgb("#74ad5a"))
		   .attr("stroke-width",10);
	
	//plotando valor atual
	
	svg.append("rect")
		  .transition().duration(duration).delay(1000)
		  .attr("x", x1(valor_cidade))
		  .attr("y",(y0-12))
		  .attr("width", 1)
		  .attr("height" , 30)
		  .style("fill", "black");
	
	if((parseFloat(valor_cidade) != d3.min(dados_estado,function(d){return parseFloat(d[indicador])})) & 
		(parseFloat(valor_cidade) != d3.max(dados_estado,function(d){return parseFloat(d[indicador])}))){
		svg.append("text")
				.attr("x", x1(valor_cidade))
				.attr("y",(y0 + 30))
				.attr("text-anchor", "middle")
				.transition().duration(duration).delay(1000)
				.text(parseFloat(valor_cidade).toFixed(2));
	}
	
	svg.append("text")
		.attr("x", x1(valor_cidade))
		.attr("y",(y0 - 20))
		.attr("text-anchor", "middle")
		.transition().duration(duration).delay(1000)
		.text(cidade);
	
}

function plot_bars(svg,dados_estado,dados_regiao, y0, indicador_value){

	var x1 = d3.scale.linear()
          .domain([dados_estado[0].x, dados_estado[1].x])
          .range([120, 650]);
		
	svg.append("line")
		  .attr("x1", x1(dados_regiao[0].x))
		  .attr("x2", x1(dados_regiao[1].x))
		  .attr("y1",(y0))
		  .attr("y2",(y0))
		  .transition().duration(duration)
		  .style("stroke",d3.rgb("#E0E0E0"))
		  .attr("stroke-width",10);
	
	svg.append("rect")
		  .transition().duration(duration).delay(1000)
		  .attr("x", x1(dados_regiao[0].x))
		  .attr("y",(y0-12))
		  .attr("width", 1)
		  .attr("height" , 30)
		  .style("fill", "black");
	
	svg.append("rect")
		  .transition().duration(duration).delay(1000)
		  .attr("x", x1(dados_regiao[1].x))
		  .attr("y",(y0-12))
		  .attr("width", 1)
		  .attr("height" , 30)
		  .style("fill", "black");
	
	if((dados_estado[0].x != dados_regiao[0].x)){
		svg.append("text")
			.attr("x", x1(dados_regiao[0].x) - 10)
			.attr("y",(y0 + 30))
			.text((dados_regiao[0].x).toFixed(2));
	}
	if(dados_estado[1].x != dados_regiao[1].x){
		svg.append("text")
			.attr("x", x1(dados_regiao[1].x) - 10)
			.attr("y",(y0 + 30))
			.text((dados_regiao[1].x).toFixed(2));
	}

}

function plot_ranges(svg, dados, y0){
	var x1 = d3.scale.linear()
          .domain([dados[0].x, dados[1].x])
          .range([120, 650]);

	var xAxis = d3.svg.axis()
			.scale(x1)
			.orient("bottom")
			.tickValues([dados[0].x,dados[1].x])
			.ticks(6);
			
	svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + (y0+12) + ")")
		  .transition().duration(duration).delay(500)
		  .call(xAxis);
	
	svg.append("text")
		.attr("x", x1(dados[0].x) - 10)
		.attr("y", (y0 + 44))
		.text("Min");
		
	svg.append("text")
		.attr("x", x1(dados[1].x) - 10)
		.attr("y", (y0 + 44))
		.text("Max");
	
	svg.append("line")
			  .attr("x1", x1(dados[0].x))
			  .attr("x2", x1(dados[1].x))
			  .attr("y1",y0)
			  .attr("y2",y0)
			  .style("stroke",d3.rgb("#F0F0F0"))
			  .style("stroke-width", 25);
}
