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

* Added logic that checks whether the passed instance is of the native `Headers` class or `V4Headers`.
  To avoid overwriting response header values, we use the `append` method when handling the native Headers object
  received from the response, while retaining the original practice of setting headers with the `set` method when
  constructing request headers.

## v4.0.0-alpha.33 (2024-04-19)

#### :bug: Bug Fix

* Now, the custom `Headers` class uses the `append` method
  to construct a new set of headers based on the built-in Headers in the Fetch API implementation

## v3.78.0 (2022-03-16)

#### :rocket: New Feature

* Initial release
