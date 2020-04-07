# core/functools/not-implemented

This module provides a bunch of functions and decorators to mark not implemented functions with the special flag.

```js
import { notImplement, notImplemented } from 'core/functools/not-implemented';

const foo = notImplement({name: 'foo', alternative: 'bar'}, () => {

});

function bar() {

}

class Baz {
  @notImplemented({alternative: 'newMethod'})
  oldMethod() {

  }

  newMethod() {}
}
```
