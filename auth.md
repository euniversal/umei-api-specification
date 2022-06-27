Authentication
===

Authentication towards an UMEI-compliant FMO server is performed using a user-provided token. This token should be sent on each request as a "Bearer" token in the HTTP headers, like this:

`Authentication: Bearer eyJ...`

How the token is acquired is not covered by the UMEI specification and is specified by the individual FMO. 


Authorization / Access control
===

Each FMO is required to authorize individual API calls based on the provided authentication. FMOs may have different rules and this is not covered by the UMEI specification. 

However, each FMO is required to return correct http status codes and error details if the authorization fails, as detailed in the section of error codes. 
