import {doFetch, throwIfError} from "./utils.ts";

export interface IOptions {
    baseUrl: string;
    init?: any,
    authorizationHeader?: string | null,
    organizationId?: string | null,
    // marketName?: string,
    // portfolioName?: string,
    // gridNodeId?: string,
}

let options: IOptions = {
    baseUrl: "not-set",
}


export const configure = (o: IOptions) => {
    // //
    // // Object.assign(options, o);
    // for (const propertyName in o) {
    //     const key = propertyName as keyof IOptions;
    //     options[key] = o[key]
    // }
    options = o; 
    options.init = {
        headers: {
            "Authorization": options.authorizationHeader,
            'ActingOrganizationId': options.organizationId,
            'Content-Type': 'application/json',
        }
    }
};

export const fetchMarkets = async () => await doFetch(options.baseUrl + "markets", options.init);

export const fetchPortfolios = async (searchParams: { gridNodeId?: string }) => {
    const url = `${options.baseUrl}portfolios?gridNodeId=${searchParams.gridNodeId}`
    return await doFetch(url, options.init);
};

export const fetchTrades = async (searchParams: { gridNodeId: string, "periodFrom.gte"?: Date }) => {
    const url = `${options.baseUrl}trades?gridNodeId=${searchParams.gridNodeId}&periodFrom.gte=${searchParams["periodFrom.gte"]?.toISOString()}`
    return await doFetch(url, options.init);
};

export const fetchOrder = async (id: string) => await doFetch(`${options.baseUrl}orders/${id}`, options.init);

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
