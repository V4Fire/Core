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
    skills: ['singing', 'dancing', 'programming']
  }
};

const clone = proxyClone(original);

clone.user.name = 'Jack';
clone.user.skills.push('boxing');

console.log(clone.user.name !== original.user.name);

// ['singing', 'dancing', 'programming', 'boxing']
console.log(clone.user.skills);

// ['singing', 'dancing', 'programming']
console.log(original.user.skills);
```

## Known limitations

Because the process of cloning uses native Proxy objects, there are a few limitations:

1. You can't use `Object.preventExtension` at a clone object because it should be applied to the original object.
2. `Object.isExtensible` always returns a value from the original object.
3. If the original object prevents extensions, then a cloned object will also prevent these extensions.
4. You can't redefine a property descriptor if it contains `configurable: false` attribute in the original object.
