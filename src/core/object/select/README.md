# core/object/select

This module provides a function to find an element from an object by the specified parameters.

```js
import select from 'core/object/select';

// {test: 1}
select([{test: 1}], {where: {test: 1}});

// {test: 1}
select({test: 1}, {where: {test: 1}});

// The array is interpreted as "or"

// {test: 2}
select({test: 2}, {where: [{test: 1}, {test: 2}]});

// {test: 2}
select([{test: 1}, {test: 2}], {where: {test: 2}});

// {t: 10}
select({test: {t: 10}}, {where: {t: 10}, from: 'test'});
```
