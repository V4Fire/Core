# core/log

This module provides the API for logging.

```js
import log from 'core/log';

log.info('Info message');
log.warn('Some warning');
log.error('Some error');

log.namespace('net').error('Some error with the context');
```
