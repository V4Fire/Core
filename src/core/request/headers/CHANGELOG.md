Changelog
=========

> **Tags:**
> - :boom:       [Breaking Change]
> - :rocket:     [New Feature]
> - :bug:        [Bug Fix]
> - :memo:       [Documentation]
> - :house:      [Internal]
> - :nail_care:  [Polish]

## v4.0.0-alpha.?? (2024-05-??)

#### :bug: Bug Fix

* Add logic that checks whether the passed instance is of the native class `Headers` or `V4Headers`
to avoid overwriting header values, add new values to headers that accept multiple values:
	- If it's native `Headers`, adds new header items using the `append` method;
	- If it's `V4Headers`, appends the items using the `set` method.

## v4.0.0-alpha.33 (2024-04-19)

#### :bug: Bug Fix

* Now, the custom `Headers` class uses the `append` method
  to construct a new set of headers based on the built-in Headers in the Fetch API implementation

## v3.78.0 (2022-03-16)

#### :rocket: New Feature

* Initial release
