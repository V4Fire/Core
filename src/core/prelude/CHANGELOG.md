Changelog
=========

> **Tags:**
> - :boom:       [Breaking Change]
> - :rocket:     [New Feature]
> - :bug:        [Bug Fix]
> - :memo:       [Documentation]
> - :house:      [Internal]
> - :nail_care:  [Polish]

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
