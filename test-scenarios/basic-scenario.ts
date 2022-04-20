import {
    configure,
    fetchMarkets,
    fetchOrder,
    fetchPortfolios,
    fetchTrades,
    IOptions,
    postOrder
} from "./umei-api.ts"
import {applyOptionalConfigFile, HOUR_IN_MILLIS, sleep, truncateToHour} from "./utils.ts"

console.log('UMEI Interoperability test - Running basic scenario')

const scenarioOptions: any = {};
await applyOptionalConfigFile('./umei-config.local.ts', o => configure(o as IOptions))
await applyOptionalConfigFile('./scenario-config.local.ts', o => Object.assign(scenarioOptions, o))


// const me = await fetchCurrentUserInfo()
// console.log('Current user info: ', me)
// Deno.exit(0)

const markets = await fetchMarkets()
const market = markets.items.find((m: any) => m.name === scenarioOptions.marketName)
if (!market)
    throw new Error(`Market ${scenarioOptions.marketName} not found`)
console.log(`Using market    #${market.id}: ${market.name}`)

const portfolios = await fetchPortfolios({gridNodeId: scenarioOptions.gridNodeId})
const portfolio = portfolios.items.find((p: any) => p.name === scenarioOptions.portfolioName)
if (!portfolio)
    throw new Error(`Portfolio ${scenarioOptions.portfolioName} not found among ${portfolios.numberOfHits} items: ${portfolios.items.map((p: any) => p.name).join(", ")}`)
console.log(`Using portfolio #${portfolio.id}: ${portfolio.id}`)

const periodFrom = truncateToHour(new Date().getTime() + 36*HOUR_IN_MILLIS);
const periodTo = new Date(periodFrom.getTime() + HOUR_IN_MILLIS)

const newBuyOrder =
    {
        side: 'Buy',
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

const createdBuyOrder = await postOrder(newBuyOrder)
console.log('Created buy order: ', createdBuyOrder)

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

const trades = await fetchTrades({gridNodeId: scenarioOptions.gridNodeId!, "periodFrom.gte": periodFrom})
const tradeToString = (t: any) => `${t.periodFrom} <-> ${t.periodTo}`
console.log(`Fetched ${trades.numberOfHits} trades: `, trades.items.map(tradeToString))

