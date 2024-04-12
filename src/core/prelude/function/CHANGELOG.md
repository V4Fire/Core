Changelog
=========

> **Tags:**
> - :boom:       [Breaking Change]
> - :rocket:     [New Feature]
> - :bug:        [Bug Fix]
> - :memo:       [Documentation]
> - :house:      [Internal]
> - :nail_care:  [Polish]

## v4.0.0-alpha.29 (2024-04-04)

#### :boom: Breaking Change

* Dropped API support with rest parameters in the `addToPrototype` `core/prelude/function/extend`.
  Migration Guide: `Foo.addToPrototype(bar, baz)` -> `Foo.addToPrototype({bar, baz})`.

## v3.27.8 (2020-11-05)

#### :bug: Bug Fix

* Fixed a bug with the redundant saving of the state `curry`

```js
const a = (b, c) => b + c;
const e = a.curry()
console.log(e(4)(5)); // 9
console.log(e(3)(4)); // Error
```

## v3.20.0 (2020-07-05)

#### :rocket: New Feature

* Added tests
* Added `single` parameter to `lazy/throttle`

#### :bug: Bug Fix

* Fixed bugs
