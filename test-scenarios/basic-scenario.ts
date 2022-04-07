import {configure, fetchOrder, fetchMarkets, fetchPortfolios, fetchTrades, postOrder} from "./umei-api.ts";
import {sleep} from "./utils.ts";
import {fetchCurrentUserInfo} from "./nodes-api.ts";

console.log('UMEI Interoperability test')

console.log('Running basic scenario')

// Basic run configuration, should be read from file: 

const authorizationHeader = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjQ4MjkyOTZCMEY3REQwQ0FCNjg0MzAyMkUyQkMzMEVERDFGODY2RTQiLCJ4NXQiOiJTQ2twYXc5OTBNcTJoREFpNHJ3dzdkSDRadVEifQ.eyJpc3MiOiJodHRwczovL25vZGVzdGVjaGRldi5iMmNsb2dpbi5jb20vMmI1OGNkNzAtMTUzYS00ZmUxLWFkNzQtZjgzOWZlMjE0ODE1L3YyLjAvIiwiZXhwIjoxNjQ5MzM1ODc2LCJuYmYiOjE2NDkzMzIyNzYsImF1ZCI6ImFlZmE3ZDYxLTRiYzEtNDdhNS05ZTI0LWEzMDU3OTk4YWFkYSIsInN1YiI6ImRlMWUwODNiLWZhODctNDAwNS1iOTU4LWJhZDEyYjVmMzljYSIsImVtYWlsIjoib3BlcmF0b3JAbm9kZXNtYXJrZXQuY29tIiwibmFtZSI6Ik5vZGVzIE9wZXJhdG9yIiwiZ2l2ZW5fbmFtZSI6Ik5vZGVzIiwiZmFtaWx5X25hbWUiOiJPcGVyYXRvciIsImV4dGVuc2lvbl9ub2Rlc19yZWYiOiJiZWFmYmYxYi0xYzAxLTQwM2MtOThlNy0zNGE3ODFhNGFkNTgiLCJ0aWQiOiIyYjU4Y2Q3MC0xNTNhLTRmZTEtYWQ3NC1mODM5ZmUyMTQ4MTUiLCJ0ZnAiOiJCMkNfMUFfc2lnbmluX29ubHkiLCJzY3AiOiJ1c2VyX2ltcGVyc29uYXRpb24iLCJhenAiOiJhZWZhN2Q2MS00YmMxLTQ3YTUtOWUyNC1hMzA1Nzk5OGFhZGEiLCJ2ZXIiOiIxLjAiLCJpYXQiOjE2NDkzMzIyNzZ9.ZyQ2XRKsiF91OSaNiUve1gau5yoVpX7RcJyVzsclXRFywDK8j-3CNHXeKuhbKCg5sMNEXi3DKiuJ5tnTk_onsbWtWIMpvKvjFqgts_sFnMV-TXJZfeYWubQNcxuar_ymn4PwSNOQzEjgjjAPEycYAkODsWiUWTW3iJoikrFTsxyd8qG6rEf9JEtzaGveX22kpCY9wrHIookn35oOQWBXveSqwDuUBpGSJNsenG6mf5AYl8ac9hlbk418Oz0xzgGz2wCqKRhbYHvL0V3oIntlFynB4Dsf0JWSf3Z3eEAoiEvO-ffu5UEMsFoHWgeslAyTg7pwT_i0Vcj1vXQw-uO-Iw";
const organizationId = "da0b309d-d990-45d3-a8c0-51d132d7b80d";
const marketName = "22-01-12 Test";
const portfolioName = "UMEI-portfolio";
const gridNodeId = "32cb78c8-b846-46c0-86b1-dc13440b7da6"; // "Parent"

configure({authorizationHeader, organizationId})

const me = await fetchCurrentUserInfo();

console.log('Current user info: ', me)
Deno.exit(0)

const markets = await fetchMarkets()
const market = markets.items.find(m => m.name === marketName);
console.log(`Using market    #${market.id}: ${market.name}`)

const portfolios = await fetchPortfolios({gridNodeId});
const portfolio = portfolios.items.find(p => p.name === portfolioName);
console.log(`Using portfolio #${portfolio.id}: ${portfolio.id}`)

const periodFrom = new Date()
periodFrom.setHours(periodFrom.getHours() + 36)
periodFrom.setMinutes(0)
periodFrom.setSeconds(0)
periodFrom.setMilliseconds(0)
const periodTo = new Date(periodFrom.getTime())
periodTo.setHours(periodTo.getHours() + 1)

const newBuyOrder =
    {
        side: 'Buy',
        regulationType: "Up",
        marketId: market.id,
        gridNodeId: gridNodeId,
        pricePoints: [{
            quantity: 11,
            unitPrice: 13,
        }],
        periodFrom: periodFrom.toISOString(),
        periodTo: periodTo.toISOString(),
    };

// @ts-ignore
const createdBuyOrder = await postOrder(newBuyOrder);
console.log('Created buy order: ', createdBuyOrder);

const newSellOrder =
    {
        side: 'Sell',
        portfolioId: portfolio.id,
        regulationType: "Up",
        marketId: market.id,
        gridNodeId: gridNodeId,
        pricePoints: [{
            quantity: 11,
            unitPrice: 13,
        }],
        periodFrom: periodFrom.toISOString(),
        periodTo: periodTo.toISOString(),
    };

const createdSellOrder = await postOrder(newSellOrder);
console.log('Created sell order: ', createdSellOrder);

console.log('Checking status of orders...');
await sleep(1000);
[createdSellOrder, createdBuyOrder].forEach(async o => {
    let order = await fetchOrder(o.id)
    console.log(` Order ${order.id}, side ${order.side}, status ${order.status}`)
})

const trades = await fetchTrades({gridNodeId, "periodFrom.gte": periodFrom});
console.log('Fetched trades: ', trades.items.map(t => t.periodFrom + " <-> " + t.periodTo));

