# core/session

This module provides the API for working with a work session, such as authorization.

```js
import * as session from 'core/session';

session.emitter.on('set', ({auth, params}) => {
  console.log(`Session was registered with for ${auth}`);
  console.log(params);
});

(async () => {
  if (!await session.isExists()) {
    session.set('[[ANONYMOUS]]');
  }
})();
```
