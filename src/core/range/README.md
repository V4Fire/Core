# core/range

This module provides a class to create a range structure. The ranges can be different: numbers, characters, dates.

```js
import Range from 'core/range';

// Using number range

const
  numRange = new Range(0, 10);

console.log(numRange.contains(5)); // true
console.log(numRange.intersect(new Range(6, 15)).toString()); // 6..10

// Using date range

const
  dateRange = new Range(new Date(2019, 5), new Date(2020, 5));

console.log(dateRange.contains(new Date(2019, 8))); // true
console.log(
  dateRange.intersect(
    new Range(new Date(2017, 9),
    new Date(2019, 9))
  ).toString()
); // Sat Jun 01 2019 00:00:00 GMT+0300..Tue Oct 01 2019 00:00:00 GMT+0300

// Using string range

const
  strRange = new Range('a', 'e');

console.log(strRange.contains('d')); // true
console.log(strRange.intersect(new Range('d', 'z')).toString()); // d..e
```
