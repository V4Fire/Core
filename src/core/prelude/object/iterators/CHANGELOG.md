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

#### :boom: Breaking Change

* Now `[key, el]` responses from an iterator will be destructured before providing to callback `Object.forEach`

## v3.77.0 (2022-03-15)

#### :rocket: New Feature

* Now iterations over iterable structures have indices as the second argument of a passed callback function `Object.forEach`

#### :bug: Bug Fix

* Fixed an issue when iterating over non-dictionary object with enabled `passDescriptor` `Object.forEach`

## v3.36.0 (2021-03-16)

#### :boom: Breaking Change

* Marked `notOwn` as deprecated. Use `propsToIterate` instead.
* Marked `withDescriptor` as deprecated. Use `passDescriptor` instead.

## v3.35.0 (2021-03-04)

#### :rocket: New Feature

* Added a new option `withNonEnumerables` `Object.forEach`

## v3.20.0 (2020-07-05)

#### :rocket: New Feature

* Added tests

#### :bug: Bug Fix

* Fixed bugs
