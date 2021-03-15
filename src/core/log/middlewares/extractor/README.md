# core/log/middlewares/extractor

This module provides middleware that extracts information of an error from a log event and stores it in `additionals`
dictionary of the event.

## Description

The constructor of the extractor middleware accepts error details extractors that implement `ErrorDetailsExtractor`
interface. If a log event with an error inside goes through this middleware, then it tries to match the error with
one of available extractors. If it finds the match, then it uses that extractor to get details from the error. Otherwise,
the middleware gets only enumerable fields from the error.

Also, the middleware is capable of processing hierarchy of nested errors. If an error from a log event has `cause`
property with the error inside, then the middleware processes that error in the same way as the error from the log event.
If the cause error has another cause error inside then the middleware goes further by the hierarchy.

### Produced details

The result of an error processing is following:

```
{
    error: {
        details: {...}, // an object of enumerable fields of an error or details returned by an extractor
        cause: {
            error: {
                name: '...', // a name of a cause error
                message: '...' // a message of a cause error
            },
            details: {...}, // details of a cause error
            cause: {
                ...
            }
        }
    }
}
```

## How ot use

The middleware should be set up via config in `config/index`. It should be added to `middleware` array property of a
pipeline.

It will be instantiated without error details extractors if passed as a string:

```(typescript)
{
    log: {
        pipelines: [{
            middlewares: ['extractor'],
            ...
        }],
        ...
    }
}
```

Or it will be instantiated with erro details extractors if passed as a tuple:

```(typescript)
{
    log: {
        pipelines: [{
            middlewares: [['extractor', [new RequestErrorDetailsExtractor()]]],
            ...
        }],
        ...
    }
}
```

The first opened bracket here is an array of middlewares, the second one is tuple of middleware's name and its parameters.
