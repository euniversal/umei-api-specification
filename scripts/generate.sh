#!/bin/sh -x


# sudo apt install httpie
# sudo apt install jq


#https://github.com/OpenAPITools/openapi-generator/blob/master/docs/generators/aspnetcore.md

#serversOrClients=clients
#framework=csharp-netcore

serversOrClients=servers
framework=aspnetcore

outputDir=../generated

echo "Using framework=${framework}, serversOrClients=${serversOrClients}, outputDir=${outputDir}"

echo "  -- Removing old files  --- "
rm -rf ${outputDir:?}/*
mkdir -p ${outputDir:?}

echo "  -- Contacting the openapi generator  --- "
http POST http://api.openapi-generator.tech/api/gen/${serversOrClients}/${framework} @aspnetcore.requestbody.json \
   | jq -r .link  \
   | xargs curl --output ${outputDir:?}/${framework}.zip


echo "  -- Unzipping the api  --- "
unzip ${outputDir:?}/${framework}.zip -d ${outputDir:?}

echo "  -- removing ProblemDetails"
find ${outputDir:?} -name ProblemDetails.cs -type f -delete 

echo " -- correcting TimeStamp => string (for servers/aspnetcore)"
find ${outputDir:?} -name *.cs| xargs sed -i 's/TimeStamp/string/g'

echo " -- correcting urls (for servers/aspnetcore)"
find ${outputDir:?} -name Program.cs | xargs sed -i 's+http://0.0.0.0:8080+https://0.0.0.0:5001+g'

echo " -- correcting incorrect file parameters (for clients/csharp-core )"
find ${outputDir:?} -name *.cs | xargs sed -i 's/localVarRequestOptions.FileParameters.Add("file", file);/file.ForEach(f => localVarRequestOptions.FileParameters.Add("file", f));/g'

echo "  -- correct assembly refs"
find ${outputDir:?} -name Startup.cs | xargs sed -i 's/Assembly.GetEntryAssembly()/typeof(Startup).Assembly/g'
#Assembly.GetEntryAssembly() => typeof(Startup).Assembly
