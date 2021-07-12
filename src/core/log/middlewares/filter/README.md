# core/log/middlewares/filter

This module provides a middleware for filtering events.

## Description

A constructor of the filter middleware takes a list of objects that implement the `LogFilter` interface.
These objects are used to check whether events need to be displayed.

```js
new FilterMiddleware(
  {
    check: (event) => { /* Return boolean */ }
  },

  {
    check: (event) => { /* Return boolean */ }
  }
);
```

## How to use

The middleware should be set up via config in `config/index`. It should be added to the `middleware` array property of a
pipeline.

To install the middleware, use the following form:

```typescript
{
  log: {
    pipelines: [{
      middlewares: [
          ['filter', [new DuplicatesFilter()]]
      ]
      // ...
    }]
  }
}
```

The first opened bracket here is an array of middlewares. The second one is a tuple of the middleware name and its parameters.
The filters will be applied in the order specified in the config.

## Available filters

- `ContextFilter` - removes events whose context does not fit the patterns specified in the logging config
- `DuplicatesFilter` - removes events that have already been shown
