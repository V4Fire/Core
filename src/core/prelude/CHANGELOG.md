Changelog
=========

> **Tags:**
> - :boom:       [Breaking Change]
> - :rocket:     [New Feature]
> - :bug:        [Bug Fix]
> - :memo:       [Documentation]
> - :house:      [Internal]
> - :nail_care:  [Polish]

## v3.54.0 (2021-??-??)

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

* Fixed a bug when Dates could be transformed to strings after cloning `Object.fastClone`

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
