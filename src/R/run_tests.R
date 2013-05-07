require('RUnit')

source('calcula_e_agrega_indicadores_e_desvios(US-8).R')
source('calcula_mediana_regioes_e_estado_para_todos_indicadores(US-8).R')

test.suite <- defineTestSuite("EduBrasil",
                              dirs = file.path("testes"),
                              testFileRegexp = '^\\d+\\.R')

test.result <- runTestSuite(test.suite)

printTextProtocol(test.result)