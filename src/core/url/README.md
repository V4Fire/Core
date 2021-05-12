# core/url

This module provides a bunch of functions to work with URL strings, such as parsing/serializing, concatenating groups of URLs to one, etc.

## Concatenation of URL-s

```js
import { concatURLs } from 'core/url';
concatURLs('foo/baz', '/bar', 'bla') === '/foo/baz/bar/bla';
```

## Parsing/Serialization

```js
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

These methods can take additional options:

````typescript
interface ToQueryStringOptions {
  /**
   * If false, then the result string won't be encoded by using `encodeURIComponent`
   * @default `true`
   */
  encode?: boolean;

  /**
   * Separator for nested properties
   *
   * @default `'_'`
   *
   * @example
   * ```js
   * // foo.bar=1
   * toQueryString({foo: {bar: 1}}, {separator: '.'});
   * ```
   */
  separator?: string;

  /**
   * If true, then nested properties will be encoded by using `[]` syntax
   *
   * @default `false`
   *
   * @example
   * ```js
   * // foo[]=1&bar[bla]=2
   * toQueryString({foo: [1], bar: {bla: 2}}, {arraySyntax: true});
   * ```
   */
  arraySyntax?: boolean;

  /**
   * Filters values that shouldn't be serialized.
   * By default, the function skip all values with null-s and empty strings.
   *
   * @param value
   * @param key - property key
   * @param path - accumulated property path `({a: {b: 1}} => 'a_b')`
   *
   * @example
   * ```js
   * // foo=1
   * toQueryString({foo: 1, bar: {bla: 2}}, {paramsFilter: (el, key) => key !== 'bla'});
   * ```
   */
  paramsFilter?(value: unknown, key: string, path?: string): unknown;
}

interface FromQueryStringOptions {
  /**
   * If false, then the passed string won't be decoded by using `decodeURIComponent`
   * @default `true`
   */
  decode?: boolean;

  /**
   * If false, then all parsed values won't be converted from a string
   *
   * @default `true`
   *
   * @example
   * ```js
   * // {foo: '1'}
   * fromQueryString('foo=1', {convert: false});
   * ```
   */
  convert?: boolean;

  /**
   * Separator for nested properties
   *
   * @example
   * ```js
   * // {foo: {bar: 1}}
   * fromQueryString('foo_bar=1', {separator: '_'});
   * ```
   */
  separator?: string;

  /**
   * If true, then nested properties will be decoded by using `[]` syntax
   *
   * @default `false`
   *
   * @example
   * ```js
   * // {foo: [1], bar: {bla: 2}}
   * fromQueryString('foo[]=1&bar[bla]=2', {arraySyntax: true});
   * ```
   */
  arraySyntax?: boolean;
}
````
