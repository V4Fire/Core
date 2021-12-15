# core/log/middlewares/errors-deduplicator

This module provides a middleware to omit duplicated errors from a log event.

## Description

Only the first event will get to the next middleware when an application tries to log events with the same errors.

This behavior doesn't affect a log event that does not have an error.

### Important notice

The middleware doesn't store all occurred errors. Instead, it holds an error in the cache until there is at least one reference to it.

## How to use

The middleware should be set up via config in `config/index`: add the middleware name to a list of used middlewares.
Like this:

```typescript
{
  log: {
    pipelines: [{
      middlewares: ['errorsDeduplicator']
      // ...
    }]
  }
}
```
