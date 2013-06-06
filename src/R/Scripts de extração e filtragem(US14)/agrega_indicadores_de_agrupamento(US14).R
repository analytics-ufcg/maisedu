#Script que carrega arquivos de indicadores necessários para o agrupamento da US14 e salva todos agregados em um unico arquivo
#São necessarios os arquivos que estão na pasta Indicadores Selecionados/5 - Indicadores para Análises de Grupos/

require("gdata")

#Caminho do interpretedor perl(arquivos xls precisam dessa lib(gdata))
perl.path = "C:/ProgramFiles/strawberry/perl/bin/perl"

#Carrega arquivos necessártios
total.matriculas = read.xls("INDICADOR_219 - Total Matrículas.xls",perl=perl.path)
IFDM = read.xls("IFDM_2010_Paraiba.xls",perl=perl.path)[,]
FPM = read.xls("tabela de municípios com coeficiente FPM e cod IBGE.xls",perl=perl.path)


#Selecionando colunas e linhas necessárias e ordenando
total.matriculas = total.matriculas[total.matriculas$ANO==2011,]
total.matriculas = total.matriculas[with(total.matriculas,order(NOME_MUNICIPIO)),]

IFDM = IFDM[order(IFDM$Cidade),]
FPM = FPM[order(FPM$Nome.do.Município),]


#Merge dos atributos
data = cbind(total.matriculas,IFDM$IFDM, FPM$Coeficiente)

colnames(data)[10:12] = c("numero.matriculas", "IFDM", "FPM") 


#Salvando informações agregadas
write.csv(data,"numero.matriculas_IFDM_e_FPM_agregados.csv",row.names=F)






