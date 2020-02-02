# core/functools

This module provides a bunch of functions and decorators to wrap another functions with adding some extra functionality.

```js
import { once, debounce } from 'core/meta';

class Foo {
  @once
  bar() {
    return Math.random();
  }

  @debounce(500)
  bla() {
    console.log('Bang!');
  }
}
```
