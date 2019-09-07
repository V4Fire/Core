Changelog
=========

> **Tags:**
> - :boom:       [Breaking Change]
> - :rocket:     [New Feature]
> - :bug:        [Bug Fix]
> - :memo:       [Documentation]
> - :house:      [Internal]
> - :nail_care:  [Polish]

_Note: Gaps between patch versions are faulty, broken or test releases._

## v3.0.0-beta.67 (2019-09-07)

#### :rocket: New Feature

* Improved number prelude API:
  * Added `Number.isFloat`
  * Added `Number.isEven`
  * Added `Number.isOdd`
  * Added `Number.isPositive`
  * Added `Number.isNegative`
  * Added `Number.isNonNegative`
  * Added `Number.isNatural`
  * Added `Number.isBetweenZeroAndOne`
  * Added `Number.isPositiveBetweenZeroAndOne`

## v3.0.0-beta.66 (2019-08-27)

#### :bug: Bug Fix

* Fixed the case when `.api` is not proved for a request

#### :house: Internal

* Extracted `RequestAPI` to an interface
* Added `CHANGELOG.md`
* Marked `LogOptions.patterns` property as required
