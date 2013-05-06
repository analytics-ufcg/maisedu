Repositorio no github: https://github.com/analyticsUfcg/eduBrasil
Diretorio dos arquivos da parte de processing: 
eduBrasil/eduBrasil/scripts/processing/SPRINT2/

Res: 1250x1000

Pré-requisitos: ter instalado R e Processing.

Para abrir o projeto com o Eclipse é necessário:

1. Importar o projeto do diretório do processing

2. Adicionar external JARs:
				controlP5
				processing core
				geomerative
                                ggplot2 
3. No diretorio eduBrasil/eduBrasil/scripts/processing/SPRINT2/
o arquivo "SPRINT2.pde" deve ter substituido as variaveis "path" e "path2" para o endereço do "Rscript.exe"
e nas mesmas variaveis reorganizar o path para acessar o script de criar imagens 
("cria_imagens.R" e "gera_imagens_series_temporais(US-7).R"), criar a pasta "graph" na pasta SPRINT2.

4. Modificar endereço das variaveis "folder", "indicador", "indicador2" para o endereço da pasta SPRINT2/graphs.

5. Modificar o trecho de codigo a seguir com o diretorio da pasta "graphs". System.setProperty("user.dir", endereço de graphs);

6. Modificar endereços nos scripts "gera_imagens_series_temporais(US-7).R" e "cria_imagens.R" apontando os arquivos em seus diretorios.

7. Rodar script "SPRINT2.pde".



Para abrir o projeto com o Processing é necessário:

Pré-requisitos:
libs:     
                                controlP5
				geomerative
                                ggplot2 

1. Acessar o repositorio.

2. Baixar o projeto eduBrasil.

3. No diretorio eduBrasil/eduBrasil/scripts/processing/SPRINT2/
o arquivo "SPRINT2.pde" deve ter substituido as variaveis "path" e "path2" para o endereço do "Rscript.exe" 
e nas mesmas variaveis reorganizar o path para acessar o script de criar imagens 
("cria_imagens.R" e "gera_imagens_series_temporais(US-7).R"), criar a pasta "graph" na pasta SPRINT2.

4. Modificar endereço das variaveis "folder", "indicador", "indicador2" para o endereço da pasta SPRINT2/graphs.

5. Modificar o trecho de codigo a seguir com o diretorio da pasta "graphs". System.setProperty("user.dir", endereço de graphs);

6. Modificar endereços nos scripts "gera_imagens_series_temporais(US-7).R" e "cria_imagens.R" apontando os arquivos em seus diretorios.

7. Rodar script "SPRINT2.pde".


