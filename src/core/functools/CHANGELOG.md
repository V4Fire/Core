Changelog
=========

> **Tags:**
> - :boom:       [Breaking Change]
> - :rocket:     [New Feature]
> - :bug:        [Bug Fix]
> - :memo:       [Documentation]
> - :house:      [Internal]
> - :nail_care:  [Polish]

## v4.0.0-alpha.?? (2024-??-??)

#### :bug: Bug Fix

* Fixed the bug with the `debounce` decorator:
  conflicts between debounced methods across instances of identical classes or components have been resolved

## v3.95.4 (2023-05-25)

#### :bug: Bug Fix

* Fixed the bug with `debounce` and `throttle` decorated methods being executed on every call ignoring delay

## v3.51.0 (2021-06-15)

#### :rocket: New Feature

* Added possibility to set default get/set accessors within trait classes `trait`

## v3.27.0 (2020-09-04)

#### :boom: Breaking Change

* Dropped `interface.ts`:
  * `deprecation`
  * `implementation`

#### :rocket: New Feature

* Added a new module `warning`

#### :house: Internal

* Re-wrote the module with `warning`:
  * `deprecation`
  * `implementation`
