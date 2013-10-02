#Script que carrega arquivos de indicadores necessários para o agrupamento da US14 e salva todos agregados em um unico arquivo
#São necessarios os arquivos que estão na pasta Indicadores Selecionados/5 - Indicadores para Análises de Grupos/

require("gdata")

#Caminho do interpretedor perl(arquivos xls precisam dessa lib(gdata))
perl.path = "C:/Perl64/bin/perl"


data = read.csv("tabela_com_todos_os_indicadores_selecionados_e_desvios.csv",
                stringsAsFactors=F, encoding="UTF-8")

#Inicio - henriquerzo@gmail.com - 14/08/2013

#Carrega arquivos necessártios
total.matriculas = read.xls("INDICADOR_219 - Total Matr�culas.xls", perl=perl.path,
                            stringsAsFactors=F)

IFDM = read.xls("IFDM_2010_Paraiba.xls", perl=perl.path,
                stringsAsFactors=F)


receita = read.xls("Receita.xls", perl = perl.path, stringsAsFactors=F)
receita = receita[1:(nrow(receita)-1), ]
receita$Valor = gsub(",","",receita$Valor)


#Selecionando colunas e linhas necessárias e ordenando
total.matriculas = total.matriculas[total.matriculas$ANO==2011,]
total.matriculas = total.matriculas[with(total.matriculas,order(NOME_MUNICIPIO)),]

#ordenando os indicadores
data = data[data$ANO == 2011, ]
data = data[order(as.character(data$NOME_MUNICIPIO)), ]
IFDM = IFDM[order(as.character(IFDM$Cidade)),]
receita = receita[as.character(order(receita$Muninipio)), ]

data = cbind(data,receita$Valor,total.matriculas$INDICADOR_219,IFDM$IFDM)

colnames(data)[40:42] = c("receita","numero.matriculas","IFDM")


#for(i in 1:nrow(data)){
#  nome = as.character(data$NOME_MUNICIPIO[i])
#  if(nrow(receita[receita$Muninipio == nome,]) > 0){
#    data[i,]$receita = receita[receita$Muninipio == nome, ]$Valor
#  }
#}

#for(i in 1:nrow(data)){
#  nome = as.character(data$NOME_MUNICIPIO[i])
#  if(nrow(IFDM[IFDM$Cidade == nome,]) > 0){
#    data[i,]$IFDM = IFDM[IFDM$Cidade == nome, ]$IFDM
#  }
#}

#for(i in 1:nrow(data)){
#  nome = as.character(data$NOME_MUNICIPIO[i])
#  if(nrow(total.matriculas[total.matriculas$NOME_MUNICIPIO == nome,]) > 0){
#    data[i,]$numero.matriculas = total.matriculas[total.matriculas$NOME_MUNICIPIO == nome, ]$INDICADOR_219
#  }
#}

#Salvando informações agregadas
write.csv(data,"numero.matriculas_IFDM_e_receita_agregados.csv",row.names=F, dec = ".",
          fileEncoding="UTF-8")

#Fim - henriquerzo@gmail.com - 14/08/2013





