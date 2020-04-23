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

import { DeprecatedOptions, InlineDeprecatedOptions } from 'core/functools/deprecation/interface';
export * from 'core/functools/deprecation/interface';

const
	consoleCache = Object.create(null);

/**
 * Marks the specified function as obsolescence
 *
 * @param opts - additional options
 * @param [fn] - function for wrapping
 */
export function deprecate<T extends Function>(
	opts: DeprecatedOptions,
	fn: T
): T;

/**
 * Emits an obsolescence warning with the specified parameters
 * @param opts - additional options
 */
export function deprecate(opts: InlineDeprecatedOptions): void;

/**
 * Marks the specified function as obsolescence
 * @param fn - function for wrapping
 */
export function deprecate<T extends Function>(fn: T): T;

export function deprecate<T extends Function>(
	fnOrParams: DeprecatedOptions | InlineDeprecatedOptions | T,
	fn?: T
): T | void {
	let
		p = <DeprecatedOptions>{};

	if (Object.isSimpleFunction(fnOrParams)) {
		fn = fnOrParams;

	} else {
		p = fnOrParams || p;
	}

	if (!fn) {
		wrapper();
		return;
	}

	function wrapper(): unknown {
		//#unless isProd

		const
			name = p.name || fn?.name,
			type = p.type || 'function',
			msg = <string[]>[];

		if (p.movedTo || p.renamedTo) {
			if (!p.movedTo) {
				msg.push(
					`The ${type} "${name}" was renamed to "${p.renamedTo}".`,
					'Please use the renamed version instead of the current, because it will be removed from the next major release.'
				);

			} else if (!p.renamedTo) {
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

		} else {
			msg.push(`The ${type} "${name}" was deprecated and will be removed from the next major release.`);

			if (p.alternative) {
				if (Object.isString(p.alternative)) {
					msg.push(`Please use "${p.alternative}" instead.`);

				} else if (p.alternative.source) {
					msg.push(`Please use "${p.alternative.name}" from "${p.alternative.source}" instead.`);

				} else {
					msg.push(`Please use "${p.alternative.name}" instead.`);
				}
			}
		}

		if (p.notice) {
			msg.join(p.notice);
		}

		const
			str = msg.join(' ');

		if (!consoleCache[str]) {
			console.warn(str);
			consoleCache[str] = true;
		}

		//#endunless

		return fn?.apply(this, arguments);
	}

	return <any>wrapper;
}

/**
 * Decorator for the "deprecate" function
 *
 * @decorator
 * @see [[deprecate]]
 *
 * @example
 * ```js
 * class Foo {
 *   @deprecated
 *   bar() {
 *
 *   }
 * }
 * ```
 */
export function deprecated(target: object, key: string | symbol, descriptor: PropertyDescriptor): void;

/**
 * Decorator for the "deprecate" function.
 * This overload add a feature to provide additional options.
 *
 * @see [[deprecate]]
 * @param [opts] - additional options
 *
 * @example
 * ```js
 * class Foo {
 *   @deprecated({renamedTo: 'baz'}})
 *   bar() {
 *
 *   }
 * }
 * ```
 */
export function deprecated(opts?: DeprecatedOptions): Function;

export function deprecated(
	opts?: DeprecatedOptions | object,
	key?: string | symbol,
	descriptor?: PropertyDescriptor
): Function | void {
	const f = (name, descriptor, opts?) => {
		const
			{get, set, value: method} = descriptor;

		if (get) {
			descriptor.get = deprecate({type: 'accessor', ...opts, name}, get);
		}

		if (set) {
			descriptor.set = deprecate({type: 'accessor', ...opts, name}, set);
		}

		if (get || set) {
			return;
		}

		if (!Object.isFunction(method)) {
			throw new TypeError(`descriptor.value is not a function: ${method}`);
		}

		descriptor.value = deprecate({type: 'method', ...opts, name}, method);
	};

	if (arguments.length > 1) {
		return f(key, descriptor);
	}

	return (target, key, descriptor) => f(key, descriptor, opts);
}
