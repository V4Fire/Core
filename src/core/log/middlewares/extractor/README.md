# core/log/middlewares/extractor

This module provides a middleware to extract information from an error log event and store
it within the `additionals` dictionary of the event.

## Description

A constructor of the extractor middleware takes a list of objects that implement the `ErrorDetailsExtractor` interface.
These objects are used to match an error and extract details.
If the error doesn't match with any `ErrorDetailsExtractor`, the middleware gets only enumerable properties from the error.

```js
new ExtractorMiddleware(
  {
    target: RequestError,
    extract: (err) => { /* Return details */ }
  },

  {
    target: URLError,
    extract: (err) => { /* Return details */ }
  }
);
```

Also, the middleware is capable of processing the hierarchy of nested errors. If an error from some log event has the `cause`
property with another error inside, the middleware processes that error in the same way as the log event's error.
If the cause error has another cause error inside then, the middleware goes further by the hierarchy, i.e.,  it works recursively.

### Produced details

The result of the error processing is following:

```
{
  error: {
    // An object of enumerable properties from the error or details returned by the error extractor
    details: {...},

    cause: {
      error: {
        // A name of the caused error
        name: '...',

        // A message of the caused error
        message: '...'
      },


      // Details of the caused error
      details: {...},

      cause: {
          ...
      }
    }
  }
}
```

## How ot use

The middleware should be set up via config in `config/index`. It should be added to the `middleware` array property of a
pipeline.

To install it without the custom detail extractors, just pass a string:

```typescript
{
  log: {
    pipelines: [{
      middlewares: ['extractor']
      // ...
    }]
  }
}
```

To install the middleware with the custom detail extractors, use the following form:

```typescript
{
  log: {
    pipelines: [{
      middlewares: [['extractor', [new RequestErrorDetailsExtractor()]]]
      // ...
    }]
  }
}
```

The first opened bracket here is an array of middlewares. The second one is a tuple of the middleware name and its parameters.
