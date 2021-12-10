# core/object/proxy-clone

The module returns a function to create clones of the passed objects.
This function creates a Proxy object based on the given to create a clone.
It means that this operation is lazily and very effective but depends on the native support of proxy objects.

```js
import proxyClone from 'core/object/proxy-clone';

const original = {
  user: {
    name: 'Bob',
    age: 56,
    skils: ['singing', 'dancing', 'programming']
  }
};

const clone = proxyClone(original);

clone.user.name = 'Jack';
clone.user.skils.push('boxing');

console.log(clone.user.name !== original.user.name);

// ['singing', 'dancing', 'programming', 'boxing']
console.log(clone.user.skils);

// ['singing', 'dancing', 'programming']
console.log(original.user.skils);
```
