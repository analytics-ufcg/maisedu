#Recebe os arquivos com os indicadores, calcula os outliers e gera um arquivo com esses resultados. 
#Basta setar o diretorio root dos indicadores selecionados como workspace e executar o script. 
require("gdata")


#Recebe um valor do indicador, as tabelas de media e desvio padrao, e o ano do indicador. Retorna se e um outlier
classifyOutLiers <- function(obValue, tabMean, tabSD, ano){
  if(!is.na(obValue)) {
    if(obValue > (tabMean[tabMean$Group.1==ano,2] + 3*tabSD[tabSD$Group.1==ano,2])){
      1 #"Positive OutLier"
    }
    else if(obValue < (tabMean[tabMean$Group.1==ano,2] - 3*tabSD[tabSD$Group.1==ano,2])){
      -1 #"Negative OutLier"
    }
    else {
      0 #"Normal"
    }
  }
  else {
    NA
  }
}


#recebe o data frame com um indicador e retorna um novo data frame com uma nova coluna informando se o indicador é outlier. Remove NAs dos indicadores.
generateOutlierColumn <- function(data.df){ 
  data.sem.nas = na.omit(data.df)
  meanAno = aggregate(data.sem.nas[,ncol(data.sem.nas)], list(data.sem.nas$ANO), mean)
  sdAno = aggregate(data.sem.nas[,ncol(data.sem.nas)], list(data.sem.nas$ANO), sd)
  class <- Vectorize(classifyOutLiers,c("obValue", "ano"))(data.df[,10], meanAno, sdAno, data.df$ANO)
  data.df = cbind(data.df, class)
  colnames(data.df)[11] = paste("OUTLIER_", colnames(data.df)[10], sep="")
  return(data.df)
}


#ajusta dados faltantes do data frame dos indicadores
adjustIndictorData <- function(df){
  df$COD_UF = 25
  df$NOME_UF = "Paraíba"  
  return(df)
}


#processa cada indicador e agrega todos em um unico data frame
processSelectedIndicatorsData <- function(indicadorFiles,perl.path){
  #tabela principal que contem a maior quantidade de linhas
  data.principal = read.xls(xls=indicadorFiles[4],perl=perl.path)
  #preenche dados faltantes
  data.principal = adjustIndictorData(data.principal)
  data.principal = generateOutlierColumn(data.principal)
  
  for(indicadorFile in 1:length(indicadorFiles)) {
    print(indicadorFile)
    if(indicadorFile != 4) {
      data = read.xls(xls=indicadorFiles[indicadorFile], perl=perl.path)
      data = adjustIndictorData(data)
      data = generateOutlierColumn(data)
      data.principal = merge(data.principal,data,all.x=T)
    }
  }
  return(data.principal)
}


indicadorFiles = list.files(path=".",full.names=T,recursive=T,pattern=".xls")
perl.path = "C:/ProgramFiles/strawberry/perl/bin/perl"

dffinal <- processSelectedIndicatorsData(indicadorFiles, perl.path)

#salva data frame
write.csv(dffinal, "tabela_com_todos_os_indicadores_selecionados_e_outliers.csv",row.names=F)



