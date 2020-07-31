Changelog
=========

> **Tags:**
> - :boom:       [Breaking Change]
> - :rocket:     [New Feature]
> - :bug:        [Bug Fix]
> - :memo:       [Documentation]
> - :house:      [Internal]
> - :nail_care:  [Polish]

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
