# core/prelude/i18n

This module provides an API for internationalizing an application.
Keep in mind, this module provides functions, but the language packs themselves for internationalization are specified in the `lang` module.

```js
// Getting a language translation for a key
i18n('my-keyset-name')('my key');

// Resolve variables in text
i18n('my-keyset-name')('My name is {name}', {name: 'John'});     // My name is John

// Pluralize text
i18n('my-keyset-name')('I have {count} toy', {count: 10});       // I have 10 toys

// Using of several keysets, to implement inheritance or reuse shared translations
i18n(['my-keyset-name', 'dates'])('February')

// Using translations other than the app default language
i18n('my-keyset-name', 'ru')('I have {count} toy', {count: 10}); // У меня 10 игрушек
```

## Using the i18n function as a string tag

To reduce syntactic noise, it is allowed to use the internationalization function as a regular string tag.
Please note that in this option we cannot forward additional parameters (for example, for pluralization).

```js
const t = i18n('my-keyset-name');
console.log(t`my key`);
```

## Language pack structure

The structure of the language map consists of several levels:

1. The symbolic name of the language or locale for which translations are provided.

   ```js
   export default {
     'ru': { /* ... */ },
     'en-gb': { /* ... */ },
     'en-us': { /* ... */ }
   };
   ```

2. Namespace for language keys (hereinafter "keyset"). Keyset allows you to share the same keys in different contexts.
   For example, the key "Next" may have a different value in different components of the application, therefore,
   we can use the name of the component as a keyset value.

   ```js
   export default {
     ru: {
       'b-reg-form': {
         Next: 'Далее'
       },

       'b-queue': {
         Next: 'Следующий'
       }
     }
   };
   ```

3. Keys and translations. The key can be any symbolic sequence. The key values will be replaced with the corresponding translation.
   If there is no translation for the given locale or keyset, then the key itself will be displayed.

## Interpolation of variables in translations

Some translations may include special constructions in their text, which will be replaced by other meanings during translation.
To use such variables, it is enough to place them inside the `{variableName}` construct, and pass the values for
translation as an additional parameter to the `i18n` function.

```js
export default {
  en: {
    "my-component": {
      "my name is {name}": "my name is {name}",
      "apple": "apple"
    }
  }
};
```

```js
i18n('my-component')('My name is {name}', {name: 'John'});
```

## Pluralization of translations

Some keys may have multiple translations depending on some numeric value. For example, "1 apple" or "5 apples".
To specify such translations, a special macro `{count}` is used, and translations are specified as a tuple `[zero, one, two, few, many, other]`.

```js
export default {
  ru: {
    "my-component": {
      "time": "время",
      "{count} product": {
        "one": "{count} product",
        "few": "{count} products",
        "many": "{count} products",
        "zero": "{count} products",
        "other": "{count} products",
      }
    }
  },

  en: {
    "my-component": {
      "{count} product": {
        "one": "{count} product",
        "few": "{count} products",
        "many": "{count} products",
        "zero": "{count} products",
        "other": "{count} products",
      }
    }
  }
};
```

```js
i18n('my-component', 'ru')('{count} product', {count: 10});
```

## API

### Getters

#### emitter

The event emitter to broadcast localization events.

#### locale

The default application language.

```typescript
interface Locale {
  /**
   * The locale value
   */
  value: CanUndef<Language>;

  /**
   * True if the locale is default
   */
  isDefault: boolean;
}
```

#### region

The default application region.

```typescript
interface Region {
  /**
   * The region value
   */
  value: CanUndef<Region>;

  /**
   * True if the region is default
   */
  isDefault: boolean;
}
```

### Functions

#### setI18NParam

Sets a new application i18n param.

```js
import { setI18NParam } from 'core/prelide/i18n';

// Set Russian as default language
setI18NParam('locale', 'ru', true);

// Set Russia as default region
setI18NParam('region', 'RU', true);
```

#### i18n

Creates a function to internationalize strings in an application based on the given locale and keyset.
Keyset allows you to share the same keys in different contexts. For example, the key "Next" may have a different value
in different components of the application, therefore, we can use the name of the component as a keyset value.

Keep in mind that this function is global, i.e. it does not need to be explicitly imported.

```js
i18n('my-component')('My name is {name}', {name: 'John'});
```
