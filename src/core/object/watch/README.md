# core/object/watch

This module provides API to watch changes from an object.

```js
import watch from 'core/object/watch';

const obj = {
  a: 1,
  b: [],
  c: new Map(),
  d: {}
};

const {proxy, unwatch} = watch(obj, {deep: true, immediate: true}, (value, oldValue) => {
  console.log(value, oldValue);
});

proxy.a++;
proxy.b.push(1);
proxy.c.set(1, 2);
proxy.d.foo = 'bar';

unwatch();
```
