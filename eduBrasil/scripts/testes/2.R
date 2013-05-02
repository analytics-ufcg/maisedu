#testa o script: calcula_e_agrega_indicadores_e_desvios(US-8).R

data1 = data.frame(COD_UF=c(rep(25,3),NA,NA), NOME_UF=c(rep("Paraíba",3),NA,NA),	COD_MUNICIPIO=c(1,4,2,2,3), ANO=c(1,2,2,2,1),	
                   COD_MESO=c(10,40,20,20,30),	NOME_MESO=c("A","D","B","B","C"),	COD_MICRO=c(1,4,2,2,3),
                   NOME_MICRO=c("a","d","b","b","c"),	NOME_MUNICIPIO=c("1","4","2","2","3"),	INDICADOR_329=c(10,15,20,25,30))

data2 = data.frame(COD_UF=c(NA,NA,rep(25,3)), NOME_UF=c(NA,NA,rep("Paraíba",3)),  COD_MUNICIPIO=c(3,3,2,4,1), ANO=c(2,1,2,2,1),	
                   COD_MESO=c(30,30,20,20,10),	NOME_MESO=c("C","C","B","B","A"),	COD_MICRO=c(3,3,2,4,1),
                   NOME_MICRO=c("c","c","b","d","a"),	NOME_MUNICIPIO=c("3","3","2","4","1"),	INDICADOR_64=c(40,23,22,12,20))    


test.classifyOutLiers <- function() {  
  tabMean = data.frame(Group.1=c(1,2,3),x=c(2,34,23))
  tabSd = data.frame(Group.1=c(1,2,3),x=c(2,5,4))
  checkEquals(-3, classifyOutLiers(obValue=24, tabMean, tabSd, ano=2))
  checkEquals(-1, classifyOutLiers(obValue=30, tabMean, tabSd, ano=2))
  checkEquals(4, classifyOutLiers(obValue=10, tabMean, tabSd, ano=1))
  checkEquals(2, classifyOutLiers(obValue=30, tabMean, tabSd, ano=3))
  checkEquals(0, classifyOutLiers(obValue=23, tabMean, tabSd, ano=3))
}

test.generateOutlierColumn <- function() { 
  data1 = adjustIndictorData(data1)
  data2 = adjustIndictorData(data2)
  checkEquals(c(-1,-2,0,2,1), generateOutlierColumn(data1,referencial.outlier="MELHOR")[,11])
  checkEquals(c(1,2,0,-2,-1), generateOutlierColumn(data1,referencial.outlier="PIOR")[,11])
  checkEquals(c(2,1,-1,-1,-1), generateOutlierColumn(data2,referencial.outlier="MELHOR")[,11])
  checkEquals(c(-2,-1,1,1,1), generateOutlierColumn(data2,referencial.outlier="PIOR")[,11])
}

test.adjustIndictorData <- function() { 
  checkEquals(rep("Paraíba",5), adjustIndictorData(data2)[,2])
  checkEquals(rep("Paraíba",5), adjustIndictorData(data1)[,2])
  checkEquals(rep(25,5), adjustIndictorData(data2)[,1])
  checkEquals(rep(25,5), adjustIndictorData(data1)[,1])
}

test.processSelectedIndicatorsData <- function() { 
  data1 = adjustIndictorData(data1)
  data2 = adjustIndictorData(data2)
  data1 = generateOutlierColumn(data1,referencial.outlier="MELHOR")
  data2 = generateOutlierColumn(data2,referencial.outlier="PIOR")
  checkEquals(c(10, 20, 25, 30, NA, NA, 15), merge(data1,data2,all=T)[,10])
  checkEquals(c(-1,  0,  2,  1, NA, NA, -2), merge(data1,data2,all=T)[,11])
  checkEquals(c(20, 22, 22, 23, 40, 12, NA), merge(data1,data2,all=T)[,12])
  checkEquals(c(1,  1,  1, -1, -2,  1, NA), merge(data1,data2,all=T)[,13])
}