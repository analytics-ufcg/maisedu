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
criaImagemSerieTemporal = function(nome.cidade, numero.indicador, dicionario){
  #path = "C:/Users/Iara/Documents/GitHub/eduBrasil/eduBrasil/scripts/processing/SPRINT2/graphs/"
  path = "/home/iara/processing-2.0b3/sketchbook/SPRINT2/graphs/"
  paraiba = regioes[regioes$REGIAO=="Para?ba",]
  cidade = desvios[desvios$NOME_MUNICIPIO==nome.cidade,]
  indicador.desvio = 10 + (2*numero.indicador - 1)
  indicador.regiao = 3 + numero.indicador
  
  nome.indicador = dicionario$indicador[numero.indicador]
  
  desvio = retornaMaiorDesvioIndicar(cidade, indicador.desvio)
  indicador = colnames(cidade)[indicador.desvio]
  
  tabela = cidade[,c(5,10,indicador.desvio)]
  colnames(tabela)[2] = "REGIAO"
  tabela = rbind(tabela, paraiba[,c(3,2,indicador.regiao)])
  colnames(tabela)[3] = "VALOR"
  
  tabela = na.omit(tabela)
  
  p = ggplot(tabela, aes(x=ANO, y=VALOR, colour=REGIAO)) + 
      geom_line(aes(group=REGIAO)) +
      geom_point(size=3) +
      theme_bw() +
      theme(legend.position="none")  +
      labs(title = nome.indicador) 
  png(paste(path,nome.cidade,"_SERIE","_",indicador,"_",desvio,".png", sep=""),width = 382, height = 291) 
  print(p)
  dev.off()
}

#dicionario de nomes dos indicadores
dicionario = data.frame(key = c("INDICADOR_62", "INDICADOR_89", "INDICADOR_90", "INDICADOR_329", "INDICADOR_333", "INDICADOR_73", "INDICADOR_74", "INDICADOR_80", "INDICADOR_81", 
                                "INDICADOR_176", "INDICADOR_177", "INDICADOR_202", "INDICADOR_184", "INDICADOR_7", "INDICADOR_201"), 
                        indicador = c("Part. despesa e encargos educa??o(%)", "IDEB - 5? ano do ensino fundamental", "IDEB - 9? ano do ensino fundamental", "Taxa de analfabetismo",
                                      "Taxa de atendimento escolar", "Taxa abandono total - fundamental(%)", "Taxa de abandono - ensino m?dio(%)", "Taxa aprova??o total - fundamental(%)",
                                      "Taxa de aprova??o - ensino m?dio (%)", "Percentual docentes forma??o superior(%)", "Percentual de docentes tempor?rios", "?ndice precariedade infraestrutura",
                                      "Raz?o aluno por docente", "Despesa educa??o aluno", "?ndice efici?ncia educa??o b?sica"))

#Leitura de arquivos
#formato de arquivo no windows
#desvios = read.csv("C:/Users/Iara/Documents/GitHub/eduBrasil/eduBrasil/scripts/processing/SPRINT2/tabela_com_todos_os_indicadores_selecionados_e_desvios.csv",fileEncoding="latin1")
#regioes = read.csv("C:/Users/Iara/Documents/GitHub/eduBrasil/eduBrasil/scripts/processing/SPRINT2/medianas_para_todos_os_indicadores_agrupados_por_ano_e_regiao.csv",fileEncoding="latin1")

#formato no linux - /home/iara/processing-2.0b3/sketchbook/SPRINT2/
desvios = read.csv("/home/iara/processing-2.0b3/sketchbook/SPRINT2/tabela_com_todos_os_indicadores_selecionados_e_desvios.csv",fileEncoding="latin1")
regioes = read.csv("/home/iara/processing-2.0b3/sketchbook/SPRINT2/medianas_para_todos_os_indicadores_agrupados_por_ano_e_regiao.csv",fileEncoding="latin1")


#recebe nome da cidade da linha de comando
#nome.cidade = "Campina Grande"
nome.cidade = paste(args,collapse=" ")

#gera imagens para todos os indicadores
for(indicador in 1:15) {
  criaImagemSerieTemporal(nome.cidade, indicador, dicionario)
}

