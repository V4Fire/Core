Changelog
=========

> **Tags:**
> - :boom:       [Breaking Change]
> - :rocket:     [New Feature]
> - :bug:        [Bug Fix]
> - :memo:       [Documentation]
> - :house:      [Internal]
> - :nail_care:  [Polish]

## v3.69.0 (2021-12-03)

#### :boom: Breaking Change

* Removed deprecated API

#### :rocket: New Feature

* Added a new static method `wrapReasonToIgnore`

#### :bug: Bug Fix

* Fixed a bug when a child promise is never resolved because its parent is already rejected

## v3.60.3 (2021-10-05)

#### :bug: Bug Fix

* Fixed a bug with double resolving of a promise when it resolved by another promise

## v3.59.2 (2021-09-27)

#### :bug: Bug Fix

* Now `finally` respects exceptions values from a callback

## v3.59.0 (2021-09-08)

#### :rocket: New Feature

* Added a new static method `any`

#### :bug: Bug Fix

* Fixed some cases when a promise is resolved with another promise

## v3.58.0 (2021-09-01)

#### :boom: Breaking Change

* The module has been moved to `promise/abortable`

#### :rocket: New Feature

* Added a new static method `allSettled`

## v3.45.0 (2021-05-12)

#### :memo: Documentation

* Improved documentation

## v3.20.0 (2020-07-05)

#### :rocket: New Feature

* Added tests
