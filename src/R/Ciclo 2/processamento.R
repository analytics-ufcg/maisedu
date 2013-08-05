###############
# bibliotecas #
###############
require(gdata)
require(plyr)
require(Hmisc)

#---------------------------------------------------------------------------------------------------------------------------------#
#-----------------------------------------------------------FUNCOES---------------------------------------------------------------#
#---------------------------------------------------------------------------------------------------------------------------------#


#Calcula a mediana para as regioes agrupados pelos anos recebendo como entrada a regiao que vai ser calculada(micro, meso e estado)
adjustIndictorData <- function(df){
  df$COD_UF = 25
  df$NOME_UF =  "Paraíba"
  return(df)
}

calcMedian = function(data, nome.regiao) {
  nome.coluna = colnames(data)[ncol(data)]
  colnames(data)[ncol(data)] = "INDICADOR"
  tabela = with(data,aggregate(INDICADOR, list(data[,nome.regiao],data$ANO), FUN= median,na.rm=T))
  colnames(tabela) = c("REGIAO", "ANO", nome.coluna)
  return(tabela)
}


#Calcula a mediana para a micro a meso e a paraiba e retorna em um data.frame agrupadas por ano
agregaMedianas = function(data2) {
  tabela2 = rbind(calcMedian(data2,"NOME_MICRO"), calcMedian(data2,"NOME_MESO"), calcMedian(data2,"NOME_UF"))
  return(tabela2)
}


#processa cada indicador com as funcoes anteriores e agrega todos em um unico data frame
#recebe tabela do novo indicador, tabela de mediana default, caminho perl
processaIndicador <- function(df.indicador, arquivo.principal, perl){
  anos.existentes = unique(arquivo.principal$ANO) 
  ano.indicador = unique(df.indicador$ANO)
  inter = intersect(anos.existentes,ano.indicador)
  presente = setdiff(ano.indicador,anos.existentes)
  if(length(presente) == 0){
	tabela.nova = arquivo.principal
	tabela.nova$ID = paste(tabela.nova[,1],tabela.nova[,2])
	medianas = agregaMedianas(df.indicador)
	nome <- colnames(medianas[3])
	medianas$ID <- paste(medianas[,1],medianas[,2])
	index.indicador <- match(tabela.nova$ID,medianas$ID)
	index <- which(!is.na(index.indicador))
	tabela.nova[,nome][index] <- medianas[,nome][index.indicador[!is.na(index.indicador)]] 
	tabela.nova = tabela.nova[,-ncol(tabela.nova)]
	return(tabela.nova) 
  }else{
	df.indicador <- subset(df.indicador, df.indicador$ANO %nin% anos.existentes)
  	df.medianas = agregaMedianas(df.indicador)
  	nome.id <- colnames(df.medianas[3])# pega o nome do Identificador
  	print(colnames(df.medianas)) #INDICADOR, ID
	matriz.indicadores <- data.frame(matrix(NA,ncol=15,nrow = nrow(df.medianas)))
  	tabela = cbind(df.medianas[,c(1,2)],matriz.indicadores)
  	colnames(tabela) = colnames(arquivo.principal)
  	df.medianas$ID <- paste(df.medianas[,1],df.medianas[,2])
	tabela$ID <-  paste(tabela[,1],tabela[,2])
	index.match <- match(tabela$ID,df.medianas$ID)
	index2 <- which(!is.na(index.match))
	tabela[,nome.id][index2] <- df.medianas[,nome.id][index.match[!is.na(index.match)]] 
	tabela = tabela[,-ncol(tabela)]
	data.principal = rbind(arquivo.principal,tabela)
  	return(data.principal)
  }
}

########################################################################################################################################################################


#linhacomando <- commandArgs(trailingOnly = TRUE) indicador (1), tabela de desvios(2), mediana(3), desvios novos(4), mediana nova(5), caminho perl(6)



mediana_default <- read.csv("medianas_para_todos_os_indicadores_agrupados_por_ano_e_regiao22.csv")  #mediana_default <- read.csv(args[3])
perl.path = "C:/strawberry/perl/bin/perl"   #pearl.path <- args[6]
#indicador = "INDICADOR_329 - Teste  -Taxa de analfabetismo.xls"
indicador2 = "INDICADOR_62 - Participação despesa pessoal e sociais na educação TESTE.xls"
arquivo.indicador = read.xls(xls=indicador2,perl=perl.path) #mudar xls=args[1]


#completar o df com NOME_UF e COD_UF
arquivo.indicador = adjustIndictorData(arquivo.indicador)

#realizar processamento
dffinal <- processaIndicador(arquivo.indicador,mediana_default,perl.path)

#salva data frame
con<-file("medianas_para_todos_os_indicadores_agrupados_por_ano_e_regiao23.csv",encoding="utf8")# args[5]
write.csv(dffinal, con, row.names=F)