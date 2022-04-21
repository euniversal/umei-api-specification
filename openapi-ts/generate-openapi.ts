import { OperationObject, PathItemObject, SchemaObject } from "./model/OpenApi.ts";
import { OpenApiBuilder } from "./dsl/OpenApiBuilder.ts";

type Parameters = OperationObject["parameters"]

const searchParams: Parameters = [
    {
        name: "take",
        in: 'query'
    }
];

const ps: SchemaObject = {
    description: "the description",
    properties: {
        "id": {
            type: "string"
        }
    }
}

const pp: PathItemObject = {
    get: {
        parameters: [...searchParams, {name: "portfolioId", in: 'query'}],
        responses: {
            default: {
                description: "portfolios",
                $ref: "ps-ref",
            }
        }
    }
}


const x = new OpenApiBuilder()
    .addVersion("0.1")
    .addTitle("UMEI OpenAPI Spec")
    .addSchema("portfolios", ps)
    .addPath('portfolios', pp);

const json = x.getSpecAsJson(null, "  ");

console.log(json);
