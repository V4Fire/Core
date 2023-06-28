# core/kv-storage/engines/string

This module provides an engine for cookie-based "key-value" data storage.
It allows you to work with your storage as with a regular dictionary, but store data inside in string format.

## How is data stored inside a string?

When saving, the data is serialized into a string, where special separator characters are inserted between the keys and values.

## Restrictions

After receiving the value, the engine tries to parse the value via `JSON.parse`. This means that the strings `'false'`, `'true'` will be converted to boolean.
