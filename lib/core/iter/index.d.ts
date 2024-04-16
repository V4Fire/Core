/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
/**
 * Creates an infinite iterator and returns it.
 * If the passed value is true, the created iterator will produce values from zero to the positive infinity.
 * Otherwise, from zero to the negative infinity.
 *
 * @param obj
 */
export declare function intoIter(obj: boolean): IterableIterator<number>;
/**
 * Creates an empty iterator and returns it
 * @param obj
 */
export declare function intoIter(obj: null | undefined): IterableIterator<undefined>;
/**
 * Creates an iterator from zero to the passed number (non including) and returns it
 * @param obj
 */
export declare function intoIter(obj: number): IterableIterator<number>;
/**
 * Creates an iterator over the passed string by graphical letters
 * @param obj
 */
export declare function intoIter(obj: string): IterableIterator<string>;
/**
 * Creates an iterator over values from the specified dictionary and returns it
 * @param obj
 */
export declare function intoIter<T extends Dictionary>(obj: T): IterableIterator<DictionaryType<T>>;
/**
 * Creates an iterator over values from the specified array-like object and returns it
 * @param obj
 */
export declare function intoIter<T = unknown>(obj: ArrayLike<T>): IterableIterator<T>;
/**
 * Creates an iterator from the passed generator function and returns it
 * @param obj
 */
export declare function intoIter<T = unknown>(obj: GeneratorFunction): IterableIterator<T>;
/**
 * Creates an iterator from the passed asynchronous generator function and returns it
 * @param obj
 */
export declare function intoIter<T = unknown>(obj: AsyncGeneratorFunction): AsyncIterableIterator<T>;
/**
 * Creates a new iterator based on the specified iterable structure and returns it
 * @param obj
 */
export declare function intoIter<T extends Iterable<any>>(obj: T): IterableIterator<IterableType<T>>;
/**
 * Creates a new asynchronous iterator based on the specified asynchronous iterable structure and returns it
 * @param obj
 */
export declare function intoIter<T extends AsyncIterable<any>>(obj: T): AsyncIterableIterator<IterableType<T>>;
