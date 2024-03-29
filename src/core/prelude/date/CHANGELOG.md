Changelog
=========

> **Tags:**
> - :boom:       [Breaking Change]
> - :rocket:     [New Feature]
> - :bug:        [Bug Fix]
> - :memo:       [Documentation]
> - :house:      [Internal]
> - :nail_care:  [Polish]

## v3.62.2 (2021-11-09)

#### :bug: Bug Fix

* `create`:
  * Now all dates create with a timezone actual to their creation date
  * Fixed creating a date with a local timezone when it's partial (eg 'UTC +9:30')

## v3.59.2 (2021-09-27)

#### :bug: Bug Fix

* Fixed date formatting with optional patterns

#### :nail_care: Polish

* Refactored `Date.format`

## v3.52.0 (2021-06-16)

#### :boom: Breaking Change

* Now the date methods `beginningOf.../endOf...` returns a new date

## v3.50.0 (2021-06-07)

#### :bug: Bug Fix

* Fixed `Date.create` with dates without leading zeroes

## v3.42.0 (2021-04-02)

#### :rocket: New Feature

* [Added a feature of optional patterns with `Date.format`](https://github.com/V4Fire/Core/issues/163)

## v3.20.0 (2020-07-05)

#### :rocket: New Feature

* Added tests

#### :bug: Bug Fix

* Fixed bugs
