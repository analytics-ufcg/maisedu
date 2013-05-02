#script que gera as figuras das series temporais para a US7. Destacando as series que merecem atencao
args = commandArgs(trailingOnly = TRUE)
require("ggplot2")
options(stringsAsFactors = FALSE)


#retorna o maior desvio(absoluto) de um indicador(apenas indices impares)
retornaMaiorDesvioIndicar = function(tabela.cidade, numero.indicador) {
  cidade = tabela.cidade
  
  tabela = cidade[,c(5, numero.indicador, numero.indicador+1)]
  
  tabela = na.omit(tabela)
  maior = 0  
  for (indice in tabela[,3]) {
    if (maior < abs(indice)) {
      maior = indice
    }
  }
  return(maior)  
}


#Cria uma imagem de uma serie temporal, recebendo uma cidade e um indicador como parametros
criaImagemSerieTemporal = function(nome.cidade, numero.indicador){  
  paraiba = regioes[regioes$REGIAO=="Paraíba",]
  cidade = desvios[desvios$NOME_MUNICIPIO==nome.cidade,]
  indicador.desvio = 10 + (2*numero.indicador - 1)
  indicador.regiao = 3 + numero.indicador
  desvio = retornaMaiorDesvioIndicar(cidade, indicador.desvio)
  indicador = colnames(cidade)[indicador.desvio]
  
  tabela = cidade[,c(5,10,indicador.desvio)]
  colnames(tabela)[2] = "REGIAO"
  tabela = rbind(tabela, paraiba[,c(3,2,indicador.regiao)])
  colnames(tabela)[3] = "VALOR"
  
  tabela = na.omit(tabela)
  
  if (nrow(tabela) == 2) {
    p = ggplot(tabela, aes(x=REGIAO, y=VALOR, fill=REGIAO, stat="identity")) + 
      geom_bar() + 
      guides(fill=FALSE) + 
      labs(title=tabela[1,1]) + 
      theme_bw()
  }
  else if (nrow(tabela) > 2) {
    p = ggplot(tabela, aes(x=ANO, y=VALOR, colour=REGIAO)) + 
      geom_line(aes(group=REGIAO)) +
      geom_point(size=3) +
      theme_bw() +
      theme(legend.position="none")
      
  }
  else {
    break
  }
  png(paste(nome.cidade,"_SERIE","_",indicador,"_",desvio,".png", sep=""),width = 382, height = 291) 
  print(p)
  dev.off()
}

#Leitura de arquivos
desvios = read.csv("./tabela_com_todos_os_indicadores_selecionados_e_desvios.csv",fileEncoding="latin1")
regioes = read.csv("./medianas_para_todos_os_indicadores_agrupados_por_ano_e_regiao.csv",fileEncoding="latin1")

#passa os nomes das cidades para letras minusculas
desvios$NOME_MUNICIPIO = tolower(desvios$NOME_MUNICIPIO)

#recebe o nome da cidade da linha de comando e passa para minusculo
print(args)
nome.cidade = tolower(args)

#gera imagens para todos os indicadores
for(indicador in 1:15) {
  criaImagemSerieTemporal(nome.cidade, indicador)
}

