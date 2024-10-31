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

## v4.0.0-alpha.49 (2024-10-31)

#### :bug: Bug Fix

* `core/prelude/i18n/helpers`
  * Fix logging bug in `pluralizeText`.
  * Add logging info in i18n helpers.

## v4.0.0-alpha.48 (2024-10-30)

#### :bug: Bug Fix

* Fixed an issue when receiving an empty string with the `Content-Type: application/octet-stream` header `core/request/response`

## v4.0.0-alpha.47.speedup (2024-10-01)

#### :boom: Breaking Change

* `core/async`:
  * Moved code from `V4/Client`
  * Removed deprecated API and refactored internal structures

#### :rocket: New Feature

* Added a new method `Array.toArray` `core/prelude`
* Added support for baked symbols `core/symbol`

#### :house: Internal

* Conduct refactoring and optimization of the module `core/async`
* Various performance optimizations

## v4.0.0-alpha.46 (2024-09-25)

#### :boom: breaking change

* `core/prelude/i18n/helpers`
  * changed `i18n` translations format.
  * added `intl` support for pluralization.
  * now `i18n` prefer to use `intl` api for pluralization if it's possible, otherwise fallback to old plural form logic.

## v4.0.0-alpha.45 (2024-09-09)

#### :bug: Bug Fix

* Fixed an issue with the calculation of timezones without considering time `core/prelude/date/create`

## v4.0.0-alpha.44 (2024-09-06)

#### :bug: Bug Fix

* Avoid reassigning an `undefined` value for the scheme from the prototype `core/lazy`

## v4.0.0-alpha.43 (2024-07-29)

#### :house: Internal

* RC branch merge

## v4.0.0-alpha.42 (2024-07-29)

#### :bug: Bug Fix

* Fixed memory leak with singleton providers cache `core/data/modules`

## v4.0.0-alpha.40 (2024-07-02)

#### :bug: Bug Fix

* Fixed an incorrect import from `core/status-codes`. `core/request/engines/composition`

## v4.0.0-alpha.39 (2024-07-01)

#### :rocket: New Feature

* Added a new engine for the request module - `compositionEngine`. `compositionEngine` allows you to solve problems
composition of requests in more complex structures (such as Provider). `core/request/engines/composition`

## v4.0.0-alpha.38 (2024-06-28)

#### :rocket: New Feature

* Added a new option `noContentStatuses`. This option allows to pass custom status code, array or range of status codes
  which indicate a no-content response. By default, an array `[...Range(100, 199), 204, 304]` is used, but it may be useful
  to override this value if your backend uses different status codes for no-content responses. `core/request`

## v4.0.0-alpha.37 (2024-06-03)

#### :bug: Bug Fix

* Fixed an issue with clearing `nextTick` `core/async`

## v4.0.0-alpha.36 (2024-05-16)

#### :bug: Bug Fix

* Fixed an issue where an internal property, blackList, was being written to the target object `core/object/watch`

## v4.0.0-alpha.35 (2024-05-13)

#### :bug: Bug Fix

* Added logic that checks whether the passed instance is of the native `Headers` class or `V4Headers`.
  To avoid overwriting response header values, we use the `append` method when handling the native Headers object
  received from the response, while retaining the original practice of setting headers with the `set` method when
  constructing request headers `core/request/headers`

## v4.0.0-alpha.34 (2024-05-06)

#### :rocket: New Feature

* Added support for specifying a region for i18n `core/prelude`

## v4.0.0-alpha.33 (2024-04-19)

#### :bug: Bug Fix

* Now, the custom `Headers` class uses the `append` method
  to construct a new set of headers based on the built-in Headers in the Fetch API implementation `core/request/headers`

## v4.0.0-alpha.32 (2024-04-16)

#### :bug: Bug Fix

* Fixed type generation for standalone build

## v4.0.0-alpha.31 (2024-04-12)

#### :house: Internal

* Use `WeakRef` for `RequestError` details only in node environment `core/request/error`

## v4.0.0-alpha.30 (2024-04-09)

#### :boom: Breaking Change

* Support for the `Got` library based query engine has been removed.
  Now, built-in fetch is used with Node.js. `core/request`

#### :rocket: New Feature

* Now `MiddlewareParams` are being passed to the `RequestAPIValue` function `core/request`

## v4.0.0-alpha.29 (2024-04-04)

#### :boom: Breaking Change

* Dropped API support with rest parameters in the `addToPrototype` `core/prelude/function/extend`.
  Migration Guide: `Foo.addToPrototype(bar, baz)` -> `Foo.addToPrototype({bar, baz})`.

#### :bug: Bug Fix

* Fixed `providerOptions` inheritance by ExtraProviders `core/data`
* Fixed the bug with the `debounce` decorator:
  conflicts between debounced methods across instances of identical classes or components have been resolved `core/functools`

## v4.0.0-alpha.28 (2024-03-21)

#### :bug: Bug Fix

* Revert `v4.0.0-alpha.27`

## v4.0.0-alpha.27 (2024-03-21)

#### :bug: Bug Fix

* Fixed a memory leak `core/lazy`

## v4.0.0-alpha.26 (2024-03-21)

#### :rocket: New Feature

 * The standalone version of a library now has `.d.ts` declaration files

## v4.0.0-alpha.25 (2024-03-20)

#### :bug: Bug Fix

* Fixed a memory leak `core/data`

## v4.0.0-alpha.24 (2024-03-12)

#### :bug: Bug Fix

* The error that caused the application process to never finish during SSR has been fixed `core/net`

## v4.0.0-alpha.23 (2024-03-01)

#### :bug: Bug Fix

* Return event object from the `on` method of the wrapped emitter `core/async/modules/wrappers`

## v4.0.0-alpha.22 (2024-02-27)

#### :rocket: New Feature

* Added a `recursive` parameter to the `dropCache` method for recursive cache clearing to prevent memory leaks during SSR:
  * `core/data`
  * `core/request`

## v4.0.0-alpha.21 (2024-02-12)

#### :rocket: New Feature

* Added a method to destroy the created provider `core/data`

## v4.0.0-alpha.20 (2024-02-06)

#### :boom: Breaking Change

* `core/lazy` no longer has a default export `core/lazy`

#### :bug: Bug Fix

* Added the `disposeLazy` function which clears the `makeLazy` module of the passed context to avoid memory leaks `core/lazy`

## v4.0.0-alpha.19 (2024-01-12)

#### :bug: Bug Fix

* Quickfix for `v4.0.0-alpha.18`

## v4.0.0-alpha.18 (2024-01-12)

#### :bug: Bug Fix

* Fixed memory leak when using wrappers over event emitters `core/async`

## v4.0.0-alpha.17 (2024-01-11)

#### :rocket: New Feature

* Added `Object.isEmpty`

## v4.0.0-alpha.16 (2023-12-19)

#### :bug: Bug Fix

* Fixed cache initialization for providers

## v4.0.0-alpha.15 (2023-11-26)

#### :rocket: New Feature

* Added a constant to determine if SSR is enabled `core/env`

#### :bug: Bug Fix

* Do not check online during SSR `core/net`

## v4.0.0-alpha.14 (2023-11-22)

#### :house: Internal

* Fixed TS types of the EventEmitter wrapper `core/async`

## v4.0.0-alpha.13 (2023-11-16)

#### :boom: Breaking Change

* Removed the `i18n` function from the global scope

## v4.0.0-alpha.12 (2023-10-17)

#### :rocket: New Feature

* `core/data`:
  * Added a new option `singleton` for data providers
  * Caching of requests during SSR is allowed

#### :bug: Bug Fix

* By default, the getCacheKey function should take the parameters from the provider `core/data`

## v4.0.0-alpha.11 (2023-10-12)

#### :rocket: New Feature

* Now parameters from the main provider are being passed to the engine based on providers `core/request`

#### :bug: Bug Fix

* Caching should be disabled in SSR `core/request`

## v4.0.0-alpha.10 (2023-09-29)

#### :nail_care: Polish

* Enhanced error message in `prelude/i18n` for missing translations

## v4.0.0-alpha.9 (2023-09-19)

#### :rocket: New Feature

* Added API for serializing custom objects `core/json`

## v4.0.0-alpha.8 (2023-09-15)

#### :rocket: New Feature

* Added a new property `params` `core/data`

## v4.0.0-alpha.6 (2023-07-11)

#### :boom: Breaking Change

* Removed `upd` and `del` methods
* Renamed provider events `upd/del` to `update/delete`

#### :rocket: New Feature

* Added result hashing for `Object.fastHash` `core/prelude`
* Added an engine that allows storing data in a single string `core/kv-storage`

#### :house: Internal

* Updated global object definition to be universal for any JS environment `core/prelude/env/const`

#### :bug: Bug Fix

* Fixed an error when calling `String.capitalize` with an empty string

## v3.95.4 (2023-05-25)

#### :bug: Bug Fix

* Fixed the bug with `debounce` and `throttle` decorated methods being executed on every call ignoring delay `src/core/functools/lazy`

## v3.95.3 (2023-05-22)

#### :bug: Bug Fix

* Fixed the bug with network request having CORS preflight request

## v3.95.2 (2023-04-19)

#### :bug: Bug Fix

* Fix typings for array-like objects in `Object.forEach`

## v3.95.1 (2023-04-18)

#### :rocket: New Feature

* Added the ability to change the data storage path for the `node` runtime `core/kv-storage`

## v3.95.0 (2023-04-17)

#### :rocket: New Feature

* `core/data/middlewares/attach-mock`:
  * Added headers support for mock custom response
  * Improved mock matching algorithm

#### :house: Internal

* Added spec for the `core/data/middlewares/attach-mock`

#### :nail_care: Polish

* Refactor of the `core/data/middlewares/attach-mock`

## v3.94.0 (2023-04-05)

#### :house: Internal

* Moving to yarn package manager
* Updated CI script to yarn
* Removed unused dependencies

## v3.93.1 (2023-03-14)

#### :bug: Bug Fix

* Fixed Node.js engine `core/request`

## v3.93.0 (2023-03-14)

#### :rocket: New Feature

* Added a new option `forceResponseType` `core/request`

## v3.92.0 (2023-02-21)

#### :boom: Breaking Change

* New default config for `core/net` `config`

#### :bug: Bug Fix

* `core/net`:
  * Fixed bug with network request caching
  * Fixed bug with request timeout

## v3.91.0 (2023-02-14)

#### :house: Internal

* Improved tsconfig

## v3.90.0 (2022-02-09)

#### :boom: Breaking Change

* Redesigned internationalization module `core/prelude/i18n`

## v3.89.1 (2023-01-19)

#### :bug: Bug Fix

* Fixed memory leak when caching requests with a given ttl `core/request`

## v3.89.0 (2022-09-15)

#### :rocket: New Feature

* Now `push` and `unshift` methods support multiple arguments `core/linked-list`

#### :boom: Breaking Change

* By default, the `ES` flag is set to `ES2019` for development builds `config`

## v3.88.0 (2022-08-22)

#### :rocket: New Feature

* Added a new module `core/linked-list`

* `core/queue`:
  * Added a new method to clone a queue
  * Now any queue can be traversed with an iterator

#### :bug: Bug Fix

* Changed the internal queue structure to `core/linked-list` `core/queue/simple`

## v3.87.1 (2022-08-15)

#### :boom: Breaking Change

* By default, the `ES` flag is set to `ES2021` for development builds `config`

#### :bug: Bug Fix

* `core/object/watch`:
  * Fixed setting new properties of a watchable object by a deep path using the accessor-based engine
  * Now watchable Map uses the `entries` iterator by default

## v3.87.0 (2022-08-08)

#### :rocket: New Feature

* Added a new overload for the `intoIter` method to create an iterator from an array-like object

## v3.86.4 (2022-07-05)

#### :bug: Bug Fix

* [Fixed a bug with filtering request headers](https://github.com/V4Fire/Core/issues/298) `core/request/error`

## v3.86.3 (2022-06-10)

#### :house: Internal

* Updated dependencies: `typedoc@0.22.13`

## v3.86.2 (2022-05-18)

#### :bug: Bug Fix

* Fixed an issue with `Module._resolveFilename` was overwritten by Playwright `build/tsnode`

## v3.86.1 (2022-04-26)

#### :house: Internal

* Improved TS type inferring `core/lazy`

## v3.86.0 (2022-04-26)

#### :rocket: New Feature

* Added a new feature of hook handlers `core/lazy`

## v3.85.1 (2022-04-14)

#### :house: Internal

* Downgraded TS to `4.6.2`

## v3.85.0 (2022-04-13)

#### :rocket: New Feature

* Added a new TS type-function `Writable`

#### :house: Internal

* Updated dependencies: typescript@4.6.3

## v3.84.0 (2022-04-06)

#### :boom: Breaking Change

* By default, the `ES` flag is set to `ES6` for production builds and `ES2019` for development builds
* The `config` package now uses an alias `@config/config`

#### :rocket: New Feature

* Added a `tsnode` initialization script `build/tsnode`

#### :house: Internal

* Moved a script to build `.tsconfig` files to a separate file `build/build-tsconfig`

## v3.83.0 (2022-04-05)

#### :rocket: New Feature

* Added a new static method `borrowRequestPromiseAPI` `core/data`

## v3.82.1 (2022-04-04)

#### :nail_care: Polish

* Added re-export for `RequestPromise` `core/data`

## v3.82.0 (2022-04-04)

#### :rocket: New Feature

* Added new methods `Object.isUndef`, `Object.isNull`, `Object.isNullable` `prelude`

## v3.81.3 (2022-04-04)

#### :bug: Bug Fix

* Added missing API for request responses with extra providers `core/data`

## v3.81.2 (2022-04-04)

#### :bug: Bug Fix

* All request methods should return `RequestPromise`, but not `RequestResponse` `core/request` `core/data`

## v3.81.1 (2022-04-01)

#### :memo: Documentation

* Added an example of usage:
  * `core/data/middlewares/attach-mock`
  * `core/data/middlewares/attach-status`
  * `core/data/middlewares/wait`

## v3.81.0 (2022-03-31)

#### :rocket: New Feature

* Added ability to use include and exclude filters `core/perf`

#### :bug: Bug Fix

* Fixed TS type inferring:
  * `core/promise/sync`
  * `core/promise/abortable`

## v3.80.1 (2022-03-29)

#### :rocket: New Feature

* Added new alias methods `update` and `delete` `core/data`

#### :bug: Bug Fix

* Fixed a bug when `url` is not provided `core/request/response`

## v3.80.0 (2022-03-29)

#### :rocket: New Feature

* Added a new module `core/pool`

## v3.79.1 (2022-03-18)

#### :bug: Bug Fix

* Restored the fixed `package-lock.json`

## v3.79.0 (2022-03-18)

#### :rocket: New Feature

* Added a new global function `unwatchable` `core/object/watch`

## v3.78.0 (2022-03-16)

#### :boom: Breaking Change

* Now `[key, el]` responses from an iterator will be destructured before providing to callback `Object.forEach`

* `core/request`:
  * Now `RequestResponseObject.data` contains a promise with data
  * Now the `headers` property is an instance of `core/headers`

* `core/request/reponse`:
  * Now the `headers` property is an instance of `core/request/headers`
  * Now to clone and freeze server responses is used Proxy API if it supported
  * The `getHeader` method is marked as deprecated
  * All decode methods always return non-nullable values

#### :rocket: New Feature

* Added a new module `core/iter`
* Added a new module `core/iter/combinators`
* Added a new module `core/request/headers`
* Added a new module `core/request/modules/stream-buffer`
* Added a new method `Object.isAsyncGenerator`
* Added a new type `AnyIterable`

* `core/request`:
  * Now a promise returned from a request function implements `Symbol.asyncIterator`
  * Now a promise returned from a request function has a new `data` property with the response data
  * Now a promise returned from a request function has a new `emitter` property with an event emitter to listen to raw engine events
  * Request headers can be provided as an instance of `core/headers` or native browser Headers

* `core/request/response`:
  * Added missing methods and properties to match the native browsers Response class
  * Added a new `emitter` property to listen to response events
  * Added a new `streamUsed` property to determine when the response was read in a stream form
  * Now a response instance implements `Symbol.asyncIterator`

#### :memo: Documentation

* Improved documentation `core/request`

## v3.77.0 (2022-03-15)

#### :rocket: New Feature

* Added a new method `Object.isAsyncIterator`
* Now iterations over iterable structures have indices as the second argument of a passed callback function `Object.forEach`

#### :bug: Bug Fix

* Fixed an issue when extending an object with preserving descriptors and array concatenation `Object.mixin`
* Fixed an issue when iterating over non-dictionary object with enabled `passDescriptor` `Object.forEach`
*
## v3.76.0 (2022-03-05)

#### :rocket: New Feature

* Now `RequestEngine` will take `MiddlewareParams` as a second argument `core/request`

* `core/promise`:
  * Added a new promise wrapper `createControllablePromise`
  * Added a new promise helper `isControllablePromise`

#### :bug: Bug Fix

* Fixed a race condition while checking and saving pending requests to the cache `core/request`

## v3.75.1 (2022-03-05)

#### :house: Internal

* Freezing versions of all dependencies from package.json

## v3.75.0 (2022-02-22)

#### :rocket: New Feature

* Added a new module `core/json/stream`
* Added a common function to clone `core/object/proxy-clone`
* Added a common function to create a read-only view `core/object/proxy-readonly`
* Added a new bunch of constants `support` to check a runtime for features support `core/const`

## v3.74.7 (2022-01-31)

#### :bug: Bug Fix

* Restored support of Map/WeakMap `Object.reject/select`

## v3.74.6 (2022-01-31)

#### :bug: Bug Fix

* `Object.reject/select` shouldn't copy a prototype of the passed object

## v3.74.5 (2022-01-25)

#### :bug: Bug Fix

* Now `__proto__ ` properties are ignored and removed via a json reviver to prevent prototype pollution `core/prelude/object#Object.parse`

## v3.74.4 (2022-01-24)

#### :bug: Bug Fix

* Fixed a bug when `onAbort` calling occurred after promise aborting `core/promise/abortable`

#### :house: Internal

* Now `Object.fastClone` will use `structredClone` if it is possible

## v3.74.3 (2022-01-13)

#### :boom: Breaking Change

* Changed signature of `ClassConstructor`

#### :house: Internal

* Improved type inferring `core/lazy`

## v3.74.2 (2022-01-12)

#### :bug: Bug Fix

* Don't drop all registered actions after the first invoking `core/lazy`

## v3.74.1 (2022-01-12)

#### :bug: Bug Fix

* Now function hooks can be overridden `core/lazy`

## v3.74.0 (2022-01-12)

#### :rocket: New Feature

* Added a new methods `Object.isProxy` and `Object.unwrapProxy`

#### :bug: Bug Fix

* Fixed behavior of `Object.isDictionary`, `Object.isPlainObject`, `Object.isFreeze` with proxy-based objects

## v3.73.3 (2022-01-10)

#### :bug: Bug Fix

* Fixed emitting of mutation events produced via `Object.defineProperty` `core/object/watch`

## v3.73.2 (2021-12-28)

#### :bug: Bug Fix

* Fixed a bug when adding a new property to the clone object `core/object/proxy-clone`

## v3.73.1 (2021-12-16)

#### :bug: Bug Fix

* Fixed issues with symlinks `build`

## v3.73.0 (2021-12-14)

#### :rocket: New Feature

* Added a new module to create effective read-only view of objects `core/object/proxy-readonly`

#### :bug: Bug Fix

* Now all properties that are added via `Object.defineProperty` can be handled via a proxy-based watcher `core/object/watch`

* `core/object/proxy-clone`:
  * Fixed removing of properties
  * Now the clone function supports descriptors too

## v3.72.0 (2021-12-10)

#### :rocket: New Feature

* Now `Response` can take body as a function or promise `core/request/response`
* Added a new module to create effective clones of objects `core/object/proxy-clone`

#### :bug: Bug Fix

* Fixed a case when `concatURLs` appends trailing slashes `core/url`
* Removed generator methods from base iterators:
  * `core/range`
  * `core/object/watch`

## v3.71.00 (2021-12-08)

#### :boom: Breaking Change

* Moved from `Sugar/Collection.js/urlconcat` to `@v4fire/core`

## v3.70.3 (2021-12-08)

#### :bug: Bug Fix

* Restored the native behavior of `Object.hasOwnProperty`

## v3.70.2 (2021-12-07)

#### :bug: Bug Fix

* Added setters to change config values `config`

## v3.70.1 (2021-12-07)

#### :bug: Bug Fix

* Now `Array.union` doesn't spread primitive iterable values `core/prelude`

## v3.70.0 (2021-12-07)

#### :rocket: New Feature

* Now `@v4fire/core` can be used as a simple `node.js` library

## v3.69.0 (2021-12-03)

#### :boom: Breaking Change

* Removed deprecated API `core/promise/abortable`

#### :rocket: New Feature

* Added a new static method `wrapReasonToIgnore` `core/promise/abortable`
* Added static properties with the default error types `core/request/error`

#### :bug: Bug Fix

* Fixed a bug when a child promise is never resolved because its parent is already rejected `core/promise/abortable`

## v3.68.0 (2021-12-03)

#### :boom: Breaking Change

* `core/functools`:
  * Renamed a module `core/functools/not-implemented` to `core/functools/implementation`
  * Renamed wrappers `notImplement/notImplemented` to `unimplement/unimplemented`
  * Now `unimplement/unimplemented` throw an exception

## v3.67.0 (2021-12-01)

#### :boom: Breaking Change

* `core/net/engines`
  * Renamed `browser.request` -> `browser-request`
  * Renamed `node.request` -> `node-request`

* `core/queue`:
  * Renamed `Tasks` to `InnerQueue`
  * Renamed `CreateTasks` to `CreateInnerQueue`
  * Renamed `QueueOptions.tasksFactory` to `QueueOptions.queueFactory`

#### :rocket: New Feature

* Added new types `DictionaryKey`, `AnyToIgnore`, `AnyToBoolean`
* Now the `Dictionary` type supports symbols and number
* `core/prelude/types`:
  * Added a new method `Object.cast`
  * Added a new method `Object.throw`

#### :house: Internal

* Bumped versions of `node/npm` within `ci`

## v3.66.0 (2021-11-26)

#### :rocket: New Feature

* Added a wrapper for async storages `core/async`

## v3.65.1 (2021-11-26)

#### :house: Internal

* Replaced `uniconf` with `@v4fire/config`

## v3.65.0 (2021-11-18)

#### :rocket: New Feature

* Added a new module `core/lazy`

#### :bug: Bug Fix

* Added `bigint` and `symbol` into the `Primitive` type `index.d.ts`

## v3.64.0 (2021-11-16)

#### :rocket: New Feature

* Added a new method `unwrap` `core/promise/sync`

## v3.63.0 (2021-11-16)

#### :rocket: New Feature

* Now `Object.get` can access properties through promises `core/prelude/object`

## v3.62.3 (2021-11-09)

#### :bug: Bug Fix

* Fixed deep watching for array dependencies `core/object/watch`

## v3.62.2 (2021-11-09)

#### :bug: Bug Fix

* Fixed deep watching for an array element `core/object/watch`
* `core/prelude/date/create`:
  * Now all dates create with a timezone actual to their creation date
  * Fixed creating a date with a local timezone when it's partial (eg 'UTC +9:30')

## v3.62.1 (2021-11-08)

#### :bug: Bug Fix

* Fixed watching for an array by a complex path with indices `core/object/watch`

## v3.62.0 (2021-10-29)

#### :boom: Breaking Change

* Changed project building from `gulp-typescript` to `gulp-babel`
* Now, if a promise is resolved during muted, it will be rejected `core/async`

#### :rocket: New Feature

* Added a new method `Object.isIterable` `prelude`

* `core/async`:
  * Added a new option `AsyncCbOptions.onMutedCall`
  * Added new bunch of methods to hook iterable objects

#### :house: Internal

* Updated dependencies

### :nail_care: Polish

* Added new tests `core/async`
* Added generation of source maps with the hot-reload mode

## v3.61.1 (2021-10-25)

#### :bug: Bug Fix

* Fixed bugs with clearing/muting/suspending promises by their IDs `core/async`

## v3.61.0 (2021-10-20)

#### :rocket: New Feature

* Added a new module `core/perf`

## v3.60.5 (2021-10-14)

#### :bug: Bug Fix

* Fixed a bug when the function `convertIfDate` didn't convert an ISO string to a date `core/json`

## v3.60.4 (2021-10-06)

#### :bug: Bug Fix

* Now cache keys are generated for all strategies `core/request`

## v3.60.3 (2021-10-05)

#### :bug: Bug Fix

* Fixed a bug with double resolving of a promise when it resolved by another promise `core/promise`

## v3.60.2 (2021-10-04)

#### :bug: Bug Fix

* Fixed restoring state if provided TTL `core/cache/decorators/persistent`
* Fixed support of offline caching `core/request`

## v3.60.1 (2021-10-01)

#### :bug: Bug Fix

* Hotfix for `3.60.0`

## v3.60.0 (2021-10-01)

#### :rocket: New Feature

* Added `Number.isSafe` and `Number.prototype.isSafe` `core/prelude/number`

#### :bug: Bug Fix

* Fixed parsing of numbers `Object.parse` `core/prelude/object`

#### :house: Internal

* Updated dependencies: `typescript@4.4.3`, `typedoc@0.22.4`

## v3.59.2 (2021-09-27)

#### :bug: Bug Fix

* Fixed date formatting with optional patterns `core/prelude/date/format`
* Now `finally` respects exceptions values from a callback:
  * `core/promise/sync`
  * `core/promise/abortable`

#### :nail_care: Polish

* Refactored `Date.format` `core/prelude/date/format`

## v3.59.1 (2021-09-21)

#### :bug: Bug Fix

* Don't override methods of already override objects `core/cache/decorators/helpers/add-emitter`

## v3.59.0 (2021-09-08)

#### :rocket: New Feature

* Added a new static method `any`:
  * `core/promise/sync`
  * `core/promise/abortable`

#### :bug: Bug Fix

* Fixed some cases when a promise is resolved with another promise:
  * `core/promise/sync`
  * `core/promise/abortable`

## v3.58.2 (2021-09-06)

#### :bug: Bug Fix

* Fixed a bug when the function `convertIfDate` converted a string with a date inside into a date object `core/json`

## v3.58.1 (2021-09-06)

#### :bug: Bug Fix

* `core/request`:
  * Fixed initializing of the cache API
  * Fixed detection of the online connection

## v3.58.0 (2021-09-01)

#### :boom: Breaking Change

* The module has been moved to `promise/abortable` `core/then`

#### :rocket: New Feature

* Added a new static method `allSettled`:
  * `core/promise/sync`
  * `core/then`

#### :bug: Bug Fix

* Now `SyncPromise` will emit `unhandledRejection` if there are no catch handlers
* Fixed comparing of `Map` and `Set` structures `Object.fastCompare`

## v3.57.0 (2021-08-31)

#### :boom: Breaking Changes

* Removed the `externalRequest` option within `core/request` and `core/data`
* Online checking functionality was moved to engines `core/request`

#### :rocket: New Feature

* Added a new middleware `core/log/middlewares/errors-deduplicator` to `core/log` pipeline

#### :bug: Bug Fix

* Fixed `String.dasherize` and `String.underscore` with numbers

#### :house: Internal

* Updated dependencies: `typescript@4.4.2`, `tlib@2.3.1`, `jasmine@3.9.0`, `jsdom@17.0.0`

## v3.56.2 (2021-08-05)

#### :bug: Bug Fix

* Fixed an issue when `dropCache` don't clear caches of mounted objects `core/request`

## v3.56.1 (2021-07-28)

#### :bug: Bug Fix

* Readonly non-configurable values can't be watched via Proxy `core/object/watch`

## v3.56.0 (2021-07-25)

#### :rocket: New Feature

* Now `Object.hasOwnProperty` supports symbols

#### :bug: Bug Fix

* Fixed an issue when modifying a prototype value of the watched object `core/object/watch`

## v3.55.0 (2021-07-24)

#### :rocket: New Feature

* Added new options `return` and `ctx` for `globalThis.include`

## v3.54.4 (2021-07-18)

#### :bug: Bug Fix

* Fixed a bug when the tied path can be mutated from handlers `core/object/watch`

## v3.54.3 (2021-07-16)

#### :bug: Bug Fix

* Fixed watching for specific paths with collapsing `core/object/watch`

## v3.54.2 (2021-07-14)

#### :bug: Bug Fix

* Fixed watching of values from iterable objects `core/object/watch`

## v3.54.1 (2021-07-09)

#### :house: Internal

* Refactored `core/queue` structures to use more effective implementations

## v3.54.0 (2021-07-09)

#### :boom: Breaking Change

* Migration from `fs-extra-promise` to `fs-extra`
* Renamed `core/kv-storage` engines: `browser.indexeddb` -> `browser-indexeddb`, `browser.localstorage` -> `browser-localstorage`, etc.
* The module has been renamed from `parse` to `convert` `object`

* `core/analytics`:
  * Removed an implementation of `sendAnalytics`
  * Updated API of `sendAnalytics`

#### :rocket: New Feature

* Added `Object.trySerialize`

#### :bug: Bug Fix

* Fixed `throttle` callback invoking `core/prelude/function/lazy`

## v3.53.1 (2021-07-06)

#### :bug: Bug Fi

* Fixed parsing with encoded system symbols `core/url`

#### :house: Internal

* Removed error logging duplication `core/data/modules/base`
* Updated dependencies: `dotenv@10.0.0`, `typescript@4.3.5`, `tlib@2.3.0`, `typedoc@0.21.1`, `husky@7.0.0`

## v3.53.0 (2021-06-24)

#### :rocket: New Feature

* Added automatically converting files and other blobs to send via `FormData` `core/request`

## v3.52.1 (2021-06-21)

#### :bug: Bug Fix

* Fix possibility to set default get/set accessors within trait classes

## v3.52.0 (2021-06-16)

#### :boom: Breaking Change

* Now the date methods `beginningOf.../endOf...` returns a new date

## v3.51.0 (2021-06-15)

#### :rocket: New Feature

* Added possibility to set default get/set accessors within trait classes `core/functools/trait`

## v3.50.0 (2021-06-07)

#### :rocket: New Feature

* Added possibility to listen to events from a function emitter `core/async`
* Added a feature to change maximum capacity `core/cache/restricted`

* `core/cache`:
  * Now all cache structures are iterable objects
  * Added new iterators `values`, `entries`
  * Added `size`

#### :bug: Bug Fix

* Fixed `Date.create` with dates without leading zeroes

#### :memo: Documentation

* Improved documentation `core/cache`

#### :house: Internal

* Updated dependencies: `typescript@4.3.2`

## v3.49.2 (2021-05-27)

#### :bug: Bug Fix

* Fixed subscribing to the original object `core/cache/decorators/helpers/add-emitter`

## v3.49.1 (2021-05-26)

#### :bug: Bug Fix

* Fixed checking of `Blob` via `isPlaingObject`

## v3.49.0 (2021-05-26)

#### :bug: Bug Fix

* Added `Blob` to `ReuqestBody` `core/request`

## v3.48.0 (2021-05-18)

#### :rocket: New Feature

* `core/object/select`:
  * Added support for iterable objects
  * Added support for complex conditions

#### :bug: Bug Fix

* Bugfixes `core/object/select`

#### :memo: Documentation

* Improved documentation
  * `core/object/select`
  * `core/event`

## v3.47.0 (2021-05-17)

#### :rocket: New Feature

* Added a new modules `core/cache/decorators/helpers/add-emitter`

#### :bug: Bug Fix

* Fixed bugs when take a place mutations caused by side effects:
  * `core/cache/decorators/persistent`
  * `core/cache/decorators/ttl`

## v3.46.0 (2021-05-14)

#### :boom: Breaking Change

* `core/range`:
  * Renamed `reverse` to `isReversed`
  * Now `union` and `intersect` preserve ordering of the first range
  * New API of infinite ranges

#### :rocket: New Feature

* Added new methods `entries`, `keys`, `indices` `core/range`

#### :bug: Bug Fix

* Fixed a bug when intersection doesn't include bounds `core/range`

#### :memo: Documentation

* Improved documentation `core/range`

#### :house: Internal

* Updated dependencies: `dotenv@9.0.2`, `husky@6.0.0`

## v3.45.0 (2021-05-12)

#### :boom: Breaking Change

* `getDataTypeFromURL` marked as deprecated. Use `getDataTypeFromURI` instead. `core/mime-type`

#### :rocket: New Feature

* Added the support of non-including range bounds `core/range`

#### :bug: Bug Fix

* Fixed a bug when watching an object by the specified path when occurring a mutation of nested properties `core/object/watch`

#### :memo: Documentation

* Improved documentation:
  * `core/object/watch`
  * `core/then`
  * `core/status-codes`

#### :house: Internal

* Updated dependencies: `typescript@4.2.4`, `tslib@2.2.0`

## v3.44.1 (2021-04-23)

#### :bug: Bug Fix

* `core/functools/trait`:
  * Fixed a bug when one trait extends from another
  * Fixed a bug with accessors within a trait

## v3.44.0 (2021-04-19)

#### :rocket: New Feature

* Added a module to create class traits `core/functools/trait`

## v3.43.1 (2021-04-19)

#### :bug: Bug Fix

* Fixed a bug when parsing a query string from a URL without query parameters `fromQueryString` `core/url`

#### :house: Internal

* Renamed `noMessageBodyStatusCodes` to `noContentStatusCodes` `core/request/response`

## v3.43.0 (2021-04-14)

#### :house: Internal

* Added filtering out status codes with no message bodies in response `core/request/response`

#### :bug: Bug Fix

* Fixed async execution of the test case `core/request`

## v3.42.1 (2021-04-12)

#### :house: Internal

* Optimized exporting of interfaces `core/async`

## v3.42.0 (2021-04-02)

#### :rocket: New Feature

* [Added a feature of optional patterns with `Date.format`](https://github.com/V4Fire/Core/issues/163)

## v3.41.0 (2021-04-02)

#### :rocket: New Feature

* Added a wrapper to provide the feature of persistent storing `core/cache/decorators/persistent`

## v3.40.1 (2021-04-01)

#### :bug: Bug Fix

* Restored `core/async/const`

## v3.40.0 (2021-04-01)

#### :rocket: New Feature

* Added a wrapper to provide the feature of `core/cache` expiring
* Added a new parameter `paramsFilter` to filter values that shouldn't be serialized `core/url/toQueryString`
* Added a new parameter `querySerializer` to specify how to serialize queries to URL `core/request`

#### :bug: Bug Fix

* Fixed an issue when trying to remove event listeners by providing a label without specifying a group `core/async`

## v3.39.0 (2021-03-19)

#### :bug: Bug Fix

* Fixed `camelize` when calling with an empty string `prelude/string/transformers`

## v3.38.1 (2021-03-19)

#### :bug: Bug Fix

* `core/data` tests rewrited on express

## v3.38.0 (2021-03-18)

#### :bug: Bug Fix

* Fixed `camelize` when calling with `upper: false` `prelude/string/transformers`

## v3.37.0 (2021-03-17)

#### :boom: Breaking Change

* Now `details` property within the `LogEvent` object is deprecated.
  The `additionals` property should be using instead `core/log/middlewares`.

#### :rocket: New Feature

* Added a new `BaseError` class `core/error`
* Now `RequestError` extends the `BaseError` class `core/request/error`
* Added `RequestErrorDetailsExtractor`  to extract `RequestError`'s details `core/request/error`
* Added ability to set up middlewares via the config `core/log/middlewares`
* Added a new middleware `ExtractorMiddleware` `core/log/middlewares/extractor`

#### :memo: Documentation

* Updated `core/request/error` documentation

#### :nail_care: Polish

* Improved the `RequestError`'s message format `core/request/error`

## v3.36.0 (2021-03-16)

#### :boom: Breaking Change

* `Object.mixin`:
  * Marked `onlyNew` as deprecated. Use `propsToCopy` instead.
  * Marked `withDescriptor` and `withAccessors` as deprecated. Use `withDescriptors` instead.
  * Marked `withUndef` as deprecated. Use `skipUndefs` instead.
  * Marked `concatArray` and `concatFn` as deprecated. Use `concatArrays` instead.

* `Object.forEach`:
  * Marked `notOwn` as deprecated. Use `propsToIterate` instead.
  * Marked `withDescriptor` as deprecated. Use `passDescriptor` instead.

#### :rocket: New Feature

* Added wrappers for data-providers and event-emitters `core/async`

## v3.35.1 (2021-03-11)

#### :bug: Bug Fix

* Fixed an issue when external non-enumerable properties become enumerable `core/request`

## v3.35.0 (2021-03-04)

#### :rocket: New Feature

* Added a new option `withNonEnumerables`:
  * `Object.forEach`
  * `Object.mixin`

* Added a new feature of request retryings `core/request`

#### :bug: Bug Fix

* Fixed incorrect path resolving by a chain of provider engines with parameters within URL `core/request/engines/provider`

#### :house: Internal

* `applyQueryForStr` now redefines a property with the `enumerable: false` descriptor instead of deleting it

## v3.34.0 (2021-03-03)

#### :boom: Breaking Change

* Changed a signature of `extendFilter` `core/prelude/object/mixin`

#### :rocket: New Feature

* Added a new helper `core/promise/sync/memoize`
* Now all null values from `.tsconfig` files are removed `core/build`
* Added a new config `client.tsconfig`
* Now `Object.reject and Object.select` respect object without prototypes `core/prelude/object/create`

```
// true
console.log(Object.reject({a: 1, b: 2, __proto__: null}, 'a').__proto__ == null);
```

## v3.33.2 (2021-03-01)

#### :bug: Bug Fix

* Fixed optimizing of imports `config`

## v3.33.1 (2021-03-01)

#### :bug: Bug Fix

* Fixed an issue with invalid rounding of months `core/prelude/date`

#### :house: Internal

* Added `importsNotUsedAsValues` to `.tsconfig`
* Updated dependencies: `typescript@4.2.2`

## v3.33.0 (2021-02-26)

#### :boom: Breaking Change

* Renamed `concatUrls` to `concatURLs` `core/url`

#### :rocket: New Feature

* Added a new engine based on the data providers `core/request`

## v3.32.0 (2021-02-05)

#### :rocket: New Feature

* Added a new parameter `setter` for `set` `core/prelude/object`

#### :bug: Bug Fix

* Fixed an issue when trying to set a property by the complex path `core/object/watch`
* Fixed parsing of JSON structures `core/request/engines/fetch`

## v3.31.0 (2021-02-03)

#### :rocket: New Feature

* `core/prelude/regexp`:
  * Added new methods `addFlags`, `removeFlags`, `setFlags`
  * Added new static methods `addFlags`, `removeFlags`, `setFlags`, `test`

#### :bug: Bug Fix

* Fixed using of global RegExp-s with the `g` flag

## v3.30.4 (2021-01-29)

#### :bug: Bug Fix

* Fixed the `requestIdleCallback` interface

## v3.30.3 (2021-01-28)

#### :house: Internal

* `core/async`:
  * Optimized clearing of async wrappers
  * Now all promises are wrapped by using `SyncPromise`

## v3.30.2 (2021-01-15)

#### :bug: Bug Fix

* Fixed `Object.get` interface and comments

## v3.30.1 (2021-01-11)

#### :bug: Bug Fix

* Fixed iterations over chained emoji-s `core/prelude/string`
* Fixed Unicode support of char ranges `core/range`

## v3.30.0 (2021-01-10)

#### :boom: Breaking Change

* `build`:
  * Renamed `docs.gulp.js` -> `doc.gulp.js`
  * Renamed `gulp build:docs` -> `gulp build:doc`

#### :rocket: New Feature

* Added `letters` and `String.letters` `core/prelude/string`

#### :bug: Bug Fix

* Improved Unicode support `core/prelude/string`
* Fixed providing of empty strings as API URL-s `core/request`

#### :house: Internal

* Updated `typedoc@0.20.14`

## v3.29.1 (2020-12-23)

#### :bug: Bug Fix

* Added response status checking whether it's 204 before decoding a server response `core/request/response`

#### :house: Internal

* Added mapping `application/octet-stream` to `arrayBuffer` `core/mime-type`

## v3.29.0 (2020-12-22)

#### :rocket: New Feature

* `core/prelude`:
  * Added support of `Map/WeakMap/Set/WeakSet/Array` `Object.select` and `Object.reject`
  * Added overloads for nullable values:
    * `Object.select`
    * `Object.reject`
    * `Object.createDict`
    * `Object.convertEnumToDict`
    * `Object.createEnumLike`
    * `Object.createMap`
    * `Object.fromArray`

#### :house: Internal

* Fixed TS errors `core/log`

## v3.28.2 (2020-11-11)

#### :bug: Bug Fix

* Fixed a security issue with the prototype pollution `core/url/convert`

## v3.28.1 (2020-11-06)

#### :house: Internal

* Updated dependencies: `typescript@4.1.1-rc`

## v3.28.0 (2020-11-06)

#### :rocket: New Feature

* `core/request`:
  * Added new engine based on Fetch API
  * Added decoding text in `Response` into `Document`
  * Added decoding `Buffer` (in Node.js) and `ArrayBuffer` in `Response` into json
  * Supported response type `"blob"` in Node.js request engine
  * Use `"arraybuffer"` (in `XmlHtpRequest` engine ) and `"buffer"` (in Node.js engine) as default `responseType`
  * Use Fetch API by default in browser if `AbortController` is supported

#### :house: Internal

* `core/request`:
  * Run tests with all engines instead of only Node.js one
  * Test aborting the request on timeout
  * Improved stability of tests by using local server instead of remote mock service

## v3.27.8 (2020-11-05)

#### :bug: Bug Fix

* Fixed a bug with the redundant saving of the state `core/prelude/function/curry`

```js
const a = (b, c) => b + c;
const e = a.curry()
console.log(e(4)(5)); // 9
console.log(e(3)(4)); // Error
```

## v3.27.7 (2020-11-04)

#### :bug: Bug Fix

* Fixed resolving a promise after the catch `core/promise/sync`

```js
SyncPromise.resolve(1).catch(() => undefined).then((r) => console.log(r));
```

## v3.27.6 (2020-11-01)

#### :boom: Breaking Change

* Renamed `MockResponseType` -> `MockResponseValue` `core/data`

#### :house: Internal

* Updated dependencies:
  `tslib@2.0.3`
  `got@11.8.0`
  `del@6.0.0`
  `upath@2.0.0`
  `find-up@5.0.0`
  `typedoc@0.19.2`
  `jasmine@3.6.3`
  `@types/jasmine@3.6.0`

## v3.27.5 (2020-09-29)

#### :bug: Bug Fix

* Fixed a bug when cloning an object with cycle links `Object.fastClone`

## v3.27.4 (2020-09-29)

#### :bug: Bug Fix

* `core/object/watch`:
  * Fixed a bug when a deleted property won't be deleted from an object if using `unset`
  * Fixed restoring of an old value `engines/accessors/set`

#### :house: Internal

* Refactoring `core/object/watch`

## v3.27.3 (2020-09-25)

#### :bug: Bug Fix

* Fixed a bug when Dates could be transformed to strings after cloning `Object.fastClone`

## v3.27.2 (2020-09-18)

#### :bug: Bug Fix

* Fixed invalid imports within README `core/data`
* Fixed a bug when a new value to set is equal by a link with the previous `core/object/watch`

## v3.27.1 (2020-09-10)

#### :bug: Bug Fix

* Fixed a bug with iOS and ES6 when the engine hasn't parsed a declaration with nested arrow functions `core/request`

## v3.27.0 (2020-09-04)

#### :boom: Breaking Change

* Dropped `interface.ts`:
  * `core/functools/deprecation`
  * `core/functools/implementation`

#### :rocket: New Feature

* Added a new module `core/functools/warning`

#### :house: Internal

* Re-wrote the module with `core/functools/warning`:
  * `core/functools/deprecation`
  * `core/functools/implementation`

## v3.26.0 (2020-09-04)

#### :rocket: New Feature

* Added `jsonReviver` to `CreateRequestOptions` `core/request`

#### :bug: Bug Fix

* Fixed a bug when strings could be compiled to Dates after cloning `Object.fastClone`

#### :house: Internal

* Extracted some types to `interface.ts` `core/prelude/object/clone`

## v3.25.1 (2020-09-04)

#### :bug: Bug Fix

* Fixed parsing "1997-07-16T19:20:30.45+0100" format on iOS `core/prelude/date`

## v3.25.0 (2020-09-03)

#### :rocket: New Feature

* Now `deprecate` returns `DeprecatedFn` `core/functools/deprecation`
* Now `notImplement` returns `NotImplementedFn` `core/functools/implementation`

## v3.24.2 (2020-09-02)

#### :house: Internal

* Review `any` and `unknown` types

## v3.24.1 (2020-09-01)

#### :bug: Bug Fix

* Fixed TS signatures of `Object.has`, `Object.delete`

## v3.24.0 (2020-08-12)

#### :rocket: New Feature

* Added `Object.delete`

#### :bug: Bug Fix

* Fixed `Object.has` with Set and WeakSet

## v3.23.0 (2020-08-10)

#### :rocket: New Feature

* Added a new engine based on IndexedDB `core/kv-storage`

#### :house: Internal

* Updated dependencies:
  `@v4fire/linters@1.5.4`
  `@types/jasmine@3.5.12`

## v3.22.5 (2020-07-31)

#### :bug: Bug Fix

* Fixed `core/object/watch/engines/accessors/set`

## v3.22.4 (2020-07-30)

#### :bug: Bug Fix

* [Fixed incorrectly ignored errors `build/include`](https://github.com/V4Fire/Core/pull/121)

## v3.22.3 (2020-07-23)

#### :bug: Bug Fix

* [Fixed notice params being ignored `core/functools/deprecation`](https://github.com/V4Fire/Core/pull/120)
* Fixed notice params being ignored `core/functools/implementation`

#### :house: Internal

* [Added `component` `core/functools/deprecation/DeprecatedExprType`](https://github.com/V4Fire/Core/pull/120)
* Added `typedoc.tsconfig`

## v3.22.2 (2020-07-21)

#### :boom: Breaking Change

* Set `skipLibCheck` to false `.tsconfig`

#### :bug: Bug Fix

* Fixed errors within `index.d.ts`
* Fixed deep watching by a complex path with overrides `core/object/watch`

```js
const obj = {
  a: {
    b: {
      c: 1
    }
  }
};

const {proxy} = watch(obj, 'a.b.c', (newVal, oldVal) => {
  console.log(newVal, oldVal);
});

proxy.a.b = {c: 1};
```

#### :house: Internal

* Fixed TS errors

## v3.22.1 (2020-07-20)

#### :bug: Bug Fix

* Fixed deep watching with a complex path `core/object/watch`

#### :house: Internal

* Updated dependencies: typescript@3.9.7, @v4fire/linters@1.4.0

## v3.22.0 (2020-07-14)

#### :rocket: New Feature

* Added `core/object/watch/isProxy`

## v3.21.1 (2020-07-13)

#### :bug: Bug Fix

* Fixed the bug when comparing intermediate numbers `core/semver`

## v3.21.0 (2020-07-10)

#### :rocket: New Feature

* Added `build/const/isLayerDep` & `build/const/isExternalDep`

#### :bug: Bug Fix

* Fixed the bug when comparing with `ord` strategy `core/semver`
* Added the project name to `build/const/depsRgxpStr`

#### :house: Internal

* Made timeout interval for async specs bigger
* Refactoring `build/tsconfig.gulp.js`
* Updated dependencies: got@11.5.0, @v4fire/linters@1.2.1

## v3.20.4 (2020-07-06)

#### :bug: Bug Fix

* Fixed passing of constructor options `core/data`

## v3.20.3 (2020-07-06)

#### :bug: Bug Fix

* Fixed passing of constructor options `core/data`

## v3.20.2 (2020-07-06)

#### :bug: Bug Fix

* Fixed constructor accessibility `core/data`

## v3.20.1 (2020-07-06)

#### :house: Internal

* All linter configurations now loaded from @v4fire/linters

## v3.20.0 (2020-07-05)

#### :boom: Breaking Change

* Changed the returning value of `clear` from `Set` to `Map` `core/kv-storage`
* New API and logic `core/queue/merge`
* Removed `core/prelude/number/converters/ex`

#### :rocket: New Feature

* Migration to from TSLint to ESlint
* Added tasks to build core as a standalone library
* Added the code coverage tool
* Added more tests
* Added node.js support for all modules
* Added `SimpleWorkerQueue`

#### :bug: Bug Fix

* Fixed bugs

#### :house: Internal

* Improved doc
* Refactoring

## v3.19.2 (2020-06-19)

#### :bug: Bug Fix

* [Fixed `Object.isCustomObject` for objects without prototypes](https://github.com/V4Fire/Core/issues/112)

## v3.19.1 (2020-06-08)

#### :bug: Bug Fix

* Restored deprecated API `Object.fromArray`

## v3.19.0 (2020-06-08)

#### :boom: Breaking Change

* Review `Object.fromArray` API

## v3.18.0 (2020-05-29)

#### :rocket: New Feature

* Added config hash

#### :house: Internal

* :new: node-object-hash@2.0.0
* Review config files

## v3.17.3 (2020-05-26)

#### :house: Internal

* Fixed TS types

## v3.17.2 (2020-05-25)

#### :house: Internal

* Added `husky`
* [Added `config.expand` method](https://github.com/V4Fire/Core/pull/103)
* [Added `@v4fire/typescript-check`](https://github.com/V4Fire/Core/pull/104)
* [Added `[Typescript check]` action](https://github.com/V4Fire/Core/pull/104)
* Updated dependencies: got@11.1.4

## v3.17.1 (2020-05-24)

#### :house: Internal

* :up: typesctipt@3.9.3, tslib@2.0.0

## v3.17.0 (2020-05-22)

#### :boom: Breaking Change

* [Removed `ts-toolbelt`](https://github.com/V4Fire/Core/pull/99)

#### :rocket: New Feature

* Added tilda ranges `core/semver`

## v3.16.1 (2020-05-22)

#### :bug: Bug Fix

* Fixed `dropCache` `core/data`

## v3.16.0 (2020-05-21)

#### :rocket: New Feature

* Added a feature to provide a custom watch engine `core/object/watch`

#### :bug: Bug Fix

* Fixed watching of arrays `core/object/watch`
* Fixed proxy arrays concatenation `core/object/watch`

## v3.15.4 (2020-05-15)

#### :bug: Bug Fix

* Fixed concatenation with absolute URL-s `core/url/concat`

## v3.15.3 (2020-05-15)

#### :bug: Bug Fix

* Fixed `Object.reject/select` type inferring
* [Fixed `core/semver`](https://github.com/V4Fire/Core/pull/91)

## v3.15.2 (2020-05-13)

#### :bug: Bug Fix

* Fixed TS compile flags

## v3.15.1 (2020-05-10)

#### :bug: Bug Fix

* Fixed `core/data/middlewares/wait` within `encoder` mode
* Fixed TS warnings

## v3.15.0 (2020-05-09)

#### :rocket: New Feature

* Added new build parameters `--client-output`, `--server-output`, `--output`

#### :bug: Bug Fix

* Fixed range validation `core/range`

#### :house: Internal

* Added spec `core/range`

## v3.14.0 (2020-05-08)

#### :rocket: New Feature

* Added jasmine@3.5.0
* Added spec `core/url`

## v3.13.3 (2020-05-01)

#### :bug: Bug Fix

* Fixed clearing of zombie tasks `core/async`

#### :house: Internal

* Refactoring `core/object/watch`

## v3.13.2 (2020-04-29)

#### :bug: Bug Fix

* Fixed watching for "spread" objects `core/object/watch`

## v3.13.1 (2020-04-28)

#### :bug: Bug Fix

* Fixed promise rejecting `core/async`
* Fixed clearing by id `core/async`

## v3.13.0 (2020-04-27)

#### :rocket: New Feature

* [Added `core/data/middlewares/wait`](https://github.com/V4Fire/Core/pull/87)

## v3.12.0 (2020-04-27)

#### :boom: Breaking Change

* Renamed interfaces from `core/kv-storage`:
  * `Namespace` -> `SyncStorageNamespace`
  * `AsyncNamespace` -> `AsyncStorageNamespace`
  * `FactoryResult` -> `SyncStorage`
  * `AsyncFactoryResult` -> `AsyncStorage`

#### :rocket: New Feature

* Added `has`, `clear` methods `core/kv-storage`

#### :bug: Bug Fix

* Fixed clearing within a namespace `core/kv-storage`

#### :house: Internal

* Improved documentation `core/kv-storage`

## v3.11.3 (2020-04-23)

#### :bug: Bug Fix

* Fixed `Object.set` invalid overload

## v3.11.2 (2020-04-23)

#### :bug: Bug Fix

* Fixed request caching `core/data`

#### :house: Internal

* Improved TS types

## v3.11.1 (2020-04-22)

#### :bug: Bug Fix

* Fixed TS errors

## v3.11.0 (2020-04-22)

#### :rocket: New Feature

* Added functional overloads to Prelude API:

```js
Object.get('foo')({foo: 1});
String.camelize({upper: true})('foo-bar');
/// etc.
```

* Added `Function.compose` to right-to-left composing of functions:

```js
Function.compose(String.camelize, Object.get('foo'))({foo: 'foo-bar'});
Function.compose(String.camelize, Object.get('foo'), () => Promise.resolve({foo: 'foo-bar'}))().then((res) => {
  console.log(res);
});
```

* Added `Function.prototype.compose` to left-to-right composing of functions:

```js
Object.get('foo').compose(String.camelize)({foo: 'foo-bar'});
```

* Added `Function.curry` and `Function.prototype.curry` to create curried functions:

```js
function calc(a, b, c, d) {
  return a * (b + c + d);
}

calc.curry()(10)(1, 2)(0); // 30
calc.curry()(Function.__, 1)(10, 2)(0); // 30
```

* Added `Object.Option` wrapper, that can contain some value beside null or undefined:

```js
Object.Option(1).then((v) => v === 1);
Object.Option(null).catch((v) => v === null);
Object.Option((s) => s.camelize())(null).catch((v) => v === null);
```

* Added `Function.prototype.option` helper, that can wrap a function to `Option` structure

```js
((s) => s.camelize()).option()(null).catch((v) => v === null);
```

* Added `Object.Result` wrapper, that can contain some value or error:

```js
Object.Result(1).then((v) => v === 1);
Object.Result(new Error('Boom!')).catch((err) => err.message === 'Boom!');
Object.Result(Promise.reject('Boom!')).catch((err) => err === 'Boom!');
Object.Result((s) => s.camelize())(null).catch((err) => err.message === 's is null');
```

* Added `Function.prototype.result` helper, that can wrap a function to `Result` structure

```js
((s) => s.camelize()).result()(null).catch((err) => err.message === 's is null');
```

* Added `Array.concat`

```js
Array.concat([], 1, null, [2, 3, 4]) // [1, 2, 3, 4];
```

* Added support of iterables `Array.union`

```js
Array.union([], 1, null, [1, 2].values()) // [1, 2];
```

* Added new prelude types: `AnyFunction`, `AnyOneArgFunction`, `Maybe`, `Either`
* Added `ts-toolbelt`
* [Added `debounce/throttle` to `core/async`](https://github.com/V4Fire/Core/pull/82)
* Added an overload for the zero delay `core/prelude/function/lazy/debounce`
* [Added `core/queue/order`](https://github.com/V4Fire/Core/pull/83)
* [Improved `core/queue/worker` API](https://github.com/V4Fire/Core/pull/83)

#### :house: Internal

* Refactoring

## v3.10.4 (2020-04-13)

#### :house: Internal

* Fixed types `core/object/watch`

## v3.10.3 (2020-04-10)

#### :bug: Bug Fix

* Fixed `deprecated/notImplemented` with accessors

## v3.10.2 (2020-04-08)

#### :bug: Bug Fix

* Added normalizing of input data `core/mime-type/getDataType`
* Fixed URL encoding `core/url/toQueryString`

## v3.10.1 (2020-04-07)

#### :bug: Bug Fix

* Fixed `lastDate` synchronization `core/net`

## v3.10.0 (2020-04-07)

#### :boom: Breaking Change

* [Switched the priority of a response type `core/request/response`](https://github.com/V4Fire/Core/pull/63)
* [`core/url/fromQueryString` doesn't parse nested properties by default](https://github.com/V4Fire/Core/pull/72)

#### :rocket: New Feature

* [Added `core/mime-type`](https://github.com/V4Fire/Core/pull/62)
* [Added support for custom cache strategies](https://github.com/V4Fire/Core/pull/65)
* [Added a new reviver parameter to `Object.parse`](https://github.com/V4Fire/Core/pull/72)
* [Added new overloads with options for `toQueryString/fromQueryString` `core/url`](https://github.com/V4Fire/Core/pull/72)
* [Added `core/data/middlewares/attach-status`](https://github.com/V4Fire/Core/pull/73)
* Added `Symbol.iterator` to `core/range`
* [Added `core/functools/implementation`](https://github.com/V4Fire/Core/pull/75)

#### :house: Internal

* Improved type inference `core/json/convertIfDate`
* Extracted constants to separated files `core/prelude`
* [Review `core/request`](https://github.com/V4Fire/Core/pull/68)
* [Review `core/data`](https://github.com/V4Fire/Core/pull/69)
* [Review `core/queue`](https://github.com/V4Fire/Core/pull/71)
* [Extracted `core/net` logic to an engine](https://github.com/V4Fire/Core/pull/74)

## v3.9.0 (2020-03-31)

#### :rocket: New Feature

* Added `Object.isPrimitive`
* Added `mute`/`unmute` to `core/object/watch`
* Added `pathModifier` to `core/object/watch`
* Added `eventFilter` to `core/object/watch`
* Added `root` to `core/object/watch/interface/WatchHandlerParentParams`

#### :bug: Bug Fix

* Fixed network connection status' checking algorithm

## v3.8.0 (2020-03-25)

#### :rocket: New Feature

* Added set/unset methods `core/object/watch`

## v3.7.5 (2020-03-24)

#### :bug: Bug Fix

* Fixed watching for Map/Set by using the engine `core/object/watch/engines/accessors`

## v3.7.4 (2020-03-23)

#### :bug: Bug Fix

* Fixed getting a property by a symbol from a proxy `core/object/watch`

## v3.7.3 (2020-03-23)

#### :house: Internal

* Exported some helpful helpers from `core/object/watch`

## v3.7.2 (2020-03-22)

#### :bug: Bug Fix

* Fixed `core/object/watch` with Map/Set structures

#### :house: Internal

* Updated dependencies: eventemitter2@6.2.1

## v3.7.1 (2020-03-20)

#### :bug: Bug Fix

* Fixed `core/object/watch` collapsing of events

## v3.7.0 (2020-03-17)

#### :rocket: New Feature

* Added `parent` to `core/object/watch/interface/WatchHandlerParams`

#### :bug: Bug Fix

* Fixed `core/object/watch` collapsing of events

## v3.6.1 (2020-03-16)

#### :bug: Bug Fix

* Fixed `core/object/watch` with another watchers

## v3.6.0 (2020-03-15)

#### :rocket: New Feature

* Added `withProto` parameter for `core/object/watch`

#### :bug: Bug Fix

* Fixed `core/object/watch` with nested objects

## v3.5.3 (2020-03-12)

#### :bug: Bug Fix

* Fixed `Object.create`

## v3.5.2 (2020-03-10)

#### :bug: Bug Fix

* Fixed `Object.forEach` overloads
* Fixed `core/object/watch` for getters

## v3.5.1 (2020-03-05)

#### :bug: Bug Fix

* Fixed `core/object/watch` with native structures

## v3.5.0 (2020-03-05)

#### :rocket: New Feature

* Added `core/object/select`
* Added `core/object/watch`
* Added `core/data`
* Added `core/socket`

#### :house: Internal

* Moved `core/session` to `@v4fire/client`
* Moved `core/event/resolveAfterDOMLoaded` to `@v4fire/client`

## v3.4.2 (2020-03-04)

#### :bug: Bug Fix

* Fixed error details `core/request`

## v3.4.1 (2020-03-04)

#### :bug: Bug Fix

* Fixed `Object.has` with primitive values
* Fixed `toQueryString/fromQueryString` from `core/url`
* Added URL to a request error `core/request/error`

## v3.4.0 (2020-03-03)

#### :rocket: New Feature

* Added request information to a request error `core/request/error`

## v3.3.10 (2020-03-02)

#### :bug: Bug Fix

* Fixed `String.prototype.camelize` default behaviour

## v3.3.9 (2020-02-28)

#### :bug: Bug Fix

* Fixed invalid object converting `core/kv-storage`

#### :house: Internal

* Updated dependencies: tslib@1.11.1

## v3.3.8 (2020-02-25)

#### :bug: Bug Fix

* Fixed prelude initializing

## v3.3.7 (2020-02-25)

#### :bug: Bug Fix

* Fixed `Object.isCustomObject` with functions

## v3.3.6 (2020-02-21)

#### :bug: Bug Fix

* Fixed default import `core/queue/worker`

## v3.3.5

#### :bug: Bug Fix

* Fixed default import `core/queue/interface`

#### :house: Internal

* Updated dependencies: typescript@3.8.2

## v3.3.4

#### :bug: Bug Fix

* Fixed default import `core/queue/merge`

#### :house: Internal

* Updated dependencies: typescript@3.8.1

## v3.3.3

#### :bug: Bug Fix

* Fixed `core/request/engines/browser` with specified contentType value

## v3.3.2

#### :bug: Bug Fix

* Fixed invalid imports

## v3.3.1

#### :bug: Bug Fix

* Fixed invalid imports

## v3.3.0

#### :rocket: New Feature

* Added support for a custom engine with `core/request`
* Added support for a custom engine with `core/analytics`

#### :house: Internal

* Improved TS types `core/kv-storage`

## v3.2.0

#### :boom: Breaking Change

* Renamed `core/meta` to `core/functools`
* Review `core/queue` API

#### :rocket: New Feature

* Added `core/queu/simple`
* Added `Object.hasOwnProperty` to `prelude/object`
* Added a new overload to `Object.has` from `prelude/object`

#### :bug: Bug Fix

* Fixed `core/request` with absolute URL-s

#### :house: Internal

* Improved TS types `core/request`

## v3.1.4

#### :house: Internal

* Improved TS types `core/request`

## v3.1.3

#### :house: Internal

* Improved TS types `core/request`

## v3.1.2

#### :bug: Bug Fix

* Fixed JSON parsing `core/kv-storage`

## v3.1.1

#### :bug: Bug Fix

* [Fixed JSON parsing `core/kv-storage`](https://github.com/V4Fire/Core/pull/43)

## v3.1.0

#### :rocket: New Feature

* Added `Object.isIterable`
* Unmarked deprecation flag from `Object.isPlainObject`
* Unmarked deprecation flag from `Object.isSimpleObject`

#### :bug: Bug Fix

* Added native check for `Object.isCustomObject`

#### :house: Internal

* TS type refactoring
* Some optimizations and refactoring

## v3.0.6

#### :house: Internal

* Improved `Then` and `SyncPromise` interfaces

## v3.0.5

#### :house: Internal

* Improved TS types

## v3.0.4

#### :bug: Bug Fix

* Fixed `Async` initializing

## v3.0.3

#### :house: Internal

* Improved interfaces for promises

## v3.0.2

#### :rocket: New Feature

* Added `Object.isDictionary`, `Object.isPlainObject` marked as deprecated

## v3.0.1

#### :bug: Bug Fix

* Fixed `String.prototype.underscore`

## v3.0.0

#### :boom: Breaking Change

* Removed `core/thread`
* Promise versions of the `Async` methods now returns a SyncPromise instance
* Removed hardcode for `document.addEventListener` options within `Async` methods
* Removed the legacy CSRF header from the session API
* Added a new header to the session API: it can take a dictionary with additional parameters
* Removed `json/setJSONToUTC`
* Changed signature of `Number.prototype.pad`
* Removed `Object.getPrototypeChain`
* Marked `Date.getWeekDays` as deprecated

#### :rocket: New Feature

* Added deprecation API `core/meta/deprecation`
* Added `Object.isPromiseLike`
* Added `Then.prototype.finally`
* Added `core/promise/sync` API (`core/event/createSyncPromise` was marked as deprecated)
* Reviewed `core/event` API
* Improved `Number.prototype.format`
* Added a bunch of new functions to `Number` from `Number.prototype`
* Added `Object.createEnumLike` (`Object.createMap` was marked as deprecated)
* Added `Object.isPlainObject` (`Object.isObject` was marked as deprecated)
* Added `Object.isCustomObject` (`Object.isSimpleObject` was marked as deprecated)
* Improved `Object.fromArray` API
* Added new parameters for `core/request/interface/RequestAPI`
* Improved date/number formatting API
* Improved API of `prelude/string`
* Added `Range.prototype.values`

#### :house: Internal

* Updated dependencies: eventemitter2@6.0.0

## v3.0.0-beta.94 (2019-12-18)

#### :boom: Breaking Change

* Removed `core/thread`

#### :rocket: New Feature

* Added `Object.fastHash`

#### :bug: Bug Fix

* Fixed `Object.fastClone` with Set objects

## v3.0.0-beta.93 (2019-12-10)

#### :rocket: New Feature

* Added `preventDefault` parameter to `core/async/ClearOptions`

#### :house: Internal

* Updated dependencies: typescript@3.7.3, got@10.0.3, node-localstorage@2.1.5, eslint@6.7.2

## v3.0.0-beta.92 (2019-12-06)

#### :boom: Breaking Change

* Renamed interfaces `Opts` -> `Options`

## v3.0.0-beta.91 (2019-11-27)

#### :house: Internal

* Fixed `index.d.ts`

## v3.0.0-beta.90 (2019-11-12)

#### :house: Internal

* [Removed ES flag validation](https://github.com/V4Fire/Core/pull/42)

## v3.0.0-beta.89 (2019-11-12)

#### :rocket: New Feature

* Added functional form for `RequestAPI` parameters

#### :bug: Bug Fix

* Fixed `core/request/context/wrapAsResponse`

## v3.0.0-beta.88 (2019-11-12)

#### :bug: Bug Fix

* Fixed `content-type` header resolving `core/request/response`

## v3.0.0-beta.87 (2019-11-06)

#### :bug: Bug Fix

* Fixed querystring interpolation (`core/request`)

## v3.0.0-beta.86 (2019-11-06)

#### :house: Internal

* Improved `core/session` type declarations

## v3.0.0-beta.85 (2019-11-06)

#### :rocket: New Feature

* [Added querystring interpolation within url (core/request)](https://github.com/V4Fire/Core/pull/41)

#### :house: Internal

* Updated dependencies: typescript@3.7.2, dotenv@8.2.0, eslint@6.6.0
* Improved `core/session` type declarations
* Fixed `core/event` type declarations

## v3.0.0-beta.84 (2019-10-22)

#### :bug: Bug Fix

* [Fixed `Async.links` override](https://github.com/V4Fire/Core/pull/36)

## v3.0.0-beta.83 (2019-10-17)

#### :rocket: New Feature

* [Improved API for `Object.fromArray`](https://github.com/V4Fire/Core/pull/35)

## v3.0.0-beta.82 (2019-10-17)

#### :bug: Bug Fix

* Fixed `globalThis` shim

## v3.0.0-beta.81 (2019-10-14)

#### :boom: Breaking Change

* Renamed `whenDomLoaded` -> `afterDOMLoaded` `core/event`
* New API `core/request/create` for `resolver` parameter
* Removed `core/helpers/string/pluralize`

#### :rocket: New Feature

* Improved API `core/event/afterEvents`
* Added `HAS_WINDOW` for `core/env`
* Added `globalThis` shim

## v3.0.0-beta.80 (2019-10-10)

#### :boom: Breaking Change

* New API for `String.capitalize`

## v3.0.0-beta.79 (2019-10-10)

#### :bug: Bug Fix

* Fixed stable `String.dasherize` & `String.underscore` with numbers

## v3.0.0-beta.78 (2019-10-10)

#### :bug: Bug Fix

* Fixed `String.dasherize` & `String.underscore` with numbers

## v3.0.0-beta.77 (2019-10-09)

#### :bug: Bug Fix

* Fixed `clear` within `core/queue`

## v3.0.0-beta.76 (2019-10-09)

#### :house: Internal

* Improved interface `core/queue`

## v3.0.0-beta.75 (2019-10-09)

#### :house: Internal

* Improved interface `core/queue`

## v3.0.0-beta.74 (2019-10-09)

#### :boom: Breaking Change

* New API for `core/queue/interface` and `core/queue/merge`

## v3.0.0-beta.73 (2019-10-09)

#### :rocket: New Feature

* Added `clear` to `core/queue`
* Marked `interval`, `concurrency`, `activeWorkers` as public `core/queue`

## v3.0.0-beta.72 (2019-10-09)

#### :boom: Breaking Change

* New API for `core/queue/interface` and `core/queue/merge`

## v3.0.0-beta.71 (2019-10-08)

#### :bug: Bug Fix

* Fixed `Object.clone` with functions

## v3.0.0-beta.70 (2019-10-04)

#### :boom: Breaking Change

* Added new interface for `core/prelude/i18n/locale`

## v3.0.0-beta.69 (2019-09-23)

#### :house: Internal

* Improved error handling `core/event/onEverythingReady`

## v3.0.0-beta.68 (2019-09-20)

#### :bug: Bug Fix

* Fixed `Function.throttle`

## v3.0.0-beta.67 (2019-09-07)

#### :rocket: New Feature

* Improved number prelude API:
  * Added `Number.prototype.isFloat`
  * Added `Number.prototype.isEven`
  * Added `Number.prototype.isOdd`
  * Added `Number.prototype.isPositive`
  * Added `Number.prototype.isNegative`
  * Added `Number.prototype.isNonNegative`
  * Added `Number.prototype.isNatural`
  * Added `Number.prototype.isBetweenZeroAndOne`
  * Added `Number.prototype.isPositiveBetweenZeroAndOne`

#### :house: Internal

* Updated dependencies: typescript@3.6.2

## v3.0.0-beta.66 (2019-08-27)

#### :bug: Bug Fix

* Fixed the case when `.api` is not proved for a request

#### :house: Internal

* Extracted `RequestAPI` to an interface
* Added `CHANGELOG.md`
* Marked `LogOptions.patterns` property as required
