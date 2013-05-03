args = commandArgs(trailingOnly = TRUE)
print(args)

options(stringsAsFactors = FALSE)

#TODO: captura o diretorio corrente e inclui no nome do arquivo

#Leitura de arquivos
#desvios = read.csv("C:\Users\Rodolfo\Documents\GitHub\eduBrasil\eduBrasil\scripts\processing\mainScreen\mainScreen\tabela_com_todos_os_indicadores_selecionados_e_desvios.csv",fileEncoding="latin1")
#regioes = read.csv("C:\Users\Rodolfo\Documents\GitHub\eduBrasil\eduBrasil\scripts\processing\mainScreen\mainScreen\medianas_para_todos_os_indicadores_agrupados_por_ano_e_regiao.csv",fileEncoding="latin1")
#desvios = read.csv("C:/Users/Rodolfo/Documents/GitHub/eduBrasil/eduBrasil/scripts/processing/mainScreen/mainScreen/tabela_com_todos_os_indicadores_selecionados_e_desvios.csv",fileEncoding="latin1")
#regioes = read.csv("C:/Users/Rodolfo/Documents/GitHub/eduBrasil/eduBrasil/scripts/processing/mainScreen/mainScreen/medianas_para_todos_os_indicadores_agrupados_por_ano_e_regiao.csv",fileEncoding="latin1")

desvios = read.csv("tabela_com_todos_os_indicadores_selecionados_e_desvios.csv",fileEncoding="latin1")
regioes = read.csv("medianas_para_todos_os_indicadores_agrupados_por_ano_e_regiao.csv",fileEncoding="latin1")


#codigo = "Cabedelo"
codigo = paste(args,collapse=" ")
ano = 2011

linha = desvios[desvios$NOME_MUNICIPIO==codigo & desvios$ANO==ano,]


criaImagem = function(valor,indicador,codigo,dp){

	#path = "C:/Users/Rodolfo/Documents/GitHub/eduBrasil/eduBrasil/scripts/processing/mainScreen/mainScreen/Graficos/"
	path = "/home/isa/sketchbook/us6/graphs/"

	desv = dp

	if(dp < 0){
 		dp = dp*(-1)
	}
	png(paste(path ,codigo,"_",indicador,"_",desv,".png", sep=""),width = 382, height = 291)
	barplot(valor[1], xlim=c(-0.5,2), ylim=c(0,max(valor)+dp), axes=T)
	abline(valor[2],0,col="green",lty=2) # MICRO
	abline(valor[3],0,col="red",lty=4) # MESO
	abline(valor[4],0,col="blue",lty=5) # ESTADO
	#legend("bottomright", inset=.05, c("Micro","Meso","Estado"), col = c("green","red","blue"),lty = c(2,4,5), horiz=F)
	dev.off()
}


for(i in seq(11, ncol(linha), 2)){

	valorIndicador = linha[,i]
	valorDesvio = linha[,i+1]
	
	valor = c()
	micro = regioes[regioes$REGIAO==linha[,9] & regioes$ANO==ano,colnames(desvios)[i]]
	meso = regioes[regioes$REGIAO==linha[,7] & regioes$ANO==ano,colnames(desvios)[i]]
	estado = regioes[regioes$REGIAO==linha[,3] & regioes$ANO==ano,colnames(desvios)[i]]
	valor = c(valorIndicador,micro,meso,estado)	
	
	if(!is.na(valorIndicador)){
		print(valorDesvio)
		criaImagem(valor,colnames(desvios)[i],codigo,valorDesvio)
	}

}




