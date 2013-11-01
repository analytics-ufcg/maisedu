#!/bin/bash
echo "FRH - Analytics"
echo "Script de deploy - $(date)"
folder=$1
serverName=$3
serverUser=$2

mkdir $folder
#substituir src/...blah
cp -r src/edubrasil/WebContent/* $folder/

#zip da pagina
rm $folder.zip
zip -r $folder.zip maisedu

#transferindo dados pro servidor
#fazendo no lab, substituir futuramento pelo serverName e serverUser utilizado no servidor
scp $folder.zip $serverUser@$serverName:/tmp/
ssh $serverUser@${serverName} "rm -r /var/www/$folder/*; unzip /tmp/$folder.zip -d /var/www/"

#removendo o diretorio e zip gerados
rm -rf $folder.zip
rm -rf maisedu

