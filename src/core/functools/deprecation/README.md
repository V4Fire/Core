# core/functools/deprecation

This module provides a bunch of functions and decorators for marking deprecated functions with the special flag.

```js
import { deprecate, deprecated } from 'core/meta/deprecation';

const foo = deprecate({
  name: 'foo',
  renamedTo: 'bar'
}, bar);

function bar() {

}

class Baz {
  @deprecated({alternative: 'newMethod'})
  oldMethod() {

  }

  newMethod() {}
}
```
