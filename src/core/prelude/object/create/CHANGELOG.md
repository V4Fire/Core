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

#### :rocket: New Feature

* Now `Object.reject and Object.select` respect object without prototypes

```
// true
console.log(Object.reject({a: 1, b: 2, __proto__: null}, 'a').__proto__ == null);
```

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

## v3.20.0 (2020-07-05)

#### :rocket: New Feature

* Added tests
* Added support for a custom function filter `Object.select/reject`

#### :bug: Bug Fix

* Fixed bugs
