#Script que calcula as 10 cidades mais proximas dada uma cidade de referencia, usando os atributos: FPM IFDM e numero de maticulas
#É necessario o arquivo "numero.matriculas_IFDM_e_FPM_agregados.csv" que esta na pasta Indicadores Selecionados/5 - Indicadores para Análises de Grupos

#Carrega os dados e remove linhas com NA
data.real <- read.csv("numero.matriculas_IFDM_e_FPM_agregados.csv", head = T, stringsAsFactors=F)
data <- na.omit(data.real)


#Função que recebe  duas cidades e retorna a distancia euclidiana para valores dos 3 atributos: FPM, IFDM e numero.matriculas
calcDistanciaEuclidiana <- function (cidade, outra.cidade){
  x <- (cidade$FPM - outra.cidade$FPM)^2
  y <- (cidade$IFDM - outra.cidade$IFDM)^2
  z <- (cidade$numero.matriculas - outra.cidade$numero.matriculas)^2
  
  distancia <- sqrt(x + y + z)
  
  return (distancia)  
}


#Funcao que normaliza os dados no intervalo [0,1] usando Z score
norm_dados <- function(dados){
  media <- mean(dados)
  desvio <- sd(dados)
  dados_normalizados <- (dados - media)/desvio
  return (dados_normalizados)
}


#Normalizando colunas dos atributos que serão usados
data$FPM = normDados(data$FPM)
data$IFDM = normDados(data$IFDM)
data$numero.matriculas = normDados(data$numero.matriculas)


#Função que recebe o nome de uma cidade e retorna as n cidades mais proximas(10 é o padrão), também é possivel retornar as cidades mais proximas somente na mesorregiao
calcDistanciaCidadesSemelhantes <- function(nome.cidade, quant.cidades = 10, mesorregiao = F) {
  cidade <- data[data$NOME_MUNICIPIO == nome.cidade, ]
  if(nome.cidade %in% data.real$NOME_MUNICIPIO == F) {
    return("Cidade não encontrada")
  }
  else if(nrow(cidade) == 0) {
    return("Cidade não possui dados")
  }
  else {
    if(mesorregiao == F) {
      outras.cidades <- data[(data$NOME_MUNICIPIO != nome.cidade), ]
    }
    if(mesorregiao == T){
      outras.cidades <- subset(data, data$NOME_MUNICIPIO != nome.cidade & data$NOME_MESO == cidade$NOME_MESO)
    }
    tabela = data.frame(cidade = outras.cidades$NOME_MUNICIPIO, distancia.euclidiana = calcDistanciaEuclidiana(cidade, outras.cidades))
    tabela = tabela[order(tabela$distancia),]
    return(tabela[1:quant.cidades,])
 
  }
}


#Funcao que calcula a distancia media de uma cidade para as 10 mais proximas a ela(agrupando ou não por mesorregiao) 
calcMediaDistanciaCidadesSemelhantes = function(nome.cidade, quant.cidades = 10, mesorregiao = F) {
  return(mean(calcDistanciaCidadesSemelhantes(nome.cidade, quant.cidades, mesorregiao)[,2]))
}

#Funcao que gera um data.frame com a media das distancias Euclidianas para todas as cidades
calcDistanciaMediaTodasCidades = function(quant.cidades = 10, mesorregiao = F) {
  tabela = data.frame(cidade = data$NOME_MUNICIPIO, distancia.media = Vectorize(calcMediaDistanciaCidadesSemelhantes,c("nome.cidade"))(as.character(data$NOME_MUNICIPIO),quant.cidades, mesorregiao))
  tabela = tabela[order(tabela$distancia.media),]
  return(tabela)
}

#Tabela com as distancias medias
tabela = calcDistanciaMediaTodasCidades()

#histograma com as distancias medias da tabela acima
hist(tabela$distancia.media,main="Histograma da distância média",xlim=c(0,1.3), xlab="Distância Média")


distancia = calcDistanciaCidadesSemelhantes("João Pessoa")

boxplot(distancia$distancia.euclidiana)
write.csv(tabela, "tabela_media_distancias_das_cidades_mais_proximas.csv",row.names=F)

tab = data.frame(Vectorize(calcDistanciaCidadesSemelhantes,c("nome.cidade"))(as.character(tabela$cidade[209:219]),quant.cidades=10, mesorregiao=T))


