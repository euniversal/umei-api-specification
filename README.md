# UMEI API specifications

Specification for the API that FMOs in the eUniversal project 
should support. 


See generated web page here: 
https://euniversal.github.io/umei-api-specification/

# Glossary (DRAFT)
**Activation market:** flexibility market in which participants offer the activation of their available flexibility shortly after the acceptance of the offer.
**Baseline:** the forecasted aggregated consumption/injection of an asset portfolio (see Portfolio) during a defined time period
**Block order:** type of order for which the amount of flexibility proposed is fully indivisible (i.e. either the offer is fully accepted, either fully rejected)
**Curtailable block orders:** type of order that can be partially accepted but above a minimum acceptance ratio defined by the seller
**DSO:** distribution system operator
**Fill-and-kill:** type of order that is immediately matched. If the order is partially matched, the rest is killed and instantly removed from the platform. (available in NODES continuous market)
**Fill-or-kill:** type of order that is immediately matched. If the order is partially matched, the rest stay on the platform. (available in NODES continuous market)
**FSP:** flexibility service provider
**Gridnode:** Zone of the electrical grid to which an asset portfolio is connected 
**Interpolated orders:** order with a non-uniform price (i.e. instead of having one single price independently of the accepted part of the order, the price is evolving with the quantity accepted)
**MeterReading:** registration of the actual power consumed/injected by an asset
**Order:** flexibility order placed on a market. The order can be either “buy” in case the market participant wants to procure flexibility or “sell” in case the market participant wants to offer flexibility
**PayAsBid:** this is a market rule stating that the price at which trade between two offers will occur is the proposed price of the first offer placed on the platform. This is also referred to as “Limit” in NODES platform
**PayAsCleared:** this is a market rule stating that the price at which a trade will occur is the one of the market equilibrium (determined by the buy and sell curves). This is also referred to as “Market price” in NODES platform
**Portfolio:** A portfolio represents one or more assets (aggregated) that can participate in a flexibility market, e.g. batteries, dispatchable generators, etc…
**Reservation Market:** flexibility market in which participants offer the reservation of their flexibility (weeks or years in advance depending on market rules) before actual procurement. If their reservation offer is activated, they are forced to place an offer on the consecutive activation market (see above)
