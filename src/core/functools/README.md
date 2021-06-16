# core/functools

This module provides a bunch of functions and decorators to wrap another functions with adding some extra functionality.
Also, see submodules of this module:

* [`core/functools/deprecation`](src_core_functools_deprecation.html);
* [`core/functools/not-implemented`](src_core_functools_not-implemented.html);
* [`core/functools/trait`](src_core_functools_trait.html).

## once

Decorator for `Function.prototype.once`.
Returns a new function that allows to invoke the specified function only once.

```js
import { once, debounce } from 'core/functools';

class Foo {
  @once
  bar() {
    return Math.random();
  }
}

const foo = new Foo();
console.log(foo.bar() === foo.bar());
```

## debounce

Decorator for `Function.prototype.debounce`
Returns a new function that allows to invoke a function, which it takes, only with the specified delay.
The next invocation of the function will cancel the previous.

```js
import { debounce } from 'core/functools';

class Foo {
  @debounce(500)
  bla() {
    console.log('Bang!');
  }
}
```

## throttle

Decorator for `Function.prototype.throttle`.
Returns a new function that allows to invoke a function, which it takes, not more often than the specified delay.
The first invoking of a function will run immediately, but all rest invokes will be merged to one and
executes after the specified delay.

```js
import { throttle } from 'core/functools';

class Foo {
  @throttle(500)
  bla() {
    console.log('Bang!');
  }
}
```
