#!/bin/bash

# sudo apt install httpie

# sudo apt install jq

mkdir -p output

http POST http://api.openapi-generator.tech/api/gen/servers/aspnetcore @aspnetcore.requestbody.json \
   | jq -r .link \
   | xargs curl --output output/aspnetcore.zip

unzip output/aspnetcore.zip -d output
