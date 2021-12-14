# core/object/proxy-readonly

The module returns a function to create read-only views of the passed objects.
This function creates a Proxy object based on the given to create a view.
It means that this operation is lazily and very effective but depends on the native support of proxy objects.

```js
import proxyReadonly from 'core/object/proxy-readonly';

const original = {
  user: {
    name: 'Bob',
    age: 56,
    skills: ['singing', 'dancing', 'programming']
  }
};

const clone = proxyReadonly(original);

try {
  clone.user.name = 'Jack';

} catch (err) {
  console.log(err);
}

try {
  clone.user.skills.push('boxing');

} catch (err) {
  console.log(err);
}

console.log(clone.user.name === original.user.name);

// ['singing', 'dancing', 'programming']
console.log(clone.user.skills);

// ['singing', 'dancing', 'programming']
console.log(original.user.skills);
```

## Known limitations

Because the process of cloning uses native Proxy objects, there are a few limitations:

1. You can't use `Object.preventExtension` at a clone object because it should be applied to the original object.
2. `Object.isExtensible` always returns a value from the original object.

## isReadonly

This function returns true if the passed value is read-only. It can be a primitive value, frozen object, or an object wrapped via `proxyReadonly`.

```js
import proxyReadonly, { isReadonly } from 'core/object/proxy-readonly';

isReadonly(1); // true

isReadonly(Object.freeze({})); // true

isReadonly(proxyReadonly({})); // true

isReadonly({}); // false
```
