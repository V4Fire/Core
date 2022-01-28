Changelog
=========

> **Tags:**
> - :boom:       [Breaking Change]
> - :rocket:     [New Feature]
> - :bug:        [Bug Fix]
> - :memo:       [Documentation]
> - :house:      [Internal]
> - :nail_care:  [Polish]

## v3.73.6 (2022-01-31)

#### :bug: Bug Fix

* Fixed setting of the original prototype to the proxy object with the `accessors` engine

## v3.73.3 (2022-01-10)

#### :bug: Bug Fix

* Fixed emitting of mutation events produced via `Object.defineProperty`

## v3.73.0 (2021-12-14)

#### :bug: Bug Fix

* Now all properties that are added via `Object.defineProperty` can be handled via a proxy-based watcher

## v3.72.0 (2021-12-10)

#### :bug: Bug Fix

* Removed generator methods from base iterators

## v3.62.3 (2021-11-09)

#### :bug: Bug Fix

* Fixed deep watching for array dependencies

## v3.62.2 (2021-11-09)

#### :bug: Bug Fix

* Fixed deep watching for an array element

## v3.62.1 (2021-11-08)

#### :bug: Bug Fix

* Fixed watching for an array by a complex path with indices

## v3.56.1 (2021-07-28)

#### :bug: Bug Fix

* Readonly non-configurable values can't be watched via Proxy

## v3.56.0 (2021-07-25)

#### :bug: Bug Fix

* Fixed an issue when modifying a prototype value of the watched object

## v3.54.4 (2021-07-18)

#### :bug: Bug Fix

* Fixed a bug when the tied path can be mutated from handlers

## v3.54.3 (2021-07-16)

#### :bug: Bug Fix

* Fixed watching for specific paths with collapsing

## v3.54.2 (2021-07-14)

#### :bug: Bug Fix

* Fixed watching of values from iterable objects

## v3.45.0 (2021-05-12)

#### :bug: Bug Fix

* Fixed a bug when watching an object by the specified path when occurring a mutation of nested properties

#### :memo: Documentation

* Improved documentation

## v3.32.0 (2021-02-05)

#### :bug: Bug Fix

* Fixed an issue when trying to set a property by the complex path

## v3.27.4 (2020-09-29)

#### :bug: Bug Fix

* Fixed a bug when a deleted property won't be deleted from an object if using `unset`
* Fixed restoring of an old value `engines/accessors/set`

#### :house: Internal

* Refactoring

## v3.27.2 (2020-09-18)

#### :bug: Bug Fix

* Fixed a bug when a new value to set is equal by a link with the previous

## v3.22.5 (2020-07-31)

#### :bug: Bug Fix

* Fixed `engines/accessors/set`

## v3.22.2 (2020-07-21)

#### :bug: Bug Fix

* Fixed deep watching by a complex path with overrides

```js
const obj = {
  a: {
    b: {
      c: 1
    }
  }
};

const {proxy} = watch(obj, 'a.b.c', (newVal, oldVal) => {
  console.log(newVal, oldVal);
});

proxy.a.b = {c: 1};
```

## v3.22.1 (2020-07-20)

#### :bug: Bug Fix

* Fixed deep watching by a complex path

## v3.22.0 (2020-07-14)

#### :rocket: New Feature

* Added `isProxy`

## v3.20.0 (2020-07-05)

#### :rocket: New Feature

* Added tests

#### :bug: Bug Fix

* Fixed bugs

## v3.16.0 (2020-05-21)

#### :rocket: New Feature

* Added a feature to provide a custom watch engine

#### :bug: Bug Fix

* Fixed watching of arrays
* Fixed proxy arrays concatenation

#### :house: Tests

* Added `spec.js` with some test cases for arrays
