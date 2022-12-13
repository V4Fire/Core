# lang

This module provides language pack maps for internationalizing the application.
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

## Pluralization of translations

Some keys may have multiple translations depending on some numeric value. For example, "1 apple" or "5 apples".
To specify such translations, a special macro `{count}` is used, and translations are specified as a tuple `[one, some, many, none]`.

```js
export default {
  ru: {
    "my-component": {
      "time": "время",
      "{count} product": [
        "{count} продукт",
        "{count} продукта",
        "{count} продуктов",
        "{count} продуктов"
      ]
    }
  },

  en: {
    "my-component": {
      "{count} product": [
        "{count} product",
        "{count} products",
        "{count} products",
        "{count} products"
      ]
    }
  }
};
```
