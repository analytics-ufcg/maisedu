Sprint 1
========

* calcula_e_agrega_indicadores_e_outliers.R
  - script que gera os limites para outliers da forma: media mais ou menos tres vezes o desvio padr�o, classifica se a cidade esta dentro ou fora desse limite e gera um arquivo de saida contendo todos os indicadores e a classifica��o para todas as cidades.

* gera_graficos_para_outliers.R
  - script que gera gr�ficos de densidade, distribui��o, histograma, m�dia, desvio padr�o e mediana para os indicadores.

* media_micro_meso_indicadores.R
  - script que agrupa as cidades por meso e micro regi�o e gera um arquivo com esse agrupamento e as m�dias para cada regi�o


Sprint 2
========

 * calcula_e_agrega_indicadores_e_desvios(US-6).R
  - agrega todos os indicadores e adiciona uma coluna para cada indicador com um valor entre o intervalo(-4,4), onde 4 significa que o valor para aquele
indicador esta mais que 3 desvios padr�es da m�dia e 1 significa que o valor esta menos de 1 desvio padr�o da m�dia. Valores positivos nesse intervalo
indicam que o valor esta bom e negativos indicam que ele esta ruim, com base na classifica��o dos indicadores em maior melhor ou pior.

 * calcula_mediana_regioes_e_estado_para_todos_indicadores(US-6)
  - calcula a mediana para todos os indicadores agrupados por estado, micro e meso regi�o e por ano.