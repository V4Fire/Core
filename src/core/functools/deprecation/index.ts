/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/functools/deprecation/README.md]]
 * @packageDocumentation
 */

import { warn, warned, WarnOptions, InlineWarnOptions, WarnedFn } from 'core/functools/warning';

export * from 'core/functools/warning/interface';

/**
 * Marks the specified function as obsolescence
 *
 * @param opts - additional options
 * @param fn - function to wrap
 */
export function deprecate<T extends Function>(
	opts: WarnOptions,
	fn: T
): T extends ((...args: infer A) => infer R) ? WarnedFn<A, R> : T;

/**
 * Emits an obsolescence warning with the specified parameters
 * @param opts - additional options
 */
export function deprecate(opts: InlineWarnOptions): void;

/**
 * Marks the specified function as obsolescence
 * @param fn - function to wrap
 */
export function deprecate<T extends Function>(fn: T): T extends ((...args: infer A) => infer R) ?
	WarnedFn<A, R> :
	T;

export function deprecate<T extends Function>(
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

	return <any>warn({context: 'deprecated', ...p}, <T>fn);
}

/**
 * Decorator for `deprecate`
 *
 * @decorator
 * @see [[deprecate]]
 */
export function deprecated(target: object, key: string | symbol, descriptor: PropertyDescriptor): void;

/**
 * Decorator for `deprecate`.
 * This overload adds a feature to provide additional options.
 *
 * @see [[deprecate]]
 * @param [opts] - additional options
 */
export function deprecated(opts?: WarnOptions): Function;

export function deprecated(
	opts?: WarnOptions | object,
	key?: string | symbol,
	descriptor?: PropertyDescriptor
): Function | undefined {
	if (arguments.length > 1) {
		warned({context: 'deprecated'})(opts, key, descriptor);
		return;
	}

	return (target, key, descriptor) => warned({context: 'deprecated', ...opts})(target, key, descriptor);
}
