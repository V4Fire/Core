# core/json/stream/filters

This module provides a bunch of classes to filter tokens produced by `json/stream/parser` Parser.
Also, the module provides an abstract class to create your own filters.

## Usage

```js
import Parser from 'core/json/stream/parser';
import { Filter } from 'core/json/stream/filters';

const
  parser = Parser.from(['{"total": 2, "data": [1, 2]}'], new Filter('data'));
  tokens = [];

for await (const token of parser) {
  tokens.push(token);
}

/* [
  {name: 'startObject'},
  {name: 'startKey'},
  {name: 'stringChunk', value: 'data'},
  {name: 'endKey'},
  {name: 'keyValue', value: 'data'},
  {name: 'startArray'},
  {name: 'startNumber'},
  {name: 'numberChunk', value: '1'},
  {name: 'endNumber'},
  {name: 'numberValue', value: '1'},
  {name: 'startNumber'},
  {name: 'numberChunk', value: '2'},
  {name: 'endNumber'},
  {name: 'numberValue', value: '2'},
  {name: 'endArray'},
  {name: 'endObject'}
] */
console.log(tokens);
```

## Filters

### Filter

An instance of the Filter class takes an iterable object of parsed tokens, filters values matched with the specified condition,
and yields only the filtered tokens.

#### Preserving tokens by the specified path

If a filter condition is provided as a string, the Filter instance will interpret it as a property path that should preserve.

```js
import Parser from 'core/json/stream/parser';
import Assembler from 'core/json/stream/assembler';
import { Filter } from 'core/json/stream/filters';

const
  src = ['{"total": 2, "data": {"a": [1, 2], "b": [2, 3]}}'],
  parser = Parser.from(src, new Filter('data.a'), new Assembler());

for await (const val of parser) {
  // {data: {a: [1, 2]}
  console.log(val);
}
```

#### Preserving tokens with paths matched to the specified regular expression

If a filter condition is provided as a RegExp, the Filter instance will interpret it as a pattern of property paths that should preserve.

```js
import Parser from 'core/json/stream/parser';
import Assembler from 'core/json/stream/assembler';
import { Filter } from 'core/json/stream/filters';

const
  src = ['{"total": 2, "data": {"a": [1, 2], "b": [2, 3]}}'],
  parser = Parser.from(src, new Filter(/\b[ab]\b/), new Assembler());

for await (const val of parser) {
  // {data: {a: [1, 2], b: [2, 3]}}
  console.log(val);
}
```

#### Preserving tokens filtered via the specified function

If a filter condition is provided as a function, the Filter instance will invoke it at each token and preserve it if the function returns true.
The filter function takes a property path and token.

```js
import Parser from 'core/json/stream/parser';
import Assembler from 'core/json/stream/assembler';
import { Filter } from 'core/json/stream/filters';

const
  src = ['{"total": 2, "data": {"a": [1, true, "foo", 2], "b": [2, 3]}}'],
  filter = (path, token) => path.includes('a') && token.name === 'numberValue',
  parser = Parser.from(src, new Filter(filter), new Assembler());

for await (const val of parser) {
  // {data: {a: [1, 2]}}
  console.log(val);
}
```

### Pick

An instance of the Pick class takes an iterable object of parsed tokens and yields only tokens by the specified selector.

#### Picking tokens by the specified path

If a pick selector is provided as a string, the Pick instance will interpret it as a property path that should pick.

```js
import Parser from 'core/json/stream/parser';
import Assembler from 'core/json/stream/assembler';
import { Pick } from 'core/json/stream/filters';

const
  src = ['{"total": 2, "data": {"a": [1, 2], "b": [2, 3]}}'],
  parser = Parser.from(src, new Pick('data.a'), new Assembler());

for await (const val of parser) {
  // [1, 2]
  console.log(val);
}
```

#### Picking tokens with paths matched to the specified regular expression

If a pick selector is provided as a RegExp, the Pick instance will interpret it as a pattern of property path that should pick.

```js
import Parser from 'core/json/stream/parser';
import Assembler from 'core/json/stream/assembler';
import { Pick } from 'core/json/stream/filters';

const
  src = ['{"total": 2, "data": {"a": [1, 2], "b": [2, 3]}}'],
  parser = Parser.from(src, new Pick(/\b[ab]\b/), new Assembler());

for await (const val of parser) {
  // [1, 2]
  console.log(val);
}
```

##### Multiple mode

When you need to pick more than one set of tokens by a selector, use the additional `multiple` option.

```js
import Parser from 'core/json/stream/parser';
import Assembler from 'core/json/stream/assembler';
import { Pick } from 'core/json/stream/filters';

const
  src = ['{"total": 2, "data": {"a": [1, 2], "b": [2, 3]}}'],
  parser = Parser.from(src, new Pick(/\b[ab]\b/, {multiple: true}), new Assembler());

const
  values = [];

for await (const val of parser) {
  values.push(val);
}

// [[1, 2], [2, 3]]
console.log(values);
```

#### Picking tokens filtered via the specified function

If a pick selector is provided as a function, the Pick instance will invoke it at each token and pick it if the function returns true.
The pick function takes a property path and token.

```js
import Parser from 'core/json/stream/parser';
import Assembler from 'core/json/stream/assembler';
import { Pick } from 'core/json/stream/filters';

const
  src = ['{"total": 2, "data": {"a": [1, true, "foo", 2], "b": [2, 3]}}'],
  selector = (path, token) => path.includes('a') && token.name === 'numberValue',
  parser = Parser.from(src, new Pick(selector), new Assembler());

for await (const val of parser) {
  // 1
  console.log(val);
}
```

##### Multiple mode

When you need to pick more than one set of tokens by a selector, use the additional `multiple` option.

```js
import Parser from 'core/json/stream/parser';
import Assembler from 'core/json/stream/assembler';
import { Pick } from 'core/json/stream/filters';

const
  src = ['{"total": 2, "data": {"a": [1, true, "foo", 2], "b": [2, 3]}}'],
  selector = (path, token) => path.includes('a') && token.name === 'numberValue',
  parser = Parser.from(src, new Pick(selector), new Assembler());

const
  values = [];

for await (const val of parser) {
  values.push(val);
}

// [1, 2]
console.log(values);
```

### AbstractFilter

When creating a new filter class, extend it from the `AbstractFilter` and implement the `checkToken` method.
In addition, you can override `finishTokenProcessing` if needed.

```typescript
import type { Token } from 'core/json/stream/parser';

import Super from 'core/json/stream/filters/abstract-filter';
import type { TokenFilter, FilterOptions } from 'core/json/stream/filters/interface';

export default class PickObject extends Super {
  public constructor(filter: TokenFilter, opts?: FilterOptions) {
    super(filter, opts);
  }

  /** @inheritDoc */
  protected*checkToken(chunk: Token): Generator<boolean | Token> {
    switch (chunk.name) {
      case 'startObject':
      case 'startArray':
        if (this.filter(this.stack, chunk)) {
          yield chunk;

          // eslint-disable-next-line @typescript-eslint/unbound-method
          this.processToken = this.passObject;
          this.depth = 1;

          return true;
        }

        break;

      default:
        // Do nothing
    }

    return false;
  }
}
```

#### API

##### constructor

The instance constructor takes two parameters.
The first one is a filter. The second one is an object with optional filter parameters.
A filter can be defined via a string, regular expression, or function.
By providing the optional `multiple` parameter, you can customize should or not to stop filter after the first successful token.

##### processToken

Processes the passed JSON token and yields tokens.

```js
import Parser from 'core/json/stream/parser';
import { Pick } from 'core/json/stream/filters';

const
  pick = new Pick('0'),
  tokens = [];

for (const token of new Parser().processChunk('["foo"]')) {
  tokens.push(...pick.processToken(token));
}

tokens.push(...pick.finishTokenProcessing());
```

##### finishTokenProcessing

Closes all unclosed tokens and returns a Generator of filtered tokens.
The method must be called after the end of filtration.
