#Script que calcula as 10 cidades mais proximas dada uma cidade de referencia, usando os atributos: FPM IFDM e numero de maticulas
#É necessario o arquivo "numero.matriculas_IFDM_e_FPM_agregados.csv" que esta na pasta Indicadores Selecionados/5 - Indicadores para Análises de Grupos

#Carrega os dados e remove linhas com NA
data.real <- read.csv("numero.matriculas_IFDM_e_receita_agregados.csv", head = T, stringsAsFactors=F,dec = ".")

data.real = data.real[,c(1:9,40,41,42)]

data <- na.omit(data.real)


#Função que recebe  duas cidades e retorna a distancia euclidiana para valores dos 3 atributos: FPM, IFDM e numero.matriculas
calcDistanciaEuclidiana <- function (cidade, outra.cidade){
  #x <- (cidade$FPM - outra.cidade$FPM)^2
  x <- (cidade$receita - outra.cidade$receita)^2
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
#data$FPM = norm_dados(data$FPM)
data$receita = norm_dados(data$receita)
data$IFDM = norm_dados(data$IFDM)
data$numero.matriculas = norm_dados(data$numero.matriculas)


#Função que recebe o nome de uma cidade e retorna as n cidades mais proximas(10 é o padrão)
calcDistanciaCidadesSemelhantes <- function(nome.cidade, quant.cidades = 10) {
  cidade <- data[data$NOME_MUNICIPIO == nome.cidade, ]
  if(nome.cidade %in% data.real$NOME_MUNICIPIO == F) {
    return("Cidade não encontrada")
  }
  else if(nrow(cidade) == 0) {
    return("Cidade não possui dados")
  }
  else {
    outras.cidades <- data[(data$NOME_MUNICIPIO != nome.cidade), ]
    tabela = data.frame(cidade = outras.cidades$NOME_MUNICIPIO, distancia.euclidiana = calcDistanciaEuclidiana(cidade, outras.cidades))
    tabela = tabela[order(tabela$distancia),]
    return(tabela[1:quant.cidades,])
 
  }
}


#Funcao que calcula a distancia media de uma cidade para as 10 mais proximas a ela(agrupando ou não por mesorregiao) 
calcMediaDistanciaCidadesSemelhantes = function(nome.cidade, quant.cidades = 10) {
  return(mean(calcDistanciaCidadesSemelhantes(nome.cidade, quant.cidades)[,2]))
}

#Funcao que gera um data.frame com a media das distancias Euclidianas para todas as cidades
calcDistanciaMediaTodasCidades = function(quant.cidades = 10) {
  tabela = data.frame(cidade = data$NOME_MUNICIPIO, distancia.media = Vectorize(calcMediaDistanciaCidadesSemelhantes,c("nome.cidade"))(as.character(data$NOME_MUNICIPIO),quant.cidades))
  tabela = tabela[order(tabela$distancia.media),]
  return(tabela)
}


#Funcao que retorna um data frame com a cidade, as suas n cidades mais proximas e os valores de distancia***********************
calcTodasDistanciasCidadesSemelhantes = function(data, quant.cidades = 10,nomes) {
  tabela = data.frame()
  media_cidades = calcDistanciaMediaTodasCidades()  
  for(nome.cidade in data$NOME_MUNICIPIO) {
    linha = calcDistanciaCidadesSemelhantes(nome.cidade, quant.cidades)
    if(nomes){
      cidade = cbind(nome.cidade,rbind(as.character(linha$cidade)))
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


calCidadesDiferentes <- function(data, quant.cidades = 10){
  #cidades_nomes = read.csv("cidades_semelhantes_nomes.csv", head = T)
  #cidades_nomes_meso = read.csv("cidades_semelhantes_nomes_meso.csv", head = T)
  tabela = data.frame()
  media_cidades_meso = calcDistanciaMediaTodasCidades(mesorregiao = T)
  media_cidades = calcDistanciaMediaTodasCidades(mesorregiao = F)
  
  for(nome.cidade in data$NOME_MUNICIPIO) {
    linha_meso = calcDistanciaCidadesSemelhantes(nome.cidade,quant.cidades, mesorregiao = T)
    linha = calcDistanciaCidadesSemelhantes(nome.cidade,quant.cidades, mesorregiao = F)
    diferencas = cbind(as.character(linha_meso$cidade)) == cbind(as.character(linha$cidade))
    media.cidade = media_cidades[media_cidades$cidade == nome.cidade, ]$distancia.media
    media.cidade.meso = media_cidades_meso[media_cidades_meso$cidade == nome.cidade, ]$distancia.media
    total = (10 - sum(diferencas[diferencas[,1] == TRUE, ]))
    tabela = rbind(tabela,cbind(nome.cidade,as.numeric(total), round(media.cidade,4), round(media.cidade.meso,4)))
  }
  
  colnames(tabela) = c("nome.cidade","total.cidades","media","media.meso")
  return(tabela)
  
}

####lista com nome das cidades semelhantes####
semelhantes_nomes = calcTodasDistanciasCidadesSemelhantes(data,nomes = T)
write.csv(semelhantes_nomes, "cidades_semelhantes_nomes.csv", row.names = F)

####lista com distancia das cidades semelhantes####
semelhantes_distancias = calcTodasDistanciasCidadesSemelhantes(data, nomes = F)
write.csv(semelhantes_distancias, "cidades_semelhantes_distancias.csv", row.names = F)

####Ordenar de acordo com a maior distancia media####
cidades_distancias = read.csv("cidades_semelhantes_distancias.csv", head = T, dec = ".")
cidades_distancias = cidades_distancias[with(cidades_distancias,order(cidades_distancias$V12)), ]
write.csv(cidades_distancias,"cidades_semelhantes_distancias.csv",row.names = F)

####Quantidade de cidades diferentes####
#cidades_diferentes = calCidadesDiferentes(data,10)
#write.csv(cidades_diferentes,"cidades_diferentes_medias.csv",row.names = F)
