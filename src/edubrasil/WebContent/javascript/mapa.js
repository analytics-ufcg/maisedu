var porcentagem = ["INDICADOR_62","INDICADOR_329","INDICADOR_333","INDICADOR_181","INDICADOR_182","INDICADOR_188","INDICADOR_189","INDICADOR_289","INDICADOR_290","INDICADOR_202"]
var reais = ["INDICADOR_7"]

//compara unicode characters
function sortComparer(a,b){
 return a.localeCompare(b);
};

//Retorna o desvio padrão do ultimo ano disponível para um indicador e uma cidade
function getDesvioIndicador(indicador, colunaDesvio, cidade, dataset) {
	var rawdata = dataset.filter(function(i){return i.NOME_MUNICIPIO == cidade;});	
	var maxYear = rawdata.filter(function(d){return d[indicador] != "NA";}).map(function(d){return parseInt(d.ANO);});
	if (maxYear.length == 0) {
		return ["NA","NA"];
	}
	else {
		maxYear = d3.max(maxYear);
		var currentYearData = rawdata.filter(function(d){return d.ANO == maxYear;})[0];
		return [currentYearData[indicador], currentYearData[colunaDesvio]];
	}
}

function getClassColor(indicadorValor, desvioResult, indicadorNome) {
	if (desvioResult == "NA" ) {
			return "none";
	}

	if(indicadorNome == "INDICADOR_201") {
		if(parseFloat(indicadorValor) <= 0.545) {
			return "valor_pessimo";
		}
		else if(parseFloat(indicadorValor) <= 0.665) {
			return "valor_muito_ruim";
		}
		else if(parseFloat(indicadorValor) <= 0.895) {
			return "neutro";
		}
		else if(parseFloat(indicadorValor) <= 0.995) {
			return "valor_bom";
		}
		else if(parseFloat(indicadorValor) >= 0.996) {
			return "valor_muito_bom";
		}
		else {
			return "valor_muito_bom";
		}
	}

	if(indicadorNome == "INDICADOR_62" || indicadorNome == "INDICADOR_7") {
		if(parseFloat(desvioResult) > 0) {
			desvioResult = "-" + desvioResult;
		}
	}

	if(desvioResult == "-4"){
		return "valor_pessimo";
	}
	else if(desvioResult == "-3"){
		return "valor_muito_ruim";
	}
	else if(desvioResult == "-2"){
		return "valor_ruim";
	}
	else if(desvioResult == "3") {
		return "valor_bom";
	}
	else if(desvioResult == "4") {
		return "valor_muito_bom";
	}
	else{
		return "neutro";
	}
}

function plotColorMap(indicador_nome, colunaDesvio, dataset, dataset_medianas) {
	
	var todas_cidades = dataset.map(function(d){return d.NOME_MUNICIPIO;}).unique().sort(sortComparer);
	var div_municipios = d3.select("#Municípios");
	var indicador_result;
	var indicador_valor;
	var indicador_desvio;
	//laço que itera em todas as cidades do mapa
	for (var i = 0; i < todas_cidades.length; i++) {
		indicador_result = getDesvioIndicador(indicador_nome, colunaDesvio, todas_cidades[i], dataset);
		indicador_valor = indicador_result[0];
		var indicador_desvio = indicador_result[1];

		var cidade = todas_cidades[i].replace(/ /g, "_");
		if(cidade == "Mãe_d'Água" || cidade == "Olho_d'Água") {
			cidade = cidade.replace(/'/, "_");
		}

		var cidadeID = div_municipios.select("#" + cidade);
		cidadeID.attr("class", "str2 " + getClassColor(indicador_valor, indicador_desvio, indicador_nome));

		//mouse over
		cidadeID.on("mouseover", function(d) {
			var cidadeID = $(this);
			cidadeID.attr("class", "str2 " + "fil0");

			var xPosition = cidadeID.offset().left + 100;
			var yPosition = cidadeID.offset().top;

			var cidade = cidadeID.attr("id").replace(/_/g, " ");

			if(cidade == "Mãe d Água" || cidade == "Olho d Água") {
				cidade = cidade.replace(/d Água/, "d'Água");
			}

			var indicador_result = getDesvioIndicador(indicador_nome, colunaDesvio, cidade, dataset);
			var indicador_valor = indicador_result[0];
			var indicador_desvio = indicador_result[1];

			if(indicador_nome == "INDICADOR_62" || indicador_nome == "INDICADOR_7") {
				if(indicador_desvio < -1) {
					$("#image_minus").show();
					$("#image_plus").hide();
				}
				else if (indicador_desvio > 1){
					$("#image_plus").show();
					$("#image_minus").hide();
				}
				else{
					$("#image_minus").hide();
					$("#image_plus").hide();
				}
			}
			else {
				$("#image_minus").hide();
				$("#image_plus").hide();
			}

			if(indicador_valor == "NA") {
				d3.select("#tooltip").style("left", xPosition + "px")
				.style("top", yPosition + "px")
				.select("#value").text(cidade + " não possui dados para este indicador.");
			}
			else {
				/*Inicio - adicao de unidades ao tooltip do mapa - 29/09
				         - formatacao dos valores dos indicadores - 30/09
				         Iury
				*/
				if(porcentagem.contains(indicador_nome)){
					d3.select("#tooltip").style("left", xPosition + "px")
					.style("top", yPosition + "px")
					.select("#value").text(cidade + ": " + formatNum(d3.format(".2f")(indicador_valor))+" %");
				}else{
					if(reais.contains(indicador_nome)){
						d3.select("#tooltip").style("left", xPosition + "px")
						.style("top", yPosition + "px")
						.select("#value").text(cidade + ": R$ " + formatNum(d3.format(".2f")(indicador_valor)));
					}else{
						d3.select("#tooltip").style("left", xPosition + "px")
						.style("top", yPosition + "px")
						.select("#value").text(cidade + ": " + formatNum(d3.format(".2f")(indicador_valor)));						
					}
				}
				/*Fim - adicao de unidades ao tooltip do mapa - 29/09
				         - formatacao dos valores dos indicadores - 30/09
				         Iury
				*/

			}
			d3.select("#tooltip").classed("hidden", false);
		});
		
		//mouse out
		cidadeID.on("mouseout", function(d) {
			var cidadeID = $(this);

			var cidade = cidadeID.attr("id").replace(/_/g, " ");

			if(cidade == "Mãe d Água" || cidade == "Olho d Água") {
				cidade = cidade.replace(/d Água/, "d'Água");
			}

			var indicador_result = getDesvioIndicador(indicador_nome, colunaDesvio, cidade, dataset);
			var indicador_valor = indicador_result[0];
			var indicador_desvio = indicador_result[1];

			cidadeID.attr("class", "str2 " + getClassColor(indicador_valor, indicador_desvio, indicador_nome));

			d3.select("#tooltip").classed("hidden", true);
		});

		cidadeID.on("click", function(d){
			var cidadeID = $(this);

			var cidade = cidadeID.attr("id").replace(/_/g, " ");

			if(cidade == "Mãe d Água" || cidade == "Olho d Água") {
				cidade = cidade.replace(/d Água/, "d'Água");
			}

			var indicador_result = getDesvioIndicador(indicador_nome, colunaDesvio, cidade, dataset);

			var selection = $("#myList").val(cidade);

			selection.change();

			if(indicador_result[0] != "NA") {
				setTimeout(function(){
					plotIndicadores(indicador_nome);
					plotSeries(cidade,indicador_nome, dataset, dataset_medianas);
				},500);
			}

			
		});
	};
}

/*Inicio - funcao para formatar os números - iury - 30/09*/
function formatNum(numero) {
    var n= numero.toString().split(".");
    n[0] = n[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return n.join(",");
}
/*Fim - funcao para formatar os números - iury - 30/09*/

function resetMap(dataset) {
	$("#map_title").text("Escolha uma Cidade ou um Indicador para mais detalhes.");
	var todas_cidades = dataset.map(function(d){return d.NOME_MUNICIPIO;}).unique().sort(sortComparer);
	var div_municipios = d3.select("#Municípios");

	//Esconde os icones
	$("#image_minus").hide();
	$("#image_plus").hide();


	//laço que itera em todas as cidades do mapa
	for (var i = 0; i < todas_cidades.length; i++) {
		var cidade = todas_cidades[i].replace(/ /g, "_");
		if(cidade == "Mãe_d'Água" || cidade == "Olho_d'Água") {
			cidade = cidade.replace(/'/, "_");
		}

		var cidadeID = div_municipios.select("#" + cidade);
		cidadeID.attr("class", "fil5 str2");

		//mouse over
		cidadeID.on("mouseover", function(d) {
			var cidadeID = $(this);
			cidadeID.attr("class", "str2 " + "fil0");

			var xPosition = cidadeID.offset().left + 100;
			var yPosition = cidadeID.offset().top;

			var cidade = cidadeID.attr("id").replace(/_/g, " ");

			if(cidade == "Mãe d Água" || cidade == "Olho d Água") {
				cidade = cidade.replace(/d Água/, "d'Água");
			}
			d3.select("#tooltip").style("left", xPosition + "px")
			.style("top", yPosition + "px")
			.select("#value").text(cidade);

			d3.select("#tooltip").classed("hidden", false);
		});
		
		//mouse out
		cidadeID.on("mouseout", function(d) {
			var cidadeID = $(this);

			var cidade = cidadeID.attr("id").replace(/_/g, " ");

			if(cidade == "Mãe d Água" || cidade == "Olho d Água") {
				cidade = cidade.replace(/d Água/, "d'Água");
			}

			cidadeID.attr("class", "fil5 str2");

			d3.select("#tooltip").classed("hidden", true);
		});

		cidadeID.on("click", function(d){
			var cidadeID = $(this);

			var cidade = cidadeID.attr("id").replace(/_/g, " ");

			if(cidade == "Mãe d Água" || cidade == "Olho d Água") {
				cidade = cidade.replace(/d Água/, "d'Água");
			}

			var selection = $("#myList").val(cidade);

			selection.change();

		});
	};
}