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
 *
 * @param iterable
 * @param iterables
 */
export declare function seq<T extends Iterable<any>, A extends AnyIterable>(iterable: T, ...iterables: A[]): IterableIterator<IterableType<T> | IterableType<A>>;
/**
 * Takes asynchronous iterable objects and returns a new asynchronous iterator
 * that produces values from them sequentially
 *
 * @param iterable
 * @param iterables
 */
export declare function seq<T extends AsyncIterable<any>, A extends AnyIterable<any>>(iterable: T, ...iterables: A[]): AsyncIterableIterator<IterableType<T> | IterableType<A>>;
