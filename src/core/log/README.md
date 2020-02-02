# core/log

This module provides API to log different system/application events.

```js
import log from 'core/log';

log.info('Info message');
log.warn('Some warning');
log.error('Some error', new Error('Boom!'));

log.namespace('net').error('Some error with the context');
```
