# core/functools/implementation

This module provides a bunch of functions and decorators to mark unimplemented functions with the special flag.

```js
import { unimplement, unimplemented } from 'core/functools/implementation';

const foo = unimplement({name: 'foo', alternative: 'bar'}, () => {

});

function bar() {

}

class Baz {
  @unimplemented({alternative: 'newMethod'})
  oldMethod() {

  }

  newMethod() {}
}
```
