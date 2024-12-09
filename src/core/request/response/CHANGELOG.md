Changelog
=========

> **Tags:**
> - :boom:       [Breaking Change]
> - :rocket:     [New Feature]
> - :bug:        [Bug Fix]
> - :memo:       [Documentation]
> - :house:      [Internal]
> - :nail_care:  [Polish]

## v3.101.2 (2024-12-09)

#### :bug: Bug Fix

* Fixed an issue when receiving an empty string with the `Content-Type: application/octet-stream` header `core/request/response`

## v3.93.0 (2023-03-14)

#### :rocket: New Feature

* Added a new option `forceResponseType`

## v3.80.1 (2022-03-29)

#### :bug: Bug Fix

* Fixed a bug when `url` is not provided

## v3.78.0 (2022-03-16)

#### :boom: Breaking Change

* Now to clone and freeze server responses is used Proxy API if it supported
* Now the `headers` property is an instance of `core/request/headers`
* The `getHeader` method is marked as deprecated
* All decode methods always return non-nullable values

#### :rocket: New Feature

* Added missing methods and properties to match the native browsers Response class
* Added a new `emitter` property to listen to response events
* Added a new `streamUsed` property to determine when the response was read in a stream form
* Now a response instance implements `Symbol.asyncIterator`

## v3.72.0 (2021-12-10)

#### :rocket: New Feature

* Now `Response` can take body as a function or promise
