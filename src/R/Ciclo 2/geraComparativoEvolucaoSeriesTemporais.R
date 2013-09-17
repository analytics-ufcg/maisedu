sum.diff = function(indicador){
  indicador = as.vector(na.omit(indicador))
  return(sum(diff(indicador)))
}

mean.diff = function(indicador){
  indicador = as.vector(na.omit(indicador))
  return(mean(diff(indicador)))
}

median.diff = function(indicador){
  indicador = as.vector(na.omit(indicador))
  return(median(diff(indicador)))
}

sd.diff = function(indicador){
  indicador = as.vector(na.omit(indicador))
  return(sd(diff(indicador)))
}


mediana=read.csv('medianas_para_todos_os_indicadores_agrupados_por_ano_e_regiao.csv')


output = levels(mediana$REGIAO)


for (i in 3:(ncol(mediana))) {
  aux = aggregate(mediana[i],list(mediana$REGIAO),FUN=mean.diff)[2]
  colnames(aux) = colnames(mediana)[i]
  output = cbind(output, aux)
}

output.sd = levels(mediana$REGIAO)

for (i in 3:(ncol(mediana))) {
  aux.sd = aggregate(mediana[i],list(mediana$REGIAO),FUN=sd.diff)[2]
  colnames(aux.sd) = colnames(mediana)[i]
  output.sd = cbind(output.sd, aux.sd)
}


tabela.grande = read.csv("tabela_com_todos_os_indicadores_selecionados_e_desvios.csv")
tabela = tabela.grande[, c(4, seq(10, 38, 2))]

agregado = levels(factor(tabela$ANO))

calcula.medianas.pb.por.ano = function(df) {
  for(i in 2:(ncol(df))) {
    agregado = cbind(agregado, with(df, aggregate(as.numeric(df[, i]), 
                                                  list(df[, 1]), FUN=median, na.rm=T)[2]))
  }
  colnames(agregado) = names(tabela)
  return(agregado)
}

medianas.anuais.pb = calcula.medianas.pb.por.ano(tabela)

indicadores = names(medianas.anuais.pb[, 2:(ncol(medianas.anuais.pb))])

diff.mean.pb = function(df) {
  valores = c()
  for(i in 2:(ncol(df))) {
    valores[i - 1] = mean.diff(df[, i])
  }
  valores = t(valores)
  colnames(valores) = indicadores
  return(as.data.frame(valores))
}

diff.sd.pb = function(df) {
  valores = c()
  for(i in 2:(ncol(df))) {
    valores[i - 1] = sd.diff(df[, i])
  }
  valores = t(valores)
  colnames(valores) = indicadores
  return(as.data.frame(valores))
}

pb = diff.mean.pb(df=medianas.anuais.pb)
pb = rbind(pb, diff.sd.pb(medianas.anuais.pb))
rownames(pb) = c("media", "sd")

meso = output[which(output$output %in% levels(tabela.grande$NOME_MESO)), ]
micro = output[which(!(output$output %in% levels(tabela.grande$NOME_MESO))), ]

meso.sd = output.sd[which(output.sd$output.sd %in% levels(tabela.grande$NOME_MESO)), ]
micro.sd = output.sd[which(!(output.sd$output.sd %in% levels(tabela.grande$NOME_MESO))), ]


agrega.por.cidade = function(df) {
  tab = df[, c(9, seq(10, 38, 2))]
  agrega = levels(tab[, 1])
  for(i in 2:(ncol(tab))) {
    agrega = cbind(agrega, 
                   with(tab, aggregate(tab[i], list(tab[, 1]), mean.diff)[2]))
  }
  colnames(agrega) = c("NOME_MUNICIPIO", names(agrega[, 2:(ncol(agrega))]))
  return(agrega)
}

municipios = agrega.por.cidade(tabela.grande)

dic = read.csv("dicionario.csv")[, c(1, 4)]

compara.media.pb = function(df1, df2) {
  saida = c()
  for(i in 2:(ncol(df1))) {
    media.pb.comparada = c()
    for(j in 1:(nrow(df1))) {
      if(dic[which(dic$id == names(municipios)[i]), 2] == "melhor") {
        if(is.na(df1[j, i]) || is.na(df2[1, names(municipios)[i]]) ||
             is.na(df2[2, names(municipios)[i]])) {
          media.pb.comparada[j] = 0
        }
        else if(df1[j, i] < (df2[1, names(municipios)[i]] - 
                               df2[2, names(municipios)[i]]) &&
                  df1[j, i] >= (df2[1, names(municipios)[i]] - 
                                 2*df2[2, names(municipios)[i]])) {
          media.pb.comparada[j] = 1
        } else if(df1[j, i] < (df2[1, names(municipios)[i]] - 
                                 2*df2[2, names(municipios)[i]]) &&
                    df1[j, i] >= (df2[1, names(municipios)[i]] - 
                                    3*df2[2, names(municipios)[i]])) {
          media.pb.comparada[j] = 2
        } else if(df1[j, i] < (df2[1, names(municipios)[i]] - 
                                 3*df2[2, names(municipios)[i]])) {
          media.pb.comparada[j] = 3
        } else {
          media.pb.comparada[j] = 0
        }  
      } else {
        if(is.na(df1[j, i]) || is.na(df2[1, names(municipios)[i]]) ||
             is.na(df2[2, names(municipios)[i]])) {
          media.pb.comparada[j] = 0
        }
        else if(df1[j, i] > (df2[1, names(municipios)[i]] + 
                               df2[2, names(municipios)[i]]) &&
                  df1[j, i] <= (df2[1, names(municipios)[i]] - 
                                  2*df2[2, names(municipios)[i]])) {
          media.pb.comparada[j] = 1
        } else if(df1[j, i] > (df2[1, names(municipios)[i]] + 
                                2*df2[2, names(municipios)[i]]) &&
                    df1[j, i] <= (df2[1, names(municipios)[i]] - 
                                    3*df2[2, names(municipios)[i]])) {
          media.pb.comparada[j] = 2
        } else if(df1[j, i] > (df2[1, names(municipios)[i]] + 
                                 3*df2[2, names(municipios)[i]])) {
          media.pb.comparada[j] = 3
        } else {
          media.pb.comparada[j] = 0
        } 
      }
    }
    saida = cbind(saida, media.pb.comparada)
  }
  saida = cbind(levels(municipios$NOME_MUNICIPIO), saida)
  colnames(saida) = names(df1)
  return(saida)
}

comparacoes.pb = as.data.frame(compara.media.pb(municipios, pb))

cidades.por.meso.micro = tabela.grande[order(tabela.grande$NOME_MUNICIPIO,
                                       decreasing = F), ][, c(6, 8, 9)]
cidades.por.meso.micro = cidades.por.meso.micro[!duplicated(cidades.por.meso.micro), ]

cidades.por.meso.micro = cbind(cidades.por.meso.micro, 
          municipios[which(cidades.por.meso.micro$NOME_MUNICIPIO %in% municipios$NOME_MUNICIPIO), 
                                             2:(ncol(municipios))])
cidades.por.meso.micro = cidades.por.meso.micro[order(cidades.por.meso.micro$NOME_MESO,
                                                      cidades.por.meso.micro$NOME_MICRO,
                                                      cidades.por.meso.micro$NOME_MUNICIPIO), ]

compara.meso.ou.micro = function(df1, df2, df3, micro.or.meso.col) {
  out = c()
  for(i in 4:(ncol(df1))) {
    media.comparada = c()
    for(j in 1:(nrow(df1))) {
      valor.meso = df2[which(df1[j, micro.or.meso.col] %in% df2$output),
                        names(df1)[i]]
      valor.sd = df3[which(df1[j, micro.or.meso.col] %in% df3$output.sd),
                       names(df1)[i]]
      if(dic[which(dic$id == names(df1)[i]), 2] == "melhor") {
        if(is.na(df1[j, i]) || is.na(valor.meso) || is.na(valor.sd)) {
          media.comparada[j] = 0
        }
        else if(df1[j, i] < (valor.meso - valor.sd) && df[j, i] >= (valor.meso - 2*valor.sd)) {
          media.comparada[j] = 1
        } else if(df1[j, i] < (valor.meso - 2*valor.sd) && df[j, i] >= (valor.meso - 3*valor.sd)) {
          media.comparada[j] = 2
        } else if(df1[j, i] < (valor.meso - 3*valor.sd)) {
          media.comparada[j] = 3
        } else {
          media.comparada[j] = 0
        }
      } else {
        if(is.na(df1[j, i]) || is.na(valor.meso) || is.na(valor.sd)) {
          media.comparada[j] = 0
        }
        else if(df1[j, i] > (valor.meso + valor.sd) && df[j, i] <= (valor.meso - 2*valor.sd)) {
          media.comparada[j] = 1
        } else if(df1[j, i] > (valor.meso + 2*valor.sd) && df[j, i]  <= (valor.meso - 3*valor.sd)) {
          media.comparada[j] = 2
        } else if(df1[j, i] > (valor.meso + 3*valor.sd)) {
          media.comparada[j] = 3
        } else {
          media.comparada[j] = 0
        }
      }
    }
    out = cbind(out, media.comparada)
  }
  out = cbind(as.character(df1[, 3]), out)
  colnames(out) = names(df1[, 3:(ncol(df1))])
  return(out)
}

comparacoes.meso = as.data.frame(compara.meso.ou.micro(cidades.por.meso.micro, meso, meso.sd, 1))
comparacoes.micro = as.data.frame(compara.meso.ou.micro(cidades.por.meso.micro, micro, micro.sd, 2))

comparacoes.meso = comparacoes.meso[order(comparacoes.meso$NOME_MUNICIPIO,
                                          decreasing=F), ]
comparacoes.micro = comparacoes.micro[order(comparacoes.micro$NOME_MUNICIPIO,
                                          decreasing=F), ]
comparacoes.pb = comparacoes.pb[order(comparacoes.pb$NOME_MUNICIPIO,
                                      decreasing=F), ]

soma.todas.comparacoes = function() {
  somado = c()
  for(i in 2:(ncol(comparacoes.meso))) {    
    soma = as.vector(as.numeric(as.character(comparacoes.meso[, i])) + 
                       as.numeric(as.character(comparacoes.micro[, i])) + 
                       as.numeric(as.character(comparacoes.pb[, i])))
    somado = cbind(somado, soma)
  }
  somado = cbind(as.character(comparacoes.meso[, 1]), somado)
  colnames(somado) = names(comparacoes.meso)
  return(somado)
}

comparacoes.finais = soma.todas.comparacoes()

write.csv(file="serie_temporal.csv", comparacoes.finais, row.names=F)