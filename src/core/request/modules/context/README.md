# core/request/context

This module provides a class to wrap a raw request object with adding some useful methods and middlewares.
You can use an instance within your decoders/encoders/middlewares.

```js
import request from 'core/request';

request('//users', {
  middlewares: [
    ({ctx}) => {
      if (ctx.query.dropCache) {
        ctx.dropCache();
      }
    }
  ]
});
```

## Properties

### canCache

True if the request can be cached.

### cache

A storage to cache the resolved request.

### pendingCache

A storage to cache the request while it is pending a response.

### withoutBody

True if the request can provide parameters only as a query string.

### params

An object with request parameters.

### query

An alias for `params.query`.

### headers

An alias for `params.headers`.

### encoders

A sequence of request data encoders.

### decoders

A sequence of response data decoders.

## Methods

### wrapAsResponse

A middleware to wrap the specified response value with `RequestResponseObject`.
Use it when wrapping some raw data as the `core/request` response.

### dropCache

Drops the request cache.
