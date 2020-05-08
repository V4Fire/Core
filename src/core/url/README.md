# core/url

This module provides a bunch of functions to work with URL strings, such as parsing/serializing, concatenating groups of URLs to one, etc.

## Concatenation of URL-s

```javascript
import { concatUrls } from 'core/url';
concatUrls('foo/baz', '/bar', 'bla') === '/foo/baz/bar/bla';
```

## Parsing/Serialization

```javascript
import { fromQueryString, toQueryString } from 'core/url';

const data = {
  foo: 1,
  bar: true,
  baz: [1, 2, 3],
  ban: {a: 2}
};

toQueryString(data) === 'ban_a=2&bar=true&baz=1&baz=2&baz=3&foo=1';

// {foo: 1, bar: true, baz: [1, 2, 3], ban: {a: 2}}
fromQueryString(toQueryString(data), {separator: '_'});
```
