# core/object/select

This module provides a function to find an element from an object by the specified parameters.
The function is useful for declarative searching from data without functions, i.e., we can take parameters to search from JSON
or other stuff.

## Searching upon a plain object

When the search function takes a plain object and some `where` condition, it returns the object itself if it matches the condition.
Otherwise, it returns `undefined`.

```js
import select from 'core/object/select';

// {foo: 1, bar: 2}
select({foo: 1, bar: 2}, {where: {foo: 1}});

// undefined
select({foo: 1, bar: 2}, {where: {foo: 1, bar: 3}});
```

The matching process is recursive, i.e., it checks the nested structure of the condition and object.

```js
import select from 'core/object/select';

// {foo: {b: [1, 2, 3]}}
select({foo: {b: [1, 2, 3]}}, {where: {foo: {b: [1, 2, 3]}}});

// undefined
select({foo: {b: [1, 2, 3]}}, {where: {foo: {b: [1]}}});
```

If the object to search doesn't have some property from `where`, the property will be ignored if other conditions are matched.

```js
import select from 'core/object/select';

// {foo: 1, bar: 2}
select({foo: 1, bar: 2}, {where: {baz: 78, foo: 1}});

// undefined
select({foo: 1, bar: 2}, {where: {baz: 78}});
```

## Searching upon an iterable object

When the search function takes an iterable object and some `where` condition, it returns the first element from the object
that matches the condition. If there are no elements that match the condition, the function returns undefined.

```js
import select from 'core/object/select';

// {foo: 1, bar: 2}
select([{bla: 12}, {foo: 1, bar: 2}], {where: {foo: 1}});

// undefined
select(new Set([{bla: 12}, {foo: 1, bar: 2}]), {where: {foo: 1, bar: 3}});
```

## Providing multiple conditions to search

When `where` contains an array, it will be represented as the `OR` condition.

```js
import select from 'core/object/select';

// {test: 2}
select({test: 2}, {where: [{test: 1}, {test: 2}]});
```

## Providing a context to search

By using the `from` option, you can define a start point to search.

```js
import select from 'core/object/select';

// {foo: 1, bar: 2}
select({my: {data: {foo: 1, bar: 2}}}, {where: {foo: 1}, from: 'my.data'});

// undefined
select(new Map([[0, {data: {foo: 1, bar: 2}}]]), {where: {foo: 21}, from: [0, 'data']});
```

If there is no provided `where` condition but specified `from`, the function returns a value by the path.

```js
import select from 'core/object/select';

// {foo: 1, bar: 2}
select({my: {data: {foo: 1, bar: 2}}}, {from: 'my.data'});

// {foo: 1, bar: 2}
select(new Map([[0, {data: {foo: 1, bar: 2}}]]), {from: [0, 'data']});
```
