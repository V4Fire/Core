/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/functools/not-implemented/README.md]]
 * @packageDocumentation
 */

import { warn, warned, WarnOptions, InlineWarnOptions, WarnedFn } from '~/core/functools/warning';

export * from '~/core/functools/warning/interface';

/**
 * Marks the specified function as not implemented
 *
 * @param opts - additional options
 * @param fn - function to wrap
 */
export function notImplement<T extends Function>(
	opts: WarnOptions,
	fn: T
): T extends ((...args: infer A) => infer R) ? WarnedFn<A, R> : T;

/**
 * Emits a "not implemented" warning with the specified parameters
 * @param opts - additional options
 */
export function notImplement(opts: InlineWarnOptions): void;

/**
 * Marks the specified function as not implemented
 * @param fn - function to wrap
 */
export function notImplement<T extends Function>(fn: T): T extends ((...args: infer A) => infer R) ?
	WarnedFn<A, R> :
	T;

export function notImplement<T extends Function>(
	fnOrParams: WarnOptions | InlineWarnOptions | T,
	fn?: T
): T | undefined {
	let
		p: WarnOptions;

	if (Object.isSimpleFunction(fnOrParams)) {
		fn = fnOrParams;
		p = {};

	} else {
		p = fnOrParams;
	}

	return Object.cast(warn({context: 'notImplemented', ...p}, <T>fn));
}

/**
 * Decorator for `notImplement`
 *
 * @decorator
 * @see [[notImplement]]
 *
 * @example
 * ```js
 * class Foo {
 *   @notImplemented()
 *   bar() {
 *
 *   }
 * }
 * ```
 */
export function notImplemented(target: object, key: string | symbol, descriptor: PropertyDescriptor): void;

/**
 * Decorator for `notImplement`.
 * This overload adds a feature to provide additional options.
 *
 * @see [[notImplement]]
 * @param [opts] - additional options
 *
 * @example
 * ```js
 * class Foo {
 *   @notImplemented({alternative: 'baz'}})
 *   bar() {
 *
 *   }
 * }
 * ```
 */
export function notImplemented(opts?: WarnOptions): Function;

export function notImplemented(
	opts?: WarnOptions | object,
	key?: string | symbol,
	descriptor?: PropertyDescriptor
): Function | undefined {
	if (arguments.length > 1) {
		warned({context: 'notImplemented'})(opts, key, descriptor);
		return;
	}

	return (target, key, descriptor) => warned({context: 'notImplemented', ...opts})(target, key, descriptor);
}
