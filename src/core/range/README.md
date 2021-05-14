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

const
  arr = [];

for (const el of new Range(0)) {
  arr.push(el);

  if (el > 1e3) {
    break;
  }
}
```

## Iterators

All ranges support three kinds of iterators.
Each kind of iterators can take a step value to iterate elements (for date ranges it means milliseconds to shift).

1. By values (used by default).

```js
for (const el of new Range('a', 'c')) {
  // 'a' 'b' 'c'
  console.log(el);
}

for (const el of new Range(0, 3).values()) {
  // 0 1 2 3
  console.log(el);
}

for (const el of new Range(0, 3).values(2)) {
  // 0 2
  console.log(el);
}
```

2. By pairs of indexes and values.

```js
for (const el of new Range('c', 'a').entries()) {
  // [0, 'c'] [1, 'b'] [2 'a']
  console.log(el);
}
for (const el of new Range('c', 'a').entries(2)) {
  // [0, 'c'] [1, 'a']
  console.log(el);
}
```

3. By indexes.

```js
for (const el of new Range(3, 1).indices()) {
  // 0 1 2
  console.log(el);
}

for (const el of new Range(0, 3).indices(2)) {
  // 0 1
  console.log(el);
}
```

## API

Ranges support a bunch of methods to work with them.

### contains

The method returns true if an element is contained inside the range
(the element can be a simple value or another range).

```js
// true
console.log(new Range(0, 10).contains(4));

// false
console.log(new Range(0, [10]).contains(10));

// false
console.log(new Range(0, 10).contains(12));

// false
console.log(new Range(0, 10).contains('a'));

// true
console.log(new Range(0, 10).contains(Range(3, 6)));

// false
console.log(new Range(0, 10).contains(Range(3, 16)));

// false
console.log(new Range(0, 10).contains(Range('a', 'b')));
```

### intersect

The method returns a new range with the latest starting point as its start, and the earliest ending point as its end.
If the two ranges do not intersect, this will effectively produce an empty range.

The method preserves element ordering of the first range.
The intersection of ranges with different types will always produce an empty range.

```js
// 8..10
console.log(new Range(0, 10).intersect(new Range([7], 14)).toString());

// 10..7
console.log(new Range(10, 0).intersect(new Range(7, 14)).toString());

// 7..10
console.log(new Range(0, 10).intersect(new Range(7)).toString());

// 7..
console.log(new Range(0).intersect(new Range(7)).toString());

// ''
console.log(new Range(0, 10).intersect(new Range(11, 14)).toString());

// ''
console.log(new Range(0, 10).intersect(new Range('a', 'z')).toString());
```

### union

The method returns a new range with the earliest starting point as its start, and the latest ending point as its end.
If the two ranges do not intersect, this will effectively remove the "gap" between them.

The method preserves element ordering of the first range.
The union of ranges with different types will always produce an empty range.

```js
// 0..13
console.log(new Range(0, 10).union(new Range(7, [14])).toString());

// 14..0
console.log(new Range(10, 0).union(new Range(7, 14)).toString());

// 0..
console.log(new Range(0, 10).union(new Range(7)).toString());

// ..
console.log(new Range().union(new Range(7)).toString());

// ''
console.log(new Range(0, 10).union(new Range('a', 'z')).toString());
```

### clone

The method clones the range and returns a new.

### reverse

The method clones the range with reversing of element ordering and returns a new.

```js
// [3, 2, 1, 0]
console.log(new Range(0, 3).reverse().toArray());
```

### clamp

The method clamps an element to be within the range if it falls outside.
If the range is invalid or empty, the method always returns `null`.

```js
// 3
console.log(new Range(0, 10).clamp(3));

// 'd'
console.log(new Range('a', 'd').clamp('z'));

// null
console.log(new Range(0, [0]).clamp(10));
```

### span

The method returns a span of the range.
The span includes both the start and the end.

If the range is a date range, the value is in milliseconds.
If the range is invalid or empty, the method always returns `0`.

```js
// 4
console.log(new Range(7, 10).span());

// 0
console.log(new Range(0, [0]).span());
```

### toArray

The method creates an array from the range and returns it.
Also, it can take a step to iterate elements (for date ranges, it means milliseconds to shift).
Mind, you can't transform infinite ranges to arrays, but you free to use iterators.

```js
// [0, 3, 6, 9]
console.log(new Range(0, 10).toArray(3));

// ['a', 'b']
console.log(new Range('a', ['c']).toArray());

// []
console.log(new Range(0, [0]).toArray());
```

### toString

The method creates a string from the range and returns it.
If the range invalid or empty, the method always returns an empty string.

```js
// 0..10
console.log(new Range(0, 10).toString());

// 0..9
console.log(new Range(0, [10]).toString());

// 0..
console.log(new Range(0).toString());

// ..z
console.log(new Range(null, 'z').toString());

// ''
console.log(new Range(0, [0]).toString());
```
