Changelog
=========

> **Tags:**
> - :boom:       [Breaking Change]
> - :rocket:     [New Feature]
> - :bug:        [Bug Fix]
> - :memo:       [Documentation]
> - :house:      [Internal]
> - :nail_care:  [Polish]

## v4.0.0-alpha.?? (2024-08-??)

#### :rocket: New Feature
* Added a shared cache feature for data providers

## v4.0.0-alpha.29 (2024-04-04)

#### :bug: Bug Fix

* Fixed `providerOptions` inheritance by ExtraProviders

## v4.0.0-alpha.25 (2024-03-20)

#### :bug: Bug Fix

* Fixed a memory leak

## v4.0.0-alpha.22 (2024-02-27)

#### :rocket: New Feature

* Added a `recursive` parameter to the `dropCache` method for recursive cache clearing to prevent memory leaks during SSR

## v4.0.0-alpha.21 (2024-02-12)

#### :rocket: New Feature

* Added a method to destroy the created provider

## v4.0.0-alpha.16 (2023-12-19)

#### :bug: Bug Fix

* Fixed cache initialization for providers

## v4.0.0-alpha.12 (2023-10-17)

#### :rocket: New Feature

* Added a new option `singleton` for data providers
* Caching of requests during SSR is allowed

#### :bug: Bug Fix

* By default, the getCacheKey function should take the parameters from the provider

## v4.0.0-alpha.8 (2023-09-15)

#### :rocket: New Feature

* Added a new property `params`

## v4.0.0-alpha.6 (2023-07-11)

#### :boom: Breaking Change

* Removed `upd` and `del` methods
* Renamed provider events `upd/del` to `update/delete`

## v3.83.0 (2022-04-05)

#### :rocket: New Feature

* Added a new static method `borrowRequestPromiseAPI`

## v3.82.1 (2022-04-04)

#### :nail_care: Polish

* Added re-export for `RequestPromise`

## v3.81.3 (2022-04-04)

#### :bug: Bug Fix

* Added missing API for request responses with extra providers

## v3.81.2 (2022-04-04)

#### :bug: Bug Fix

* All request methods should return `RequestPromise`, but not `RequestResponse`

## v3.80.1 (2022-03-29)

#### :rocket: New Feature

* Added new alias methods `update` and `delete`

## v3.57.0 (2021-08-31)

#### :boom: Breaking Changes

* Removed the `externalRequest` option

## v3.53.1 (2021-07-06)

#### :house: Internal

* Removed error logging duplication

## v3.38.1 (2021-03-19)

#### :bug: Bug Fix

* Rewritten tests on express

## v3.27.6 (2020-11-01)

#### :boom: Breaking Change

* Renamed `MockResponseType` -> `MockResponseValue`

## v3.27.2 (2020-09-18)

#### :bug: Bug Fix

* Fixed invalid imports within README

## v3.20.0 (2020-07-05)

#### :rocket: New Feature

* Added tests
