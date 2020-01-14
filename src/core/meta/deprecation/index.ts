/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/meta/deprecation/README.md]]
 * @packageDocumentation
 */

import { DeprecatedOptions, InlineDeprecatedOptions } from 'core/meta/deprecation/interface';
export * from 'core/meta/deprecation/interface';

const
	consoleCache = Object.create(null);

/**
 * Marks the specified function as obsolescence
 *
 * @param params - additional parameters
 * @param [fn] - function for wrapping
 */
export function deprecate<T extends Function>(
	params: DeprecatedOptions,
	fn: T
): T;

/**
 * Emits an obsolescence warning with the specified parameters
 * @param params - additional parameters
 */
export function deprecate(params: InlineDeprecatedOptions): void;

/**
 * Marks the specified function as obsolescence
 * @param fn - function for wrapping
 */
export function deprecate<T extends Function>(fn: T): T;

export function deprecate<T extends Function>(
	fnOrParams?: DeprecatedOptions | InlineDeprecatedOptions | T,
	fn?: T
): T | void {
	let
		p = <DeprecatedOptions>{};

	if (Object.isFunction(fnOrParams)) {
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
 * Decorator for the "deprecate" function.
 * Can be used with providing additional parameters or within their.
 *
 * @decorator
 * @see [[deprecate]]
 */
export function deprecated(target: object, key: string | symbol, descriptor: PropertyDescriptor): void;
export function deprecated(params?: DeprecatedOptions): Function;
export function deprecated(
	params?: DeprecatedOptions | object,
	key?: string | symbol,
	descriptor?: PropertyDescriptor
): Function | void {
	const f = (name, descriptor, params?) => {
		const
			method = descriptor.value;

		if (!Object.isFunction(method)) {
			throw new TypeError(`descriptor.value is not a function: ${method}`);
		}

		descriptor.value = deprecate({type: 'method', ...params, name}, method);
	};

	if (arguments.length > 1) {
		return f(key, descriptor);
	}

	return (target, key, descriptor) => f(key, descriptor, params);
}
