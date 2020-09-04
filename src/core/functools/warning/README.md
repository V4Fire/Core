# core/functools/warning

This module provides a bunch of functions and decorators to mark functions with different warnings.

```js
import { warn, warned } from 'core/functools/warning';

const foo = warn({context: 'notImplemented', name: 'foo', alternative: 'bar'}, () => {

});

function bar() {

}

class Baz {
  @warned({context: 'deprecated', alternative: 'newMethod'})
  oldMethod() {

  }

  newMethod() {}
}
```
