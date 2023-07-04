# core/kv-storage/engines/string

This module provides an engine for string-based "key-value" data storage.

## Usage

This storage allows you to work with a standard interface. It is specifically beneficial when your data storage needs are confined to a string format, such as when storing data in cookies.

## How is data stored inside a string?

When saving, the data is serialized into a string, where special separator characters are inserted between the keys and values.

## Restrictions

Once a value is retrieved, the engine attempts to parse the data using `JSON.parse`. Consequently, strings such as `'false'` and `'true'` are converted into corresponding boolean values. It's important to note this characteristic during data interpretation.
