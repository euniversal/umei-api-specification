import {
    acquireToken,
    configure, createBaselineInterval, fetchBaselineInterval, fetchBaselineIntervals,
    fetchMarkets,
    fetchOrder,
    fetchPortfolios, fetchPrivateOrders, fetchPublicOrders,
    fetchTrades, getById,
    IOptions, options, patchBaselineInterval,
    postOrder, tokenRequestType, updateBaselineInterval
} from "./umei-api.ts"
import { applyOptionalConfigFile, doFetch, HOUR_IN_MILLIS, sleep, truncateToHour } from "./utils.ts"
import { fetchCurrentUserInfo } from './nodes-api.ts';
import { tokenData, tokenServer } from './umei-config.local.ts';

console.log('UMEI Interoperability test - Running basic scenario')

const scenarioOptions: any = {};
await applyOptionalConfigFile('./umei-config.local.ts', o => configure(o as IOptions))
await applyOptionalConfigFile('./scenario-config.local.ts', o => Object.assign(scenarioOptions, o))


const token = await acquireToken(tokenServer, tokenData)
options.init.headers.Authorization = 'Bearer ' + token

const markets = await fetchMarkets()
const market = markets.items.find((m: any) => m.name === scenarioOptions.marketName)
if (!market)
    throw new Error(`Market ${scenarioOptions.marketName} not found`)
console.log(`Using market    #${market.id}: ${market.name}`)

const portfolios = await fetchPortfolios({gridNodeId: scenarioOptions.gridNodeId})
const portfolio = portfolios.items.find((p: any) => p.name === scenarioOptions.portfolioName)
if (!portfolio)
    throw new Error(`Portfolio ${scenarioOptions.portfolioName} not found among ${portfolios.numberOfHits} items: ${portfolios.items.map((p: any) => p.name).join(", ")}`)
console.log(`Using portfolio #${portfolio.id}: ${portfolio.id} @ ${portfolio.gridNodeId}`)

// const gridNode = await getById('gridnodes', scenarioOptions.gridNodeId)
// console.log('Using grid node: ', gridNode)
//


const periodFrom = truncateToHour(new Date().getTime() + 36 * HOUR_IN_MILLIS);
const periodTo = new Date(periodFrom.getTime() + HOUR_IN_MILLIS)

if (false) {
    const baselineIntervals = await fetchBaselineIntervals(portfolio.id)
    console.log('got ', {baselineIntervals})
    let baselineInterval: any;
    if (baselineIntervals.items.length > 0) {
        baselineInterval = baselineIntervals.items[0];
    } else {

        const toInsert = {
            periodFrom,
            periodTo,
            portfolioId: portfolio.id,
            status: 'Active',
            quantityType: 'ActivePower',
            quantity: 11.1,
        }
        baselineInterval = await createBaselineInterval(toInsert)
    }

    baselineInterval.quantity += 1.1
    await patchBaselineInterval(baselineInterval);

    const fetchedBaselineInterval = await fetchBaselineInterval('XXXdb71c85c-1b12-40d3-b5cd-abeb52f3aacc');
    console.log({fetchedBaselineInterval})

    Deno.exit(0)
}

// console.log('executing order fetch', {})

for (const f of [fetchPrivateOrders, fetchPublicOrders]) {
    console.log('executing order fetch', f)
    const orders = await f('Up', market.id, scenarioOptions.gridNodeId, periodFrom, periodTo)
    const pendingOrders = orders.items.filter((o: any) => o.status == 'Pending')
    console.log(` fetched ${orders.items.length} orders. `)
    if (pendingOrders.length > 0)
        console.log(` ${pendingOrders.length} PENDING orders. `)
// const orderToString = (t: any) => `${t.periodFrom} <-> ${t.periodTo}: ${t.quantity} @ ${t.unitPrice}`
    orders.items.forEach((o: any) => {
        console.log(`   ${o.periodFrom} <-> ${o.periodTo}  - ID=${o.id || 'N/A'}, Status=${o.status}, Side=${o.side}`)
        for (const p of o.pricePoints) {
            console.log(`      qty ${p.quantity} => price ${p.unitPrice}`)
        }
    })
}
// console.log('Done ?')
// Deno.exit(0)


const newBuyOrder =
    {
        side: 'Buy',
        regulationType: "Up",
        marketId: market.id,
        gridNodeId: scenarioOptions.gridNodeId,
        pricePoints: [
            // {
            //     quantity: 0,
            //     unitPrice: 15,
            // },
            // {
            //     quantity: 2,
            //     unitPrice: 12,
            // },
            {
                quantity: 11,
                unitPrice: 19,
            },
        ],
        periodFrom: periodFrom.toISOString(),
        periodTo: periodTo.toISOString(),
    }

const createdBuyOrder = await postOrder(newBuyOrder)
console.log('Created buy order: ', createdBuyOrder)

// console.log('Done ?')
// Deno.exit(0)


const newSellOrder =
    {
        side: 'Sell',
        portfolioId: portfolio.id,
        regulationType: "Up",
        marketId: market.id,
        gridNodeId: scenarioOptions.gridNodeId,
        pricePoints: [{
            quantity: 11,
            unitPrice: 13,
        }],
        periodFrom: periodFrom.toISOString(),
        periodTo: periodTo.toISOString(),
    }

const createdSellOrder = await postOrder(newSellOrder)
console.log('Created sell order: ', createdSellOrder)

console.log('Checking status of orders...')
await sleep(1000);
[createdSellOrder, createdBuyOrder].forEach(async (o: any) => {
    const order = await fetchOrder(o.id)
    console.log(` Order ${order.id}, side ${order.side}, status ${order.status}`)
})

const tradeToString = (t: any) => `${t.periodFrom} <-> ${t.periodTo}  ${t.side} \t${t.quantity}  oid=${t.orderId}`

const trades = await fetchTrades({gridNodeId: scenarioOptions.gridNodeId!, "periodFrom.gte": periodFrom})
console.log(`Fetched ${trades.numberOfHits} trades: `, trades.items.map(tradeToString))

const sellTrade = trades.items.filter((t: any) => t.orderId === createdSellOrder.id)
console.log('The sell trade: ', sellTrade)

const tradesByOrder = await fetchTrades({orderId: createdBuyOrder.id})
console.log(`Fetched by order id: ${tradesByOrder.numberOfHits} trades: `, tradesByOrder.items.map(tradeToString))
