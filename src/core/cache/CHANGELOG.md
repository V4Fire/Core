Changelog
=========

> **Tags:**
> - :boom:       [Breaking Change]
> - :rocket:     [New Feature]
> - :bug:        [Bug Fix]
> - :memo:       [Documentation]
> - :house:      [Internal]
> - :nail_care:  [Polish]

## v3.??.0 (2022-0?-??)

#### :boom: Breaking Change
* Changed typed parameters of `Cache` interface from `<V, K>` to `<K, V>`
* Change a default `Cache` interface key type

#### :rocket: New Feature

* Added new cache `DefaultCache`
* Added a new method `clone`

#### :bug: Bug Fix

* Fixed type inference in decorator

## v3.50.0 (2021-06-07)

#### :rocket: New Feature

* Now all cache structures are iterable objects
* Added new iterators `values`, `entries`
* Added `size`

#### :memo: Documentation

* Improved documentation `core/cache`

## v3.20.0 (2020-07-05)

#### :boom: Breaking Change

* Changed the returning value of `clear` from `Set` to `Map`

#### :rocket: New Feature

* Added tests
