#!/bin/bash

echo FRH-Analytis - MAIS.Saude
echo "Script de deploy - $(date)"

#set -e

#declaracao das variaveis do git

#clone do repositorio
remoteHost=https://github.com
remoteUser=analyticsUfcg
remoteRepos=$1

cloneCmd="git clone $remoteHost/$remoteUser/$remoteRepos.git"

if [ -d "$remoteRepos" ]; then
	echo -e "Directory already exists, removing files.\n"
	rm -rf $remoteRepos
fi

cloneCmdRun= $($cloneCmd)
echo  "Running: \n $cloneCmd"
echo  "${cloneCmd}\n\n"

#zip do projeto clonado
rm $remoteRepos.zip
zip -r $remoteRepos.zip $remoteRepos

#transferindo dados pro servidor
#fazendo no lab, substituir futuramento pelo serverName e serverUser utilizado no servidor
serverName=150.165.75.104
serverUser=iara
scp $remoteRepos.zip $serverUser@$serverName:/var/www/$remoteRepos
ssh $serverUser@${serverName} "cd /var/www/; rm -r $remoteRepos; unzip $remoteRepos.zip -d ."
rm -rf $remoteRepos.zip

