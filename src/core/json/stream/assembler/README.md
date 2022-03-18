# core/json/stream/assembler

This module provides a class to assemble JS values from an iterable of tokens produced by `json/stream/parser` Parser.

## Usage

```js
import Parser from 'core/json/stream/parser';
import Assembler from 'core/json/stream/assembler';

const
  src = ['{"total": 2, "data', '": {"a": [1', ', true, "foo", 2', '], "b": [2, 3]}}'],
  parser = Parser.from(src, new Assembler());

for await (const val of parser) {
  // {total: 2, data: {a: [1, true, "foo", 2], b: [2, 3]}}
  console.log(val);
}
```

## API

### constructor

The instance constructor can take an object with optional parameter.

#### [numberAsString = `false`]

Should or not parse numeric values as string literals.

```js
import Parser from 'core/json/stream/parser';
import Assembler from 'core/json/stream/assembler';

const
  parser1 = Parser.from('-13.4e-3', new Assembler({numberAsString: true}));

for await (const val of parser1) {
  // '-13.4e-3'
  console.log(val);
}

const
  parser2 = Parser.from('-13.4e-3', new Assembler());

for await (const val of parser2) {
  // -0.0134
  console.log(val);
}
```

#### reviver

The option defines a reviver function similar to `JSON.parse`.

```js
import { convertIfDate } from 'core/json';

import Parser from 'core/json/stream/parser';
import Assembler from 'core/json/stream/assembler';

const
  parser = Parser.from(JSON.stringify([new Date()]), new Assembler({reviver: convertIfDate}))

for await (const val of parser) {
  // true
  console.log(val[0] instanceof Date);
}
```

### Properties

#### key

A property key of the active assembling value.

#### value

A value of the active assembled item.
If it is a container (object or array), all new assembled values will be added to it.

### Getters

#### isValueAssembled

Indicates that the active value is fully assembled.

#### depth

A depth of the assembling structure.

### Methods

#### processToken

Processes the passed JSON token and yields the assembled values

```js
import Parser from 'core/json/stream/parser';
import Assembler from 'core/json/stream/assembler';

const
  assembler = new Assembler();

for (const token of new Parser().processChunk('["foo"]')) {
  // ["foo"]
  console.log(...assembler.processToken(token));
}
```
