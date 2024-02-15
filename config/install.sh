#!/bin/bash

printf -- "Running frontend configuration script\n"
printf -- "-------------------------------------\n\n"

currentDir=$(basename "$PWD")

if [ $currentDir != "client" ]
then
  printf -- "Not in ./client folder, moving to it...\n"
  cd ./client || exit 1
fi

printf -- "Downloading config files...\n"

configList=$(curl -s "https://raw.githubusercontent.com/Brynjulf/amplify-components/main/config/config_list.txt")

for line in $configList
do
  fileName=$(echo $line | rev | cut -d '/' -f 1 | rev)
  curl -s $line > $fileName
done

printf -- "Downloading setupLocalhost.mjs file...\n"

cd ./src || return
echo $PWD
curl -s "https://raw.githubusercontent.com/Brynjulf/amplify-components/main/config/config_files/setupLocalhost.mjs" > setupLocalhost.mjs

printf -- "Downloading setupTests folder...\n"
echo $PWD
cd ./test-utils || (mkdir test-utils && cd ./test-utils || return)

printf -- "Downloading setupTests.ts file...\n"

curl -s "https://raw.githubusercontent.com/Brynjulf/amplify-components/main/config/config_files/test-utils/setupTests.ts" > setupTests.ts

printf -- "Downloading mockLocalStorage.ts file...\n"

curl -s "https://raw.githubusercontent.com/Brynjulf/amplify-components/main/config/config_files/test-utils/mockLocalStorage.ts" > mockLocalStorage.ts
echo $PWD
cd ../..
echo $PWD
printf -- "Downloading nginx.conf proxy config...\n"

cd ./proxy || (mkdir proxy && cd ./proxy || return)
echo $PWD
curl -s "https://raw.githubusercontent.com/Brynjulf/amplify-components/main/config/config_files/nginx.conf" > nginx.conf

printf -- "Downloading securityheaders.conf proxy config...\n"

curl -s "https://raw.githubusercontent.com/Brynjulf/amplify-components/main/config/config_files/securityheaders.conf" > securityheaders.conf

cd ../..
echo $PWD
printf -- "Downloading client github actions...\n"
workflowsList=$(curl -s "https://raw.githubusercontent.com/Brynjulf/amplify-components/main/config/github_actions_list.txt")

for line in $workflowsList
do
  fileName=$(echo $line | rev | cut -d '/' -f 1 | rev)
  curl -s $line > ".github/workflows/$fileName"
done

printf -- "Downloading CODEOWNERS file...\n"
curl -s "https://raw.githubusercontent.com/Brynjulf/amplify-components/main/config/config_files/CODEOWNERS" > .github/CODEOWNERS