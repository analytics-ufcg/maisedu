#Script que sumariza os dados dos indicadores de acordo com a regiao.
#A medida de sumarizacao utilizada foi a media e alguns anos nao apresentam todos os dados, nesse caso ficam com valor NA
#As colunas do data frame final ficam da forma:
# ANO MESOREGIAO MICROREGIAO MEDIA_ESTADO MEDIA_MICRO NOME_INDICADOR  
#Versao 1.0 - Iara Ribeiro (12 de abril de 2013)

#caminho padrao da pasta do git
setwd("~/eduBrasil/data")
require("gdata")
require("plyr")

#eh necessario o perl pra executar o script, substituir o caminho pra que o script funcione
perl.path = "C:/strawberry/perl/bin/perl"

#lendo os arquivos com os indicadores 

part_despesa_pessoal_encargos_sociais<- na.omit(read.xls(xls = "INDICADOR_62 - Participação da despesa com pessoal e encargos sociais na função educação (%).xls", perl=perl.path))
ideb_ano5_ens_fund<- na.omit(read.xls(xls = "INDICADOR_89 - IDEB - 5º ano do ensino fundamental.xls", perl=perl.path))
ideb_ano9_ens_fund<- na.omit(read.xls(xls = "INDICADOR_90 - IDEB - 9º ano do ensino fundamental.xls", perl=perl.path))
taxa_analfabetismo_maiores_idade<- na.omit(read.xls(xls = "INDICADOR_329 - Taxa de analfabetismo para pessoas com 18 anos de idade ou mais (%).xls", perl=perl.path))
taxa_atendimento_escolar_4_17_anos<- na.omit(read.xls(xls = "INDICADOR_333 - Taxa de atendimento escolar para pessoas entre 4 e 17 anos de idade (%).xls", perl=perl.path))
taxa_abandono_total_ens_fund<- na.omit(read.xls(xls = "INDICADOR_73 - Taxa de abandono total - ensino fundamental (%).xls", perl=perl.path))
taxa_abandono_total_ens_medio<- na.omit(read.xls(xls = "INDICADOR_74 - Taxa de abandono - ensino médio (%).xls", perl=perl.path))
taxa_aprov_total_ens_fund<- na.omit(read.xls(xls = "INDICADOR_80 - Taxa de aprovação total - ensino fundamental (%).xls", perl=perl.path))
taxa_aprov_total_ens_medio<- na.omit(read.xls(xls = "INDICADOR_81 - Taxa de aprovação - ensino médio (%).xls", perl=perl.path))
percentual_docentes_formacao_superior <- na.omit(read.xls(xls="INDICADOR_176 - Percentual de docentes com formação superior (%).xls", perl=perl.path))
percentual_docentes_temp_contr_indefinidos <- na.omit(read.xls(xls = "INDICADOR_177 - Percentual de docentes temporários e de contratos indefinidos (%).xls", perl=perl.path)) 
indice_precariedade_infraestrutura <- na.omit(read.xls(xls = "INDICADOR_202 - Índice de precariedade de infraestrutura.xls", perl=perl.path))
razao_aluno_docente<- na.omit(read.xls(xls = "INDICADOR_184 - Razão aluno por docente.xls", perl=perl.path))
despesa_educacao_aluno<- na.omit(read.xls(xls = "INDICADOR_7 - Despesa corrente na função educação por aluno (em reais de 2011).xls", perl=perl.path))
eficiencia_edu_basica<- na.omit(read.xls(xls = "INDICADOR_201 - Índice de eficiência da educação básica.xls", perl=perl.path))

#calculo media do indicador por estado

part_despesa_pessoal_encargos_sociais$MEDIA_ESTADO <- mean(part_despesa_pessoal_encargos_sociais$INDICADOR_62)
ideb_ano5_ens_fund$MEDIA_ESTADO <- mean(ideb_ano5_ens_fund$INDICADOR_89)
ideb_ano9_ens_fund$MEDIA_ESTADO <- mean(ideb_ano9_ens_fund$INDICADOR_90)
taxa_analfabetismo_maiores_idade$MEDIA_ESTADO <- mean(taxa_analfabetismo_maiores_idade$INDICADOR_329)
taxa_atendimento_escolar_4_17_anos$MEDIA_ESTADO <- mean(taxa_atendimento_escolar_4_17_anos$INDICADOR_333)
taxa_abandono_total_ens_fund$MEDIA_ESTADO <- mean(taxa_abandono_total_ens_fund$INDICADOR_73)
taxa_abandono_total_ens_medio$MEDIA_ESTADO <- mean(taxa_abandono_total_ens_medio$INDICADOR_74)
taxa_aprov_total_ens_fund$MEDIA_ESTADO <- mean(taxa_aprov_total_ens_fund$INDICADOR_80)
taxa_aprov_total_ens_medio$MEDIA_ESTADO <- mean(taxa_aprov_total_ens_medio$INDICADOR_81)
percentual_docentes_formacao_superior$MEDIA_ESTADO <- mean(percentual_docentes_formacao_superior$INDICADOR_176)
percentual_docentes_temp_contr_indefinidos$MEDIA_ESTADO <- mean(percentual_docentes_temp_contr_indefinidos$INDICADOR_177)
indice_precariedade_infraestrutura$MEDIA_ESTADO <- mean(indice_precariedade_infraestrutura$INDICADOR_202)
razao_aluno_docente$MEDIA_ESTADO <- mean(razao_aluno_docente$INDICADOR_184)
despesa_educacao_aluno$MEDIA_ESTADO <- mean(despesa_educacao_aluno$INDICADOR_7)
eficiencia_edu_basica$MEDIA_ESTADO <- mean(eficiencia_edu_basica$INDICADOR_201)


#aggregando os valores pela Meso e micro regiao
part_despesa_pessoal_encargos_sociais <- ddply( part_despesa_pessoal_encargos_sociais, .(ANO,NOME_MESO,NOME_MICRO,MEDIA_ESTADO), summarize, MEDIA_MICRO = mean(INDICADOR_62))
ideb_ano5_ens_fund <- ddply( ideb_ano5_ens_fund, .(ANO,NOME_MESO,NOME_MICRO,MEDIA_ESTADO), summarize, MEDIA_MICRO = mean(INDICADOR_89))
ideb_ano9_ens_fund <- ddply( ideb_ano9_ens_fund, .(ANO,NOME_MESO,NOME_MICRO,MEDIA_ESTADO), summarize, MEDIA_MICRO = mean(INDICADOR_90))
taxa_analfabetismo_maiores_idade <- ddply(taxa_analfabetismo_maiores_idade , .(ANO,NOME_MESO,NOME_MICRO,MEDIA_ESTADO), summarize, MEDIA_MICRO = mean(INDICADOR_329))
taxa_atendimento_escolar_4_17_anos <- ddply(taxa_atendimento_escolar_4_17_anos , .(ANO,NOME_MESO,NOME_MICRO,MEDIA_ESTADO), summarize, MEDIA_MICRO = mean(INDICADOR_333))
taxa_abandono_total_ens_fund <- ddply( taxa_abandono_total_ens_fund, .(ANO,NOME_MESO,NOME_MICRO,MEDIA_ESTADO), summarize, MEDIA_MICRO = mean(INDICADOR_73))
taxa_abandono_total_ens_medio <- ddply( taxa_abandono_total_ens_medio, .(ANO,NOME_MESO,NOME_MICRO,MEDIA_ESTADO), summarize, MEDIA_MICRO = mean(INDICADOR_74))
taxa_aprov_total_ens_fund <- ddply( taxa_aprov_total_ens_fund, .(ANO,NOME_MESO,NOME_MICRO,MEDIA_ESTADO), summarize, MEDIA_MICRO = mean(INDICADOR_80))
taxa_aprov_total_ens_medio <- ddply( taxa_aprov_total_ens_medio, .(ANO,NOME_MESO,NOME_MICRO,MEDIA_ESTADO), summarize, MEDIA_MICRO = mean(INDICADOR_81))
percentual_docentes_formacao_superior <- ddply(percentual_docentes_formacao_superior, .(ANO,NOME_MESO,NOME_MICRO,MEDIA_ESTADO), summarize, MEDIA_MICRO = mean(INDICADOR_176))
percentual_docentes_temp_contr_indefinidos <- ddply(percentual_docentes_temp_contr_indefinidos, .(ANO,NOME_MESO,NOME_MICRO,MEDIA_ESTADO), summarize, MEDIA_MICRO = mean(INDICADOR_177))
indice_precariedade_infraestrutura <- ddply(indice_precariedade_infraestrutura , .(ANO,NOME_MESO,NOME_MICRO,MEDIA_ESTADO), summarize, MEDIA_MICRO = mean(INDICADOR_202))
razao_aluno_docente <- ddply(razao_aluno_docente, .(ANO,NOME_MESO,NOME_MICRO,MEDIA_ESTADO), summarize, MEDIA_MICRO = mean(INDICADOR_184))
despesa_educacao_aluno <- ddply( despesa_educacao_aluno , .(ANO,NOME_MESO,NOME_MICRO,MEDIA_ESTADO), summarize, MEDIA_MICRO = mean(INDICADOR_7))
eficiencia_edu_basica <- ddply( eficiencia_edu_basica , .(ANO,NOME_MESO,NOME_MICRO,MEDIA_ESTADO), summarize, MEDIA_MICRO = mean(INDICADOR_201))

#nomeando os indicadores
part_despesa_pessoal_encargos_sociais$indicador <- "INDICADOR_62"
ideb_ano5_ens_fund$indicador <- "INDICADOR_89"
ideb_ano9_ens_fund$indicador <- "INDICADOR_90"  
taxa_analfabetismo_maiores_idade$indicador <- "INDICADOR_329"
taxa_atendimento_escolar_4_17_anos$indicador <- "INDICADOR_333"
taxa_abandono_total_ens_fund$indicador <- "INDICADOR_73"
taxa_abandono_total_ens_medio$indicador <- "INDICADOR_74"
taxa_aprov_total_ens_fund$indicador <- "INDICADOR_80"
taxa_aprov_total_ens_medio$indicador <- "INDICADOR_81"
percentual_docentes_formacao_superior$indicador <- "INDICADOR_176"
percentual_docentes_temp_contr_indefinidos$indicador <- "INDICADOR_177"
indice_precariedade_infraestrutura$indicador <- "INDICADOR_202"
razao_aluno_docente$indicador <- "INDICADOR_184"
despesa_educacao_aluno$indicador <- "INDICADOR_7"
eficiencia_edu_basica$indicador <- "INDICADOR_201"

indicadores <- rbind(part_despesa_pessoal_encargos_sociais,ideb_ano5_ens_fund,
                     ideb_ano9_ens_fund,taxa_analfabetismo_maiores_idade,
                     taxa_atendimento_escolar_4_17_anos,taxa_abandono_total_ens_fund,
                     taxa_abandono_total_ens_medio,taxa_aprov_total_ens_fund,
                     taxa_aprov_total_ens_medio,percentual_docentes_formacao_superior,
                     percentual_docentes_temp_contr_indefinidos,indice_precariedade_infraestrutura,
                     razao_aluno_docente,despesa_educacao_aluno,eficiencia_edu_basica)

write.csv(indicadores,"~/eduBrasil/data/indicadores_micro_meso_regiao.csv", head = T)