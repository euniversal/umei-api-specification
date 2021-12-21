# Glossary and abbreviations

**Activation market:** Flexibility market where the assets are dispatched for the 
 period covered by a trade.  

**Asset:** In this context, an asset represents a physical or vertical device which 
has power characteristics that can be controlled, thus providing flexibility. 
Typically assets are either consumers (e.g. heating systems, factories) or producers
(e.g. renewable energy sources or traditional power plants), while some assets
(e.g. batteries) can both produce and consume. 

**Baseline:** The forecasted aggregated consumption/production of an asset portfolio (see portfolio) during a defined time period. 

**DSO:** Distribution System Operator, the entity responsible for operating a electrical grid. 

**Fill-and-kill:** Type of order that is immediately matched. The order is killed and instantly removed after matching, whether it is matched fully, partially or not at all. Available in NODES continuous market. Commonly abbreviated as FaK. Also known as Immediate-or-Cancel (IoC).

**Fill-or-kill:** Type of order that is immediately matched. The order is either matched in full and then killed, or else it is killed and instantly removed. No partial matching is allowed. Available in NODES continuous market. Commonly abbreviated as FoK. 

**FMO:** Flexible Market Operator, a market where participants can trade flexibility. 

**FSP:** Flexibility Service Provider, an entity offering flexible assets into a market.   

**GridNode:** Zone of the electrical grid to which an asset portfolio is connected and on which 
  trading happens. 

**Interpolated orders:** Order with a non-uniform price, i.e. instead of having one single price independently of the accepted part of the order, the price is evolving with the quantity accepted. Available on N-Side auction market. 

**Limit price:** For buy orders, this is the upper limit of what the buyer is willing to pay. 
For a sell order, this is the lower limit of what the seller is willing to accept. See "Market price". 

**Market price:** For buy orders, this means that the buyer will is willing to pay the current market sell price. For sell orders, this means that the seller is willing to sell at the current market buy price. 

**MeterReading:** Registration of the actual power consumed/produced by an asset

**Order:** Flexibility order placed on a market. The order can be either “Buy” in case the market participant wants to procure flexibility or “Sell” in case the market participant wants to offer flexibility. 

**PayAsBid:** This is a market rule stating that the price at which trade between two offers will occur is the proposed price of the first order placed on the platform. 

**PayAsCleared:** This is a market rule stating that the price at which a trade will occur is the one of the market equilibrium (determined by the buy and sell curves). 

**Portfolio:** A portfolio represents one or more assets (aggregated) that can participate in a flexibility market, e.g. batteries, dispatchable generators, etc. 

**QuantityType:** What is traded on a market / in an order. Possible values are 
*ActivePower*, *ReactivePower*, *Energy*, *Capacity*. 

**Reservation Market:** Flexibility market in which participants offer the reservation of their flexibility (possibly weeks or years in advance depending on market rules) before actual dispatching.
The actual dispatching can be done outside the market or in a consecutive activation market. 

**Trade:** A trade either between two participants of a market, or between one participant 
and the FMO. A trade is always the result of two or more orders being matched. 


# Categorization of orders

Orders can be categorized along several *axes*. Some categorizations follow 
directly from the market, while other can vary between orders with the same market. 


**QuantityType:** Some orders are for adjusting active power supply, some are for energy etc. 
Each market operates in one quantity type. 

**Quantity:** Some orders are can be matched-in-part, and some orders need to be fully "filled". This is deduced from the minimumAcceptanceCriteria. Possible categorizations are *Curtailable* (minimumAcceptanceQuantity < Quantity) and *AllOrNothing* (minimumAcceptanceQuantity == Quantity)

**PriceCurve:** Some orders have a fixed price regardless of quantity, while some orders have price depending on quantity bought (using the piecewise linear price curve concept). Possible categorizations are *FixedPrice* or *VariablePrice*.

**Period:** Some orders needs to be matched for the whole period stated in the order 
(e.g. 1300-1800), while other orders can be divided into time-slots and some of them met 
(e.g. buying 1300-1500 of an order that has period 1300-1800). 
Possible categorizations are *SingleSlot* (must match the whole period) 
or *MultiSlot* (one can match/buy parts of the period).

**FillType:** Depending on the fill type, some orders are killed immediately after matching, 
while some can remain in the market. 
Possible categorizations are *Normal* (remains in market), *FillOrKill*, *FillAndKill*.

**PriceType:** Some orders have a fixed limit on how high (for buy orders) or low (for sell orders) 
the price can be. Other orders will buy/sell at the current market price. 
Possible categorizations are: *Limit*, *Market*. 
