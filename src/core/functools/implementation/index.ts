/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/functools/implementation/README.md]]
 * @packageDocumentation
 */

import { warn, warned, WarnOptions, InlineWarnOptions, WarnedFn } from 'core/functools/warning';

export * from 'core/functools/warning/interface';

/**
 * Marks the specified function as unimplemented
 *
 * @param opts - additional options
 * @param fn - function to wrap
 */
export function unimplement<T extends Function>(
	opts: WarnOptions,
	fn: T
): T extends ((...args: infer A) => any) ? WarnedFn<A, AnyToIgnore> : T;

/**
 * Emits an "unimplemented" warning with the specified parameters
 * @param opts - additional options
 */
export function unimplement(opts: InlineWarnOptions): void;

/**
 * Marks the specified function as unimplemented
 * @param fn - function to wrap
 */
export function unimplement<T extends Function>(fn: T): T extends ((...args: infer A) => any) ?
	WarnedFn<A, AnyToIgnore> :
	T;

export function unimplement<T extends Function>(
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

	return Object.cast(warn({context: 'unimplemented', ...p}, <T>fn));
}

/**
 * Decorator for `unimplement`
 *
 * @decorator
 * @see [[unimplement]]
 *
 * @example
 * ```js
 * class Foo {
 *   @unimplemented()
 *   bar() {
 *
 *   }
 * }
 * ```
 */
export function unimplemented(target: object, key: string | symbol, descriptor: PropertyDescriptor): void;

/**
 * Decorator for `unimplement`.
 * This overload adds a feature to provide additional options.
 *
 * @see [[unimplement]]
 * @param [opts] - additional options
 *
 * @example
 * ```js
 * class Foo {
 *   @unimplemented({alternative: 'baz'}})
 *   bar() {
 *
 *   }
 * }
 * ```
 */
export function unimplemented(opts?: WarnOptions): Function;

export function unimplemented(
	opts?: WarnOptions | object,
	key?: string | symbol,
	descriptor?: PropertyDescriptor
): Function | undefined {
	if (arguments.length > 1) {
		warned({context: 'unimplemented'})(opts, key, descriptor);
		return;
	}

	return (target, key, descriptor) => warned({context: 'unimplemented', ...opts})(target, key, descriptor);
}
