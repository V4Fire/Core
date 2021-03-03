Changelog
=========

> **Tags:**
> - :boom:       [Breaking Change]
> - :rocket:     [New Feature]
> - :bug:        [Bug Fix]
> - :memo:       [Documentation]
> - :house:      [Internal]
> - :nail_care:  [Polish]

## v3.34.0 (2021-03-03)

#### :boom: Breaking Change

* Changed a signature of `extendFilter` `mixin`

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

* Fixed a bug when Dates could be transformed to strings after cloning `Object.fastClone`

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
