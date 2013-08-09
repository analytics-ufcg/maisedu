#script que adiciona novos dados ao sistema, a partir de uma tabela com o indicador a ser atualizado o script atualiza a tabela dos indicadores e dos desvios
# e a tabela das medianas. O script recebe como entrada da linha de comando 6 argumentos:

#1: endereço da nova tabela a ser adicionadac("INDICADOR_EXEMPLO - tabela com indicador_62 com anos 2012 e 2013.csv")
#2: endereço da tabela default do sistema com os valores dos indicadores e dos desvios("tabela_com_todos_os_indicadores_selecionados_e_desvios.csv")
#3: endereço da tabela default com os valores das medianas("medianas_para_todos_os_indicadores_agrupados_por_ano_e_regiao.csv")
#4: endereço com o nome da nova tabela com os novos dados dos indicadores
#5: endereço com o nome da nova tabela com as medianas
#6: endereço do  bin do perl ("C:/strawberry/perl/bin/perl.exe") 

#Rscript agrega_novos_dados_nas_tabelas_de_indicadores_e_medianas.R 1.xls saida/1.csv saida/2.csv saida2/1.csv saida2/2.csv C:/strawberry/perl/bin/perl.exe

###############
# bibliotecas #
###############
require(gdata)
require(plyr)
require(Hmisc)

#install.packages("Hmisc")

#---------------------------------------------------------------------------------------------------------------------------------#
#-----------------------------------------------------------FUNCOES---------------------------------------------------------------#
#---------------------------------------------------------------------------------------------------------------------------------#

####Funcoes para mediana da Paraiba e das meso e micro regioes

#Caclula a mediana com base nos dados e no nome da regiÃ£o desejada
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
#recebe tabela do novo indicador, tabela de mediana default
processaIndicador <- function(df.indicador, arquivo.principal){
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


############Funcoes para os indicadores e os desvios dos indicadores e agregação

#Ordena um dataframe pelo nome do municipio depois pelo ano
ordenaDataFrame = function(data) {
  data$NOME_MUNICIPIO = as.character(data$NOME_MUNICIPIO)
  data$ANO = as.character(data$ANO)
  data = arrange(data, data$NOME_MUNICIPIO, data$ANO)
  return (data)
}

#junta a tabela nova na tabela default
addTabela = function(tabela.default, tabela.nova) {
  tabela.default = merge(tabela.default, tabela.nova, by=colnames(tabela.nova), all.y=T)
  
  tabela.default$NOME_MUNICIPIO = as.factor(tabela.default$NOME_MUNICIPIO)
  tabela.default$NOME_UF = as.factor(tabela.default$NOME_UF)
  tabela.default$NOME_MESO = as.factor(tabela.default$NOME_MESO)
  tabela.default$NOME_MICRO = as.factor(tabela.default$NOME_MICRO)
  return (tabela.default)
}


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

getIndicadorCategoria = function(tabela.nova, tabela.indicador){
  categoria = tabela.indicador[tabela.indicador$indice==colnames(tabela.nova)[10],]$categoria
  return (as.character(categoria))
}



####################################################################################################################

args <- commandArgs(trailingOnly = TRUE) 
#indicador (1), tabela de desvios(2), mediana(3), desvios novos(4), mediana nova(5), caminho perl(6)

#args = c("INDICADOR_EXEMPLO - tabela com indicador_62 com anos 2012 e 2013.csv", "tabela_com_todos_os_indicadores_selecionados_e_desvios.csv", "medianas_para_todos_os_indicadores_agrupados_por_ano_e_regiao.csv", "desvio.novo.csv", "mediana.nova.csv","perl")



#lista indicando se para um indicador quanto maior (MELHOR/PIOR), com base na ordem em que aparecem na lista "indicadorFiles"
indice.indicador = c("INDICADOR_62", "INDICADOR_199", "INDICADOR_200", "INDICADOR_329", "INDICADOR_333", "INDICADOR_181", "INDICADOR_182", "INDICADOR_188", "INDICADOR_189", "INDICADOR_289", "INDICADOR_290", "INDICADOR_202", "INDICADOR_184", "INDICADOR_7", "INDICADOR_201")
indicador.categoria = c("MELHOR", "MELHOR", "MELHOR", "PIOR", "MELHOR", "PIOR", "PIOR", "MELHOR", "MELHOR", "MELHOR", "PIOR", "PIOR", "PIOR", "NEUTRO", "MELHOR")

tabela.indicador = data.frame(indice = indice.indicador, categoria = indicador.categoria)


#################################################
###Caminho do perl
perl.path <- args[6]

#Tabela do indicador novo
#tabela.nova <- read.xls(xls=args[1],perl=args[6])
tabela.nova <- read.csv(args[1])

#tabela do indicador antigo
tabela.default <- read.csv(args[2])

#####################################################processamento das medianas
#Tabela default da mediana
mediana_default <- read.csv(args[3])

#realizar processamento da mediana
dffinal <- processaIndicador(tabela.nova,mediana_default)

#salva data frame mediana
#con<-file(args[5],encoding="utf8")
write.csv(dffinal, args[5], row.names=F)


##############################################Processamento dos novos indicadores

#adiciona desvios na tabela
tabela.nova = generateOutlierColumn(tabela.nova, getIndicadorCategoria(tabela.nova,tabela.indicador))


tabela.final = addTabela(tabela.default,tabela.nova)

#salva data frame
#con<-file(args[4],encoding="utf8")
write.csv(tabela.final, args[4], row.names=F)
