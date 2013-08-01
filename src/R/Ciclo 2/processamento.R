###############
# bibliotecas #
###############
library(gdata)
library(plyr)
library(Hmisc)

#---------------------------------------------------------------------------------------------------------------------------------#
#-----------------------------------------------------------FUNCOES---------------------------------------------------------------#
#---------------------------------------------------------------------------------------------------------------------------------#


#Calcula a mediana para as regiões agrupados pelos anos recebendo como entrada a regiao que vai ser calculada(micro, meso e estado)
calcMedian = function(data, nome.regiao) {
  nome.coluna = colnames(data)[ncol(data)]
  #altera o nome da coluna para o ddply
  colnames(data)[ncol(data)] = "INDICADOR"
  tabela = ddply(data, c(nome.regiao,"ANO"), summarize, INDICADOR = median(INDICADOR,na.rm=T))
  colnames(tabela) = c("REGIAO", "ANO", nome.coluna)
  return(tabela)
}


#Calcula a mediana para a micro a meso e a paraiba e retorna em um data.frame agrupadas por ano
agregaMedianas = function(data) {
  tabela = rbind(calcMedian(data,"NOME_MICRO"), calcMedian(data,"NOME_MESO"), calcMedian(data,"NOME_UF"))
  return(tabela)
}


#processa cada indicador com as funcoes anteriores e agrega todos em um unico data frame
processaIndicadorNovoAno <- function(nome.indicador, arquivo.principal, perl){
  anos_existentes = unique(arquivo.principal$ANO) #2000 
  data = read.xls(xls=nome.indicador,perl=perl) #arquivo de indicador #2000 2001 2013
  data <- subset(data, data$ANO %nin% anos_existentes)
  print(unique(data$ANO))
  data = agregaMedianas(data)
  data.principal = merge(arquivo.principal,data,all.x=T)
  return(data)
}

########################################################################################################################################################################

#capturar os diretórios 
#linhacomando <- commandArgs(trailingOnly = TRUE)

#mediana_default <- read.csv(args[2])
mediana_default <- read.csv("medianas_para_todos_os_indicadores_agrupados_por_ano_e_regiao_teste.csv")
#pearl.path <- args[5]
perl.path = "C:/strawberry/perl/bin/perl"
#lista de arquivos com os indicadores
indicador = "INDICADOR_329 - Teste  -Taxa de analfabetismo.xls" #-- mudar apenas o arquivo
#data.frame com todos os valores de indicadores e desvios(outliers)
dffinal <- processaIndicadorNovoAno(indicador,mediana_default,perl.path)
#salva data frame
con<-file("medianas_para_todos_os_indicadores_agrupados_por_ano_e_regiao22.csv",encoding="utf8")
write.csv(dffinal, con, row.names=F)