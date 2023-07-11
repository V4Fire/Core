/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Haskell-like Maybe structure
 */
interface Maybe<T = unknown> extends Promise<T> {
	readonly type: 'Maybe';
}

/**
 * Haskell-like Either structure
 */
interface Either<T = unknown> extends Promise<T> {
	readonly type: 'Either';
}

/**
 * Expanded promise type with support of functional monads
 */
type NewPromise<K, V> = K extends Maybe ?
	Maybe<V> : K extends Either ?
		Either<V> : Promise<V>;

/**
 * Extracts a value type of the passed promise
 *
 * @example
 * ```typescript
 * const p = Promise.resolve(1);
 * const val: PromiseType<typeof p> = 100;
 * ```
 */
type PromiseType<T> =
	T extends Maybe<infer V> ?
		NonNullable<V> : T extends Promise<infer V> ? V : T;
