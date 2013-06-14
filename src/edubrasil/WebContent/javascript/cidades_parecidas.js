var dataset = [];
var rawdata = [];
var dicionario = [];
var similares = [];


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

	d3.csv("data/cidades_semelhantes_nomes.csv", function (data){
		similares = data;});
};


function plotHistograms(){ //TODO fazer metodo depois que se escolher o grafico para representar
	var dataset = [ 25, 7, 5, 26, 11, 8, 25, 14, 23, 19,
	                14, 11, 22, 29, 11, 13, 12, 17, 18, 10,
	                24, 18, 25, 9, 3 ];
	
	d3.select("plot_imagens").selectAll("div")
    .data(dataset)
    .enter()
    .append("div")
    .attr("class", "bar")
    .style("height", function(d) {
        var barHeight = d * 5;
        return barHeight + "px";
    });
}

