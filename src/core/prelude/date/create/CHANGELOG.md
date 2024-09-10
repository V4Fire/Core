Changelog
=========

> **Tags:**
> - :boom:       [Breaking Change]
> - :rocket:     [New Feature]
> - :bug:        [Bug Fix]
> - :memo:       [Documentation]
> - :house:      [Internal]
> - :nail_care:  [Polish]

## v3.100.1 (2024-09-10)

#### :bug: Bug Fix

* Fixed an issue with the calculation of timezones without considering time

## v3.62.2 (2021-11-09)

#### :bug: Bug Fix

* Now all dates create with a timezone actual to their creation date
* Fixed creating a date with a local timezone when it's partial (eg 'UTC +9:30')

## v3.50.0 (2021-06-07)

#### :bug: Bug Fix

* Fixed `Date.create` with dates without leading zeroes

## v3.25.1 (2020-09-04)

#### :bug: Bug Fix

* Fixed parsing "1997-07-16T19:20:30.45+0100" format on iOS

## v3.20.0 (2020-07-05)

#### :rocket: New Feature

* Added tests

#### :bug: Bug Fix

* Fixed bugs
