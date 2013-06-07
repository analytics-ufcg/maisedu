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
data$FPM = norm_dados(data$FPM)
data$IFDM = norm_dados(data$IFDM)
data$numero.matriculas = norm_dados(data$numero.matriculas)


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


#Funcao que retorna um data frame com a cidade, as suas n cidades mais proximas e os valores de distancia***********************
calcTodasDistanciasCidadesSemelhantes = function(data, quant.cidades = 10, mesorregiao = F, nomes) {
  tabela = data.frame()
  if(mesorregiao){
    media_cidades = calcDistanciaMediaTodasCidades(mesorregiao = T)
  }else{
    media_cidades = calcDistanciaMediaTodasCidades(mesorregiao = F)  
  }
  for(nome.cidade in data$NOME_MUNICIPIO) {
    linha = calcDistanciaCidadesSemelhantes(nome.cidade, quant.cidades, mesorregiao)
    if(nomes){
      cidade = cbind(nome.cidade,rbind(t((as.character(linha$cidade)))))
      tabela = rbind(tabela,as.data.frame(cidade))
    }else{
      cidade = cbind(nome.cidade,rbind(round(linha$distancia.euclidiana,4)),round(as.numeric(media_cidades[media_cidades$cidade == nome.cidade, ]$distancia.media),4))
      tabela = rbind(tabela,as.data.frame(cidade))
    }
    
  }
  
  nomes = c(1:10)
  colnames(tabela)[1] = "cidade"
  colnames(tabela)[2:11] = paste("Vizinho", nomes,sep = "")
  if(!nomes)colnames(tabela)[12] = "distancia.media"
  
  return(tabela)
}


####lista com nome das cidades semelhantes####
semelhantes_nomes = calcTodasDistanciasCidadesSemelhantes(data,nomes = T)
write.csv(semelhantes_nomes, "cidades_semelhantes_nomes.csv", row.names = F)
####considerando a mesorregiao####
semelhantes_nomes_meso = calcTodasDistanciasCidadesSemelhantes(data,mesorregiao = T,nomes = T)
write.csv(semelhantes_nomes_meso, "cidades_semelhantes_nomes_meso.csv", row.names = F)

####lista com distancia das cidades semelhantes####
semelhantes_distancias = calcTodasDistanciasCidadesSemelhantes(data, nomes = F)
write.csv(semelhantes_distancias, "cidades_semelhantes_distancias.csv", row.names = F)
####considerando a mesorregiao####
semelhantes_distancias_meso = calcTodasDistanciasCidadesSemelhantes(data,mesorregiao = T, nomes = F)
write.csv(semelhantes_distancias_meso, "cidades_semelhantes_distancias_meso.csv", row.names = F)





####Ordenar de acordo com a maior distancia media####
cidades_distancias = read.csv("cidades_semelhantes_distancias.csv", head = T, dec = ".")
cidades_distancias = cidades_distancias[with(cidades_distancias,order(cidades_distancias$V12)), ]
write.csv(cidades_distancias,"cidades_semelhantes_distancias.csv",row.names = F)

cidades_distancias_meso = read.csv("cidades_semelhantes_distancias_meso.csv", head = T, dec = ".")
cidades_distancias_meso = cidades_distancias_meso[with(cidades_distancias,order(cidades_distancias_meso$V12)), ]
write.csv(cidades_distancias_meso,"cidades_semelhantes_distancias_meso.csv",row.names = F)

