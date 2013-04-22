data = read.csv("tabela_com_todos_os_indicadores_selecionados_e_outliers.csv", header = T)

data2011 <- subset(data, ANO == 2011)

municipios <- unique(data$NOME_MUNICIPIO)

outliers <- data.frame(data2011$NOME_MUNICIPIO,data2011$OUTLIER_INDICADOR_329,data2011$OUTLIER_INDICADOR_62,data2011$OUTLIER_INDICADOR_89,data2011$OUTLIER_INDICADOR_90,data2011$OUTLIER_INDICADOR_333,
           data2011$OUTLIER_INDICADOR_73,data2011$OUTLIER_INDICADOR_74,data2011$OUTLIER_INDICADOR_80,data2011$OUTLIER_INDICADOR_81,data2011$OUTLIER_INDICADOR_176,data2011$OUTLIER_INDICADOR_202,
           data2011$OUTLIER_INDICADOR_184,data2011$OUTLIER_INDICADOR_7,data2011$OUTLIER_INDICADOR_201)
colnames(outliers) = c("NOME","INDICADOR_329","INDICADOR_62","INDICADOR_89","INDICADOR_90","INDICADOR_333", "INDICADOR_73",  "INDICADOR_74" ,
                       "INDICADOR_80",  "INDICADOR_81",  "INDICADOR_176", "INDICADOR_202","INDICADOR_184", "INDICADOR_7", "INDICADOR_201")

outliers$sum = 0

for(i in 1:(nrow(data2011))){
  outliers[i,16] = sum(abs(outliers[i,2:15]), na.rm = T)
}


rowSums(outliers ==-1 & ! is.na(outliers))
outliers[rowSums(outliers ==-1 & ! is.na(outliers)) > 0,]
