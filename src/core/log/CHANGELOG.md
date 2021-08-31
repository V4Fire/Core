Changelog
=========

> **Tags:**
> - :boom:       [Breaking Change]
> - :rocket:     [New Feature]
> - :bug:        [Bug Fix]
> - :memo:       [Documentation]
> - :house:      [Internal]
> - :nail_care:  [Polish]

## v3.56.3 (2021-08-16)

#### :rocket: New Feature

* Added a new middleware `ErrorsDeduplicatorMiddleware`

## v3.37.0 (2021-03-17)

#### :boom: Breaking Change

* Now `details` property within the `LogEvent` object is deprecated.
  The `additionals` property should be using instead.

#### :rocket: New Feature

* Added ability to set up middlewares via the config
* Added a new middleware `ExtractorMiddleware`

## v3.29.0 (2020-12-22)

#### :house: Internal

* Fixed TS errors
