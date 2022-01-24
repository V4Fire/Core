Changelog
=========

> **Tags:**
> - :boom:       [Breaking Change]
> - :rocket:     [New Feature]
> - :bug:        [Bug Fix]
> - :memo:       [Documentation]
> - :house:      [Internal]
> - :nail_care:  [Polish]

## v3.72.0 (2021-12-10)

#### :bug: Bug Fix

* Fixed a case when `concatURLs` appends trailing slashes

## v3.53.1 (2021-07-06)

#### :bug: Bug Fix

* Fixed parsing with encoded system symbols

## v3.43.1 (2021-04-19)

#### :bug: Bug Fix

* Fixed a bug when parsing a query string from a URL without query parameters `fromQueryString`

## v3.40.0 (2021-04-01)

#### :rocket: New Feature

* Added a new parameter `paramsFilter` to filter values that shouldn't be serialized `toQueryString`

## v3.33.0 (2021-02-26)

#### :boom: Breaking Change

* Renamed `concatUrls` to `concatURLs`

## v3.28.2 (2020-11-11)

#### :bug: Bug Fix

* Fixed a security issue with the prototype pollution

## v3.20.0 (2020-07-05)

#### :house: Internal

* Refactoring

## v3.15.4 (2020-05-16)

#### :bug: Bug Fix

* Fixed concatenation with absolute URL-s
