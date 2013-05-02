#testa o script: calcula_mediana_regioes_e_estado_para_todos_indicadores(US-8).R
data1 = data.frame(COD_UF=c(rep(25,3),NA,NA), NOME_UF=c(rep("Paraíba",3),NA,NA),  COD_MUNICIPIO=c(1,4,2,2,3), ANO=c(1,2,2,2,1),	
                   COD_MESO=c(10,40,20,20,30),	NOME_MESO=c("A","D","B","B","C"),	COD_MICRO=c(1,4,2,2,3),
                   NOME_MICRO=c("a","d","b","b","c"),	NOME_MUNICIPIO=c("11","44","22","22","33"),	INDICADOR_329=c(10,15,20,25,30))

data2 = data.frame(COD_UF=c(NA,NA,rep(25,3)), NOME_UF=c(NA,NA,rep("Paraíba",3)),  COD_MUNICIPIO=c(3,3,2,4,1), ANO=c(2,1,2,2,1),	
                   COD_MESO=c(30,30,20,20,10),	NOME_MESO=c("C","C","B","B","A"),	COD_MICRO=c(3,3,2,4,1),
                   NOME_MICRO=c("c","c","b","d","a"),	NOME_MUNICIPIO=c("33","33","22","44","11"),	INDICADOR_64=c(40,23,22,12,20))




test.calcMedian.UF <- function() {
  data1 = adjustIndictorData(data1)
  data2 = adjustIndictorData(data2)
  checkEquals(c("Paraíba","Paraíba"), calcMedian(data1,"NOME_UF")[,1])
  checkEquals(c(1,2), calcMedian(data1,"NOME_UF")[,2])
  checkEquals(c(20,20), calcMedian(data1,"NOME_UF")[,3])
  checkEquals(c("Paraíba","Paraíba"), calcMedian(data2,"NOME_UF")[,1])
  checkEquals(c(1,2), calcMedian(data2,"NOME_UF")[,2])
  checkEquals(c(21.5, 22.0), calcMedian(data2,"NOME_UF")[,3])
}


test.calcMedian.Meso <- function() {
  data1 = adjustIndictorData(data1)
  data2 = adjustIndictorData(data2)
  checkEquals(c("A","B","C","D"), as.character(calcMedian(data1,"NOME_MESO")[,1]))
  checkEquals(c(1,2,1,2), calcMedian(data1,"NOME_MESO")[,2])
  checkEquals(c(10.0,22.5,30.0,15.0), calcMedian(data1,"NOME_MESO")[,3])
  checkEquals(c("A","B","C","C"), as.character(calcMedian(data2,"NOME_MESO")[,1]))
  checkEquals(c(1,2,1,2), calcMedian(data2,"NOME_MESO")[,2])
  checkEquals(c(20,17,23,40), calcMedian(data2,"NOME_MESO")[,3])
}


test.calcMedian.Micro <- function() {
  data1 = adjustIndictorData(data1)
  data2 = adjustIndictorData(data2)
  checkEquals(c("a","b","c","d"), as.character(calcMedian(data1,"NOME_MICRO")[,1]))
  checkEquals(c(1,2,1,2), calcMedian(data1,"NOME_MICRO")[,2])
  checkEquals(c(10.0,22.5,30.0,15.0), calcMedian(data1,"NOME_MICRO")[,3])
  checkEquals(c("a","b","c","c","d"), as.character(calcMedian(data2,"NOME_MICRO")[,1]))
  checkEquals(c(1,2,1,2,2), calcMedian(data2,"NOME_MICRO")[,2])
  checkEquals(c(20,22,23,40,12), calcMedian(data2,"NOME_MICRO")[,3])
}
