Changelog
=========

> **Tags:**
> - :boom:       [Breaking Change]
> - :rocket:     [New Feature]
> - :bug:        [Bug Fix]
> - :memo:       [Documentation]
> - :house:      [Internal]
> - :nail_care:  [Polish]

## v4.0.0-alpha.50 (2024-11-26)

#### :rocket: New Feature

* `stderr` can now accept error details and pass them to the logger

## v4.0.0-alpha.49 (2024-10-31)

#### :bug: Bug Fix

* Fix logging bug in `pluralizeText`.
* Add logging info in i18n helpers.

## v4.0.0-alpha.47.speedup (2024-10-01)

#### :rocket: New Feature

* Added a new method `Array.toArray` `core/prelude/array`

## v4.0.0-alpha.46 (2024-09-25)

#### :boom: breaking change

* `core/prelude/i18n/helpers`
  * changed `i18n` translations format.
  * added `intl` support for pluralization.
  * now `i18n` prefer to use `intl` api for pluralization if it's possible, otherwise fallback to old plural form logic.

## v4.0.0-alpha.34 (2024-05-06)

#### :rocket: New Feature

* Added support for specifying a region for i18n

## v4.0.0-alpha.15 (2023-11-26)

#### :rocket: New Feature

* Added a constant to determine if SSR is enabled

## v4.0.0-alpha.10 (2023-09-29)

#### :nail_care: Polish

* Enhanced error message for missing translations

## v4.0.0-alpha.6 (2023-07-11)

#### :rocket: New Feature

* Added result hashing for `Object.fastHash`

#### :house: Internal

* Updated global object definition to be universal for any JS environment `core/prelude/env/const`

#### :bug: Bug Fix

* Fixed an error when calling `String.capitalize` with an empty string

## v3.90.0 (2022-02-09)

#### :boom: Breaking Change

* Redesigned internationalization module

## v3.82.0 (2022-04-04)

#### :rocket: New Feature

* Added new methods `Object.isUndef`, `Object.isNull`, `Object.isNullable`

## v3.78.0 (2022-03-16)

#### :boom: Breaking Change

* Now `[key, el]` responses from an iterator will be destructured before providing to callback `Object.forEach`

## v3.77.0 (2022-03-15)

#### :rocket: New Feature

* Added a new method `Object.isAsyncIterator`
* Now iterations over iterable structures have indices as the second argument of a passed callback function `Object.forEach`

#### :bug: Bug Fix

* Fixed an issue when extending an object with preserving descriptors and array concatenation `Object.mixin`
* Fixed an issue when iterating over non-dictionary object with enabled `passDescriptor` `Object.forEach`

## v3.74.4 (2022-01-24)

#### :house: Internal

* Now `Object.fastClone` will use `structredClone` if it is possible

## v3.74.0 (2022-01-12)

#### :rocket: New Feature

* Added a new methods `Object.isProxy` and `Object.unwrapProxy`

#### :bug: Bug Fix

* Fixed behavior of `Object.isDictionary`, `Object.isPlainObject`, `Object.isFreeze` with proxy-based objects

## v3.70.3 (2021-12-08)

#### :bug: Bug Fix

* Restored the native behavior of `Object.hasOwnProperty`

## v3.70.1 (2021-12-07)

#### :bug: Bug Fix

* Now `Array.union` doesn't spread primitive iterable values `array`

## v3.67.0 (2021-12-01)

#### :rocket: New Feature

* Added a new method `Object.cast`
* Added a new method `Object.throw`

## v3.63.0 (2021-11-16)

#### :rocket: New Feature

* Now `Object.get` can access properties through promises

## v3.62.2 (2021-11-09)

#### :bug: Bug Fix

* `data/create`:
  * Now all dates create with a timezone actual to their creation date
  * Fixed creating a date with a local timezone when it's partial (eg 'UTC +9:30')

## v3.62.0 (2021-10-29)

#### :rocket: New Feature

* Added a new method `Object.isIterable`

## v3.60.0 (2021-10-01)

#### :rocket: New Feature

* Added `Number.isSafe` and `Number.prototype.isSafe`

#### :bug: Bug Fix

* Fixed parsing of numbers `Object.parse`

## v3.59.2 (2021-09-27)

#### :bug: Bug Fix

* Now `finally` respects exceptions values from a callback `sync-promise`

## v3.59.0 (2021-09-08)

#### :rocket: New Feature

* Added a new static method `any`

## v3.58.0 (2021-09-01)

#### :rocket: New Feature

* Added a new static method `allSettled`

## v3.57.0 (2021-08-31)

#### :bug: Bug Fix

* Fixed `String.dasherize` and `String.underscore` with numbers

## v3.56.0 (2021-07-25)

#### :rocket: New Feature

* Now `Object.hasOwnProperty` supports symbols

## v3.54.0 (2021-07-09)

#### :boom: Breaking Change

* The module has been renamed from `parse` to `convert` `object`

#### :rocket: New Feature

* Added `Object.trySerialize`

## v3.52.0 (2021-06-16)

#### :boom: Breaking Change

* Now the date methods `beginningOf.../endOf...` returns a new date

## v3.42.0 (2021-04-02)

#### :rocket: New Feature

* [Added a feature of optional patterns with `Date.format`](https://github.com/V4Fire/Core/issues/163)

## v3.36.0 (2021-03-16)

#### :boom: Breaking Change

* `object/mixin`:
  * Marked `onlyNew` as deprecated. Use `propsToCopy` instead.
  * Marked `withDescriptor` and `withAccessors` as deprecated. Use `withDescriptors` instead.
  * Marked `withUndef` as deprecated. Use `skipUndefs` instead.
  * Marked `concatArray` and `concatFn` as deprecated. Use `concatArrays` instead.

* `object/iterators`:
  * Marked `notOwn` as deprecated. Use `propsToIterate` instead.
  * Marked `withDescriptor` as deprecated. Use `passDescriptor` instead.

## v3.34.0 (2021-03-03)

#### :boom: Breaking Change

* Changed a signature of `extendFilter` `object/mixin`

#### :rocket: New Feature

* Now `Object.reject and Object.select` respect object without prototypes `object/create`

```
// true
console.log(Object.reject({a: 1, b: 2, __proto__: null}, 'a').__proto__ == null);
```

## v3.32.0 (2021-02-05)

#### :rocket: New Feature

* Added a new parameter `setter` for `set` `object`

## v3.31.0 (2021-02-03)

#### :rocket: New Feature

* `regexp`:
  * Added new methods `addFlags`, `removeFlags`, `setFlags`
  * Added new static methods `addFlags`, `removeFlags`, `setFlags`, `test`

## v3.30.1 (2021-01-11)

#### :bug: Bug Fix

* Fixed iterations over chained emoji-s `string`

## v3.30.0 (2021-01-10)

#### :rocket: New Feature

* Added `letters` and `String.letters` `string`

#### :bug: Bug Fix

* Improved Unicode support `string`

## v3.29.0 (2020-12-22)

#### :rocket: New Feature

* `object/create`:
  * Added support of `Map/WeakMap/Set/WeakSet/Array` `Object.select` and `Object.reject`
  * Added overloads for nullable values:
    * `Object.select`
    * `Object.reject`
    * `Object.createDict`
    * `Object.convertEnumToDict`
    * `Object.createEnumLike`
    * `Object.createMap`
    * `Object.fromArray`

## v3.27.8 (2020-11-05)

#### :bug: Bug Fix

* Fixed a bug with the redundant saving of the state `function/curry`

```js
const a = (b, c) => b + c;
const e = a.curry()
console.log(e(4)(5)); // 9
console.log(e(3)(4)); // Error
```

## v3.27.7 (2020-11-04)

#### :bug: Bug Fix

* Fixed resolving a promise after the catch `structures/sync-promise`

```js
SyncPromise.resolve(1).catch(() => undefined).then((r) => console.log(r));
```

## v3.27.5 (2020-09-29)

#### :bug: Bug Fix

* Fixed a bug when cloning an object with cycle links `Object.fastClone`

## v3.27.3 (2020-09-25)

#### :bug: Bug Fix

* Fixed a bug when Dates could be transformed to string after cloning `Object.fastClone`

## v3.26.0 (2020-09-04)

#### :bug: Bug Fix

* Fixed a bug when strings could be compiled to Dates after cloning `Object.fastClone`

#### :house: Internal

* Extracted some types to `interface.ts` `object/clone`

## v3.20.0 (2020-07-05)

#### :rocket: New Feature

* Added tests

#### :bug: Bug Fix

* Fixed bugs
