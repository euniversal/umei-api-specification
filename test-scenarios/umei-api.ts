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

export const buildUrl = (baseUrl: string, queryParameters: any) => {
    let url = baseUrl + "?";
    for (const q in queryParameters) {
        url += "&" + q + "=" + queryParameters[q];
    }
    return url;
}

export const fetchPrivateOrders = async (regulationType: string, marketId: string, gridNodeId: string, from: Date, to: Date) => await doFetch(
    buildUrl(`${options.baseUrl}orders`, {
        regulationType,
        marketId,
        gridNodeId,
        periodFrom: from.toISOString(),
        periodTo: to.toISOString()
    }),
    // `${options.baseUrl}orders?periodFrom=${from.toISOString()}&periodTo=${to.toISOString()}`
    options.init);

export const fetchPublicOrders = async (regulationType: string, marketId: string, gridNodeId: string, from: Date, to: Date) => await doFetch(
    buildUrl(`${options.baseUrl}PublicOrders`, {
        regulationType,
        marketId,
        gridNodeId,
        "periodFrom.gte": from.toISOString(),
        "periodTo.lte": to.toISOString()
    }),
    // `${options.baseUrl}orders?periodFrom=${from.toISOString()}&periodTo=${to.toISOString()}`
    options.init);

export const postOrder = async (order: any) => {
    console.log('Posting order: ', order)
    const response = await fetch(`${options.baseUrl}orders`, {
        method: 'post',
        body: JSON.stringify(order),
        headers: options.init.headers,
    });
    await throwIfError(response)
    const createdOrder = await response.json() as any
    console.log(' Posted order: ', createdOrder.id)
    return createdOrder
};
