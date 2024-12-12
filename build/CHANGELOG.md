Changelog
=========

> **Tags:**
> - :boom:       [Breaking Change]
> - :rocket:     [New Feature]
> - :bug:        [Bug Fix]
> - :memo:       [Documentation]
> - :house:      [Internal]
> - :nail_care:  [Polish]

## v4.0.0-alpha.52 (2024-12-12)

#### :house: Internal

* `target` option for `ts-node` set to `esnext`

## v3.86.2 (2022-05-18)

#### :bug: Bug Fix

* Fixed an issue with `Module._resolveFilename` was overwritten by Playwright

## v3.84.0 (2022-04-06)

#### :boom: Breaking Change

* The `config` package now uses an alias `@config/config`

#### :rocket: New Feature

* Added a `tsnode` initialization script `build/tsnode`

#### :house: Internal

* Moved a script to build `.tsconfig` files to a separate file `build/build-tsconfig`

## v3.55.0 (2021-07-24)

#### :rocket: New Feature

* Added new options `return` and `ctx` for `globalThis.include`

## v3.34.0 (2021-03-03)

#### :rocket: New Feature

* Now all null values from `.tsconfig` files are removed

## v3.30.0 (2021-01-10)

#### :boom: Breaking Change

* Renamed `docs.gulp.js` -> `doc.gulp.js`
* Renamed `gulp build:docs` -> `gulp build:doc`

## v3.22.4 (2020-07-30)

#### :bug: Bug Fix

* [Fixed incorrectly ignored errors `include`](https://github.com/V4Fire/Core/pull/121)

## v3.21.0 (2020-07-10)

#### :rocket: New Feature

* Added `const/isLayerDep` & `const/isExternalDep`

#### :bug: Bug Fix

* Added the project name to `const/depsRgxpStr`

#### :house: Internal

* Refactoring `tsconfig.gulp.js`
