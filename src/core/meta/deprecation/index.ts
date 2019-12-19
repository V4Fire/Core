/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { DeprecatedParams, InlineDeprecatedParams } from 'core/meta/deprecation/interface';
export * from 'core/meta/deprecation/interface';

/**
 * Marks the specified function as obsolescence
 *
 * @param params - additional parameters:
 *   *) [name] - name of the current function
 *   *) [type] - type of the expression for wrapping
 *
 *   *) [renamedTo] - indicates that the function was renamed, but the interface still actual,
 *       the value contains a name after renaming
 *
 *   *) [movedTo] - indicates that the function was moved to a different file, but the interface still actual,
 *      the value contains a source path after moving
 *
 *   *) [alternative] - name of the function which should prefer to use instead the current
 *      or an object with the alternative options:
 *
 *      *) name
 *      *) [source] - source of the alternative
 *
 * @param [fn] - function for wrapping
 *
 * @example
 * const normalizeEmail = deprecate(function normalizeEmail(phone: string): string {
 *   ...
 * });
 *
 * // Mark the function as deprecated with providing an alternative
 * const normalizeTel = deprecate(
 *  {
 *    alternative: 'normalizePattern'
 *  },
 *
 *  function normalizeTel(phone: string): string {
 *    ...
 *  }
 * );
 */
export function deprecate<T extends Function>(
	params: DeprecatedParams,
	fn: T
): T;

/**
 * @param params - additional parameters
 */
export function deprecate(params: InlineDeprecatedParams): void;

/**
 * @param fn - function for wrapping
 */
export function deprecate<T extends Function>(fn: T): T;

export function deprecate<T extends Function>(
	fnOrParams?: DeprecatedParams | InlineDeprecatedParams | T,
	fn?: T
): T | void {
	let
		p = <DeprecatedParams>{};

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

		console.warn(msg.join(' '));
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
 * @see deprecate
 *
 * @example
 * class Foo {
 *   @deprecated
 *   bla(): void {
 *
 *   }
 *
 *   @deprecated({alternative: 'foo'})
 *   baz(): void {
 *
 *   }
 * }
 */
export function deprecated(target: object, key: string | symbol, descriptor: PropertyDescriptor): void;
export function deprecated(params?: DeprecatedParams): Function;
export function deprecated(
	params?: DeprecatedParams | object,
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
