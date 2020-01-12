# core/meta

This module provides a bunch of functions for annotation another functions with additional meta information, such as obsolescence, etc.

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
