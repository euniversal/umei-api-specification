# List of error codes

This is a non-exhaustive list of error codes. The main purpose is to harmonize error codes between different FMOs, enabling users and code to handle common errors in the same way even when interfacing with different FMOs. 

Note that this list is non-exhaustive. FMOs are free to perform additional validations and to provide errors messages with error codes not in this list. However, FMOs are strongly encouraged to re-use existing error codes if possible. 

See the definition of the ProblemDetails object in the OpenAPI documentation for usage, or the problem details RFC: https://datatracker.ietf.org/doc/html/rfc7807


### Security related error codes

**Forbidden:** The current user is not authorized to perform the requested operation. Corresponds to http status 403 Forbidden.

**Unauthenticated:** This operation requires a logged-in user, but the request did not specify valid authentication parameters. Corresponds to http status 401 Unauthorized (sic).


### Error codes related to invalid request data 

**EndpointNotSupported** The requested endpoint is known by the server, but the market platform does not support this method. The 'allow' header field of the response contains a list of methods that the market platform currently supports.

**InconsistentPeriods:** 'periodTo' must be subsequent to 'periodFrom'

**InvalidBaseline** The baseline provided is not valid (input data validation error)

**InvalidFlexibilityZone** The flexibility zone provided is not valid (input data validation error)

**InvalidGridNode:** The given grid node does not exist, is not available for the current user, or is otherwise not available for the given order

**InvalidLongflexContractId:** The given longflex contract does not exist, or is not available for the current user

**InvalidMarket** The given market does not exist, is not available for the current user, or is otherwise not available for the given order

**InvalidMeterReading** The meter reading provided is not valid (input data validation error)

**InvalidOrder** The order provided is not valid (input data validation error)

**InvalidPortfolio:** The given portfolio is not valid (input data validation error), does not exist, or is not available for the current user

**InvalidStatus:** The status specified is not valid for the item selected

**MarketClosed:** The market is not open for trading for the period specified in the order

**MarketNotYetOpen:** The market has not yet opened for trading for the period specified in the order

**NonUpdatablePortfolio:** The portfolio can not be updated

**NonZeroFirstQuantity:** The quantity of the first 'QuantityPricePoint' of an interpolated order must always be zero

**ResourceNotFound** The resource identified by the path parameter does not exist or the logged-in user does not have sufficient privileges.

