#!/bin/bash

# sudo apt install httpie
# sudo apt install jq

echo "  -- Removing old files  --- "
rm -rf output/aspnetcore*
mkdir -p output

echo "  -- Contacting the openapi generator  --- "

http POST http://api.openapi-generator.tech/api/gen/servers/aspnetcore @aspnetcore.requestbody.json \
   | jq -r .link \
   | xargs curl --output output/aspnetcore.zip

echo "  -- Unzipping the api  --- "

unzip output/aspnetcore.zip -d output
