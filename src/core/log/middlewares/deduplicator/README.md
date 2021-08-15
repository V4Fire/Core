# core/log/middlewares/deduplicator

This module provides a middleware for omitting duplicated errors from a log event.

## Description

When application is trying to log events with the same errors, only first event will get to the next middleware.

This behaviour doesn't affect a log event, that doesn't have an error.

### Important notice

The middleware doesn't store all occurred errors. It holds an error in a cache until there is at least one reference to it.

## How ot use

The middleware should be set up via config in `config/index`. It should be added to the `middleware` array property of a
pipeline. Like this:

```typescript
{
  log: {
    pipelines: [{
      middlewares: ['deduplicator']
      // ...
    }]
  }
}
```
