var dataset = [];
var dataset_medianas = [];
var rawdata = [];
var dicionario = [];
var similares = [];
var tendencia = [];
var cidade = "Visão Geral";
var cidades_tendencia = [];
var duration = 1000;
var w = 800;
var h = 350;
var mensagemBotaoCinza = "Dados Indisponíveis";
var valorR;
var vizinhos;

var porcentagem = ["INDICADOR_62","INDICADOR_329","INDICADOR_333","INDICADOR_181","INDICADOR_182","INDICADOR_188","INDICADOR_189","INDICADOR_289","INDICADOR_290","INDICADOR_202"]
var reais = ["INDICADOR_7"]

var  ind_percentual = ["Índice eficiência educação básica","Índice precariedade infraestrutura", "Percentual de docentes temporários",
"Percentual docentes formação superior","Taxa abandono total - fundamental","Taxa aprovação total - fundamental","Taxa de abandono total - ensino médio",
"Taxa de analfabetismo","Taxa de aprovação total - ensino médio","Taxa de atendimento escolar"]


function getAlarme(valor){
	if(valor.indexOf("1") > -1){
		return "atenção";
	}else{
		if(valor.indexOf("2") > -1){
			return "alerta";
		}else{
			if(valor.indexOf("3") > -1){
				return "crítico";
			}else{
				return "";
			}
		}
	}
}

//Recebe uma cidade e pinta os botoes
function getMenuOption(selection) {
	//limpa containers
	cleanContainers();
	
    cidade = selection.options[selection.selectedIndex].value;


	//Inicio - henriquerzo@gmail.com 06/09/2013
	if(cidade == "Visão Geral") {
		$("#map_area").show();
		resetMap(dataset);
		dicionario.sort(function (a, b) {
				return a.name.localeCompare(b.name);
		});
		$("#div_legend_button").hide();
		
	}
	else {
		$("#map_area").hide();
		$("#image_minus").hide();
		$("#image_plus").hide();
		$("#div_legend_button").show();
		
	}
	//Fim - henriquerzo@gmail.com 06/09/2013

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
	.attr("value", function (d){return d.name.replace("(%)","").replace("(em Reais)","");}) /*removendo unidades 27/09/2013*/
	.attr("id", function (d, i){return d.id;});


	cidades_tendencia = getCol(tendencia);
	
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
	
	var array_setas = Array(15);
	var cont = 0;
	d3.selectAll(".arrows")
	.data(dicionario)
	.attr("src", function (d){
					
					if (cidade=="Visão Geral") {
						array_setas[cont] = "0";
						cont = cont + 1;
						return "images/arrow0.png";
					}
					else
						array_setas[cont] = tendencia[cidades_tendencia.indexOf(cidade)][d.id]+"";
						cont = cont + 1;
						return "images/arrow"+tendencia[cidades_tendencia.indexOf(cidade)][d.id]+".png";
				})
	.attr("id", function(d,i){ return "arrow_indicador_" + i;});

	//var xPosition_ = parseFloat(d3.select(this).attr("x1")) + 50;
	//var yPosition_ =  ;
	/*Inicio - tooltips setas - iury - 01/10*/
	 $('#arrow_indicador_0')
	 .on("mouseover", function(d) {
			$('.tooltips').tooltipster('disable');
			 d3.select("#tooltip").style("left", 1  + "px")
								 .style("top", 10+ "px")
								 .select("#value").text("A análise da série temporal índica um alarme de nível " + getAlarme(array_setas[0]));
			 if(array_setas[0].indexOf("0") == -1){
				d3.select("#tooltip").classed("hidden", false);
			 }else{
				 d3.select("#tooltip").classed("hidden", true);	
			 }			
	 })
	 .on("mouseout",function(d){
	 		$('.tooltips').tooltipster('enable');
			 d3.select("#tooltip").classed("hidden", true);	
	});
	
	 $('#arrow_indicador_1')
	 .on("mouseover", function(d) {
	 	$('.tooltips').tooltipster('disable');
			 console.log(array_setas[1].indexOf("0") == -1);
			 d3.select("#tooltip").style("left", 1+ "px")
								  .style("top", 10 + "px")
								  .select("#value").text("A análise da série temporal índica um alarme de nível "+getAlarme(array_setas[1]));
			 if(array_setas[1].indexOf("0") == -1){
				 d3.select("#tooltip").classed("hidden", false);
			 }else{

				 d3.select("#tooltip").classed("hidden", true);	
			 }
	 })
	 .on("mouseout",function(d){
	 		$('.tooltips').tooltipster('enable');
			 d3.select("#tooltip").classed("hidden", true);	
	});

	 $('#arrow_indicador_2')
	 .on("mouseover", function(d) {
	 		$('.tooltips').tooltipster('disable');
			 d3.select("#tooltip").style("left", 10+ "px")
								  .style("top", 10 + "px")
								  .select("#value").text("A análise da série temporal índica um alarme de nível "+getAlarme(array_setas[2]));
			 if(array_setas[2].indexOf("0") == -1){
				 d3.select("#tooltip").classed("hidden", false);
			 }else{
				 d3.select("#tooltip").classed("hidden", true);	
			 }
	 })
	 .on("mouseout",function(d){
	 		$('.tooltips').tooltipster('enable');
			 d3.select("#tooltip").classed("hidden", true);	
	});		

	 $('#arrow_indicador_3')
	 .on("mouseover", function(d) {
	 		$('.tooltips').tooltipster('disable');
			 d3.select("#tooltip").style("left", 10+ "px")
								  .style("top", 10 + "px")
								  .select("#value").text("A análise da série temporal índica um alarme de nível "+getAlarme(array_setas[3]));
			 if(array_setas[3].indexOf("0") == -1){
				 d3.select("#tooltip").classed("hidden", false);
			 }else{
				 d3.select("#tooltip").classed("hidden", true);	
			 }
	 })
	 .on("mouseout",function(d){
	 		$('.tooltips').tooltipster('enable');
			 d3.select("#tooltip").classed("hidden", true);	
	});

	 $('#arrow_indicador_4')
	 .on("mouseover", function(d) {
	 	$('.tooltips').tooltipster('disable');
 		d3.select("#tooltip").style("left", 10+ "px")
							 .style("top", 10 + "px")
							 .select("#value").text("A análise da série temporal índica um alarme de nível "+getAlarme(array_setas[4]));
			 if(array_setas[4].indexOf("0") == -1){
				 d3.select("#tooltip").classed("hidden", false);
			 }else{

				 d3.select("#tooltip").classed("hidden", true);	
			 }
	 })
	 .on("mouseout",function(d){
	 		$('.tooltips').tooltipster('enable');
			 d3.select("#tooltip").classed("hidden", true);	
	});

	 $('#arrow_indicador_5')
	 .on("mouseover", function(d) {
	 	$('.tooltips').tooltipster('disable');
			 d3.select("#tooltip").style("left", 10+ "px")
								  .style("top", 10 + "px")
								  .select("#value").text("A análise da série temporal índica um alarme de nível"+getAlarme(array_setas[5]));
			 if(array_setas[5].indexOf("0") == -1){
				 d3.select("#tooltip").classed("hidden", false);
			 }else{
				 d3.select("#tooltip").classed("hidden", true);	
			 }
	 })
	 .on("mouseout",function(d){
	 		$('.tooltips').tooltipster('enable');
			 d3.select("#tooltip").classed("hidden", true);	
	});		

	 $('#arrow_indicador_6')
	 .on("mouseover", function(d) {
	 	$('.tooltips').tooltipster('disable');
			 d3.select("#tooltip").style("left", 10+ "px")
								  .style("top", 10 + "px")
								  .select("#value").text("A análise da série temporal índica um alarme de nível"+getAlarme(array_setas[6]));
			 if(array_setas[6].indexOf("0") == -1){
				 d3.select("#tooltip").classed("hidden", false);
			 }else{

				 d3.select("#tooltip").classed("hidden", true);	
			 }
	 })
	 .on("mouseout",function(d){
	 		$('.tooltips').tooltipster('enable');
			 d3.select("#tooltip").classed("hidden", true);	
	});

	 $('#arrow_indicador_7')
	 .on("mouseover", function(d) {
	 	$('.tooltips').tooltipster('disable');
				 d3.select("#tooltip").style("left", 10+ "px")
								  .style("top", 10 + "px")
								  .select("#value").text("A análise da série temporal índica um alarme de nível"+getAlarme(array_setas[7]));
			 if(array_setas[7].indexOf("0") == -1){
				 d3.select("#tooltip").classed("hidden", false);
			 }else{

				 d3.select("#tooltip").classed("hidden", true);	
			 }
	 })
	 .on("mouseout",function(d){
	 		$('.tooltips').tooltipster('enable');
			 d3.select("#tooltip").classed("hidden", true);	
	});

	 $('#arrow_indicador_8')
	 .on("mouseover", function(d) {
	 	$('.tooltips').tooltipster('disable');
				 d3.select("#tooltip").style("left", 10+ "px")
								  .style("top", 10 + "px")
								  .select("#value").text("A análise da série temporal índica um alarme de nível"+getAlarme(array_setas[8]));
			 if(array_setas[8].indexOf("0") == -1){
				 d3.select("#tooltip").classed("hidden", false);
			 }else{

				 d3.select("#tooltip").classed("hidden", true);	
			 }
	 })
	 .on("mouseout",function(d){
	 		$('.tooltips').tooltipster('enable');
			 d3.select("#tooltip").classed("hidden", true);	
	});		

	 $('#arrow_indicador_9')
	 .on("mouseover", function(d) {
	 	$('.tooltips').tooltipster('disable');
					 d3.select("#tooltip").style("left", 10+ "px")
								  .style("top", 10 + "px")
								  .select("#value").text("A análise da série temporal índica um alarme de nível"+getAlarme(array_setas[9]));
			 if(array_setas[9].indexOf("0") == -1){
				 d3.select("#tooltip").classed("hidden", false);
			 }else{

					 d3.select("#tooltip").classed("hidden", true);	
			 }
	 })
	 .on("mouseout",function(d){
	 		$('.tooltips').tooltipster('enable');
			 d3.select("#tooltip").classed("hidden", true);	
	});

	 $('#arrow_indicador_10')
	 .on("mouseover", function(d) {
	 	$('.tooltips').tooltipster('disable');
				 d3.select("#tooltip").style("left", 10+ "px")
							  .style("top", 10 + "px")
							  .select("#value").text("A análise da série temporal índica um alarme de nível"+getAlarme(array_setas[10]));
			 if(array_setas[10].indexOf("0") == -1){
				 d3.select("#tooltip").classed("hidden", false);
			 }else{
					 d3.select("#tooltip").classed("hidden", true);	
			 }
	 })
	 .on("mouseout",function(d){
	 		$('.tooltips').tooltipster('enable');
			 d3.select("#tooltip").classed("hidden", true);	
	});

	 $('#arrow_indicador_11')
	 .on("mouseover", function(d) {
	 	$('.tooltips').tooltipster('disable');
				 d3.select("#tooltip").style("left", 10+ "px")
								  .style("top", 10 + "px")
								  .select("#value").text("A análise da série temporal índica um alarme de nível"+getAlarme(array_setas[11]));
			 if(array_setas[11].indexOf("0") == -1){
				 d3.select("#tooltip").classed("hidden", false);
			 }else{
				 d3.select("#tooltip").classed("hidden", true);	
			 }
	 })
	 .on("mouseout",function(d){
	 		$('.tooltips').tooltipster('enable');
			 d3.select("#tooltip").classed("hidden", true);	
	});		

	 $('#arrow_indicador_12')
	 .on("mouseover", function(d) {
	 	$('.tooltips').tooltipster('disable');
				 d3.select("#tooltip").style("left", 10+ "px")
							  .style("top", 10 + "px")
							  .select("#value").text("A análise da série temporal índica um alarme de nível"+getAlarme(array_setas[12]));
			 if(array_setas[12].indexOf("0") == -1){
				 d3.select("#tooltip").classed("hidden", false);
			 }else{

				 d3.select("#tooltip").classed("hidden", true);	
			 }
	 })
	 .on("mouseout",function(d){
	 		$('.tooltips').tooltipster('enable');
			 d3.select("#tooltip").classed("hidden", true);	
	});		

	 $('#arrow_indicador_13')
	 .on("mouseover", function(d) {
	 	$('.tooltips').tooltipster('disable');
				 d3.select("#tooltip").style("left", 10+ "px")
								  .style("top", 10 + "px")
								  .select("#value").text("A análise da série temporal índica um alarme de nível"+getAlarme(array_setas[13]));
			 if(array_setas[13].indexOf("0") == -1){
				 d3.select("#tooltip").classed("hidden", false);
			 }else{

				 d3.select("#tooltip").classed("hidden", true);	
			 }
	 })
	 .on("mouseout",function(d){
	 		$('.tooltips').tooltipster('enable');
			 d3.select("#tooltip").classed("hidden", true);	
	});		

	 $('#arrow_indicador_14')
	 .on("mouseover", function(d) {
	 	$('.tooltips').tooltipster('disable');
				 d3.select("#tooltip").style("left", 10+ "px")
								  .style("top", 10 + "px")
								  .select("#value").text("A análise da série temporal índica um alarme de nível"+getAlarme(array_setas[14]));
			 if(array_setas[14].indexOf("0") == -1){
				 d3.select("#tooltip").classed("hidden", false);
			 }else{

				 d3.select("#tooltip").classed("hidden", true);	
			 }
	 })
	 .on("mouseout",function(d){
	 		$('.tooltips').tooltipster('enable');
			 d3.select("#tooltip").classed("hidden", true);	
	});		
	/*Fim - tooltips setas - iury - 01/10*/

};

function getCol(matrix){
       var column = [];
       for(var i=0; i<matrix.length; i++){
          column.push(matrix[i]["NOME_MUNICIPIO"]);
          
       }
       return column;
}

function cleanContainers(){
	//Inicio - henriquerzo@gmail.com 06/09/2013
	d3.select("#div_indicador").select("svg")
    .remove();
	d3.select("#div_series").select("svg")
    .remove();
    //Fim - henriquerzo@gmail.com 06/09/2013

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
			if(parseFloat(valor) <= 0.545) {
				return -4;
			}
			else if(parseFloat(valor) <= 0.665) {
				return -3;
			}
			else if(parseFloat(valor) <= 0.895) {
				return 0;
			}
			else if(parseFloat(valor) <= 0.995) {
				return 3;
			}
			else if(parseFloat(valor) >= 0.996) {
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
	//Inicio - henriquerzo@gmail.com 12/09/2013
	else if(colunaDesvio == "DESVIOS_MELHOR_INDICADOR_62" || colunaDesvio == "DESVIOS_NEUTRO_INDICADOR_7") {
		var valor = getRecentValueIndicadorColuna(colunaDesvio);
		if (valor == "NA" ) {
			return 10;
		}
		else if(parseFloat(valor) > 0) {
			return -1 * parseFloat(valor);
		}
		else {
			return parseFloat(valor);
		}
	}
	//Fim - henriquerzo@gmail.com 12/09/2013
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
		cities.unshift("Visão Geral");
		
		var myList = d3.selectAll("#myList");
		
		myList.selectAll("option").data(cities).enter().append("option")
		.attr("value",function(d){return d;})
		.attr("label",function(d){return d;})
		.text(function(d){return d;});
		//Inicio - henriquerzo@gmail.com 06/09/2013
		resetMap(dataset);
		//Fim - henriquerzo@gmail.com 06/09/2013
	
	});
	
	d3.csv("data/tabela_cidades_semelhantes.csv", function (data){
			similares = data;});

	//Nailson 07/09/2013		

	d3.csv("data/serie_temporal.csv" , function (data){
		tendencia = data;
	});

	//Inicio - henriquerzo@gmail.com - 18/09/2013
	d3.csv("data/medianas_para_todos_os_indicadores_agrupados_por_ano_e_regiao.csv", function (data){
			dataset_medianas = data;
	});
	//Fim - henriquerzo@gmail.com - 18/09/2013
	
	// END
	
	
	loadUpButtons();

	create_legend();

};

//Cria svg com legendas das cores dentro da div_legend_button utilizando d3.js
function create_legend() {
	var legends_aux = [ "Não há dados", "Crítico", "Alerta", "Atenção", "Normal", "Satisfatório", "Ótimo"];
	var legends_color = ["#6C7C7C", "#FF0000", "#FF7F00", "#FFFF00", "#F0F0F0", "#92B879", "#006400"];

	var container = d3.select("#div_legend_button");

	container.append("h3")
		.attr("text","Legenda")
		.text("Legenda");

	svg = container.append("svg:svg")
	    .attr("width", 130)
	    .attr("height", 100)
	    .attr("id","plotSimilares")
	    .append("svg:g")	
	    .attr("transform", "translate(10,15)")
	    .attr("font-size", "12px");

	svg.selectAll("text")
        .data(legends_aux)
        .call(function(d) { d.enter().append("text")})
        .call(function(d) { d.exit().remove()})
        .attr("y",function(d,i) { return i+"em"})
        .attr("x","1em")
        .text(function(d) { ;return d})

    svg.selectAll("circle")
        .data(legends_aux)
        .call(function(d) { d.enter().append("circle")})
        .call(function(d) { d.exit().remove()})
        .attr("cy",function(d,i) { return i-0.25+"em"})
        .attr("cx",0)
        .attr("r","0.4em")
        .style("fill",function(d,i) { return legends_color[i]})
        .style("stroke-width", "1")
        .style("stroke", "#000000");
  

}


//Carrega os botoes da parte de cima
function loadUpButtons() {
	d3.csv("data/dicionario.csv" , function (data){


		dicionario = data;
		
		dicionario.sort(function (a, b) {
				return a.name.localeCompare(b.name);
		});

		var div_buttons = d3.select("#div_indicador_options");

		div_buttons.selectAll("input")
		.data(data)
		.enter()
		.insert("span")
		.attr("class", "tooltips")
		.attr("title", function (d){return d.big_description+".<a href='dicionario de dados.html?"+d.number+"' target='_blank'><img src='images/plus.png' onmouseover='this.src=&#39;images/plus2.png&#39;' onmouseout='this.src=&#39;images/plus.png&#39;' width='16' height='16'></a>";})
		.attr("id", function (d, i){return "span"+d.id;})

		.each(function(d) {
			d3.select(this).append("input")
			.attr("type","button")
			.attr("value", function (d){return d.name.replace("(%)","").replace("(em Reais)","");}) /*27/09/2013 - removeendo unidades*/
			.attr("id", function (d, i){return d.id;})
	        .attr("class", "indicador indicador_map")
			.on("click", function(d) {

				//Inicio - henriquerzo@gmail.com 06/09/2013
				if(cidade == "Visão Geral"){
					$("#map_title")
					.text(d.name.replace("(%)","").replace("(em Reais)",""));
					plotColorMap(d.id, d.desvio, dataset, dataset_medianas);
					$("#div_legend_button").show();

				}

				//limpa tela caso o botao clicado seja cinza(inativo)
				else if(getButtonColor(d.desvio) == "indicador_cinza"){
					cleanContainers();
					
					d3.select("#div_indicador_titulo")
					.append("h1")
					.attr("class", "titulo_grafico")
					.text(mensagemBotaoCinza);

				//Fim - henriquerzo@gmail.com 06/09/2013


				}else{
					plotIndicadores(d.id);
					//Inicio - henriquerzo@gmail.com - 18/09/2013
					plotSeries(cidade, d.id, dataset, dataset_medianas);
					//Fim - henriquerzo@gmail.com - 18/09/2013
					
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
			

			d3.select(this).insert("img","input")
					.attr("class","arrows")
					.attr("width", 20)
					.attr("height", 20)
					.attr("src", function (d){return "images/arrow0.png";});
			
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
	.text(nomeIndicador(indicador).replace("(%)","").replace("(em Reais)","")); /* removendo unidades 27/09/2013*/
	
	d3.select("#div_series_titulo")
	.append("h1")
	.attr("class", "titulo_grafico")
	.text(nomeIndicador(indicador).replace("(%)","").replace("(em Reais)","") + " nos últimos anos");
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
	if (valor == "NA" && cidade == "Visão Geral") {
        return "indicador_map";
	}

	if (valor == "NA") {
        return "indicador_cinza";
	}

	valor = parseFloat(valor);

	if(colunaDesvio == "DESVIOS_MELHOR_INDICADOR_62" || colunaDesvio == "DESVIOS_NEUTRO_INDICADOR_7") {
		if(valor > 0){
			valor = -1 * valor;
		}
	}
	
	if (valor == -2) {
        return "indicador_amarelo";
	}
	else if (valor == -3) {
		return "indicador_laranja";
	}
	else if (valor <= -4) {
		return "indicador_vermelho";
	}
	else if (valor < 4 && valor >= 3) {
        return "indicador_verde";
	}
	else if (valor >= 4) {
        return "indicador_verde2";
	}
	else {
        return "indicador_branco";
	}
}


//Inicio - henriquerzo@gmail.com 20/08/2013
//Retorna a cor do Botao para o indicador "Indice de eficiencia da educacao basica/INDICADOR_201"
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
	if (valor == "NA" && cidade == "Visão Geral") {
        return "indicador_map";
	}
	
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
	else if (parseFloat(valor) <= 0.995) {
        return "indicador_verde";
	}
	else if (parseFloat(valor) >= 0.996) {
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


//Inicio - henriquerzo@gmail.com - 16/09/2013
//Retorna o nome das cidades mais similares a cidade principal
function getNomesSimilares(cidade) {
	var vizinhos = similares.filter(function(d){return d.Cidade == cidade;});
	
	var values = Object.keys(vizinhos[0]).map(function (key) {
		if(vizinhos[0][key] != "NA" && vizinhos[0][key] != cidade) {
			return vizinhos[0][key];
		}
		else {
			return null;
		}
	});

	values = $.grep(values, function(d, i){
		return d != null;
	})
	return values;
}
//Fim - henriquerzo@gmail.com - 16/09/2013

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
		
		vizinhos = filtraSimilares(currentYearData.ANO, similares, indicador);
		
		var lista_similares = (vizinhos.map(function(d){return (d.NOME_MUNICIPIO);}));
		
		if (svg[0][0] == null){
			
			svg = d3.select("#div_indicador").append("svg").attr("width", w).attr("height", 300);			
			
			//eixo das barras
			plot_ranges(svg, line_estado, h1,indicador);
			plot_ranges(svg, line_estado, h2,indicador);
			plot_ranges(svg, line_estado, h3,indicador);
			plot_ranges(svg, line_estado, h4,indicador);
			
			plot_similares(svg, vizinhos, indicador, (d3.min(estado,function(d){return parseFloat(d[indicador]);})),
					(d3.max(estado,function(d){return parseFloat(d[indicador]);})), h4, currentYearData.ANO);
			
			
			//barras cinzas equivalentes ao valor das regioes
			
			plot_bars(svg , line_estado, line_meso, h2,currentYearData[indicador],indicador);
			plot_bars(svg , line_estado, line_micro, h3,currentYearData[indicador],indicador);
			
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

			/*Inicio - Marcadores - iurygregory@gmail.com - 21/08/2013*/
			var meso = estado.filter(function(d){return d.NOME_MESO == currentYearData.NOME_MESO;});
			var micro = estado.filter(function(d){return d.NOME_MICRO == currentYearData.NOME_MICRO;});
			var min_estado = (d3.min(estado,function(d){return parseFloat(d[indicador]);}));
			var max_estado = (d3.max(estado,function(d){return parseFloat(d[indicador]);}));
			plot_cidades(svg,meso, indicador,"#A5A5A5",min_estado,max_estado,h2); 
			plot_cidades(svg,micro, indicador,"#A5A5A5",min_estado,max_estado,h3);
			/*Fim- Marcadores - iurygregory@gmail.com - 21/08/2013*/

			//Inicio - henriquerzo@gmail.com - 16/09/2013
			if(currentYearData.ANO == 2011 && getNomesSimilares(cidade).length != 0 && vizinhos.length != 0) {
			//Fim - henriquerzo@gmail.com - 16/09/2013
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
				.on("click", parallel_graph(cidade,indicador,lista_similares,currentYearData.ANO,"#container3", nomeIndicador(indicador), getNomesSimilares(cidade).length));
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
			plot_ranges(svg, line_estado, h1,indicador);
			plot_ranges(svg, line_estado, h2,indicador);
			plot_ranges(svg, line_estado, h3,indicador);
			plot_ranges(svg, line_estado, h4,indicador);
			
			
			//barras cinzas equivalentes ao valor das regioes
			//plot_bars(svg, line_estado, line_estado, 100,currentYearData[indicador]);
			plot_bars(svg , line_estado, line_meso, h2,currentYearData[indicador],indicador);
			plot_bars(svg , line_estado, line_micro, h3,currentYearData[indicador],indicador);

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
			
			/*Inicio - Marcadores - iurygregory@gmail.com - 21/08/2013*/
			var meso = estado.filter(function(d){return d.NOME_MESO == currentYearData.NOME_MESO;});
			var micro = estado.filter(function(d){return d.NOME_MICRO == currentYearData.NOME_MICRO;});
			var min_estado = (d3.min(estado,function(d){return parseFloat(d[indicador]);}));
			var max_estado = (d3.max(estado,function(d){return parseFloat(d[indicador]);}));
			plot_cidades(svg,meso, indicador,"#A5A5A5",min_estado,max_estado,h2); 
			plot_cidades(svg,micro, indicador,"#A5A5A5",min_estado,max_estado,h3);
			/*Fim- Marcadores - iurygregory@gmail.com - 21/08/2013*/

			//Inicio - henriquerzo@gmail.com - 16/09/2013
			if(currentYearData.ANO == 2011 && getNomesSimilares(cidade).length != 0 && vizinhos.length != 0) {
			//Fim - henriquerzo@gmail.com - 16/09/2013
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
				.on("click", parallel_graph(cidade,indicador,lista_similares,currentYearData.ANO,"#container3", nomeIndicador(indicador),getNomesSimilares(cidade).length));
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
	/*Inicio - unidade para cidadade em negrito - iury - 29/09*/
	/*       - formatacao do valor para cidade em negrito - 30/09*/
	if(porcentagem.contains(indicador)){
	svg.append("text")
		.attr("x", x1(valor_cidade))
		.attr("y",(y0 - 20))
		.attr("text-anchor", "middle")
		.attr("font-weight", "bold")
		.transition().duration(duration).delay(1000)
		.text(cidade + ": " + formatNum(parseFloat(valor_cidade).toFixed(2))+"%");//mudar aki
	}else{
		if(reais.contains(indicador)){
		svg.append("text")
			.attr("x", x1(valor_cidade))
			.attr("y",(y0 - 20))
			.attr("text-anchor", "middle")
			.attr("font-weight", "bold")
			.transition().duration(duration).delay(1000)
			.text(cidade + ": " + (formatNum(parseFloat(valor_cidade).toFixed(2)))+ " Reais");
		}else{
		svg.append("text")
			.attr("x", x1(valor_cidade))
			.attr("y",(y0 - 20))
			.attr("text-anchor", "middle")
			.attr("font-weight", "bold")
			.transition().duration(duration).delay(1000)
			.text(cidade + ": " + formatNum((parseFloat(valor_cidade).toFixed(2))) );
		}
	}
	/*Fim - unidade para cidadade em negrito - iury - 29/09*/
	/*       - formatacao do valor para cidade em negrito - 30/09*/


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
		addLine(svg,x1(min),x1(0.545),y0,y0,"#DE2D26");
		plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (min) & d[indicador] <= (0.545));}), indicador,"#A50F15",min,max,y0);
		//Laranja
		addLine(svg,x1(0.546),x1(0.665),y0,y0,"#FF6600");
		plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (0.546) & d[indicador] <= (0.665));}), indicador,"#FF6600",min,max,y0);
		//Cinza
		//addLine(svg,x1(0.67),x1(0.8999999),y0,y0,"#C0C0C0");
		plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (0.666) & d[indicador] <= (0.895));}), indicador,"#C0C0C0",min,max,y0);
		
		if(max == 1){
			//Verde1
			addLine(svg,x1(0.896),x1(0.995),y0,y0,"green");
			plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (0.896) & d[indicador] <= (0.995));}), indicador,"green",min,max,y0);
			//Verde2
			addLine(svg,x1(0.995),x1(1),y0,y0,"#006400");
			plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (0.996) & d[indicador] <= (1));}), indicador,"#006400",min,max,y0);
		}
		else {
			//Verde1
			addLine(svg,x1(0.896),x1(max),y0,y0,"green");
			plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (0.896) & d[indicador] <= (max));}), indicador,"green",min,max,y0);
		}
		
	}
	else{
		//Fim - henriquerzo@gmail.com - 19/08/2013
		//Inicio - henriquerzo@gmail.com 12/09/2013
		if(referencial == "melhor"){
		//Fim - henriquerzo@gmail.com 12/09/2013
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
		// Nailson Boaz Costa Leite - nailsonboaz@gmail.com - 21/08/2013
		//verde2
		if(media + (3*desvio) < max){
			addLine(svg,x1(max),x1(media + (3*desvio)),y0,y0,"#006400");
			plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (media + (3*desvio)) & d[indicador] <= (max));}), indicador,"#006400",min,max,y0);
		}
		// Fim Nailson Boaz Costa Leite - nailsonboaz@gmail.com - 21/08/2013
		//cinza
		if((media - desvio > min) & (media +(2*desvio) < max)){
			plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (media - desvio ) & d[indicador] <= (media +(2*desvio)));}), indicador,"#C0C0C0",min,max,y0);
		}else if((media - desvio > min) & (media +(2*desvio) > max)){
			plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (media - desvio ) & d[indicador] <= (max));}), indicador,"#C0C0C0",min,max,y0);
		}
		
	}
	//Inicio - henriquerzo@gmail.com 12/09/2013
	else if(referencial == "neutro"){
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
		//cinza
		if((media - desvio > min) & (media + desvio < max)){
			plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (media - desvio ) & d[indicador] <= (media + desvio));}), indicador,"#C0C0C0",min,max,y0);
		}else if((media - desvio > min) & (media + desvio > max)) {
			plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (media - desvio ) & d[indicador] <= (max));}), indicador,"#C0C0C0",min,max,y0);
		}

	}
	//Fim - henriquerzo@gmail.com 12/09/2013

	else{
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
		// Nailson Boaz Costa Leite - nailsonboaz@gmail.com - 21/08/2013
		//verde2
		if((media - (3*desvio) > min)){
			addLine(svg,x1(media - (3*desvio)),x1(min),y0,y0,"#006400");
			plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (min) & d[indicador] <= (media - (3*desvio)));}), indicador,"#006400",min,max,y0);
		}
		// Fim Nailson Boaz Costa Leite - nailsonboaz@gmail.com - 21/08/2013
		//cinza
		if((media - (2*desvio) > min) & (media + (desvio) < max)){
			plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (media - (2*desvio)) & d[indicador] <= (media + (desvio)));}), indicador,"#C0C0C0",min,max,y0);
		}else if((media - (2*desvio) < min) & (media +(desvio) < max)){
			plot_cidades(svg, estado.filter(function(d){return( d[indicador] >= (min) & d[indicador] <= (media +(desvio)));}), indicador,"#C0C0C0",min,max,y0);
		}
	}}
	
	
}

function plot_bars(svg,dados_estado,dados_regiao, y0, indicador_value,indicador){

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

	/*Inicio - unidade minino barras 2 e 3 - iury - 29/09*/
	/* - formatacao de valores minimo barras 2 e 3 - 30/09*/
	if(porcentagem.contains(indicador)){
		svg.append("text")
		.attr("text-anchor","middle")
		.attr("x", x1(dados_regiao[0].x) - 2)
		.attr("y",(y0 + 30))
		.text(formatNum((dados_regiao[0].x).toFixed(2))+"%");
	}else{
		if(reais.contains(indicador)){
		svg.append("text")
		.attr("text-anchor","middle")
		.attr("x", x1(dados_regiao[0].x) - 2)
		.attr("y",(y0 + 30))
		.text(formatNum((dados_regiao[0].x).toFixed(2))+ " Reais");
		}else{
		svg.append("text")
		.attr("text-anchor","middle")
		.attr("x", x1(dados_regiao[0].x) - 2)
		.attr("y",(y0 + 30))
		.text(formatNum((dados_regiao[0].x).toFixed(2)));
		}
	}
	/*Fim - unidade minino barras 2 e 3 - iury - 29/09*/
	/* - formatacao de valores minimo barras 2 e 3 - 30/09*/

	/*Inicio - unidade maximo barras 2 e 3 - iury - 29/09*/
	/* - formatacao de valores maximos barras 2 e 3 - 30/09*/
	if(porcentagem.contains(indicador)){
		svg.append("text")
		.attr("text-anchor","left")
		.attr("x", x1(dados_regiao[1].x) - 15)
		.attr("y",(y0 + 30))
		.text(formatNum((dados_regiao[1].x).toFixed(2))+"%");
	}else{
		if(reais.contains(indicador)){
		svg.append("text")
		.attr("text-anchor","left")
		.attr("x", x1(dados_regiao[1].x) - 15)
		.attr("y",(y0 + 30))
		.text(formatNum((dados_regiao[1].x).toFixed(2))+ " Reais");
		}else{
		svg.append("text")
		.attr("text-anchor","left")
		.attr("x", x1(dados_regiao[1].x) - 15)
		.attr("y",(y0 + 30))
		.text(formatNum((dados_regiao[1].x).toFixed(2)));}
	}
	/*Fim - unidade maximo barras 2 e 3 - iury - 29/09*/
	/* - formatacao de valores maximobarras 2 e 3 - 30/09*/
}

function plot_ranges(svg, dados, y0,indicador){
	
	var valor1 = String(dados[0].x).replace(/\,/g,'');
	var valor2 = String(dados[1].x).replace(/\,/g,'');
	
	var x1 = d3.scale.linear()
          .domain([parseFloat(valor1), parseFloat(valor2)])
          .range([120, 750]);	
	/*Inicio formatacao de valores - min e max - iury 30/09*/
	var xAxis = d3.svg.axis()
			.scale(x1)
			.orient("bottom")
			.tickValues([parseFloat(valor1),parseFloat(valor2)])
			.ticks(6)
			.tickFormat(function(d){return formatNum(  (d3.format(".2f")(d)) );});
	/* formatacao de valores - min e max - iury 30/09*/
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
		
		if(porcentagem.contains(indicador)){
			svg.append("text")
				.attr("x",x1(dados[0].x) +15)
				.attr("y",(y0+30))
				.text("%");
			svg.append("text")
				.attr("x",x1(dados[1].x) +17)
				.attr("y",(y0+30))
				.text("%");
		}else{
			if(reais.contains(indicador)){
				svg.append("text")
					.attr("x",x1(dados[0].x) +25)
					.attr("y",(y0+30))
					.text(" Reais");
				svg.append("text")
					.attr("x",x1(dados[1].x) + 25)
					.attr("y",(y0+30))
					.text(" Reais");
			}else{
				// nao apresenta unidades
			}
		}


	}


	
	addLine(svg,x1(dados[0].x),x1(dados[1].x),y0,y0,"#F0F0F0",25);
	
	
}

/*Inicio - funcao para formatar os números - iury - 30/09*/
function formatNum(numero) {
    var n= numero.toString().split(".");
    n[0] = n[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return n.join(",");
}
/*Fim - funcao para formatar os números - iury - 30/09*/


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
						/*inicio - tooltip 1º barra unidade - iury - 29/09*/
						/*       - tooltip 1º barra formatacao valores - 30/09 */
						if(porcentagem.contains(indicador)){
						d3.select("#tooltip").style("left", xPosition + "px")
						.style("top", yPosition + "px")
						.select("#value").text(formatNum(valorIndicador)+"%");
						}else{
							if(reais.contains(indicador)){
							d3.select("#tooltip").style("left", xPosition + "px")
							.style("top", yPosition + "px")
							.select("#value").text(formatNum(valorIndicador)+ " Reais");
							}else{
							d3.select("#tooltip").style("left", xPosition + "px")
							.style("top", yPosition + "px")
							.select("#value").text(formatNum(valorIndicador));
							}
						}
						/*Fim - tooltip 1º barra unidade - iury - 29/09*/
						/*    - tooltip 1º barra formatacao valores - 30/09 */
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
	
		//Inicio - henriquerzo@gmail.com - 16/09/2013
		if (getNomesSimilares(cidade).length == 0){
			svg.selectAll("#barra_indicador_altura_240").on("mouseover", function(d) {

			//Get the values for tooltip position
			var xPosition = parseFloat(d3.select(this).attr("x1")) + 450;
			var yPosition = parseFloat(d3.select(this).attr("y1")) + 150;

			//var xPosition = window.event.clientX
			//var yPosition = window.event.clientY


			//Update the tooltip position and value
			d3.select("#tooltip").style("left", xPosition + "px")
			.style("top", yPosition + "px")
			.select("#value").text("Esta cidade não possui cidades similares");

			//Show the tooltip
			d3.select("#tooltip").classed("hidden", false);
			})
			.on("mouseout", function() {//Hide the tooltip
				d3.select("#tooltip").classed("hidden", true);
			});
		}
		else if(similares.length == 0){
			svg.selectAll("#barra_indicador_altura_240").on("mouseover", function(d) {

			//Get the values for tooltip position
			var xPosition = parseFloat(d3.select(this).attr("x1")) + 450;
			var yPosition = parseFloat(d3.select(this).attr("y1")) + 150;

			//var xPosition = window.event.clientX
			//var yPosition = window.event.clientY


			//Update the tooltip position and value
			d3.select("#tooltip").style("left", xPosition + "px")
			.style("top", yPosition + "px")
			.select("#value").text("As cidades mais similares a esta não apresentam dados para este indicador neste ano");

			//Show the tooltip
			d3.select("#tooltip").classed("hidden", false);
			})
			.on("mouseout", function() {//Hide the tooltip
				d3.select("#tooltip").classed("hidden", true);
			});
		}
		else {
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


				/*inicio - tooltip  4º barra unidade - iury - 29/09*/
				/*       - tooltip 4º barra formatacao valores - 30/09 */
				if(porcentagem.contains(indicador)){
				d3.select("#tooltip").style("left", xPosition + "px")
				.style("top", yPosition + "px")
				.select("#value").text(formatNum(valorIndicador)+"%");
				}else{
					if(reais.contains(indicador)){
					d3.select("#tooltip").style("left", xPosition + "px")
					.style("top", yPosition + "px")
					.select("#value").text(formatNum(valorIndicador)+ " Reais");
					}else{
					d3.select("#tooltip").style("left", xPosition + "px")
					.style("top", yPosition + "px")
					.select("#value").text(formatNum(valorIndicador));
					}
				}
				/*Fim - tooltip 4º barra unidade - iury - 29/09*/
				/*    - tooltip 4º barra formatacao valores - 30/09 */


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
		//Fim - henriquerzo@gmail.com - 16/09/2013
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
			.select("#value").text("O sistema não possui dados neste ano para encontrar as cidades mais similares a esta.");

			//Show the tooltip
			d3.select("#tooltip").classed("hidden", false);
		})
		.on("mouseout", function() {//Hide the tooltip
			d3.select("#tooltip").classed("hidden", true);
		});
	}
	//Fim - henriquerzo@gmail.com - 07/08/2013
}

