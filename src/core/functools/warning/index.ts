/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/functools/warning/README.md]]
 *
 * @packageDocumentation
 */

import { consoleCache } from 'core/functools/warning/const';
import type { WarnOptions, InlineWarnOptions, WarnedFn } from 'core/functools/warning/interface';

export * from 'core/functools/warning/interface';

/**
 * Marks a function with the specified warning
 *
 * @param opts - additional options
 * @param fn - function to wrap
 */
export function warn<T extends Function>(
	opts: WarnOptions,
	fn: T
): T extends ((...args: infer A) => infer R) ? WarnedFn<A, R> : T;

/**
 * Emits a  warning with the specified parameters
 *
 * @param opts - additional options
 */
export function warn(opts: InlineWarnOptions): void;

/**
 * Marks a function as non-recommended to use
 *
 * @param fn - function to wrap
 */
export function warn<T extends Function>(fn: T): T extends ((...args: infer A) => infer R) ?
	WarnedFn<A, R> :
	T;

export function warn<T extends Function>(
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

	if (!fn) {
		wrapper();
		return;
	}

	wrapper[p.context ?? 'warning'] = p;
	function wrapper(this: unknown, ...args: unknown[]): unknown {
		//#unless isProd

		const
			name = p.name ?? fn?.name,
			type = p.type ?? 'function',
			wasMovedOrRenamed = p.movedTo != null || p.renamedTo != null;

		const
			msg: string[] = [];

		switch (p.context) {
			case 'deprecated':
				if (!wasMovedOrRenamed) {
					msg.push(`The ${type} "${name}" was deprecated and will be removed from the next major release.`);
				}

				break;

			case 'unimplemented':
				if (!wasMovedOrRenamed) {
					msg.push(`The ${type} "${name}" is unimplemented.`);
				}

				break;

			default:
				if (!wasMovedOrRenamed && p.notice == null) {
					msg.push(`The ${type} "${name}" is not recommended to use.`);
				}
		}

		if (wasMovedOrRenamed) {
			if (p.movedTo == null) {
				msg.push(
					`The ${type} "${name}" was renamed to "${p.renamedTo}".`,
					'Please use the renamed version instead of the current, because it will be removed from the next major release.'
				);

			} else if (p.renamedTo == null) {
				msg.push(
					`The ${type} "${name}" was moved to a new location "${p.movedTo}".`,
					'Please use the moved version instead of the current, because it will be removed from the next major release.'
				);

			} else {
				msg.push(
					`The ${type} "${name}" was renamed to "${p.renamedTo}" and moved to a new location "${p.movedTo}".`,
					'Please use the new version instead of the current, because it will be removed from the next major release.'
				);
			}
		}

		if (p.alternative != null) {
			if (Object.isString(p.alternative)) {
				msg.push(`Please use "${p.alternative}" instead.`);

			} else if (p.alternative.source != null) {
				msg.push(`Please use "${p.alternative.name}" from "${p.alternative.source}" instead.`);

			} else {
				msg.push(`Please use "${p.alternative.name}" instead.`);
			}
		}

		if (p.notice != null) {
			msg.push(p.notice);
		}

		const
			str = msg.join(' ');

		if (p.context === 'unimplemented') {
			throw new Error(str);

		} else if (consoleCache[str] == null) {
			// eslint-disable-next-line no-console
			console.warn(str);
			consoleCache[str] = true;
		}

		//#endunless

		return fn?.apply(this, args);
	}

	return Object.cast(wrapper);
}

/**
 * Decorator for `warn`
 *
 * @decorator
 * @see [[warn]]
 *
 * @example
 * ```js
 * class Foo {
 *   @warned()
 *   bar() {
 *
 *   }
 * }
 * ```
 */
export function warned(target: object, key: string | symbol, descriptor: PropertyDescriptor): void;

/**
 * Decorator for `warn`.
 * This overload adds a feature to provide additional options.
 *
 * @see [[warn]]
 * @param [opts] - additional options
 *
 * @example
 * ```js
 * class Foo {
 *   @warned({alternative: 'baz'}})
 *   bar() {
 *
 *   }
 * }
 * ```
 */
export function warned(opts?: WarnOptions): Function;

export function warned(
	opts?: WarnOptions | object,
	key?: string | symbol,
	descriptor?: PropertyDescriptor
): Function | undefined {
	const f = (name, descriptor, opts?) => {
		const
			{get, set, value: method} = descriptor;

		if (get != null) {
			descriptor.get = warn({type: 'accessor', ...opts, name}, get);
		}

		if (set != null) {
			descriptor.set = warn({type: 'accessor', ...opts, name}, set);
		}

		if (get != null || set != null) {
			return;
		}

		if (!Object.isFunction(method)) {
			throw new TypeError(`descriptor.value is not a function: ${method}`);
		}

		descriptor.value = warn({type: 'method', ...opts, name}, method);
	};

	if (arguments.length > 1) {
		f(key, descriptor);
		return;
	}

	return (target, key, descriptor) => f(key, descriptor, opts);
}
