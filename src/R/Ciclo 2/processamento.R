###############
# bibliotecas #
###############
require(gdata)
require(plyr)
require(Hmisc)

#---------------------------------------------------------------------------------------------------------------------------------#
#-----------------------------------------------------------FUNCOES---------------------------------------------------------------#
#---------------------------------------------------------------------------------------------------------------------------------#


#Calcula a mediana para as regiões agrupados pelos anos recebendo como entrada a regiao que vai ser calculada(micro, meso e estado)
adjustIndictorData <- function(df){
  df$COD_UF = 25
  df$NOME_UF =  "Para�ba"
  return(df)
}

calcMedian = function(data, nome.regiao) {
  nome.coluna = colnames(data)[ncol(data)]
  #altera o nome da coluna para o ddply
  colnames(data)[ncol(data)] = "INDICADOR"
  print("calculando mediana")
  print(nome.regiao)
  print(colnames(data))
  tabela = with(data,aggregate(INDICADOR, list(data[,nome.regiao],data$ANO), FUN= median, na.rm=T))
  print("tabela calculada")
  colnames(tabela) = c("REGIAO", "ANO", nome.coluna)
  return(tabela)
}


#Calcula a mediana para a micro a meso e a paraiba e retorna em um data.frame agrupadas por ano
agregaMedianas = function(data2) {
  print("entrou em agrega medianas")
  tabela2 = rbind(calcMedian(data2,"NOME_MICRO"), calcMedian(data2,"NOME_MESO"), calcMedian(data2,"NOME_UF"))
  return(tabela2)
}


#processa cada indicador com as funcoes anteriores e agrega todos em um unico data frame
processaIndicadorNovoAno <- function(df.indicador, arquivo.principal, perl){
  anos_existentes = unique(arquivo.principal$ANO) 
  data.nova <- subset(df.indicador, df.indicador$ANO %nin% anos_existentes)
  print(unique(data.nova$ANO))
  datadf = agregaMedianas(data.nova)
  df2 = arquivo.principal[0,]
  df2[]
  #data.principal = merge(arquivo.principal,data,all.x=T)
  return(datadf)
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
data.nova = read.xls(xls=indicador,perl=perl.path) 
d = adjustIndictorData(data.nova)
#p <- subset(d, d$ANO == 2018)
dffinal <- processaIndicadorNovoAno(d,mediana_default,perl.path)

#salva data frame
con<-file("medianas_para_todos_os_indicadores_agrupados_por_ano_e_regiao22.csv",encoding="utf8")
write.csv(dffinal, con, row.names=F)