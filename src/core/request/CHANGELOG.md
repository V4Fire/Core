Changelog
=========

> **Tags:**
> - :boom:       [Breaking Change]
> - :rocket:     [New Feature]
> - :bug:        [Bug Fix]
> - :memo:       [Documentation]
> - :house:      [Internal]
> - :nail_care:  [Polish]

## v4.0.0-alpha.?? (2024-04-??)

#### :rocket: New Feature

* Now `RequestAPIParams` are being passed to the `RequestAPIValue` function

## v4.0.0-alpha.22 (2024-02-27)

#### :rocket: New Feature

* Added a `recursive` parameter to the `dropCache` method for recursive cache clearing to prevent memory leaks during SSR

## v4.0.0-alpha.11 (2023-10-12)

#### :rocket: New Feature

* Now parameters from the main provider are being passed to the engine based on providers

#### :bug: Bug Fix

* Caching should be disabled in SSR

## v3.93.1 (2023-03-14)

#### :bug: Bug Fix

* Fixed Node.js engine

## v3.93.0 (2023-03-14)

#### :rocket: New Feature

* Added a new option `forceResponseType`

## v3.89.1 (2023-01-19)

#### :bug: Bug Fix

* Fixed memory leak when caching requests with a given ttl

## v3.81.2 (2022-04-04)

#### :bug: Bug Fix

* All request methods should return `RequestPromise`, but not `RequestResponse`

## v3.78.0 (2022-03-16)

#### :boom: Breaking Change

* Now `RequestResponseObject.data` contains a promise with data
* Now the `headers` property is an instance of `core/headers`

#### :rocket: New Feature

* Now a promise returned from a request function implements `Symbol.asyncIterator`
* Now a promise returned from a request function has a new `data` property with the response data
* Now a promise returned from a request function has a new `emitter` property with an event emitter to listen to raw engine events
* Request headers can be provided as an instance of `core/headers` or native browser Headers

#### :memo: Documentation

* Improved documentation

## v3.76.0 (2022-03-05)

#### :rocket: New Feature

* Now `RequestEngine` will take `MiddlewareParams` as a second argument

#### :bug: Bug Fix

* Fixed a race condition while checking and saving pending requests to the cache

## v3.72.0 (2021-12-10)

#### :rocket: New Feature

* Now `Response` can take body as a function or promise `response`

## v3.60.4 (2021-10-06)

#### :bug: Bug Fix

* Now cache keys are generated for all strategies

## v3.60.2 (2021-10-04)

#### :bug: Bug Fix

* Fixed support of offline caching

## v3.58.1 (2021-09-06)

#### :bug: Bug Fix

* Fixed initializing of the cache API
* Fixed detection of the online connection

## v3.57.0 (2021-08-31)

#### :boom: Breaking Changes

* Removed the `externalRequest` option
* Online checking functionality was moved to engines

## v3.56.2 (2021-08-05)

#### :bug: Bug Fix

* Fixed an issue when `dropCache` don't clear caches of mounted objects

## v3.53.0 (2021-06-24)

#### :rocket: New Feature

* Added automatically converting files and other blobs to send via `FormData`

## v3.49.0 (2021-05-26)

#### :bug: Bug Fix

* Added `Blob` to `ReuqestBody`

## v3.43.1 (2021-04-19)

#### :house: Internal

* Renamed `noMessageBodyStatusCodes` to `noContentStatusCodes` `response`

## v3.43.0 (2021-04-14)

#### :house: Internal

* Added filtering out status codes with no message bodies in response

#### :bug: Bug Fix

* Fixed async execution of the test case

## v3.40.0 (2021-04-01)

#### :rocket: New Feature

* Added a new parameter `querySerializer` to specify how to serialize queries to URL

## v3.37.0 (2021-03-17)

#### :rocket: New Feature

* Now `RequestError` extends the `BaseError` class `core/request/error`
* Added `RequestErrorDetailsExtractor`  to extract `RequestError`'s details

#### :memo: Documentation

* Updated `core/request/error` documentation

#### :nail_care: Polish

* Improved the `RequestError`'s message format

## v3.35.1 (2021-03-11)

#### :bug: Bug Fix

* Fixed an issue when external non-enumerable properties become enumerable

## v3.35.0 (2021-03-04)

#### :rocket: New Feature

* Added a new feature of request retrying

#### :house: Internal

* `applyQueryForStr` now redefines a property with the `enumerable: false` descriptor instead of deleting it

## v3.33.0 (2021-02-26)

#### :rocket: New Feature

* Added a new engine based on the data providers

## v3.32.0 (2021-02-05)

#### :bug: Bug Fix

* Fixed parsing of JSON structures `engines/fetch`

## v3.30.0 (2021-01-10)

#### :bug: Bug Fix

* Fixed providing of empty strings as API url-s

## v3.29.1 (2020-12-23)

#### :bug: Bug Fix

* Added response status checking whether it's 204 before decoding a server response `Response`

## v3.28.0 (2020-11-06)

#### :rocket: New Feature

* Added new engine based on Fetch API
* Added decoding text in `Response` into `Document`
* Added decoding `Buffer` (in Node.js) and `ArrayBuffer` in `Response` into json
* Supported response type `"blob"` in Node.js request engine
* Use `"arraybuffer"` (in `XmlHtpRequest` engine ) and `"buffer"` (in Node.js engine) as default `responseType`
* Use Fetch API by default in browser if `AbortController` is supported

#### :house: Internal

* Run tests with all engines instead of only Node.js one
* Test aborting the request on timeout
* Improved stability of tests by using local server instead of remote mock service

## v3.27.1 (2020-09-10)

#### :bug: Bug Fix

* Fixed a bug with iOS and ES6 when the engine hasn't parsed a declaration with nested arrow functions

## v3.26.0 (2020-09-04)

#### :rocket: New Feature

* Added `jsonReviver` to `CreateRequestOptions`

## v3.20.0 (2020-07-05)

#### :rocket: New Feature

* Added tests
* Added node.js support
* Added `cache` to `RequestResponseObject`

#### :bug: Bug Fix

* Fixed bugs
