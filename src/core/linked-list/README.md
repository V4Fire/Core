# core/linked-list

This module provides a class to organize a doubly [[LinkedList]] data structure.
The linked list consists of [[LinkNode]].

## API

The base API is pretty close to a JS array: `push/unshift`, `pop/shift`, `length`.
The API declares:
- `first` to get the first value from a linked list;
- `last` to get the last values from a linked list;
- `clear` to clear a whole list;
- `clone` to make a shallow copy of a list;
- `has` to check if a list contains specified value.

Linked list is an iterable structure. In addition, it has a `reverse` method to return an iterator by last element.

If iterable is passed to constructor, a linked list would be created from the iterable.
