#!/bin/bash


echo "Script de deploy - $(date)"
Folder=$1
serverName=$2
serverUser=$3

#zip da pagina
rm $Folder.zip
zip -r $Folder.zip maisedu

#transferindo dados pro servidor
#fazendo no lab, substituir futuramento pelo serverName e serverUser utilizado no servidor
scp $Folder.zip $serverUser@$serverName:/tmp/
ssh $serverUser@${serverName} "rm -r /var/www/$Folder/*; unzip /tmp/$Folder.zip -d /var/www/"
rm -rf $remoteRepos.zip

