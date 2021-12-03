# List of error codes

This is a non-exhaustive list of error codes. The main purpose is to harmonize error codes between different FMOs, enabling users and code to handle common errors in the same way even when interfacing with different FMOs. 

Note that this list is non-exhaustive. FMOs are free to perform additional validations and to provide errors messages with error codes not in this list. However, FMOs are strongly encouraged to re-use existing error codes if possible. 

See the definition of the ProblemDetails object in the OpenAPI documentation for usage, or the problem details RFC: https://datatracker.ietf.org/doc/html/rfc7807

|  Code                      | Description                               |
|----------------------------|-------------------------------------------|
| invalid-market-id          | The given market does not exist, is not available for the current user, or is otherwise not available for the given order.



InvalidMarket
: The given market does not exist, is not available for the current user, or is otherwise not available for the given order.

InvalidGridnode
: The given grid node does not exist, is not available for the current user, or is otherwise not available for the given order.

MarketClosed
: The market is not open for trading for the period specified in the order

MarketNotYetOpen
: The market has not yet opened for trading for the period specified in the order

