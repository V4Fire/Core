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
export function sequence<T extends Iterable<any>>(
	...iterables: T[]
): T extends Iterable<infer R> ? IterableIterator<R> : IterableIterator<unknown>;

/**
 * Takes async iterable objects and returns a new async iterator that produces values from them sequentially
 * @param iterables
 */
export function sequence<T extends AsyncIterable<any>>(
	...iterables: T[]
): T extends AsyncIterable<infer R> ? AsyncIterableIterator<R> : AsyncIterableIterator<unknown>;

export function sequence(
	...iterables: Array<Iterable<unknown> | AsyncIterable<unknown>>
): IterableIterator<unknown> | AsyncIterableIterator<unknown> {
	let
		cursor = 0,
		iter: Iterator<unknown>;

	const
		isAsync = Object.isAsyncIterable(iterables[cursor]);

	if (isAsync) {
		return {
			[Symbol.asyncIterator]() {
				return this;
			},

			async next(): Promise<IteratorResult<any>> {
				if (cursor >= iterables.length) {
					return Promise.resolve({value: undefined, done: true});
				}

				if (!Object.isTruly(iter)) {
					iter = iterables[cursor][Symbol.asyncIterator]();
				}

				let
					res: IteratorResult<unknown>;

				while ((res = await iter.next(), res.done) && ++cursor < iterables.length) {
					// eslint-disable-next-line require-atomic-updates
					iter = iterables[cursor][Symbol.asyncIterator]();
				}

				return res;
			}
		};
	}

	return {
		[Symbol.iterator]() {
			return this;
		},

		next(): IteratorResult<any> {
			if (cursor >= iterables.length) {
				return {value: undefined, done: true};
			}

			if (!Object.isTruly(iter)) {
				iter = iterables[cursor][Symbol.iterator]();
			}

			let
				res: IteratorResult<unknown>;

			while ((res = iter.next(), res.done) && ++cursor < iterables.length) {
				iter = iterables[cursor][Symbol.iterator]();
			}

			return res;
		}
	};
}
