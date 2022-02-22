# core/json/stream

This module provides a bunch of functions to work with JSON in a stream form.
The submodules contain different classes to parse, filter and assemble JSON in a stream form.

## Usage

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

## Functions

### from

Parses the specified iterable object as a JSON stream and yields tokens via a Generator.
See `core/json/stream/parser` for more information.

```js
import { from } from 'core/json/stream';

const
  parser = from('{"data": [1, 2, 3]}');

for await (const token of parser) {
  console.log(token);
}
```

### filter

Takes the specified iterable object of tokens and filters it via the specified filter.
See `core/json/stream/filters` for more information.

```js
import { from, filter } from 'core/json/stream';

const
  parser = filter(from('{"total": 3, "data": [1, 2, 3]}'), 'data');

for await (const token of parser) {
  console.log(token);
}
```

### pick

Takes the specified iterable object of tokens and pick from it value that matches the specified selector.
See `core/json/stream/filters` for more information.

```js
import { from, pick } from 'core/json/stream';

const
  parser = pick(from('{"total": 3, "data": [1, 2, 3]}'), 'data');

for await (const token of parser) {
  console.log(token);
}
```

### assemble

Takes the specified iterable object of tokens and yields an assembled item from it.
See `core/json/stream/assembler` for more information.

```js
import { from, assemble } from 'core/json/stream';

const
  parser = assemble(from('{"total": 3, "data": [1, 2, 3]}'));

for await (const val of parser) {
  // {total: 3, data: [1, 2, 3]}
  console.log(val);
}
```

### streamObject

Takes the specified iterable object of tokens representing an object and yields assembled object items.
See `core/json/stream/streamers` for more information.

```js
import { from, streamObject } from 'core/json/stream';

const
  parser = streamObject(from('{"total": 3, "data": [1, 2, 3]}'));

for await (const val of parser) {
  // {key: 'total', value: 3}
  // {key: 'data', value: [1, 2, 3]}
  console.log(val);
}
```

### streamArray

Takes the specified iterable object of tokens representing an array and yields assembled array items.
See `core/json/stream/streamers` for more information.

```js
import { from, streamArray } from 'core/json/stream';

const
  parser = streamArray(from('[1, 2, 3]'));

for await (const val of parser) {
  // {index: 0, value: 1}
  // {index: 1, value: 2]}
  // {index: 2, value: 3}
  console.log(val);
}
```
