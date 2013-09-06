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

function getClassColor(desvio) {
	if(desvio == "NA"){
		return "none";
	}
	else if(desvio == "-4"){
		return "valor_pessimo";
	}
	else if(desvio == "-3"){
		return "valor_muito_ruim";
	}
	else if(desvio == "-2"){
		return "valor_ruim";
	}
	else if(desvio == "3") {
		return "valor_bom";
	}
	else if(desvio == "4") {
		return "valor_muito_bom";
	}
	else{
		return "neutro";
	}
}

function plotColorMap(indicador_nome, colunaDesvio, dataset) {
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
		cidadeID.attr("class", "str2 " + getClassColor(indicador_desvio));

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

			if(indicador_valor == "NA") {
				d3.select("#tooltip").style("left", xPosition + "px")
				.style("top", yPosition + "px")
				.select("#value").text(cidade + " não possui dados para este indicador.");
			}
			else {
				d3.select("#tooltip").style("left", xPosition + "px")
				.style("top", yPosition + "px")
				.select("#value").text(cidade + ": " + d3.format(".2f")(indicador_valor));
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
			var indicador_desvio = indicador_result[1];

			cidadeID.attr("class", "str2 " + getClassColor(indicador_desvio));

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
					plotSeries(cidade,indicador_nome);
				},500);
			}

			
		});
	};
}

function resetMap(dataset) {
	$("#map_title").text("Mapa da Paraíba");
	var todas_cidades = dataset.map(function(d){return d.NOME_MUNICIPIO;}).unique().sort(sortComparer);
	var div_municipios = d3.select("#Municípios");


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