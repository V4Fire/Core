Changelog
=========

> **Tags:**
> - :boom:       [Breaking Change]
> - :rocket:     [New Feature]
> - :bug:        [Bug Fix]
> - :memo:       [Documentation]
> - :house:      [Internal]
> - :nail_care:  [Polish]

## v3.60.3 (2021-10-05)

#### :bug: Bug Fix

* Fixed a bug with double resolving of a promise when it resolved by another promise

## v3.59.2 (2021-09-27)

#### :bug: Bug Fix

* Now `finally` respects exceptions values from a callback

## v3.59.0 (2021-09-08)

#### :rocket: New Feature

* Added a new static method `any`

#### :bug: Bug Fix

* Fixed some cases when a promise is resolved with another promise

## v3.58.0 (2021-09-01)

#### :rocket: New Feature

* Added a new static method `allSettled`

#### :bug: Bug Fix

* Now `SyncPromise` will emit `unhandledRejection` if there are no catch handlers

## v3.27.7 (2020-11-04)

#### :bug: Bug Fix

* Fixed resolving a promise after the catch

```js
SyncPromise.resolve(1).catch(() => undefined).then((r) => console.log(r));
```

## v3.20.0 (2020-07-05)

#### :rocket: New Feature

* Added tests
