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
	rawdata = dataset.filter(function(i){return i.NOME_MUNICIPIO == cidade;})	
	
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

function plotNome(indicador){
	d3.selectAll("svg")
	.enter()
	.text(indicador.name);
}

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
			
			plot_ranges(svg, line_estado, 100);
			plot_ranges(svg, line_estado, 185);
			plot_ranges(svg, line_estado, 270);
			
			plot_bars(svg, line_estado, line_estado, 100,currentYearData[indicador]);
			plot_bars(svg , line_estado, line_meso, 185,currentYearData[indicador]);
			plot_bars(svg , line_estado, line_micro, 270,currentYearData[indicador]);

			
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
			
			//svg.selectAll("circle").transition()
			//	 .remove();
			
			svg.selectAll("text").transition()
				 .remove();
			
			plot_ranges(svg, line_estado, 100);
			plot_ranges(svg, line_estado, 185);
			plot_ranges(svg, line_estado, 270);
			
			plot_bars(svg, line_estado, line_estado, 100,currentYearData[indicador]);
			plot_bars(svg , line_estado, line_meso, 185,currentYearData[indicador]);
			plot_bars(svg , line_estado, line_micro, 270,currentYearData[indicador]);
			
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
	
};

function plot_bars(svg,dados,dados_regiao, y0, indicador_value){

	var x1 = d3.scale.linear()
          .domain([dados[0].x, dados[1].x])
          .range([110+ dados[0].x, 600+ dados[1].x]);
	
	svg.append("line")
		  .transition().duration(duration)
		  .attr("x1", x1(dados_regiao[0].x))
		  .attr("x2", x1(dados_regiao[1].x))
		  .attr("y1",y0)
		  .attr("y2",y0)
		  .style("stroke",d3.rgb(200,200,200))
		  .style("stroke-width", 10);
			  
	// svg.append("circle")
		// .transition().duration(duration)
		// .attr("cx", x1(parseFloat(indicador_value)) )	
		// .attr("cy",y0)
		// .style("fill","black")
		// .attr("r", 6);
		
	svg.append("rect")
		  .transition().duration(duration).delay(1000)
		  .attr("x", x1(indicador_value))
		  .attr("y",(y0-8))
		  .attr("width", 3)
		  .attr("height" , 15)
		  .style("fill", "black");
	
	// svg.append("text")
		// .transition().duration(duration).delay(500)
		// .attr("x", x1(indicador_value))
		// .attr("y", (y0 - 30))
		// .text(cidade);
}

function plot_ranges(svg, dados, y0){

	var x1 = d3.scale.linear()
          .domain([dados[0].x, dados[1].x])
          .range([110+ dados[0].x, 600+ dados[1].x]);

	var xAxis = d3.svg.axis()
			.scale(x1)
			.orient("bottom")
			.ticks(5);
			
	svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + (y0+12) + ")")
		  .transition().duration(duration).delay(500)
		  .call(xAxis);
	
	svg.append("text")
		.transition().duration(duration).delay(500)
		.attr("x", (100 + dados[0].x))
		.attr("y", (y0 + 30))
		.text("Min");
		
	svg.append("text")
		.transition().duration(duration).delay(500)
		.attr("x", (590 + dados[1].x))
		.attr("y", (y0 + 30))
		.text("Max");
	
	svg.append("line")
			  .transition().duration(duration)
			  .attr("x1", 110 + dados[0].x)
			  .attr("x2", 600 + dados[1].x)
			  .attr("y1",y0)
			  .attr("y2",y0)
			  .style("stroke",d3.rgb(220,220,220))
			  .style("stroke-width", 25);
			  

}
