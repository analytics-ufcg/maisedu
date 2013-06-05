setwd("~/WebContent/data")

data <- read.csv("dados.csv", head = T)
data <- data[complete.cases(data),]

distancia_euclidiana <- function (x1,x2,y1,y2,z1,z2){
  x <- (x1 - x2)^2
  y <- (y1 - y2)^2
  z <- (z1 - z2)^2
  
  distancia <- sqrt(x + y + z)
  
  return (distancia)
  
}

norm_dados <- function(dados){
  #vec_x = vec_x-min(vec_x)/(max(vec_x)-min(vec_x))
  dados_normalizados <- (dados-min(dados))/(max(dados)- min(dados))
  return (dados_normalizados)
}


data$IFDM.IFDM = norm_dados(data$IFDM.IFDM)
data$FPM.FPM = norm_dados(data$FPM.FPM)
data$INDICADOR_219 = norm_dados(data$INDICADOR_219)
data$regiao = 1

nome_cidade <- "Campina Grande"
cidade <- data[data$NOME_MUNICIPIO == nome_cidade, ]
data <- data[(data$NOME_MUNICIPIO != nome_cidade), ]
data$distancia = 0

data$distancia <- distancia_euclidiana(cidade$FPM.FPM, data$FPM.FPM, cidade$INDICADOR_219, data$INDICADOR_219, cidade$IFDM.IFDM, data$IFDM.IFDM)
cidades_semelhantes <- data[with(data,order(data$distancia)), ] 

####considerando a regiao####

#dados[is.element(dados$UF, regiao.ne),]$Regiao = "Nordeste"
mesorregiao = data[data$NOME_MESO == cidade$NOME_MESO, ]$NOME_MUNICIPIO
data[!(is.element(data$NOME_MUNICIPIO,mesorregiao)), ]$regiao = 0

distancia_euclidiana_regiao <- function (x1,x2,y1,y2,z1,z2,r1,r2){
  x <- (x1 - x2)^2
  y <- (y1 - y2)^2
  z <- (z1 - z2)^2
  r <- (r1 - r2)^2
  
  distancia <- sqrt(x + y + z + r)
  
  return (distancia)
  
}

data$distancia <- distancia_euclidiana_regiao(cidade$FPM.FPM, data$FPM.FPM, cidade$INDICADOR_219, data$INDICADOR_219, cidade$IFDM.IFDM, data$IFDM.IFDM,
                                              cidade$regiao,data$regiao)
cidades_semelhantes_regiao <- data[with(data,order(data$distancia)), ] 