var dataset = [];
var rawdata = [];
var dicionario = [];
var similares = [];
var cidade = "";
var duration = 1000;
var w = 800;
var h = 350;
var mensagemBotaoCinza = "Dados Indisponíveis";
var valorR;

//Recebe uma cidade e pinta os botoes
function getMenuOption(selection) {
	//limpa containers
	cleanContainers();
	
    cidade = selection.options[selection.selectedIndex].value;
	plotSeries(cidade);
	rawdata = dataset.filter(function(i){return i.NOME_MUNICIPIO == cidade;});	
	
	dicionario.sort(function (a, b) {
		//Inicio - henriquerzo@gmail.com 20/08/2013
		if(a.id == "INDICADOR_201") {
			return getDesvio(a.id) - getDesvio(b.desvio);
		}
		else if(b.id == "INDICADOR_201") {
			return getDesvio(a.desvio) - getDesvio(b.id);
		}
		else {
			return getDesvio(a.desvio) - getDesvio(b.desvio);
		}
		//Fim - henriquerzo@gmail.com 20/08/2013
	});
	d3.selectAll(".indicador")
	.data(dicionario)
	.transition()
	.delay(function(d, i) {
		return i * 50;
	})//.duration(1000)
	.attr("class", function(d) {
		//Inicio - henriquerzo@gmail.com 20/08/2013
		if(d.id == "INDICADOR_201") {
			return "indicador " + getButtonColorIndicador201(d.id);
		}
		else{
          return "indicador " + getButtonColor(d.desvio);
      	}
      	//Fim - henriquerzo@gmail.com 20/08/2013
    })
	.attr("value", function (d){return d.name;})
	.attr("id", function (d, i){return d.id;});
	
	// D3 code modification made ​​by Nailson ( add tooltip with jquery and the tooltipster's plugin)
	$('.tooltips').tooltipster('destroy');	
	
	d3.selectAll(".tooltips")
	.data(dicionario)
	.attr("title", function (d){return d.big_description+".<a href='dicionario de dados.html?"+d.number+"' target='_blank'><img src='images/plus.png' onmouseover='this.src=&#39;images/plus2.png&#39;' onmouseout='this.src=&#39;images/plus.png&#39;' width='16' height='16'></a>";})
	
	$('.tooltips').tooltipster({ 
			interactive: true,
			maxWidth: 300,
			offsetY: 2,
			position: 'right',
			theme: '.tooltipster-shadow'
			
		});
	
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
	//Inicio - henriquerzo@gmail.com 20/08/2013
	if(colunaDesvio == "INDICADOR_201") {
		var valor = getRecentValueIndicadorColuna("INDICADOR_201");
			if (valor == "NA" ) {
				return 10;
			}
			if(parseFloat(valor) <= 0.5499999) {
				return -4;
			}
			else if(parseFloat(valor) <= 0.6699999) {
				return -3;
			}
			else if(parseFloat(valor) <= 0.8999999) {
				return 0;
			}
			else if(parseFloat(valor) <= 0.9999999) {
				return 3;
			}
			else if(parseFloat(valor) == 1.0) {
				return 4;
			}
			else {
				return 4;
			}
			/*
			Escala de Eficiência
			0 - 54 = fraco/vermelho
			55 - 66 = razoável/laranja
			67 - 89 = bom/cinza
			90 =< = muito bom/verde1
			100 = excelente/verde2
			*/
			
	}
	else {
		var valor = getRecentValueIndicadorColuna(colunaDesvio);
		if (valor == "NA" ) {
			return 10;
		}
		else {
			return parseFloat(valor);
		}
	}
	//Fim - henriquerzo@gmail.com 20/08/2013

	
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
		.attr("label",function(d){return d;})
		.text(function(d){return d;});
	
	});
	
	d3.csv("data/tabela_cidades_semelhantes.csv", function (data){
			similares = data;});
	
	
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
		.insert("span")
		.attr("class", "tooltips")
		.attr("title", function (d){return d.big_description+".<a href='dicionario de dados.html?"+d.number+"' target='_blank'><img src='images/plus.png' onmouseover='this.src=&#39;images/plus2.png&#39;' onmouseout='this.src=&#39;images/plus.png&#39;' width='16' height='16'></a>";})
		.attr("id", function (d, i){return "span"+d.id;})
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
				
				//botão de cidades similares
				/*d3.select("#div_indicador_titulo")
				.append("input")
				.style("text-anchor", "left")
				.attr("id","botao_similares")
				.attr("type","button")
				.attr("value", function (d){return 'Cidades Similares';})
				.on("click", function(d) { windowObjectReference = window.open ('cidades_parecidas.html','_blank', 'menubar=1 ,resizable=1 ,width=900 ,height=700')});*/
			}
		});
		
		// D3 code modification made ​​by Nailson ( add tooltip with jquery and the tooltipster's plugin)
		$('.tooltips').tooltipster({ 
			interactive: true,
			maxWidth: 300,
			offsetY: 2,
			position: 'right',
			theme: '.tooltipster-shadow'
			
		});
		
		
	});
}

//Plota o titulo do indicador
function plotTitulosGraficos(indicador, ano) {
	d3.selectAll("h1").remove();
	d3.selectAll("#botao_similares").remove();
	//d3.selectAll("input").remove();
	
	//Inicio - nailsonboaz@gmail.com 17/08/2013
	d3.select("#div_nome_cidade")
	.append("h1")
	.attr("class", "nome_cidade")
	.text(cidade + " - " + ano);
	//Fim - nailsonboaz@gmail.com 17/08/2013
	
	d3.select("#div_indicador_titulo")
	.append("h1")
	.attr("class", "titulo_grafico")
	.text(nomeIndicador(indicador));
	
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
	var valor = getRecentValueIndicadorColuna(colunaDesvio);
	if (valor == "NA" ) {
        return "indicador_cinza";
	}
	else if (parseFloat(valor) == -2) {
        return "indicador_amarelo";
	}
	else if (parseFloat(valor) == -3) {
		return "indicador_laranja";
	}
	else if (parseFloat(valor) <= -4) {
		return "indicador_vermelho";
	}
	else if (parseFloat(valor) <= 3 && parseFloat(valor) >= 2) {
        return "indicador_verde";
	}
	else if (parseFloat(valor) >= 3) {
        return "indicador_verde2";
	}
	else {
        return "indicador_branco";
	}
}


//Inicio - henriquerzo@gmail.com 20/08/2013
//Retorna a cor do Botao para o indicar "Indice de eficiencia da educacao/INDICADOR_201"
function getButtonColorIndicador201(atributo) {
	/*
		Escala de Eficiência
		0 - 54 = fraco/vermelho
		55 - 66 = razoável/laranja
		67 - 89 = bom/cinza
		90 =< = muito bom/verde1
		100 = excelente/verde2
		*/
	var valor = getRecentValueIndicadorColuna(atributo);
	if (valor == "NA" ) {
        return "indicador_cinza";
	}
	else if (parseFloat(valor) <= 0.545) {
        return "indicador_vermelho";
	}
	else if (parseFloat(valor) <= 0.665) {
		return "indicador_laranja";
	}
	else if (parseFloat(valor) <= 0.895) {
		return "indicador_branco";
	}
	else if (parseFloat(valor) <= 0.9999) {
        return "indicador_verde";
	}
	else if (parseFloat(valor) == 1.0) {
        return "indicador_verde2";
	}
	else {
        return "indicador_branco";
	}
}
//Fim - henriquerzo@gmail.com 20/08/2013

//recebe o id do indicador e retorna o nome
function nomeIndicador(idIndicador) {
	for (var linha = 0; linha < dicionario.length; linha++) {
		if(dicionario[linha].id == idIndicador) {
			return dicionario[linha].name;
		}
	}
}

function in_array(array, value) {
    if(array.indexOf(value) == -1) {
    	return false;
    }
    return true;
}

//Filtra dados das cidades similares a cidade principal
function filtraSimilares(ano, dataSimilares, indicador) {
	var vizinhos = dataSimilares.filter(function(d){return d.Cidade == cidade;});
	
	var values = Object.keys(vizinhos[0]).map(function (key) {
	    return vizinhos[0][key];
	});
	
	values = values.splice(1,values.length);
	
	var indicadores = dataset.filter(function(d) {return (d.ANO == ano & d[indicador] != "NA");});
	indicadores = indicadores.filter(function(d){return in_array(values,d.NOME_MUNICIPIO);});
	
	return indicadores;	
}

//Plota grafico
function plotIndicadores(indicador) {
	var svg;
	var h1 = 60;
	var	h2 = h1 + 60;
	var h3 = h2 + 60;
	var h4 = h3 + 60;
	if(rawdata.length != 0){
		var maxYear = d3.max(rawdata.filter(function(d){return d[indicador] != "NA";}).map(function(d){return parseInt(d.ANO);}));
		var currentYearData = rawdata.filter(function(d){return d.ANO == maxYear;})[0];
		
		//Create SVG element
		svg = d3.select("#div_indicador").select("svg");
		var estado = dataset.filter(function(d){return d[indicador] != "NA" & d.ANO == currentYearData.ANO;});
		var meso = dataset.filter(function(d){return d[indicador] != "NA" & d.NOME_MESO == currentYearData.NOME_MESO & d.ANO == currentYearData.ANO;});
		var micro = dataset.filter(function(d){return d[indicador] != "NA" & d.NOME_MICRO == currentYearData.NOME_MICRO & d.ANO == currentYearData.ANO;});
		
		var line_estado = [{'x' : d3.min(estado,function(d){return parseFloat(d[indicador]);}) , 'y' : h1},
						   {'x':(d3.max(estado,function(d){return parseFloat(d[indicador]);})), 'y' : h1}];
					
		var line_meso =[{'x' : d3.min(meso,function(d){return parseFloat(d[indicador]);}) , 'y' : h2}, 
						{'x': (d3.max(meso,function(d){return parseFloat(d[indicador]);})), 'y' : h2}];
		
		var line_micro = [{'x' :d3.min(micro,function(d){return parseFloat(d[indicador]);}) , 'y' : h3},
						  {'x': (d3.max(micro,function(d){return parseFloat(d[indicador]);})), 'y' : h3}];
		
		var vizinhos = filtraSimilares(currentYearData.ANO, similares, indicador);
		
		var lista_similares = (vizinhos.map(function(d){return (d.NOME_MUNICIPIO);}));
		
		if (svg[0][0] == null){
			
			svg = d3.select("#div_indicador").append("svg").attr("width", w).attr("height", 300);			
			
			//eixo das barras
			plot_ranges(svg, line_estado, h1);
			plot_ranges(svg, line_estado, h2);
			plot_ranges(svg, line_estado, h3);
			plot_ranges(svg, line_estado, h4);
			
			plot_similares(svg, vizinhos, indicador, (d3.min(estado,function(d){return parseFloat(d[indicador]);})),
					(d3.max(estado,function(d){return parseFloat(d[indicador]);})), h4, currentYearData.ANO);
			
			
			//barras cinzas equivalentes ao valor das regioes
			plot_bars(svg , line_estado, line_meso, h2,currentYearData[indicador]);
			plot_bars(svg , line_estado, line_micro, h3,currentYearData[indicador]);
			
			//barra com as cores dos indicadores
			plot_desvios_barras(svg,estado, indicador,h1, parseFloat(currentYearData[indicador]));

			plotTitulosGraficos(indicador, currentYearData.ANO);			
		
			svg.append("text")
				.attr("y", h1)
				.attr("x", 60)
				.attr("text-anchor", "right")
				.attr("font-weight", "bold")
				.text("Paraíba");
			
			svg.append("text")
				.style("text-align", "right")
				.attr("y", h2 + 2)
				.text(currentYearData.NOME_MESO);
			
			svg.append("text")
				.style("text-align", "center")
				.attr("y", h2 + 14)
				.attr("x", 25)
				.attr("font-weight", "bold")	
				.text("(Mesorregião)");
			
			svg.append("text")
				.attr("y", h3 + 2)
				.text(currentYearData.NOME_MICRO);
			
			svg.append("text")
				.style("text-align", "center")
				.attr("y", h3 + 14)
				.attr("x", 25)
				.attr("font-weight", "bold")
				.text("(Microrregião)");
			
			svg.append("text")
			.attr("y", h4 + 4)
			.attr("x", 30)
			.attr("text-anchor", "right")
			.text("Similares");
			
			if(currentYearData.ANO == 2011) {
				svg.append("a")
				.attr("xlink:href","#")
				.attr("class","big-link")
				.attr("data-reveal-id","container3")
				.attr("data-animation","fade")
				.append("text")
				.attr("y", h4 + 16)
				.attr("x", 20)
				.attr("text-anchor", "right")
				.attr("font-weight", "bold")
				.text("(Mais Detalhes)")
				.on("click", parallel_graph(cidade,indicador,lista_similares,currentYearData.ANO,"#container3", nomeIndicador(indicador)));
			}
			
				
	
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
			plot_ranges(svg, line_estado, h1);
			plot_ranges(svg, line_estado, h2);
			plot_ranges(svg, line_estado, h3);
			plot_ranges(svg, line_estado, h4);
			
			
			//barras cinzas equivalentes ao valor das regioes
			//plot_bars(svg, line_estado, line_estado, 100,currentYearData[indicador]);
			plot_bars(svg , line_estado, line_meso, h2,currentYearData[indicador]);
			plot_bars(svg , line_estado, line_micro, h3,currentYearData[indicador]);

			//barra com as cores dos indicadores
			plot_desvios_barras(svg,estado, indicador,h1,parseFloat(currentYearData[indicador]));			
			
			plot_similares(svg, vizinhos, indicador, (d3.min(estado,function(d){return parseFloat(d[indicador]);})),
					(d3.max(estado,function(d){return parseFloat(d[indicador]);})), h4, currentYearData.ANO);
			
			
			plotTitulosGraficos(indicador, currentYearData.ANO);			
			
			svg.append("text")
				.attr("y", h1)
				.attr("x", 60)
				.attr("font-weight", "bold")
				.text("Paraíba");
			
			svg.append("text")
				.attr("y", h2 + 2)
				.text(currentYearData.NOME_MESO);
			
			svg.append("text")
				.attr("y", h3 + 2)
				.text(currentYearData.NOME_MICRO);
				
			svg.append("text")
				.style("text-align", "center")
				.attr("y", h3 + 14)
								.attr("x", 25)
				.attr("font-weight", "bold")
				.text("(Microrregião)");
			
			svg.append("text")
				.style("text-align", "center")
				.attr("y", h2 + 14)
								.attr("x", 25)
				.attr("font-weight", "bold")
				.text("(Mesorregião)");
			
			svg.append("text")
			.attr("y", h4 + 4)
			.attr("x", 30)
			.attr("text-anchor", "right")
			.text("Similares");
			
			
			
			if(currentYearData.ANO == 2011) {
				svg.append("a")
				.attr("xlink:href","#")
				.attr("class","big-link")
				.attr("data-reveal-id","container3")
				.attr("data-animation","fade")
				.append("text")
				.attr("y", h4 + 16)
				.attr("x", 20)
				.attr("text-anchor", "right")
				.attr("font-weight", "bold")
				.text("(Mais Detalhes)")
				.on("click", parallel_graph(cidade,indicador,lista_similares,currentYearData.ANO,"#container3", nomeIndicador(indicador)));
			}
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
		  
	desvios(svg,desvio,media,y0,min,max,dado_indicador[0].referencial_maior,dados_estado,indicador);
	
	//Plota cidades na quarta barra
	
	
	//plotando valor atual
	svg.append("line")
		  .transition().duration(duration).delay(1000)
		  .attr("x1", x1(valor_cidade))
		  .attr("x2", x1(valor_cidade) + 1)
		  .attr("y1" , (y0 - 12))
		  .style("stroke-dasharray", ("5, 3"))
		  .attr("y2", 256)//200
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

function desvios(svg,desvio,media, y0,min, max, referencial,estado,indicador){
	
	var x1 = d3.scale.linear()
          .domain([min,max])
          .range([120, 750]);
	addLine(svg, x1(min), x1(max), y0,y0,"#E0E0E0");
	//Inicio - henriquerzo@gmail.com - 19/08/2013
	if(indicador == "INDICADOR_201") {
		/*
		Escala de Eficiência
		0 - 54 = fraco/vermelho
		55 - 66 = razoável/laranja
		67 - 89 = bom/cinza
		90 =< = muito bom/verde1
		100 = excelente/verde2
		*/
		//Vermelho
		addLine(svg,x1(min),x1(0.549),y0,y0,"#DE2D26");
		plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (min) & d[indicador] <= (0.549));}), indicador,"#A50F15",min,max,y0);
		//Laranja
		addLine(svg,x1(0.55),x1(0.669),y0,y0,"#FF6600");
		plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (0.55) & d[indicador] <= (0.669));}), indicador,"#FF6600",min,max,y0);
		//Cinza
		//addLine(svg,x1(0.67),x1(0.8999999),y0,y0,"#C0C0C0");
		plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (0.67) & d[indicador] <= (0.899));}), indicador,"#C0C0C0",min,max,y0);
		
		if(max == 1){
			//Verde1
			addLine(svg,x1(0.90),x1(0.9999),y0,y0,"#32CD32");
			plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (0.90) & d[indicador] <= (0.9999));}), indicador,"#32CD32",min,max,y0);
			//Verde2
			addLine(svg,x1(0.9999),x1(1),y0,y0,"#006400");
			plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (0.99) & d[indicador] <= (1));}), indicador,"#006400",min,max,y0);
		}
		else {
			//Verde1
			addLine(svg,x1(0.90),x1(max),y0,y0,"#32CD32");
			plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (0.90) & d[indicador] <= (max));}), indicador,"#32CD32",min,max,y0);
		}
		
	}
	else{
		//Fim - henriquerzo@gmail.com - 19/08/2013
		if(referencial == "melhor" | referencial == "neutro"){		
		//amarelo
		if((media - (desvio) < max) & (media - (2*desvio) > min)){
			addLine(svg,x1(media - (2*desvio)),x1(media - (desvio)),y0,y0,"#FFCC00");
			plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (media - (2*desvio)) & d[indicador] <= (media - (desvio)));}), indicador,"#FFCC00",min,max,y0);
		}else if((media - (desvio) > max) & (media - (2*desvio) > min)){
			addLine(svg,x1(max),x1(media - (2*desvio)),y0,y0,"#FFCC00");
			plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (media - (2*desvio)) & d[indicador] <= max);}), indicador,"#FFCC00",min,max,y0);
		}else if((media - (desvio) < max) & (media - (2*desvio) < min)){
			addLine(svg,x1(media - (desvio)),x1(min),y0,y0,"#FFCC00");
			plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= min & d[indicador] <= media - (desvio));}), indicador,"#FFCC00",min,max,y0);
		}
		//laranja
		if((media - (2*desvio) < max) & (media - (3*desvio) > min)){
			addLine(svg,x1(media - (2*desvio)),x1(media - (3*desvio)),y0,y0,"#FF6600");
			plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (media - (3*desvio)) & d[indicador] <= (media - (2*desvio)));}), indicador,"#FF6600",min,max,y0);
		}else if((media - (2*desvio) > max) & (media - (3*desvio) > min)){
			addLine(svg,x1(max),x1(media - (3*desvio)),y0,y0,"#FF6600");
			plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (media - (2*desvio)) & d[indicador] <= max);}), indicador,"#FF6600",min,max,y0);
		}else if((media - (3*desvio) < min) & (media - (2*desvio) > min)){
			addLine(svg,x1(media - (2*desvio)),x1(min),y0,y0,"#FF6600");
			plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (min) & d[indicador] <= (media - (2*desvio)));}), indicador,"#FF6600",min,max,y0);
		 }
		//vermelho
		if((media - (3*desvio) > min) & (media - (2*desvio) > min) & (media - desvio > min)){
			addLine(svg,x1(media - (3*desvio)),x1(min),y0,y0,"#DE2D26");
			plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (min) & d[indicador] <= (media - (3*desvio)));}), indicador,"#A50F15",min,max,y0);
		}
		//verde
		if(media + (2*desvio) < max){
			addLine(svg,x1(max),x1(media + (2*desvio)),y0,y0,"green");
			plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (media + (2*desvio)) & d[indicador] <= (max));}), indicador,"green",min,max,y0);
		}
		//cinza
		if((media - desvio > min) & (media +(2*desvio) < max)){
			plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (media - desvio ) & d[indicador] <= (media +(2*desvio)));}), indicador,"#C0C0C0",min,max,y0);
		}else if((media - desvio > min) & (media +(2*desvio) > max)){
			plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (media - desvio ) & d[indicador] <= (max));}), indicador,"#C0C0C0",min,max,y0);
		}
		
	}else{
		 //vermelho
		if(media + (3*desvio) < max){
			addLine(svg,x1(media + (3*desvio)),x1(max),y0,y0,"#DE2D26");
			plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (media + (3*desvio)) & d[indicador] <= (max));}), indicador,"#A50F15",min,max,y0);
		}
		//laranja
		if((media + (3*desvio) < max) & (media + (2*desvio) > min)){
			addLine(svg,x1(media + (3*desvio)),x1(media + (2*desvio)),y0,y0,"#FF6600");
			plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (media + (2*desvio)) & d[indicador] <= (media + (3*desvio)));}), indicador,"#FF6600",min,max,y0);
		}else if((media + (3*desvio) > max) & (media +(2*desvio) > min)){
			addLine(svg,x1(media + (2*desvio)),x1(max),y0,y0,"#FF6600");
			plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (media + (2*desvio)) & d[indicador] <= (max));}), indicador,"#FF6600",min,max,y0);
		}else if((media +(3*desvio) < max) & (media + (2*desvio) < min)){
			addLine(svg,x1(min),x1(media + (3*desvio)),y0,y0,"#FF6600");
			plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (min) & d[indicador] <= (media + (3*desvio)));}), indicador,"#FF6600",min,max,y0);
		}
		//amarelo
		if((media + (2*desvio) < max) & (media + (desvio) > min)){
			addLine(svg,x1(media + (desvio)),x1(media + (2*desvio)),y0,y0,"#FFCC00");
			plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (media + (desvio)) & d[indicador] <= (media + (2*desvio)));}), indicador,"#FFCC00",min,max,y0);
		}else if((media + (2*desvio) > max) & (media +(desvio) > min)){
			addLine(svg,x1(media + (2*desvio)),x1(max),y0,y0,"#FFCC00");
			plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (media + (2*desvio)) & d[indicador] <= (max));}), indicador,"#FFCC00",min,max,y0);
		}else if((media +(2*desvio) < max) & (media+(desvio) < min)){
			addLine(svg,x1(min),x1(media + (2*desvio)),y0,y0,"#FFCC00");
			plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (min) & d[indicador] <= (media + (2*desvio)));}), indicador,"#FFCC00",min,max,y0);
		}
		//verde
		if((media - (2*desvio) > min)){
			addLine(svg,x1(media - (2*desvio)),x1(min),y0,y0,"green");
			plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (min) & d[indicador] <= (media - (2*desvio)));}), indicador,"green",min,max,y0);
		}
		//cinza
		if((media - (2*desvio) > min) & (media + (desvio) < max)){
			plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (media - (2*desvio)) & d[indicador] <= (media + (desvio)));}), indicador,"#C0C0C0",min,max,y0);
		}else if((media - (2*desvio) < min) & (media +(desvio) < max)){
			plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (min) & d[indicador] <= (media +(desvio)));}), indicador,"#C0C0C0",min,max,y0);
		}
	}}
	
	
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
		  .attr("height", 30)
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
	
	var valor1 = String(dados[0].x).replace(/\,/g,'');
	var valor2 = String(dados[1].x).replace(/\,/g,'');
	
	var x1 = d3.scale.linear()
          .domain([parseFloat(valor1), parseFloat(valor2)])
          .range([120, 750]);	
	
	var xAxis = d3.svg.axis()
			.scale(x1)
			.orient("bottom")
			.tickFormat(d3.format(".2f"))
			.tickValues([parseFloat(valor1),parseFloat(valor2)])
			.ticks(6);
	
	if(y0 == 60){
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

function addLine(svg,x1,x2,y1,y2,cor){
	
	if(y1 > 100){
		svg.append("line")
			  .attr("x1", x1)
			  .attr("x2", x2)
			  .attr("y1",y1)
			  .attr("y2",y2)
			  //Inicio - Henrique - 07/08/2013
			  .attr("id","barra_indicador_altura_" + y1)
			  //fim - Henrique - 07/08/2013
			  .transition().duration(duration)
			  .style("stroke",cor)
			  //.attr("opacity",0.2)
			  .attr("stroke-width",25);
	}else{
		svg.append("line")
			  .attr("x1", x1)
			  .attr("x2", x2)
			  .attr("y1",y1)
			  .attr("y2",y2)
			  //Inicio - Henrique - 07/08/2013
			  .attr("id","barra_indicador_altura_" + y1)
			  //Fim - Henrique - 07/08/2013
			  .transition().duration(duration)
			  .style("stroke",cor)
			  .attr("opacity",0.6)
			  .attr("stroke-width",25);
	}
}

/*Inicio - Funcao para gerar Mapa (valor_indicador, lista_municipios) - Iury - 19/08/2013*/
function geraMapa(tabela,indicador){
	mapa = {}
	for(var i=0;i<tabela.length;i++){
		var obj = tabela[i];
		var id = d3.format(".2f")(obj[indicador]) + "";
		if(typeof mapa[id] == "undefined"){
			mapa[id] = new Array(0);
			mapa[id].push(obj["NOME_MUNICIPIO"]);
		}else{
			mapa[id].push(obj["NOME_MUNICIPIO"]);
		}
	}
	return mapa
}
/*Fim - Funcao para gerar Mapa (valor_indicador, lista_municipios) - Iury - 19/08/2013*/



function plot_cidades(svg, dados, indicador,cor, min, max, y0){
	
	var x1 = d3.scale.linear()
          .domain([min,max])
          .range([120, 750]);
	
	var g = svg.append("g");
	
	g.selectAll("line").data(dados)
					.enter()
					.append("line")
					.attr("x1", function(d){return x1(d[indicador]);})
					.attr("x2", function(d){return x1(d[indicador]) + 2;})
					.attr("y1",y0)
					.attr("y2",y0)
					.attr("class","linha_cidade")
					.attr("text",function(d){return d.NOME_MUNICIPIO;})
					.transition().duration(duration)
					.style("stroke",cor)
					.attr("stroke-width",24);
	
	/*Inicio - Variavel do Mapa - Iury - 19/08/2013*/
	var mapa_municipios = geraMapa(dados,indicador);
	/*Fim - Variavel do Mapa - Iury - 19/08/2013*/		
	
	
	g.selectAll("line").on("mouseover", function(d) {
				
						
						/*Inicio - Alterar tooltip 1º barra  - Iury - 19/08/2013*/
						var key_valorIndicador = d3.format(".2f")(d[indicador]);
						var nomesMunicipios = d.NOME_MUNICIPIO;
						if(typeof mapa_municipios[key_valorIndicador] == "object"){
							nomesMunicipios = mapa_municipios[key_valorIndicador].join(", ");
						}			
						var valorIndicador = nomesMunicipios + ": " + key_valorIndicador;
						/*Fim - Alterar tooltip 1º barra  - Iury - 19/08/2013*/
				
				
						//Get the values for tooltip position
						var xPosition = parseFloat(d3.select(this).attr("x1")) + 200;
						var yPosition = parseFloat(d3.select(this).attr("y1")) + 50;
				
						//Update the tooltip position and value
						d3.select("#tooltip").style("left", xPosition + "px")
						.style("top", yPosition + "px")
						.select("#value").text(valorIndicador);//cidade + " : " +valorIndicador.toFixed(2));
				
						//Show the tooltip
						d3.select("#tooltip").classed("hidden", false);
					})
				
					.on("mouseout", function() {//Hide the tooltip
						d3.select("#tooltip").classed("hidden", true);
					});
}

function plot_similares(svg, similares, indicador, min, max, y0, ano){
	//Inicio - henriquerzo@gmail.com - 07/08/2013
	if(ano == 2011) {
	//Fim - henriquerzo@gmail.com - 07/08/2013
		var x1 = d3.scale.linear()
		.domain([min,max])
		.range([120, 750]);

		var g = svg.append("g"); 

		g.selectAll("line").data(similares)
		.enter()
		.append("line")
		.attr("x1", function(d){return x1(d[indicador]);})
		.attr("x2", function(d){return x1(d[indicador]) + 2;})
		.attr("y1",y0)
		.attr("y2",y0)
		.attr("class","linha_cidade")
		.attr("text",function(d){return d.NOME_MUNICIPIO;})
		.transition().duration(duration)
		.style("stroke","#C0C0C0")
		.attr("stroke-width",24);
		
		/*Inicio - Variavel do Mapa - Iury - 19/08/2013*/
		var mapa_similares = geraMapa(similares,indicador);
		/*Fim - Variavel do Mapa - Iury - 19/08/2013*/		
	
		
		g.selectAll("line").on("mouseover", function(d) {

			/*Inicio- Alterar tooltip 4º barra  - Iury - 19/08/2013*/
			var key_valorIndicador = d3.format(".2f")(d[indicador]);
			var nomesMunicipios = d.NOME_MUNICIPIO;
			if(typeof mapa_similares[key_valorIndicador] == "object"){
				nomesMunicipios = mapa_similares[key_valorIndicador].join(", ");
			}			
			var valorIndicador = nomesMunicipios + ": " + key_valorIndicador;
			/*Fim - Alterar tooltip 4º barra  - Iury - 19/08/2013*/
			
			//Get the values for tooltip position
			var xPosition = parseFloat(d3.select(this).attr("x1")) + 200;
			var yPosition = parseFloat(d3.select(this).attr("y1")) + 50;

			//Update the tooltip position and value
			d3.select("#tooltip").style("left", xPosition + "px")
			.style("top", yPosition + "px")
			.select("#value").text(valorIndicador);//cidade + " : " +valorIndicador.toFixed(2));
			
			//Show the tooltip
			d3.select("#tooltip").classed("hidden", false);
		})
		.on("mouseout", function() {//Hide the tooltip
			d3.select("#tooltip").classed("hidden", true);
		});

		
		/*svg.append("text")
		.attr("y", h1 + 10)
		.attr("x", 60 + 50)
		.attr("font-weight", "bold")
		.text("Cidades similares")
		.on("click", function(d) { windowObjectReference = window.open ('cidades_parecidas.html','_blank', 'menubar=1 ,resizable=1 ,width=900 ,height=700')});*/
		
	}
	//Inicio - henriquerzo@gmail.com - 07/08/2013
	
	else {
		svg.selectAll("#barra_indicador_altura_240").on("mouseover", function(d) {

			//Get the values for tooltip position
			var xPosition = parseFloat(d3.select(this).attr("x1")) + 450;
			var yPosition = parseFloat(d3.select(this).attr("y1")) + 150;

			//var xPosition = window.event.clientX
			//var yPosition = window.event.clientY


			//Update the tooltip position and value
			d3.select("#tooltip").style("left", xPosition + "px")
			.style("top", yPosition + "px")
			.select("#value").text("O sistema não possui dados para encontrar as cidades mais similares a esta.");

			//Show the tooltip
			d3.select("#tooltip").classed("hidden", false);
		})
		.on("mouseout", function() {//Hide the tooltip
			d3.select("#tooltip").classed("hidden", true);
		});
	}
	//Fim - henriquerzo@gmail.com - 07/08/2013
}

