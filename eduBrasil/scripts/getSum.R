data = read.csv("tabela_com_todos_os_indicadores_selecionados_e_outliers.csv", header = T)

data2011 <- subset(data, ANO == 2011)

municipios <- unique(data$NOME_MUNICIPIO)

outliers <- data.frame(data2011$NOME_MUNICIPIO,data2011$OUTLIER_INDICADOR_329,data2011$OUTLIER_INDICADOR_62,data2011$OUTLIER_INDICADOR_89,data2011$OUTLIER_INDICADOR_90,data2011$OUTLIER_INDICADOR_333,
           data2011$OUTLIER_INDICADOR_73,data2011$OUTLIER_INDICADOR_74,data2011$OUTLIER_INDICADOR_80,data2011$OUTLIER_INDICADOR_81,data2011$OUTLIER_INDICADOR_176,data2011$OUTLIER_INDICADOR_202,
           data2011$OUTLIER_INDICADOR_184,data2011$OUTLIER_INDICADOR_7,data2011$OUTLIER_INDICADOR_201)
colnames(outliers) = c("NOME","INDICADOR_329","INDICADOR_62","INDICADOR_89","INDICADOR_90","INDICADOR_333", "INDICADOR_73",  "INDICADOR_74" ,
                       "INDICADOR_80",  "INDICADOR_81",  "INDICADOR_176", "INDICADOR_202","INDICADOR_184", "INDICADOR_7", "INDICADOR_201")

data2011$sum = 0
outliers$sum = 0

for(i in 1:(nrow(data2011))){
  outliers[i,16] = sum(abs(outliers[i,2:15]), na.rm = T)
}

data2011$Outliers_Pos = NA
data2011$Outliers_Neg = NA

#rowSums(outliers ==-1 & ! is.na(outliers))

lista_outliers = outliers[rowSums(outliers ==-1 & ! is.na(outliers)) > 0,]

indicadores = colnames(outliers[2:15])

for(i in 1:nrow(lista_outliers)){
  outliers_positivos = ""
  outliers_negativos = ""
  
  for(j in 2:16){
    if(lista_outliers[i,j] == -1 & ! is.na(lista_outliers[i,j])){
      outliers_negativos <- paste(outliers_negativos, indicadores[j],sep = " ")
    }else if(lista_outliers[i,j] == 1 & ! is.na(lista_outliers[i,j])){
      outliers_positivos <- paste(outliers_positivos, indicadores[j],sep = " ")
    }
  }
  
  lista_outliers[i,17] = substring(outliers_negativos,2,nchar(outliers_negativos))
  lista_outliers[i,18] = substring(outliers_positivos,2,nchar(outliers_positivos))
}

data2011[is.element(data2011$NOME_MUNICIPIO, lista_outliers$NOME), ]$Outliers_Pos = lista_outliers$V18
data2011[is.element(data2011$NOME_MUNICIPIO, lista_outliers$NOME), ]$Outliers_Neg = lista_outliers$V17
data2011[is.element(data2011$NOME_MUNICIPIO, outliers$NOME), ]$sum = outliers$sum

write.csv(data2011, "lista_outliers_2011.csv", col.names = T)