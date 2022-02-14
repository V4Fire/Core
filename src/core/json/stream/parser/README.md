# core/json/stream/parser

This module provides a class to parse JSON from separated string chunks, i.e., stream form.
The class instance takes a JSON chunk and returns a Generator that produces parsed JSON tokens; otherwise, it throws a syntax error.

## Usage

```js
import Parser from 'core/json/stream/parser';

const
  parser = new Parser(),
  tokens = [];

for (const chunk of ['{"key', '": 2', '}']) {
  tokens.push(...parser.processChunk(chunk));
}

/* [
  {name: 'startObject'},
  {name: 'startKey'},
  {name: 'stringChunk', value: 'key'},
  {name: 'endKey'},
  {name: 'keyValue', value: 'key'},
  {name: 'startNumber'},
  {name: 'numberChunk', value: '2'},
  {name: 'endNumber'},
  {name: 'numberValue', value: '2'},
  {name: 'endObject'}
] */
console.log(tokens);
```

## API

### processChunk

The method processes the passed JSON chunk and yields tokens via a Generator.

```js
import Parser from 'core/json/stream/parser';

const
  parser = new Parser();

/* [
  {name: 'startArray'},
  {name: 'startNumber'},
  {name: 'numberChunk', value: '1'},
  {name: 'endNumber'},
  {name: 'numberValue', value: '1'},
  {name: 'endArray'}
] */
console.log([...parser.processChunk('[1]')]);
```

## Tokens

This is the list of data objects produced by Parser in the correct order:

```js
// A sequence can have 0 or more items.
// A value is one of: object, array, string, number, null, true, false.

// A parser produces a sequence of values:

// Object
({name: 'startObject'});

// Sequence of object properties: key, then value
({name: 'endObject'});

// ----

// Array
({name: 'startArray'});

// Sequence of values
({name: 'endArray'});

// ----

// Key
({name: 'startKey'});

// Sequence of string chunks:
({name: 'stringChunk', value: 'string value chunk'});
({name: 'endKey'});
({name: 'keyValue', value: 'key value'});

// ----

// String
({name: 'startString'});

// Sequence of string chunks:
({name: 'stringChunk', value: 'string value chunk'});
({name: 'endString'});
({name: 'stringValue', value: 'string value'});

// ----

// Number
({name: 'startNumber'});

// Sequence of number chunks (as strings):
({name: 'numberChunk', value: 'string value chunk'});
({name: 'endNumber'});
({name: 'numberValue', value: 'string value'});

// ----

// null, true, false
({name: 'nullValue', value: null});
({name: 'trueValue', value: true});
({name: 'falseValue', value: false});
```

All value chunks (stringChunk and numberChunk) should be concatenated in order to produce a final value.
Empty string values may have no chunks. String chunks may have empty values.

**Important:** values of `numberChunk` and `numberValue` are strings, not numbers.
It is up to a downstream code to convert it to a number using `parseInt(x)`, `parseFloat(x)` or simply `x => +x`.

All items follow in the correct order. If something is going wrong, a parser will produce an error event. For example:

* All `startXXX` are balanced with `endXXX`.
* Between `startKey` and `endKey` can be zero or more `stringChunk` items. No other items can be seen.
* After `startObject` optional key-value pairs emitted in a strict pattern: a key-related item, then a value, and
  this cycle can be continued until all key-value pairs are streamed.
  * It is not possible for a key to be missing a value.

* All `endObject` are balanced with the corresponding `startObject`.
* `endObject` cannot close `startArray`.
* Between `startString` and `endString` can go 0 or more `stringChunk`, but no other items.
* `endKey` can be optionally followed by `keyValue`, then a new value will be started, but no `endObject`.

In short, the item sequence is always correctly formed. No need to do unnecessary checks.
