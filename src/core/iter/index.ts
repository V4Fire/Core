/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/iter/README.md]]
 * @packageDocumentation
 */

import Range from 'core/range';

/**
 * Creates an infinite iterator and returns it.
 * If the passed value is true, the created iterator will produce values from zero to the positive infinity.
 * Otherwise, from zero to the negative infinity.
 *
 * @param obj
 */
export function intoIter(obj: boolean): IterableIterator<number>;

/**
 * Creates an empty iterator and returns it
 * @param obj
 */
export function intoIter(obj: null | undefined): IterableIterator<undefined>;

/**
 * Creates an iterator from zero to the passed number and returns it
 * @param obj
 */
export function intoIter<T extends number>(obj: T): IterableIterator<T>;

/**
 * Creates an iterator over values from the specified dictionary and returns it
 * @param obj
 */
export function intoIter<T extends Dictionary>(obj: T): IterableIterator<DictionaryType<T>>;

/**
 * Creates a new iterator based on the specified iterable structure and returns it
 * @param obj
 */
export function intoIter<T extends Iterable<any>>(obj: T): IterableIterator<IterableType<T>>;

/**
 * Creates a new async iterator based on the specified async iterable structure and returns it
 * @param obj
 */
export function intoIter<T extends AsyncIterable<any>>(obj: T): AsyncIterableIterator<IterableType<T>>;

export function intoIter(obj: unknown): IterableIterator<unknown> | AsyncIterableIterator<unknown> {
	if (obj == null) {
		return [].values();
	}

	if (obj === true) {
		return new Range(0, Infinity).values();
	}

	if (obj === false) {
		return new Range(0, -Infinity).values();
	}

	if (Object.isNumber(obj)) {
		return new Range(0, [obj]).values();
	}

	if (Object.isString(obj)) {
		return obj.letters();
	}

	if (typeof obj === 'object') {
		const
			isSyncIter = Object.isIterable(obj);

		if (isSyncIter || Object.isAsyncIterable(obj)) {
			const
				key = isSyncIter ? Symbol.iterator : Symbol.asyncIterator,
				iter = obj[key]();

			if ('return' in obj || 'throw' in obj) {
				return Object.cast({
					[key]() {
						return this;
					},

					next: iter.next.bind(iter)
				});
			}

			return iter;
		}

		return Object.values(obj!).values();
	}

	return [obj].values();
}
