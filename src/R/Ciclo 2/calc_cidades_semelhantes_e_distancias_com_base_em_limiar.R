require(Hmisc)
#Script que calcula as 10 cidades mais proximas dada uma cidade de referencia, usando os atributos: FPM IFDM e numero de maticulas
#É necessario o arquivo "numero.matriculas_IFDM_e_FPM_agregados.csv" que esta na pasta Indicadores Selecionados/5 - Indicadores para Análises de Grupos

#Carrega os dados e remove linhas com NA
data.real <- read.csv("numero.matriculas_IFDM_e_receita_agregados.csv", head = T, encoding="UTF-8", dec = ".")

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
    lista = data.frame(Cidade = nome.cidade)
    
    outras.cidades <- data[(data$NOME_MUNICIPIO != nome.cidade), ]
    tabela = data.frame(cidade = outras.cidades$NOME_MUNICIPIO, distancia.euclidiana = calcDistanciaEuclidiana(cidade, outras.cidades))
    tabela = tabela[order(tabela$distancia.euclidiana),]
    tabela = tabela[1:quant.cidades,]
    for (i in 1:quant.cidades) {
      lista = cbind(lista, tabela$cidade[i], tabela$distancia.euclidiana[i])    
    }
    colnames(lista)[seq(2,21,2)] = paste("Vizinho", 1:10, sep="")
    colnames(lista)[seq(3,21,2)] = paste("Distancia", 1:10, sep="")
    return (lista)
  }
}


#Função que recebe um limiar e adiciona todas as cidades em uma tabela com as cidades mais proximas e as respectivas distancias
calcDistanciaParaTodasCidades = function(data, quant.cidades = 10) {
  tabela = data.frame()
  for (cidade in data[,9]) {
    tabela = rbind(tabela, calcDistanciaCidadesSemelhantes(cidade, quant.cidades))
  }
  return (tabela)
}


#Recebe a tabela com distancias e cidades similares e retorna apenas os nomes das cidades
getCidadesSimilares = function(tabela) {
  return (tabela[,c(1,seq(2,21,2))])
}


#Recebe a tabela com distancias e cidades similares e retorna apenas as distancias das cidades similares
getDistanciasSimilares = function(tabela) {
  return (tabela[,c(1,seq(3,21,2))])
}


#Remove distancias que são maiores que um certo limiar
filtraVizinhosMaisProximos = function(tabela, limiar) {
  for (linha in 1:nrow(tabela)) {
    for (coluna in seq(2,ncol(tabela),2)) {
      if (tabela[linha,coluna + 1] > limiar) {
        tabela[linha,coluna] = NA
        tabela[linha,coluna + 1] = NA
      }
    }
  }
  return (tabela)
}


###################################################Definição de limiares########################################################


tabela = calcDistanciaParaTodasCidades(data)

tabela.distancias = getDistanciasSimilares(tabela)

pilha = stack(tabela.distancias[2:11])

#gráfico da distriuição acumulada das distancias dos vizinhos
png("Distribuição Acumulada das Distâncias dos Vizinhos.png",bg="white",width=700, height=400)
Ecdf(pilha$values,q=c(0.95,0.96,0.97,0.98), xlab = "Distancia do Vizinho",
     ylab="Percentual",label.curves=TRUE,col="black",las=1, subtitles=FALSE,)
dev.off()

valor.quantil = quantile(pilha$values,0.96)


##################################################Usando Limiares Definidos#####################################################

tabela.filtrada =  filtraVizinhosMaisProximos(tabela, valor.quantil)

tabela.cidades = getCidadesSimilares(tabela.filtrada)

tabela.distancias = getDistanciasSimilares(tabela.filtrada)



##################################################Salvando dados#################################################################

write.csv(tabela.cidades, "tabela_cidades_semelhantes.csv", row.names = F, fileEncoding="UTF-8")

write.csv(tabela.distancias,"cidades_semelhantes_distancias.csv",row.names = F)


