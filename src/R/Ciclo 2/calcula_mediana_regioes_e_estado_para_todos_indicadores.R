#Recebe a pasta raiz com os indicadores e retorna um data frame com os valores da mediana para a Paraíba, para a mesorregião e a para a microrregião
#para cada ano
require("gdata")
require("plyr")

#ajusta dados faltantes do data frame dos indicadores
adjustIndictorData <- function(df){
  df$COD_UF = 25
  df$NOME_UF =  "Paraíba"
  return(df)
}


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
processSelectedIndicatorsData <- function(indicadorFiles, perl.path, arquivo.principal){
  #tabela principal que contem a maior quantidade de linhas
  data.principal = read.xls(xls=indicadorFiles[arquivo.principal],perl=perl.path)
  #preenche dados faltantes
  data.principal = adjustIndictorData(data.principal)
  data.principal = agregaMedianas(data.principal)
  
  for(indicadorFile in 1:length(indicadorFiles)) {
    print(indicadorFile)
    if(indicadorFile != arquivo.principal) {
      data = read.xls(xls=indicadorFiles[indicadorFile], perl=perl.path)
      data = adjustIndictorData(data)
      data = agregaMedianas(data)
      data.principal = merge(data.principal,data,all.x=T)
    }
  }
  return(data.principal)
}

########################################################################################################################################################################

#lista de arquivos com os indicadores
indicadorFiles = list.files(path=".",full.names=T,recursive=T,pattern=".xls")

#caminho do interpretedor perl
perl.path = "C:/ProgramFiles/strawberry/perl/bin/perl"

#numero do arquivo que apresenta mais linhas(arquivo principal)
arquivo.principal = 4

#data.frame com todos os valores de indicadores e desvios(outliers)
dffinal <- processSelectedIndicatorsData(indicadorFiles, perl.path, arquivo.principal)

#salva data frame
con<-file("medianas_para_todos_os_indicadores_agrupados_por_ano_e_regiao.csv",encoding="utf8")

write.csv(dffinal, con, row.names=F)
