#Recebe a pasta raiz com os indicadores e retorna um data frame com os valores para cada indicador em uma coluna 
#e para cada indicador uma coluna correspondente a quantos desvios a mais ou a menos que a media o valor para indicador possui.
require("gdata")

#Recebe um valor do indicador, as tabelas de media e desvio padrao, e o ano do indicador. Retorna quantos desvios o valor esta da média
classifyOutLiers <- function(obValue, tabMean, tabSD, ano){
  if(!is.na(obValue)) {
    if(obValue >= (tabMean[tabMean$Group.1==ano,2] + 3*tabSD[tabSD$Group.1==ano,2])){
      return(4)
    }
    if(obValue >= (tabMean[tabMean$Group.1==ano,2] + 2*tabSD[tabSD$Group.1==ano,2])){
      return(3)
    }
    if(obValue >= (tabMean[tabMean$Group.1==ano,2] + tabSD[tabSD$Group.1==ano,2])){
      return(2)
    }
    if(obValue > (tabMean[tabMean$Group.1==ano,2])){
      return(1)
    }
    if(obValue == (tabMean[tabMean$Group.1==ano,2])){
      return(0)
    }
    if(obValue <= (tabMean[tabMean$Group.1==ano,2] - 3*tabSD[tabSD$Group.1==ano,2])){
      return(-4)
    }
    if(obValue <= (tabMean[tabMean$Group.1==ano,2] - 2*tabSD[tabSD$Group.1==ano,2])){
      return(-3)
    }
    if(obValue <= (tabMean[tabMean$Group.1==ano,2] - tabSD[tabSD$Group.1==ano,2])){
      return(-2)
    }
    if(obValue <= (tabMean[tabMean$Group.1==ano,2])){
     return(-1)
    }
  }
  else {
    return(NA)
  }
}


#recebe o data frame com um indicador e retorna um novo data frame com uma nova coluna informando se o indicador e outlier. Remove NAs dos indicadores.
generateOutlierColumn <- function(data.df, referencial.outlier){ 
  data.sem.nas = na.omit(data.df)
  meanAno = aggregate(data.sem.nas[,ncol(data.sem.nas)], list(data.sem.nas$ANO), mean)
  sdAno = aggregate(data.sem.nas[,ncol(data.sem.nas)], list(data.sem.nas$ANO), sd)
  class <- Vectorize(classifyOutLiers,c("obValue", "ano"))(data.df[,10], meanAno, sdAno, data.df$ANO)
  #inverte a ordem caso maior seja pior
  if(referencial.outlier == "PIOR") {
    class = -1 * class
  }
  data.df = cbind(data.df, class)
  colnames(data.df)[11] = paste("DESVIOS_", referencial.outlier, "_", colnames(data.df)[10], sep="")
  return(data.df)
}


#ajusta dados faltantes do data frame dos indicadores
adjustIndictorData <- function(df){
  df$COD_UF = 25
  df$NOME_UF =  "Paraíba"
  return(df)
}


#processa cada indicador e agrega todos em um unico data frame
processSelectedIndicatorsData <- function(indicadorFiles, perl.path, arquivo.principal, indicador.categoria){
  #tabela principal que contem a maior quantidade de linhas
  data.principal = read.xls(xls=indicadorFiles[arquivo.principal],perl=perl.path)
  #preenche dados faltantes
  data.principal = adjustIndictorData(data.principal)
  data.principal = generateOutlierColumn(data.principal, indicador.categoria[arquivo.principal])
  
  for(indicadorFile in 1:length(indicadorFiles)) {
    print(indicadorFile)
    if(indicadorFile != arquivo.principal) {
      data = read.xls(xls=indicadorFiles[indicadorFile], perl=perl.path)
      data = adjustIndictorData(data)
      data = generateOutlierColumn(data, indicador.categoria[indicadorFile])
      data.principal = merge(data.principal,data,all.x=T)
    }
  }
  return(data.principal)
}

########################################################################################################################################################################

#lista de arquivos com os indicadores
indicadorFiles = list.files(path=".",full.names=T,recursive=T,pattern=".xls")

#lista indicando se para um indicador quanto maior (MELHOR/PIOR), com base na ordem em que aparecem na lista "indicadorFiles"
indicador.categoria = c("MELHOR", "MELHOR", "MELHOR", "PIOR", "MELHOR", "PIOR", "PIOR", "MELHOR", "MELHOR", "MELHOR", "PIOR", "PIOR", "PIOR", "NEUTRO", "MELHOR")

#caminho do interpretedor perl
perl.path = "C:/ProgramFiles/strawberry/perl/bin/perl"

#numero do arquivo que apresenta mais linhas(arquivo principal)
arquivo.principal = 4

#data.frame com todos os valores de indicadores e desvios(outliers)
dffinal <- processSelectedIndicatorsData(indicadorFiles, perl.path, arquivo.principal, indicador.categoria)

#salva data frame
con<-file("tabela_com_todos_os_indicadores_selecionados_e_desvios.csv",encoding="utf8")
write.csv(dffinal, con, row.names=F)
