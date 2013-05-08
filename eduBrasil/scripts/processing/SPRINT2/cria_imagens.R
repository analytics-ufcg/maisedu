args = commandArgs(trailingOnly = TRUE)
print(args)

options(stringsAsFactors = FALSE)

#TODO: captura o diretorio corrente e inclui no nome do arquivo

#Leitura de arquivos - formato windows
#desvios = read.csv("C:\Users\Rodolfo\Documents\GitHub\eduBrasil\eduBrasil\scripts\processing\mainScreen\mainScreen\tabela_com_todos_os_indicadores_selecionados_e_desvios.csv",fileEncoding="latin1")
#regioes = read.csv("C:\Users\Rodolfo\Documents\GitHub\eduBrasil\eduBrasil\scripts\processing\mainScreen\mainScreen\medianas_para_todos_os_indicadores_agrupados_por_ano_e_regiao.csv",fileEncoding="latin1")
#desvios = read.csv("C:/Users/Iara/Documents/GitHub/eduBrasil/eduBrasil/scripts/processing/SPRINT2/tabela_com_todos_os_indicadores_selecionados_e_desvios.csv",fileEncoding="latin1")
#regioes = read.csv("C:/Users/Iara/Documents/GitHub/eduBrasil/eduBrasil/scripts/processing/SPRINT2/medianas_para_todos_os_indicadores_agrupados_por_ano_e_regiao.csv",fileEncoding="latin1")

                    
#leitura de arquivos - formato linux
desvios = read.csv("C:/Users/Henrique/Desktop/eduBrasil/eduBrasil/scripts/processing/SPRINT2/tabela_com_todos_os_indicadores_selecionados_e_desvios.csv",fileEncoding="latin1")
regioes = read.csv("C:/Users/Henrique/Desktop/eduBrasil/eduBrasil/scripts/processing/SPRINT2/medianas_para_todos_os_indicadores_agrupados_por_ano_e_regiao.csv",fileEncoding="latin1")


#codigo = "Cabedelo"
codigo = paste(args,collapse=" ")
ano = 2011

linha = desvios[desvios$NOME_MUNICIPIO==codigo & desvios$ANO==ano,]


criaImagem = function(valor,indicador,codigo,dp,nomeIndicador){

	#path = "C:/Users/Iara/Documents/GitHub/eduBrasil/eduBrasil/scripts/processing/SPRINT2/graphs/"
	path = "C:/Users/Henrique/Desktop/eduBrasil/eduBrasil/scripts/processing/SPRINT2/graphs/"  
	#path = "/home/isa/git/eduBrasil/eduBrasil/scripts/processing/SPRINT2/"

	desv = dp

	if(dp < 0){
 		dp = dp*(-1)
	}
	png(paste(path ,codigo,"_",indicador,"_",desv,".png", sep=""),width = 382, height = 291)
	barplot(valor[1], xlim=c(-0.5,2), ylim=c(0,max(valor)+dp), axes=T, main=nomeIndicador)
	abline(valor[2],0,col="green",lty=2) # MICRO
	abline(valor[3],0,col="red",lty=4) # MESO
	abline(valor[4],0,col="blue",lty=5) # ESTADO
	#legend("bottomright", inset=.05, c("Micro","Meso","Estado"), col = c("green","red","blue"),lty = c(2,4,5), horiz=F)
	dev.off()
}

dicionario = data.frame(key = c(
"INDICADOR_62", "INDICADOR_89", "INDICADOR_90", "INDICADOR_329", "INDICADOR_333", "INDICADOR_73", "INDICADOR_74", "INDICADOR_80", "INDICADOR_81","INDICADOR_176", "INDICADOR_177", "INDICADOR_202", "INDICADOR_184", "INDICADOR_7", "INDICADOR_201"), 
indicador = c("Part. despesa e encargos educação(%)", "IDEB - 5º ano do ensino fundamental", "IDEB - 9º ano do ensino fundamental", 
"Taxa de analfabetismo", "Taxa de atendimento escolar", "Taxa abandono total - fundamental(%)", "Taxa de abandono - ensino médio(%)",
"Taxa aprovação total - fundamental(%)", "Taxa de aprovação - ensino médio (%)", "Percentual docentes formação superior(%)", 
"Percentual de docentes temporários", "Índice precariedade infraestrutura", "Razão aluno por docente", "Despesa educação aluno", "Índice eficiência educação básica"))

nomeIndicador = function(indicador){
	dicionario[dicionario$key==indicador,]$indicador
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
		criaImagem(valor,colnames(desvios)[i],codigo,valorDesvio,nomeIndicador(colnames(desvios)[i]))
	}

}




