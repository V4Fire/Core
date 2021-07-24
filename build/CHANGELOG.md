Changelog
=========

> **Tags:**
> - :boom:       [Breaking Change]
> - :rocket:     [New Feature]
> - :bug:        [Bug Fix]
> - :memo:       [Documentation]
> - :house:      [Internal]
> - :nail_care:  [Polish]

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
