# core/functools

This module provides a bunch of functions and decorators for wrapping another functions with additional functionality.

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
