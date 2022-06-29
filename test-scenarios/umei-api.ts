import { doFetch, throwIfError } from "./utils.ts";

export interface IOptions {
    baseUrl: string;
    init?: any,
    authorizationHeader?: string | null,
    organizationId?: string | null,
    // marketName?: string,
    // portfolioName?: string,
    // gridNodeId?: string,
}

export let options: IOptions = {
    baseUrl: "not-set",
}


export const configure = (o: IOptions) => {
    options = o;
    options.init = {
        headers: {
            "Authorization": options.authorizationHeader,
            'ActingOrganizationId': options.organizationId,
            'Content-Type': 'application/json',
        }
    }
};

export declare type DTOType = 'markets' | 'gridnodes';

export const getById = async (type: DTOType, id:string) => await doFetch(options.baseUrl + type + "/" + id, options.init)

export const fetchMarkets = async () => await doFetch(options.baseUrl + "markets", options.init);

export const fetchPortfolios = async (searchParams: { gridNodeId?: string }) => {
    const url = buildUrl(`${options.baseUrl}portfolios`, searchParams)
    // const url = `${options.baseUrl}portfolios?gridNodeId=${searchParams.gridNodeId}`
    return await doFetch(url, options.init);
};

export const fetchTrades = async (searchParams: { gridNodeId?: string, orderId?: string, "periodFrom.gte"?: Date }) => {
    // const url = `${options.baseUrl}trades?gridNodeId=${p.gridNodeId}&orderId=${p.orderId}&periodFrom.gte=${p["periodFrom.gte"]?.toISOString()}`
    const url = buildUrl(`${options.baseUrl}trades`, searchParams)
    return await doFetch(url, options.init);
};

export const fetchOrder = async (id: string) => await doFetch(`${options.baseUrl}orders/${id}`, options.init);

export const fetchBaselineInterval = async (id: string) => await doFetch(`${options.baseUrl}BaselineIntervals/${id}`, options.init);

export const buildUrl = (baseUrl: string, queryParameters: any) => {
    const queryDict = Object.keys(queryParameters)
        .filter(qn => queryParameters[qn] !== null && queryParameters[qn] !== undefined)
        .map(qn => ({
            qn,
            qv: queryParameters[qn] instanceof Date ? queryParameters[qn].toISOString() : queryParameters[qn].toString()
        }))
        .map(kvp => kvp.qn + "=" + kvp.qv )
    return queryDict.length == 0
        ? baseUrl
        : baseUrl + "?" + queryDict.join("&");
}

export const fetchBaselineIntervals = async (portfolioId?: string) => await doFetch(
    buildUrl(`${options.baseUrl}BaselineIntervals`, {
        portfolioId,
    }),
    options.init,
)

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
    options.init);

const send = async (url: string, method: "put" | "post" | "patch", obj: any) => {
    console.log('START ', method, url, obj)
    const response = await fetch(`${options.baseUrl}${url}`, {
        method,
        body: JSON.stringify(obj),
        headers: options.init.headers,
    });
    await throwIfError(response)
    const put = await response.json() as any
    console.log('END   ', method, url, put.id)
    return put
}


export const postOrder = async (order: any) => await send('orders', 'post', order)

export const createBaselineInterval = async (baselineInterval: any) => await send('BaselineIntervals', 'post', baselineInterval)

export const updateBaselineInterval = async (baselineInterval: any) => await send(`BaselineIntervals/${baselineInterval.id}`, 'put', baselineInterval)

export const patchBaselineInterval = async (baselineInterval: any) => await send(`BaselineIntervals/${baselineInterval.id}`, 'patch', baselineInterval)


export type tokenRequestType = {
    client_id: string,
    client_secret: string,
    scope: string,
    grant_type: string,
}

export const acquireToken = async (server: string, obj: tokenRequestType) => {
    const urlData = new URLSearchParams()
    urlData.append('client_id', obj.client_id)
    urlData.append('client_secret', obj.client_secret)
    urlData.append('scope', obj.scope)
    urlData.append('grant_type', obj.grant_type)

    const tokenResponse = await fetch(
        server,
        {
            method: 'post',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
            },
            body: urlData
        })
    const tokenResponseText = await tokenResponse.text()
    // console.log({tokenResponseText})
    const tokenResponseObj = JSON.parse(tokenResponseText)
    if (tokenResponse.status >= 400) {
        // console.error('Token acquisition error: ', tokenResponseObj)
        throw new Error('Token acquisition error: ' + tokenResponseObj.error_description)
    }
    const accessToken = tokenResponseObj['access_token']
    console.log("Acquired token: ", accessToken)
    return accessToken
}

