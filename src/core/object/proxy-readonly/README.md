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

const
  readonly = proxyReadonly(original);

try {
  readonly.user.name = 'Jack';

} catch (err) {
  console.log(err);
}

try {
  readonly.user.skills.push('boxing');

} catch (err) {
  console.log(err);
}

console.log(readonly.user.name === original.user.name);

// ['singing', 'dancing', 'programming']
console.log(readonly.user.skills);

// ['singing', 'dancing', 'programming']
console.log(original.user.skills);
```

## Known limitations

Because the process of cloning uses native Proxy objects, there are a few limitations:

1. You can't use `Object.preventExtension` at a clone object because it should be applied to the original object.

## Common readonly

The module also exports a common implementation to make objects read-only. If the runtime supports Proxy API, it will be used.

```js
import { readonly } from 'core/object/proxy-readonly';

const original = {
  a: 1
};

const
  readonly = proxyReadonly(original);

try {
  readonly.a++;

} catch (err) {
  console.log(err);
}

// 1
console.log(readonly.a);
```
