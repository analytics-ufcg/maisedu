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
