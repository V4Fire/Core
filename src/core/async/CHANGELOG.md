Changelog
=========

> **Tags:**
> - :boom:       [Breaking Change]
> - :rocket:     [New Feature]
> - :bug:        [Bug Fix]
> - :memo:       [Documentation]
> - :house:      [Internal]
> - :nail_care:  [Polish]

## v4.0.0-beta.?? (2024-??-??)

#### :boom: Breaking Change

* Moved code from `V4/Client`
* Removed deprecated API and refactored internal structures

#### :house: Internal

Conduct refactoring and optimization of the module

## v4.0.0-alpha.37 (2024-06-03)

#### :bug: Bug Fix

* Fixed an issue with clearing `nextTick`

## v4.0.0-alpha.23 (2024-03-01)

#### :bug: Bug Fix

* Return event object from the `on` method of the wrapped emitter `modules/wrappers`

## v4.0.0-alpha.18 (2024-01-12)

#### :bug: Bug Fix

* Fixed memory leak when using wrappers over event emitters `modules/events`

## v4.0.0-alpha.14 (2023-11-22)

#### :house: Internal

* Fixed TS types of the EventEmitter wrapper

## v3.66.0 (2021-11-26)

#### :rocket: New Feature

* Added a wrapper for async storages

## v3.61.1 (2021-10-25)

#### :bug: Bug Fix

* Fixed bugs with clearing/muting/suspending promises by their IDs `modules/proxy`

## v3.50.0 (2021-06-07)

#### :rocket: New Feature

* Added possibility to listen to events from a function emitter

## v3.42.1 (2021-04-12)

#### :house: Internal

* Optimized exporting of interfaces

## v3.40.1 (2021-04-01)

#### :bug: Bug Fix

* Restored `core/async/const`

## v3.36.0 (2021-03-16)

#### :rocket: New Feature

* Added wrappers for data-providers and event-emitters

## v3.30.3 (2021-01-28)

#### :house: Internal

* Optimized clearing of async wrappers
* Now all promises are wrapped by using `SyncPromise`

## v3.20.0 (2020-07-05)

#### :rocket: New Feature

* Added tests

#### :bug: Bug Fix

* Fixed bugs
