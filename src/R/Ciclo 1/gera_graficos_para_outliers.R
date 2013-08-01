require("gdata")

#data
perl.path = "C:/ProgramFiles/strawberry/perl/bin/perl"

data = read.xls(xls="INDICADOR_333 - Taxa de atendimento escolar para pessoas entre 4 e 17 anos de idade (%).xls",perl=perl.path)

summary(data$INDICADOR_329)

data = na.omit(data)


anos = sort(unique(data$ANO),decreasing=T)

data.1 = subset(data, data$ANO == anos[1])

data.2 = subset(data, data$ANO == anos[2])

data.3 = subset(data, data$ANO == anos[3])

#atribuindo uma variavel
data.1.indicador = data.1$INDICADOR_333

data.2.indicador = data.2$INDICADOR_333

data.3.indicador = data.3$INDICADOR_333

#numero do indicador
indicador = "4b"
nome = "Taxa de atendimento escolar para pessoas entre 4 e 17 anos de idade"
unidade = "Percentagem"

###################################################################################################################################

#gráficos

pdf(paste("Gráficos Indicador ", indicador,".pdf", sep=""), width = 20, height = 7)
par(mfrow=c(1,3))

#histogramas
hist(data.1.indicador, main=paste("Histograma", nome, anos[1]), xlab=unidade)
abline(v = mean(data.1.indicador), col=2, lty=2, lwd=2)
abline(v = median(data.1.indicador), col=3, lty=3, lwd=2)
ex12 = expression(Media, Mediana)
utils::str(legend("topright", ex12, col = 2:4, lty=2:4,lwd=2))

hist(data.2.indicador, main=paste("Histograma", nome, anos[2]), xlab=unidade)
abline(v = mean(data.2.indicador), col=2, lty=2, lwd=2)
abline(v = median(data.2.indicador), col=3, lty=3, lwd=2)
ex12 = expression(Media, Mediana)
utils::str(legend("topright", ex12, col = 2:4, lty=2:4,lwd=2))

hist(data.3.indicador, main=paste("Histograma", nome, anos[3]), xlab=unidade)
abline(v = mean(data.3.indicador), col=2, lty=2, lwd=2)
abline(v = median(data.3.indicador), col=3, lty=3, lwd=2)
ex12 = expression(Media, Mediana)
utils::str(legend("topright", ex12, col = 2:4, lty=2:4,lwd=2))

#densidades
plot(density(data.1.indicador), main=paste("Distribuição", nome, anos[1]))

plot(density(data.2.indicador), main=paste("Distribuição", nome, anos[2]))

plot(density(data.3.indicador), main=paste("Distribuição", nome, anos[3]))

#boxplot
boxplot(data.1.indicador, main=paste("Boxplot", nome, anos[1]))

boxplot(data.2.indicador, main=paste("Boxplot", nome, anos[2]))

boxplot(data.3.indicador, main=paste("Boxplot", nome, anos[3]))

dev.off()

###################################################################################################################################

#taxas

media = c()
mediana = c()
desvio = c()
covariancia = c()

#2011
#media
media[1] = mean(data.1.indicador)

#mediana
mediana[1] = median(data.1.indicador)

#desvio padrão
desvio[1] = sd(data.1.indicador)

#covariancia
covariancia[1] = sd(data.1.indicador)/mean(data.1.indicador)

###################################################################################################################################

#2010
#media
media[2] = mean(data.2.indicador)

#mediana
mediana[2] = median(data.2.indicador)

#desvio padrão
desvio[2] = sd(data.2.indicador)

#covariancia
covariancia[2] = sd(data.2.indicador)/mean(data.2.indicador)

###################################################################################################################################

#2009
#media
media[3] = mean(data.3.indicador)

#mediana
mediana[3] = median(data.3.indicador)

#desvio padrão
desvio[3] = sd(data.3.indicador)

#covariancia
covariancia[3] = sd(data.3.indicador)/mean(data.3.indicador)

###################################################################################################################################

#graficos

pdf(paste("Taxas Indicador ", indicador, ".pdf", sep=""), width = 15, height = 15)
par(mfrow=c(2,2))

#media
barplot(media, names.arg=c(anos[1],anos[2],anos[3]), main="Média")

#mediana
barplot(mediana, names.arg=c(anos[1],anos[2],anos[3]), main="Mediana")

#desvio
barplot(desvio, names.arg=c(anos[1],anos[2],anos[3]), main="Desvio Padrão")

#mediana
barplot(covariancia, names.arg=c(anos[1],anos[2],anos[3]), main="Covariancia")

dev.off()

rm(list=ls())
###################################################################################################################################