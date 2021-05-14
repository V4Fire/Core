# core/range

This module provides a class to create a range structure.

## Supported ranges

The ranges can be different: numbers, characters, dates.

### number

```js
import Range from 'core/range';

const
  range = new Range(0, 10);

// true
console.log(range.contains(5));

// 6..10
console.log(range.intersect(new Range(6, 15)).toString());

console.log(range.type === 'number');
```

### string

```js
import Range from 'core/range';

const
  range = new Range('a', 'd');

// true
console.log(range.contains('b'));

// a..c
console.log(range.intersect(new Range('c', 'z')).toString());

// You can define one border as a code point
console.log(new Range('a', 'd'.codePointAt() + 2));
console.log(new Range('a'.codePointAt() + 1), 'd');

console.log(range.type === 'string');
```

### date

```js
const
  range = new Range(new Date(2019, 5), new Date(2020, 5));

// true
console.log(range.contains(new Date(2019, 8)));

// Sat Jun 01 2019 00:00:00 GMT+0300..Tue Oct 01 2019 00:00:00 GMT+0300
console.log(
  range.intersect(
    new Range(new Date(2017, 9),
    new Date(2019, 9))
  ).toString()
);

console.log(range.type === 'date');
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

If the start bound of a range more than the end bound, the created range will enumerate elements by descending order.
This behavior works well with any range.

```js
import Range from 'core/range';

// [3, 2, 1]
console.log(new Range(3, 1).toArray());

// [3, 2]
console.log(new Range(3, [1]).toArray());

// ['c', 'b', 'a']
console.log(new Range('c', 'a').toArray());
```

## Infinite ranges

It's possible to create an infinite range. Just skip one or both bound the creating the range.

```js
import Range from 'core/range';

// Range from 0 to Infinity
// 0..
console.log(new Range(0).toString());

// Range from -Infinity to a
// ..a
console.log(new Range(null, 'a').toString());

// Range from -Infinity to Infinity
// ..
console.log(new Range().toArray());
```

Mind, you can't transform infinite ranges to arrays by invoking `toArray`, but you free to use iterators.
Physically, the number and date ranges start from `Number.MIN_SAFE_INTEGER` to `Number.Max_SAFE_INTEGER`.
The string rages start from `\0` to the last Unicode code point.

```js
import Range from 'core/range';

// Range from 0 to Infinity
// 0..
console.log(new Range(0).toString());

while () {

}
```
