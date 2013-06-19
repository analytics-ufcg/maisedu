#Script que carrega arquivos de indicadores necessários para o agrupamento da US14 e salva todos agregados em um unico arquivo
#São necessarios os arquivos que estão na pasta Indicadores Selecionados/5 - Indicadores para Análises de Grupos/

require("gdata")

#Caminho do interpretedor perl(arquivos xls precisam dessa lib(gdata))
perl.path = "C:/strawberry/perl/bin/perl"

#Carrega arquivos necessártios
total.matriculas = read.xls("INDICADOR_219 - Total Matr�culas.xls",perl=perl.path)
IFDM = read.xls("IFDM_2010_Paraiba.xls",perl=perl.path)[,]
receita = read.xls("Receita.xls", perl = perl.path)
receita = receita[1:(nrow(receita)-1), ]
receita$Valor = gsub(",","",receita$Valor)
#FPM = read.xls("tabela de munic�???pios com coeficiente FPM e cod IBGE.xls",perl=perl.path)


#Selecionando colunas e linhas necessárias e ordenando
total.matriculas = total.matriculas[total.matriculas$ANO==2011,]
total.matriculas = total.matriculas[with(total.matriculas,order(NOME_MUNICIPIO)),]

IFDM = IFDM[order(IFDM$Cidade),]
receita = receita[order(receita$Muninipio), ]
#FPM = FPM[order(FPM$Nome.do.Munic�???pio),]



#Merge dos atributos
#data = cbind(total.matriculas,IFDM$IFDM, FPM$Coeficiente)
data = cbind(total.matriculas,IFDM$IFDM)#, receita$Valor)
data$receita = NA

for(i in 1:nrow(data)){
  nome = as.character(data$NOME_MUNICIPIO[i])
  print(nome)
  if(nrow(receita[receita$Muninipio == nome,]) > 0){
    data[i,12] = gsub(",","",receita[receita$Muninipio == nome, ]$Valor)
  }
}

#colnames(data)[10:12] = c("numero.matriculas", "IFDM", "FPM") 
colnames(data)[10:12] = c("numero.matriculas", "IFDM", "receita") 

#Salvando informações agregadas
write.csv(data,"numero.matriculas_IFDM_e_receita_agregados.csv",row.names=F, dec = ".")






