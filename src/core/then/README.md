# core/then

This module provides a class for wrapping promise-like objects and adds to them some extra functionality, such as possibility of cancelation, etc.

```js
import Then from 'core/then';

new Then((resolve, reject, onAbort) => {
  setTimeout(() => {
    resolve();
  }, 100);

  onAbort((reason) => {
    console.log(`The promise was aborted by a reason of ${reason}`);
  });
}).abort('destructor');
```
