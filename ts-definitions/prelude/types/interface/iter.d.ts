/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Wrapper for any iterable structure
 */
type AnyIterable<T = unknown> =
	Iterable<T> |
	AsyncIterable<T>;

/**
 * Wrapper for any iterator
 */
type AnyIterator<T = unknown, TReturn = any, TNext = undefined> =
	Iterator<T, TReturn, TNext> |
	AsyncIterator<T, TReturn, TNext>;

/**
 * Wrapper for any iterable iterator
 */
type AnyIterableIterator<T = unknown> =
	IterableIterator<T> |
	AsyncIterableIterator<T>;

/**
 * Wrapper for any generator function
 */
type AnyGeneratorFunction =
	GeneratorFunction |
	AsyncGeneratorFunction;

/**
 * Wrapper for any generator structure
 */
type AnyGenerator<T = unknown, TReturn = any, TNext = unknown> =
	Generator<T, TReturn, TNext> |
	AsyncGenerator<T, TReturn, TNext>;

/**
 * Extracts
 */
type IterableType<T extends AnyIterable> =
	T extends AnyIterable<infer V> ? V : T;
