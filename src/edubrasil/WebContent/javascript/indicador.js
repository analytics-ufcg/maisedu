var dataset = [];
var rawdata = [];
var dicionario = [];
var cidade = "";
var duration = 1000;
var w = 800;
var h = 350;
var mensagemBotaoCinza = "Dados Indisponíveis";

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
};

function cleanContainers(){
	d3.selectAll("svg")
    .remove();
	
	d3.selectAll("h1").remove();
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
			
			//limpa tela caso o botao clicado seja cinza(inativo)
			if(getButtonColor(d.desvio) == "indicador_cinza"){
				cleanContainers();
				
				d3.select("#div_indicador_titulo")
				.append("h1")
				.attr("class", "titulo_grafico")
				.text(mensagemBotaoCinza);

			}else{			
				plotIndicadores(d.id);
				plotSeries(cidade,d.id);
			}
		});
	});
}

//Plota o titulo do indicador
function plotTitulosGraficos(indicador, ano) {
	d3.selectAll("h1").remove();
	
	d3.select("#div_indicador_titulo")
	.append("h1")
	.attr("class", "titulo_grafico")
	.text(nomeIndicador(indicador) + " - " + ano);
	
	d3.select("#div_series_titulo")
	.append("h1")
	.attr("class", "titulo_grafico")
	.text(nomeIndicador(indicador) + " nos últimos anos");
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

//recebe o id do indicador e retorna o nome
function nomeIndicador(indicador) {
	for (var linha = 0; linha < dicionario.length; linha++) {
		if(dicionario[linha].id == indicador) {
			return dicionario[linha].name;
		}
	}
}

//Plota grafico
function plotIndicadores(indicador) {
	var svg;
	if(rawdata.length != 0){
		var maxYear = d3.max(rawdata.filter(function(d){return d[indicador] != "NA";}).map(function(d){return parseInt(d.ANO);}));
		var currentYearData = rawdata.filter(function(d){return d.ANO == maxYear;})[0];

		//Create SVG element
		svg = d3.select("#div_indicador").select("svg");
		var estado = dataset.filter(function(d){return d[indicador] != "NA" & d.ANO == currentYearData.ANO;});
		var meso = dataset.filter(function(d){return d[indicador] != "NA" & d.NOME_MESO == currentYearData.NOME_MESO & d.ANO == currentYearData.ANO;});
		var micro = dataset.filter(function(d){return d[indicador] != "NA" & d.NOME_MICRO == currentYearData.NOME_MICRO & d.ANO == currentYearData.ANO;});
		
		var line_estado = [{'x' : d3.min(estado,function(d){return parseFloat(d[indicador]);}) , 'y' : 100},
						   {'x':(d3.max(estado,function(d){return parseFloat(d[indicador]);})), 'y' : 100}];
					
		var line_meso =[{'x' : d3.min(meso,function(d){return parseFloat(d[indicador]);}) , 'y' : 185}, 
						{'x': (d3.max(meso,function(d){return parseFloat(d[indicador]);})), 'y' : 185}];
		
		var line_micro = [{'x' :d3.min(micro,function(d){return parseFloat(d[indicador]);}) , 'y' : 270},
						  {'x': (d3.max(micro,function(d){return parseFloat(d[indicador]);})), 'y' : 270}];

		
		if (svg[0][0] == null){

			svg = d3.select("#div_indicador").append("svg").attr("width", w).attr("height", h);
			
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

			plotTitulosGraficos(indicador, currentYearData.ANO);			
		
			svg.append("text")
				.attr("y", 100)
				.attr("text-anchor", "right")
				.text("Paraíba");
			
			svg.append("text")
				.style("text-align", "right")
				.attr("y", 187)
				.text(currentYearData.NOME_MESO);
			
			svg.append("text")
				.style("text-align", "center")
				.attr("y", 199)
				.text("(Mesorregião)");
			
			svg.append("text")
				.attr("y", 272)
				.text(currentYearData.NOME_MESO);
			
			svg.append("text")
				.style("text-align", "center")
				.attr("y", 284)
				.text("(Microrregião)");
			

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

			plotTitulosGraficos(indicador, currentYearData.ANO);			
			
			svg.append("text")
				.attr("y", 100)
				.text("Paraíba");
			
			svg.append("text")
				.attr("y", 187)
				.text(currentYearData.NOME_MESO);
			
			svg.append("text")
				.attr("y", 272)
				.text(currentYearData.NOME_MICRO);
				
			svg.append("text")
				.style("text-align", "center")
				.attr("y", 284)
				.text("(Microrregião)");
			
			svg.append("text")
				.style("text-align", "center")
				.attr("y", 199)
				.text("(Mesorregião)");
		
		}
		
		
	}else{
		d3.select("svg").remove();
	}
	
}

function plot_desvios_barras(svg,dados_estado, indicador, y0, valor_cidade){
	//DESVIOS_MELHOR_ ou DESVIOS_NEUTRO ou DESVIOS_PIOR
	var media =  mean(dados_estado, indicador);
	var desvio =  sd(dados_estado, indicador);
	var dado_indicador = dicionario.filter(function(d){return d.id == indicador;});
	var min = (d3.min(dados_estado,function(d){return parseFloat(d[indicador]);}));
	var max = (d3.max(dados_estado,function(d){return parseFloat(d[indicador]);}));
	var x1 = d3.scale.linear()
          .domain([min,max])
          .range([120, 750]);
		  
	desvios(svg,desvio,media,y0,min,max,dado_indicador[0].referencial_maior);
	
	//plotando valor atual
	svg.append("line")
		  .transition().duration(duration).delay(1000)
		  .attr("x1", x1(valor_cidade))
		  .attr("x2", x1(valor_cidade) + 1)
		  .attr("y1" , (y0 - 12))
		  .style("stroke-dasharray", ("5, 3"))
		  .attr("y2", 283)//200
		  .attr("stroke","black");

	//font-weight: bold
	svg.append("text")
		.attr("x", x1(valor_cidade))
		.attr("y",(y0 - 20))
		.attr("text-anchor", "middle")
		.attr("font-weight", "bold")
		.transition().duration(duration).delay(1000)
		.text(cidade + ": " + (parseFloat(valor_cidade).toFixed(2)));
}

function desvios(svg,desvio,media, y0,min, max, referencial){
	var x1 = d3.scale.linear()
          .domain([min,max])
          .range([120, 750]);
	addLine(svg, x1(min), x1(max), y0,y0,"#E0E0E0",10);
	if(referencial == "melhor" | referencial == "neutro"){
		//amarelo
		if((media - (desvio) < max) & (media - (2*desvio) > min)){
			addLine(svg,x1(media - (desvio)),x1(media - (2*desvio)),y0,y0,"#FFCC00",10);
		}else if((media - (desvio) > max) & (media - (2*desvio) > min)){
			addLine(svg,x1(max),x1(media - (2*desvio)),y0,y0,"#FFCC00",10);
		}else if((media - (desvio) < max) & (media - (2*desvio) < min)){
			addLine(svg,x1(media - (desvio)),x1(min),y0,y0,"#FFCC00",10);
		}
		//laranja
		if((media - (2*desvio) < max) & (media - (3*desvio) > min)){
			addLine(svg,x1(media - (2*desvio)),x1(media - (3*desvio)),y0,y0,"#FF6600",10);
		}else if((media - (2*desvio) > max) & (media - (3*desvio) > min)){
			addLine(svg,x1(max),x1(media - (3*desvio)),y0,y0,"#FF6600",10);
		}else if((media - (3*desvio) < min) & (media - (2*desvio) > min)){
			addLine(svg,x1(media - (2*desvio)),x1(min),y0,y0,"#FF6600",10);
		 }
		//vermelho
		if((media - (3*desvio) > min) & (media - (2*desvio) > min) & (media - desvio > min)){
			addLine(svg,x1(media - (3*desvio)),x1(min),y0,y0,"#FF0000",10);
		}
		//verde
		if(media + (2*desvio) < max){
			addLine(svg,x1(max),x1(media + (2*desvio)),y0,y0,"green",10);
		}
		
	}else{
		 //vermelho
		if(media + (3*desvio) < max){
			addLine(svg,x1(media + (3*desvio)),x1(max),y0,y0,"#FF0000",10);
		}
		//laranja
		if((media + (3*desvio) < max) & (media + (2*desvio) > min)){
			addLine(svg,x1(media + (3*desvio)),x1(media + (2*desvio)),y0,y0,"#FF6600",10);
		}else if((media + (3*desvio) > max) & (media +(2*desvio) > min)){
			addLine(svg,x1(media + (2*desvio)),x1(max),y0,y0,"#FF6600",10);
		}else if((media +(3*desvio) < max) & (media + (2*desvio) < min)){
			addLine(svg,x1(min),x1(media + (3*desvio)),y0,y0,"#FF6600",10);
		}
		//amarelo
		if((media + (2*desvio) < max) & (media + (desvio) > min)){
			addLine(svg,x1(media + (desvio)),x1(media + (2*desvio)),y0,y0,"#FFCC00",10);
		}else if((media + (2*desvio) > max) & (media +(desvio) > min)){
			addLine(svg,x1(media + (2*desvio)),x1(max),y0,y0,"#FFCC00",10);
		}else if((media +(2*desvio) < max) & (media+(desvio) < min)){
			addLine(svg,x1(min),x1(media + (2*desvio)),y0,y0,"#FFCC00",10);
		}
		//verde
		if((media - (2*desvio) > min)){
			addLine(svg,x1(media - (2*desvio)),x1(min),y0,y0,"green",10);
		}
	
	}
	
}

function plot_bars(svg,dados_estado,dados_regiao, y0, indicador_value){
	var x1 = d3.scale.linear()
          .domain([dados_estado[0].x, dados_estado[1].x])
          .range([120, 750]);
	
	addLine(svg,x1(dados_regiao[0].x),x1(dados_regiao[1].x),y0,y0,"#E0E0E0",10);
	
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
	

	svg.append("text")
		.attr("text-anchor","middle")
		.attr("x", x1(dados_regiao[0].x) - 2)
		.attr("y",(y0 + 30))
		.text((dados_regiao[0].x).toFixed(2));
	svg.append("text")
		.attr("text-anchor","left")
		.attr("x", x1(dados_regiao[1].x) - 15)
		.attr("y",(y0 + 30))
		.text((dados_regiao[1].x).toFixed(2));

}

function plot_ranges(svg, dados, y0){
	var x1 = d3.scale.linear()
          .domain([dados[0].x, dados[1].x])
          .range([120, 750]);

	var xAxis = d3.svg.axis()
			.scale(x1)
			.orient("bottom")
			.tickValues([parseFloat(dados[0].x).toFixed(2),parseFloat(dados[1].x).toFixed(2)])
			.ticks(6);
	
	if(y0 == 100){
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
	}
	
	addLine(svg,x1(dados[0].x),x1(dados[1].x),y0,y0,"#F0F0F0",25);
	
}

function mean(theArray,indicador) {
	var sum = 0, length = theArray.length; 
	for(var i=0;i<length;i++) {
		var tmp = theArray[i];
		sum += parseFloat(tmp[indicador]);
	}
	return sum/length; 
}

function sd(theArray, indicador) {
	var arithmeticMean = this.mean(theArray, indicador); 
	var sum = 0, length = theArray.length; 
	for(var i=0;i<length;i++) {
		var tmp = theArray[i];
		sum += Math.pow(parseFloat(tmp[indicador])-arithmeticMean, 2);
	}
	return Math.pow(sum/length, 0.5);
}

function addLine(svg,x1,x2,y1,y2,cor,largura){
	svg.append("line")
			  .attr("x1", x1)
			  .attr("x2", x2)
			  .attr("y1",y1)
			  .attr("y2",y2)
			  .transition().duration(duration)
			  .style("stroke",cor)
			  .attr("stroke-width",largura);
}