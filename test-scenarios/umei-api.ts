import {doFetch, throwIfError} from "./utils.ts";

export interface IOptions {
    baseUrl: string;
    init: any,
    organizationId: string | null,
    authorizationHeader: string | null,
}

export const options: IOptions = {
// const baseUrl = "https://dev.nodes-tech.com/umei/";
    baseUrl: "https://localhost:5001/",
    init: {},
    organizationId: null,
    authorizationHeader: null,
};


export const configure = (o: Partial<IOptions>) => {
    for (const k in o) options[k] = o[k];
    options.init = {
        headers: {
            "Authorization": options.authorizationHeader,
            'ActingOrganizationId': options.organizationId,
            'Content-Type': 'application/json',
        }
    }
};

export const fetchMarkets = async () => doFetch(options.baseUrl + "markets", options.init);

export const fetchPortfolios = async (searchParams: { gridNodeId?: string }) => {
    const url = `${options.baseUrl}portfolios?gridNodeId=${searchParams.gridNodeId}`
    return await doFetch(url, options.init);
};

export const fetchTrades = async (searchParams: { gridNodeId: string, "periodFrom.gte"?: Date }) => {
    const url = `${options.baseUrl}trades?gridNodeId=${searchParams.gridNodeId}&periodFrom.gte=${searchParams["periodFrom.gte"]?.toISOString()}`
    return await doFetch(url, options.init);
};

export const fetchOrder = async (id) => await doFetch(`${options.baseUrl}orders/${id}`, options.init);

export const postOrder = async (order: any) => {
    console.log('Posting order: ', order)
    const response = await fetch(`${options.baseUrl}orders`, {
        method: 'post',
        body: JSON.stringify(order),
        headers: options.init.headers,
    });
    await throwIfError(response);
    return response.json();
};
