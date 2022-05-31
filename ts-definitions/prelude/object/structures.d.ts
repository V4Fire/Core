/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

interface ObjectConstructor {
	/**
	 * Wraps the specified value into the Either structure.
	 * If the value is equal to null or undefined, the value is rejected.
	 *
	 * @example
	 * ```typescript
	 * function toLowerCase(str: string): string {
	 *   return str.toLowerCase();
	 * }
	 *
	 * Object.Option(toLowerCase)(null).catch((err) => err === null);
	 * Object.Option(null).catch((err) => err === null);
	 *
	 * Object.Option(toLowerCase)('FOO').then((value) => value === 'foo');
	 * Object.Option('foo').then((value) => value === 'foo');
	 * ```
	 */
	Option<R>(value: () => R): AnyFunction<any[], Maybe<R>>;

	/**
	 * Wraps the specified value into the Either structure.
	 * If the value is equal to null or undefined, the value is rejected.
	 *
	 * @example
	 * ```typescript
	 * function toLowerCase(str: string): string {
	 *   return str.toLowerCase();
	 * }
	 *
	 * Object.Option(toLowerCase)(null).catch((err) => err === null);
	 * Object.Option(null).catch((err) => err === null);
	 *
	 * Object.Option(toLowerCase)('FOO').then((value) => value === 'foo');
	 * Object.Option('foo').then((value) => value === 'foo');
	 * ```
	 */
	Option<A1, A extends any[], R>(value: (a1: A1, ...rest: A) => R):
		(a1: Maybe<Nullable<A1>> | Either<A1> | Nullable<A1>, ...rest: A) => Maybe<R>;

	/**
	 * Wraps the specified value into the Either structure.
	 * If the value is equal to null or undefined, the value is rejected.
	 *
	 * @example
	 * ```typescript
	 * function toLowerCase(str: string): string {
	 *   return str.toLowerCase();
	 * }
	 *
	 * Object.Option(toLowerCase)(null).catch((err) => err === null);
	 * Object.Option(null).catch((err) => err === null);
	 *
	 * Object.Option(toLowerCase)('FOO').then((value) => value === 'foo');
	 * Object.Option('foo').then((value) => value === 'foo');
	 * ```
	 */
	Option<T = unknown>(value: T): Maybe<T>;

	/**
	 * Wraps the specified value into the Either structure
	 *
	 * @example
	 * ```typescript
	 * function toLowerCase(str: string): string {
	 *   return str.toLowerCase();
	 * }
	 *
	 * Object.Result(toLowerCase)(null).catch((err) => err.message === 'str is null');
	 * Object.Result(Object.result(toLowerCase)(null)).catch((err) => err.message === 'str is null');
	 *
	 * Object.Result(toLowerCase)('FOO').then((value) => value === 'foo');
	 * Object.Result('foo').then((value) => value === 'foo');
	 * ```
	 */
	Result<R>(value: () => R): AnyFunction<any[], Either<R>>;

	/**
	 * Wraps the specified value into the Either structure
	 *
	 * @example
	 * ```typescript
	 * function toLowerCase(str: string): string {
	 *   return str.toLowerCase();
	 * }
	 *
	 * Object.Result(toLowerCase)(null).catch((err) => err.message === 'str is null');
	 * Object.Result(Object.result(toLowerCase)(null)).catch((err) => err.message === 'str is null');
	 *
	 * Object.Result(toLowerCase)('FOO').then((value) => value === 'foo');
	 * Object.Result('foo').then((value) => value === 'foo');
	 * ```
	 */
	Result<A1, A extends any[], R>(value: (a1: A1, ...a: A) => R):
		(a1: Maybe<A1> | Either<A1>, ...rest: A) => Either<R>;

	/**
	 * Wraps the specified value into the Either structure
	 *
	 * @example
	 * ```typescript
	 * function toLowerCase(str: string): string {
	 *   return str.toLowerCase();
	 * }
	 *
	 * Object.Result(toLowerCase)(null).catch((err) => err.message === 'str is null');
	 * Object.Result(Object.result(toLowerCase)(null)).catch((err) => err.message === 'str is null');
	 *
	 * Object.Result(toLowerCase)('FOO').then((value) => value === 'foo');
	 * Object.Result('foo').then((value) => value === 'foo');
	 * ```
	 */
	Result<T = unknown>(value: T): Either<T>;
}
