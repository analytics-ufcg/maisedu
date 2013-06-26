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


function plotParallelLines(){
	var margin = {top: 30, right: 120, bottom: 40, left: 60},
		width = 800 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom;
	
	var svg = d3.select("#div_parallel_lines").select("svg");
	
	svg = d3.select("#div_parallel_lines").append("svg")
	.attr("width", width + margin.left + margin.right + 150)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + (margin.left + 50) + "," + margin.top + ")");
	
	var x = d3.scale.ordinal().rangePoints([0, w], 1),
    	y = {};

	var line = d3.svg.line(),
	axis = d3.svg.axis().orient("left"),
	background,
	foreground;

	var svg = d3.select("body").append("svg:svg")
	.attr("width", w + m[1] + m[3])
	.attr("height", h + m[0] + m[2])
	.append("svg:g")
	.attr("transform", "translate(" + m[3] + "," + m[0] + ")");
	
		
}

