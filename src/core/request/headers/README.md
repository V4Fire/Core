# core/request/headers

This module provides a class to create a set of HTTP headers.
The class' API is pretty similar to native the [Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers) class
but has some extra functionality and doesn't implement the [Guard]((https://developer.mozilla.org/en-US/docs/Glossary/Guard)) conceptions.

## Why not just use the native Headers class?

Because, the `core/request` module can use different engines, but not only `fetch` or `XMLHttpRequest`.
These engines can have different peculiarities, so we need to create a new abstraction.

## Initial headers

There is a possibility to provide initial headers while creating a new Headers instance.
These headers can be provided using a simple dictionary when keys are header names and values are header values.
The value can be defined as a string or list of strings - all values will be joined into one string with a comma separator.

```js
import Headers from 'core/request/headers';

const headers = new Headers({
  'Content-Language': ['en', 'ru'],
  'Cache-Control': 'no-cache'
});

console.log(headers.get('Content-Language')); // 'en, ru'
```

Also, initial headers can be provided via another Headers instance or native browser Headers instance.

```js
import Headers from 'core/request/headers';

const headers = new Headers({
  'Content-Language': ['en', 'ru'],
  'Cache-Control': 'no-cache'
});

const headers2 = new Headers(headers);
console.log(headers2.get('Content-Language')); // 'en, ru'
```

Or, you can pass a string with raw HTTP headers.

```js
import Headers from 'core/request/headers';

const headers = new Headers(`
  Content-Language: en, ru
  Cache-control: no-cache
`);

console.log(headers.get('Content-Language')); // 'en, ru'
```

## Interpolation of headers' keys and values

The class supports a feature when headers' keys or values link to extra values from request data.
To do this, place within header key or value one or more template directives. Let's see the example below.

```js
import Headers from 'core/request/headers';

const query = {
  type: 'platform',
  typeValue: 'android'
};

const headers = new Headers(
  {
    'X-${type}': '${typeValue} scheme'
  },

  query
);

console.log(headers.get('X-${type}')); // 'android scheme'
console.log(headers.get('x-platform')); // 'android scheme'

// Notice, after applying values to templates, all used values are marked as non-enumerable
console.log(query.propertyIsEnumerable('type')); // false
console.log(query.propertyIsEnumerable('typeValue')); // false
```

## Headers' instance as a simple dictionary

For backward compatibility with previous versions of V4Fire, the instance of the Headers class can be used as a simple dictionary.

```js
import Headers from 'core/request/headers';

const headers = new Headers({
  'Content-Language': ['en', 'ru'],
  'Cache-Control': 'no-cache'
});

console.log(headers['content-language']); // 'en, ru'
console.log(Object.keys(headers)); // ['content-language', 'cache-control']
```

To make headers read-only, use `Object.freeze`.

```js
import Headers from 'core/request/headers';

const headers = Object.freeze(new Headers({
  'Content-Language': ['en', 'ru'],
  'Cache-Control': 'no-cache'
}));

try {
  headers.set('Cache-Control', 'no-store');

} catch (err) {
  console.log(err);
}

console.log(headers['cache-control']); // 'no-cache'
```
