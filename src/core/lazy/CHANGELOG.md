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

#### :boom: Breaking Change

* The contexts with which the `makeLazy` function hooks were called are now not an `Array`, but a `Set`
* `core/lazy` no longer has a default export

#### :bug: Bug Fix

* Added the `disposeLazy` function which clears the `makeLazy` module of the passed context to avoid memory leaks

## v3.86.1 (2022-04-26)

#### :house: Internal

* Improved TS type inferring

## v3.86.0 (2022-04-26)

#### :rocket: New Feature

* Added a new feature of hook handlers

## v3.74.3 (2022-01-13)

#### :house: Internal

* Improved type inferring

## v3.74.2 (2022-01-12)

#### :bug: Bug Fix

* Don't drop all registered actions after the first invoking

## v3.74.1 (2022-01-12)

#### :bug: Bug Fix

* Now function hooks can be overridden

## v3.65.0 (2021-11-18)

#### :rocket: New Feature

* Initial release
