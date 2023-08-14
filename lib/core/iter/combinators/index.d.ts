/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
/**
 * [[include:core/iter/combinators/README.md]]
 * @packageDocumentation
 */
/**
 * Takes iterable objects and returns a new iterator that produces values from them sequentially
 * @param iterables
 */
export declare function sequence<T extends Iterable<any>>(...iterables: T[]): IterableIterator<IterableType<T>>;
/**
 * Takes async iterable objects and returns a new async iterator that produces values from them sequentially
 *
 * @param iterable
 * @param iterables
 */
export declare function sequence<T extends AsyncIterable<any>, A extends AnyIterable<any>>(iterable: T, ...iterables: A[]): AsyncIterableIterator<IterableType<T> | IterableType<A>>;
