require("stats")

dados = read.csv("tabela_com_todos_os_indicadores_selecionados_e_outliers.csv")
dados = dados[, c(4, seq(10, 38, 2))]

ano.2000 = subset(dados, dados$ANO == 2000)
ano.2007 = subset(dados, dados$ANO == 2007)
ano.2008 = subset(dados, dados$ANO == 2008)
ano.2009 = subset(dados, dados$ANO == 2009)
ano.2010 = subset(dados, dados$ANO == 2010)
ano.2011 = subset(dados, dados$ANO == 2011)

#Retorna um vetor com as colunas do data.frame que possuem apenas NA's =========================================
na.cols = function(df) {
  nas = c()
  for(i in 2:ncol(df)){
    if(nrow(subset(df, is.na(df[, i]))) == 223) {
      nas = c(nas, i)
    }
  }
  return(nas)
}

#Chama a funcao na.cols selecionando apenas as colunas que nao =================================================
#possuem apenas NA's
ano.2000 = subset(ano.2000, select=-na.cols(ano.2000))
ano.2007 = subset(ano.2007, select=-na.cols(ano.2007))
ano.2008 = subset(ano.2008, select=-na.cols(ano.2008))
ano.2009 = subset(ano.2009, select=-na.cols(ano.2009))
ano.2010 = subset(ano.2010, select=-na.cols(ano.2010))
ano.2011 = subset(ano.2011, select=-na.cols(ano.2011))

#Retorna um vetor com os pvalores dos indicadores do data.frame ================================================
p.values = function(df) {
  valores = c()
  for(i in 2:ncol(df)) {
    valor = shapiro.test(df[, i])$p.value
    valores = c(valores, valor)
  }
  return(valores)
}

p.values(ano.2000)
p.values(ano.2007)
p.values(ano.2008)
p.values(ano.2009)
p.values(ano.2010)
p.values(ano.2011)

#Retorna os valores de tendencias centrais dos indicadores do data.frame =======================================
central.values = function(df, significance) {
  valores = c()
  for(i in 2:ncol(df)) {
    p.valor = shapiro.test(df[, i])$p.value
    if(p.valor < significance) {
      valores = c(valores, median(df[, i], na.rm=T))
    } else {
      valores = c(valores, mean(df[, i], na.rm=T))
    }
  }
  return(valores)
}

central.values(ano.2000, 0.05)
central.values(ano.2007, 0.05)
central.values(ano.2008, 0.05)
central.values(ano.2009, 0.05)
central.values(ano.2010, 0.05)
central.values(ano.2011, 0.05)

#Calcula o valor da correlacao entre todos os indicadores do data.frame ========================================
#baseando-se no metodo passado como argumento. spearman ou kendall =============================================
cor.values = function(df, metodo) {
  cor = c()
  indicadores = c()
  for(i in 2:(ncol(df) - 1)) {
    for(j in (i + 1):ncol(df)) {
      lines = intersect(which(!is.na(df[, i])),
                        which(!is.na(df[, j])))
      cor.value = round(cor.test(df[lines, i],
                                              df[lines, j],
                                              method=metodo)$estimate, 6)
      if(cor.value <= -0.5 || cor.value >= 0.5) {
        cor = c(cor, cor.value)
        indicadores = c(indicadores, paste(names(df)[i], 
                                           names(df)[j], sep=" & "))  
      }
    }
  }
  return(as.data.frame(cbind(indicadores, cor)))
}

sperman.2000 = cor.values(ano.2000, "spearman")
sperman.2007 = cor.values(ano.2007, "spearman")
sperman.2008 = cor.values(ano.2008, "spearman")
sperman.2009 = cor.values(ano.2009, "spearman")
sperman.2010 = cor.values(ano.2010, "spearman")
sperman.2011 = cor.values(ano.2011, "spearman")

kendall.2000 = cor.values(ano.2000, "kendall")
kendall.2007 = cor.values(ano.2007, "kendall")
kendall.2008 = cor.values(ano.2008, "kendall")
kendall.2009 = cor.values(ano.2009, "kendall")
kendall.2010 = cor.values(ano.2010, "kendall")
kendall.2011 = cor.values(ano.2011, "kendall")

#Cria imagnes .png com os plots dos indicadores do ano passado como argumento ==================================
plot.histograms = function(df, ano) {
  for(i in 2:ncol(df)) {
    png(paste(names(df)[i], ano, ".png"))
    hist(df[, i], main=paste(names(df)[i], ano, ""), las=1)
    dev.off()
  }  
}

plot.histograms(ano.2000, "2000")
plot.histograms(ano.2007, "2007")
plot.histograms(ano.2008, "2008")
plot.histograms(ano.2009, "2009")
plot.histograms(ano.2010, "2010")
plot.histograms(ano.2011, "2011")