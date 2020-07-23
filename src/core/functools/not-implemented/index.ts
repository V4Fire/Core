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

import { NotImplementedOptions, InlineNotImplementedOptions } from 'core/functools/not-implemented/interface';

export * from 'core/functools/deprecation/interface';

const
	consoleCache = Object.create(null);

/**
 * Marks the specified function as not implemented
 *
 * @param opts - additional options
 * @param [fn] - function for wrapping
 */
export function notImplement<T extends Function>(
	opts: NotImplementedOptions,
	fn: T
): T;

/**
 * Emits a "not implemented" warning with the specified parameters
 * @param opts - additional options
 */
export function notImplement(opts: InlineNotImplementedOptions): void;

/**
 * Marks the specified function as not implemented
 * @param fn - function for wrapping
 */
export function notImplement<T extends Function>(fn: T): T;

export function notImplement<T extends Function>(
	fnOrParams: NotImplementedOptions | InlineNotImplementedOptions | T,
	fn?: T
): T | undefined {
	let
		p: NotImplementedOptions;

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

	function wrapper(this: unknown, ...args: unknown[]): unknown {
		//#unless isProd

		const
			name = p.name ?? fn?.name,
			type = p.type ?? 'function';

		const
			msg = [`The ${type} "${name}" is not implemented.`];

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

		if (consoleCache[str] == null) {
			console.warn(str);
			consoleCache[str] = true;
		}

		//#endunless

		return fn?.apply(this, args);
	}

	return <any>wrapper;
}

/**
 * Decorator for the "notImplement" function
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
 * Decorator for the "notImplement" function.
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
export function notImplemented(opts?: NotImplementedOptions): Function;

export function notImplemented(
	opts?: NotImplementedOptions | object,
	key?: string | symbol,
	descriptor?: PropertyDescriptor
): Function | undefined {
	const f = (name, descriptor, opts?) => {
		const
			{get, set, value: method} = descriptor;

		if (get != null) {
			descriptor.get = notImplement({type: 'accessor', ...opts, name}, get);
		}

		if (set != null) {
			descriptor.set = notImplement({type: 'accessor', ...opts, name}, set);
		}

		if (get != null || set != null) {
			return;
		}

		if (!Object.isFunction(method)) {
			throw new TypeError(`descriptor.value is not a function: ${method}`);
		}

		descriptor.value = notImplement({type: 'method', ...opts, name}, method);
	};

	if (arguments.length > 1) {
		f(key, descriptor);
		return;
	}

	return (target, key, descriptor) => f(key, descriptor, opts);
}
