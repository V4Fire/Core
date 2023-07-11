Changelog
=========

> **Tags:**
> - :boom:       [Breaking Change]
> - :rocket:     [New Feature]
> - :bug:        [Bug Fix]
> - :memo:       [Documentation]
> - :house:      [Internal]
> - :nail_care:  [Polish]

## v3.??.?? (2022-??-??)

#### :rocket: New Feature

* Added result hashing for `Object.fastHash`

## v3.78.0 (2022-03-16)

#### :boom: Breaking Change

* Now `[key, el]` responses from an iterator will be destructured before providing to callback `Object.forEach`

## v3.77.0 (2022-03-15)

#### :rocket: New Feature

* Now iterations over iterable structures have indices as the second argument of a passed callback function `Object.forEach`

#### :bug: Bug Fix

* Fixed an issue when extending an object with preserving descriptors and array concatenation `Object.mixin`
* Fixed an issue when iterating over non-dictionary object with enabled `passDescriptor` `Object.forEach`

## v3.74.4 (2022-01-24)

#### :house: Internal

* Now `Object.fastClone` will use `structredClone` if it is possible

## v3.70.3 (2021-12-08)

#### :bug: Bug Fix

* Restored the native behavior of `Object.hasOwnProperty`

## v3.63.0 (2021-11-16)

#### :rocket: New Feature

* Now `Object.get` can access properties through promises

## v3.60.0 (2021-10-01)

#### :rocket: New Feature

* Added `Number.isSafe` and `Number.prototype.isSafe`

#### :bug: Bug Fix

* Fixed parsing of numbers `Object.parse`

## v3.58.0 (2021-09-01)

#### :bug: Bug Fix

* Fixed comparing of `Map` and `Set` structures `Object.fastCompare`

## v3.56.0 (2021-07-25)

#### :rocket: New Feature

* Now `Object.hasOwnProperty` supports symbols

## v3.54.0 (2021-07-09)

#### :boom: Breaking Change

* The module has been renamed from `parse` to `convert`

#### :rocket: New Feature

* Added `Object.trySerialize`

## v3.36.0 (2021-03-16)

#### :boom: Breaking Change

* `mixin`:
  * Marked `onlyNew` as deprecated. Use `propsToCopy` instead.
  * Marked `withDescriptor` and `withAccessors` as deprecated. Use `withDescriptors` instead.
  * Marked `withUndef` as deprecated. Use `skipUndefs` instead.
  * Marked `concatArray` and `concatFn` as deprecated. Use `concatArrays` instead.

* `iterators`:
  * Marked `notOwn` as deprecated. Use `propsToIterate` instead.
  * Marked `withDescriptor` as deprecated. Use `passDescriptor` instead.

## v3.34.0 (2021-03-03)

#### :boom: Breaking Change

* Changed a signature of `extendFilter` `mixin`

#### :rocket: New Feature

* Now `Object.reject and Object.select` respect object without prototypes `create`

```
// true
console.log(Object.reject({a: 1, b: 2, __proto__: null}, 'a').__proto__ == null);
```

## v3.32.0 (2021-02-05)

#### :rocket: New Feature

* Added a new parameter `setter` for `set`

## v3.29.0 (2020-12-22)

#### :rocket: New Feature

* Added support of `Map/WeakMap/Set/WeakSet/Array` `Object.select` and `Object.reject`
* Added overloads for nullable values:
  * `Object.select`
  * `Object.reject`
  * `Object.createDict`
  * `Object.convertEnumToDict`
  * `Object.createEnumLike`
  * `Object.createMap`
  * `Object.fromArray`

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

* Extracted some types to `interface.ts` `clone`

## v3.24.0 (2020-08-12)

#### :rocket: New Feature

* Added `Object.delete`

## v3.20.0 (2020-07-05)

#### :rocket: New Feature

* Added tests

#### :bug: Bug Fix

* Fixed bugs
