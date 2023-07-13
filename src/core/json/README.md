# core/json

This module provides a bunch of helper functions to serialize/parse JSON data.

## Stream API

The `core/json/stream` submodule provides API to work with JSON in a stream form.

```js
import { convertIfDate } from 'core/json';
import { from, pick, streamArrray } from 'core/json/stream';

const
  parser = streamArrray(pick(from('{"data": [1, 2, 3]}'), 'data'), {reviver: convertIfDate});

for await (const val of parser) {
  // {index: 0, value: 1}
  // {index: 1, value: 2}
  // {index: 2, value: 3}
  console.log(val);
}
```

## Revivers

### convertIfDate

A reviver for the `JSON.parse` method: converts all strings that are looks like a date to Date.

```js
import { convertIfDate } from 'core/json';

// true
console.log(JSON.parse('"2015-10-12"', convertIfDate).is(new Date(2015, 9, 12)));
```

### evalWith

Returns a reviver for `JSON.parse`, which interprets JSON as a JS expression in a given context.
The expression can be in two forms:

1. `call` invokes a function at a specified path with given arguments.

   ```js
   // ['b-button', 'b-button_focused_true']
   console.log(
     JSON.parse('["call", "provide.componentClasses", "b-button", {"focused": true}]', evalWith(myComponent))
   );
   ```

2. `get` retrieves the value from a defined path.

   ```js
   // ['b-button']
   console.log(JSON.parse('["get", "meta.componentName"]', evalWith(myBButton)));
   ```

Also, the reviver supports nested expression for the `call` arguments. For example:

```js
// ['b-button', 'b-button_focused_true']
console.log(
  JSON.parse('["call", "provide.componentClasses", "b-button", ["get", "mods"]]', evalWith(myComponent))
);
```
