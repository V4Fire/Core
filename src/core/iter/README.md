# core/iter

This module provides a bunch of helpers to create and work with iterators.

## intoIter

Creates an iterator based on the specified object and returns it.
The function has various overloads:

1. If the passed value is boolean, the function creates an infinite iterator.
   If the passed value is true, the created iterator will produce values from zero to the positive infinity.
   Otherwise, from zero to the negative infinity.
