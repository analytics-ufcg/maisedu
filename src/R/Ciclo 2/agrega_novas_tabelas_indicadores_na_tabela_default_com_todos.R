#script que usa a tabela default de indicadores e agrega novos dados de novos anos disponÌveis para os indicadores


require("gdata")
require("plyr")


#Ordena um dataframe pelo nome do municipio depois pelo ano
ordenaDataFrame = function(data) {
  data = arrange(data, data$NOME_MUNICIPIO, data$ANO)
  return (data)
}


#junta a tabela nova na tabela default
addTabela = function(tabela.default, tabela.nova) {
  #se a tabela original for menor
  if (length(setdiff(unique(tabela.nova$ANO), unique(tabela.default$ANO)))>0) {
    tabela.default = merge(tabela.default, tabela.nova, by=colnames(tabela.nova), all=T)
    return (tabela.default)
  }
  else {
    anoFaltante = setdiff(tabela.default$ANO,tabela.nova$ANO)
    tabela.complemento = tabela.default[tabela.default$ANO!=c(anoFaltante),]
    tabela.default = tabela.default[tabela.default$ANO==c(anoFaltante),]
    
    
    
    tabela.complemento = ordenaDataFrame(tabela.complemento)
    tabela.nova = ordenaDataFrame(tabela.nova)
    
    nome.indicador = colnames(tabela.nova)[10]
    nome.desvio = colnames(tabela.nova)[11]
    
    tabela.complemento[,nome.indicador] = tabela.nova[,nome.indicador]
    tabela.complemento[,nome.desvio] = tabela.nova[,nome.desvio]
    
    tabela.default = rbind(tabela.complemento,tabela.default)
    
    return(ordenaDataFrame(tabela.default))
  }      
}


#Recebe um valor do indicador, as tabelas de media e desvio padrao, e o ano do indicador. Retorna quantos desvios o valor esta da m√©dia
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

getIndicadorCategoria = function(tabela.nova, tabela.indicador){
  categoria = tabela.indicador[tabela.indicador$indice==colnames(tabela.nova)[10],]$categoria
  return (as.character(categoria))
}


########################################################################################################################################################################

#lista indicando se para um indicador quanto maior (MELHOR/PIOR), com base na ordem em que aparecem na lista "indicadorFiles"
indice.indicador = c("INDICADOR_62", "INDICADOR_199", "INDICADOR_200", "INDICADOR_329", "INDICADOR_333", "INDICADOR_181", "INDICADOR_182", "INDICADOR_188", "INDICADOR_189", "INDICADOR_289", "INDICADOR_290", "INDICADOR_202", "INDICADOR_184", "INDICADOR_7", "INDICADOR_201")
indicador.categoria = c("MELHOR", "MELHOR", "MELHOR", "PIOR", "MELHOR", "PIOR", "PIOR", "MELHOR", "MELHOR", "MELHOR", "PIOR", "PIOR", "PIOR", "NEUTRO", "MELHOR")

tabela.indicador = data.frame(indice = indice.indicador, categoria = indicador.categoria)

#################################################################################


tabela.default = read.csv("tabela_com_todos_os_indicadores_selecionados_e_desvios.csv")

tabela.nova = read.csv("INDICADOR_EXEMPLO - tabela com indicador_62 com anos 2012 e 2013.csv")

tabela.nova = generateOutlierColumn(tabela.nova, getIndicadorCategoria(tabela.nova,tabela.indicador))

