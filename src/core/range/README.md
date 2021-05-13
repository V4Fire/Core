# core/range

This module provides a class to create a range structure.

## Supported ranges

The ranges can be different: numbers, characters, dates.

### Numbers

```js
import Range from 'core/range';

const
  numRange = new Range(0, 10);

// true
console.log(numRange.contains(5));

// 6..10
console.log(numRange.intersect(new Range(6, 15)).toString());
```

### Characters

```js
import Range from 'core/range';

const
  numRange = new Range('a', 'd');

// true
console.log(numRange.contains('b'));

// a..c
console.log(numRange.intersect(new Range('c', 'z')).toString());

// You can define the end border as a code point
console.log(new Range('a', 'd'.codePointAt()));
```

### Dates

```js
const
  dateRange = new Range(new Date(2019, 5), new Date(2020, 5));

// true
console.log(dateRange.contains(new Date(2019, 8)));

// Sat Jun 01 2019 00:00:00 GMT+0300..Tue Oct 01 2019 00:00:00 GMT+0300
console.log(
  dateRange.intersect(
    new Range(new Date(2017, 9),
    new Date(2019, 9))
  ).toString()
);
```

## Excluding the range bounds

By default, all ranges include their bounds, but you free to change this behavior. Just wrap bounds by an array.

```js
import Range from 'core/range';

// [0, 1, 2, 3]
console.log(new Range(0, 3).toArray());

// [1, 2, 3]
console.log(new Range([0], 3).toArray());

// [0, 1, 2]
console.log(new Range(0, [3]).toArray());

// [1, 2]
console.log(new Range([0], [3]).toArray());
```

## Reversed ranges

If the start bound of a range more than the end bound, the created range will enumerate elements by descent order.
This behavior works well with any type of range.

```js
import Range from 'core/range';

// [3, 2, 1]
console.log(new Range(3, 1).toArray());

// [3, 2]
console.log(new Range(3, [1]).toArray());

// ['c', 'b', 'a']
console.log(new Range('c', 'a').toArray());
```
