import {
    configure,
    fetchOrder,
    fetchMarkets,
    fetchPortfolios,
    fetchTrades,
    postOrder,
    IOptions,
    options
} from "./umei-api.ts";
import {sleep} from "./utils.ts";
import {fetchCurrentUserInfo} from "./nodes-api.ts";

console.log('UMEI Interoperability test')
console.log('Running basic scenario')

const optionalConfigFile = './config.local.ts';

console.log('Checking for local config file: ', optionalConfigFile)
try {
    const optionalConfigModule = await import(optionalConfigFile)
    configure(optionalConfigModule.default as IOptions)
    console.log('Applied local config file ', optionalConfigFile)
} catch (e) {
    const isNotFound = /not ?found/.exec(e.message)
    if (!isNotFound)
        console.warn(e)
    console.log(`unable to load local config file '${optionalConfigFile}': `, e.name, e.message)
}


// const me = await fetchCurrentUserInfo();
// console.log('Current user info: ', me)
// Deno.exit(0)

const markets = await fetchMarkets()
const market = markets.items.find((m: any) => m.name === options.marketName)
if (!market)
    throw new Error(`Market ${options.marketName} not found`)
console.log(`Using market    #${market.id}: ${market.name}`)

const portfolios = await fetchPortfolios({gridNodeId: options.gridNodeId})
const portfolio = portfolios.items.find((p: any) => p.name === options.portfolioName)
if (!portfolio)
    throw new Error(`Portfolio ${options.portfolioName} not found among ${portfolios.numberOfHits} items: ${portfolios.items.map((p: any) => p.name).join(";")}`)
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
        gridNodeId: options.gridNodeId,
        pricePoints: [{
            quantity: 11,
            unitPrice: 13,
        }],
        periodFrom: periodFrom.toISOString(),
        periodTo: periodTo.toISOString(),
    };

const createdBuyOrder = await postOrder(newBuyOrder)
console.log('Created buy order: ', createdBuyOrder)

const newSellOrder =
    {
        side: 'Sell',
        portfolioId: portfolio.id,
        regulationType: "Up",
        marketId: market.id,
        gridNodeId: options.gridNodeId,
        pricePoints: [{
            quantity: 11,
            unitPrice: 13,
        }],
        periodFrom: periodFrom.toISOString(),
        periodTo: periodTo.toISOString(),
    };

const createdSellOrder = await postOrder(newSellOrder)
console.log('Created sell order: ', createdSellOrder)

console.log('Checking status of orders...');
await sleep(1000);
[createdSellOrder, createdBuyOrder].forEach(async o => {
    const order = await fetchOrder(o.id)
    console.log(` Order ${order.id}, side ${order.side}, status ${order.status}`)
})

const trades = await fetchTrades({gridNodeId: options.gridNodeId!, "periodFrom.gte": periodFrom})
const tradeToString = (t: any) => `${t.periodFrom} <-> ${t.periodTo}`
console.log(`Fetched ${trades.numberOfHits} trades: `, trades.items.map(tradeToString))

