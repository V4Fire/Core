# core/prelude/i18n

This module provides API to work with internalizing.

## Definition

Key - is the basic information unit. A named object for storing information. The translations are contained in the project keys.

Keyset - is a set of keys connected by some logic. For example, a Keyset for a component or for a set of functions.

## Format

```js
i18n(keysetName, customLocale?)(key, i18nParams);
```

## i18n params

i18n params is a dictionary that allows you to substitute variables inside the text.

Curly brackets are used to use variables inside the text.
`Hello is my {variable}`

### Pluralization (parameter count)

For pluralization within parameters, a special parameter `count` is used.

Besides the fact that count is supplied in the sentence, like any other variable.
It is also used to determine the correct form of a sentence.

Available values for the count parameter:

1. Number
2. 'none', 'one', 'many', 'some' - string

String representation can be used if the number itself is not used in the sentence.

'one': There are no promotions in the selected store.
'many': There are no promotions in the selected stores.

## Usage

```js
// Getting the language translation for the key
i18n('my-keyset-name')('my key'); 

// Resolve variables in text
i18n('my-keyset-name')('My name is {name}', {name: 'John'}); // My name is John

// Pluralize text
i18n('my-keyset-name')('I have {count} toy', {count: 10}); // I have 10 toys

// Using translations other than the common language of the application
i18n('my-keyset-name', 'ru')('I have {count} toy', {count: 10}); // У меня 10 игрушек
```