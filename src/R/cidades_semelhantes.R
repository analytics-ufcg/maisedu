setwd("~/WebContent/data")

data <- read.csv("dados.csv", head = T)

nome_cidade <- "Campina Grande"
cidade <- data[data$NOME_MUNICIPIO == nome_cidade, ]
data <- data[(data$NOME_MUNICIPIO != nome_cidade), ]
data$distancia = 0

distancia_euclidiana <- function (x1,x2,y1,y2,z1,z2){
  x <- (x1 - x2)^2
  y <- (y1 - y2)^2
  z <- (z1 - z2)^2
  
  distancia <- sqrt(x + y + z)
  
  return (distancia)
  
}

data$distancia <- distancia_euclidiana(cidade$FPM.FPM, data$FPM.FPM, cidade$INDICADOR_219, data$INDICADOR_219, cidade$IFDM.IFDM, data$IFDM.IFDM)
cidades_semelhantes <- data[with(data,order(data$distancia)), ] 