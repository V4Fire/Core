# core/then

This module provides a class wraps promise-like objects and adds to them some extra functionality, such as possibility of cancellation, etc.

```js
import Then from 'core/then';

const promise = new Then((resolve, reject, onAbort) => {
  setTimeout(() => {
    resolve();
  }, 100);

  onAbort((reason) => {
    console.error(`The promise was aborted by a reason of ${reason}`);
  });

}).catch((err) => console.error(err)); // timeout

promise.abort('timeout');
```
