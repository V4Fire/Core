# core/session

This module provides API to work with a user session. The API contains functions for authorizing/unauthorizing, comparing of sessions and broadcasting session events.

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
