/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/json/README.md]]
 * @packageDocumentation
 */

import { isDateStr } from 'core/prelude/date/const';

const
	minDateLength = '2017-02-03'.length;

/**
 * Reviver for the `JSON.parse` method: converts all strings that are looks like a date to Date
 *
 * @param key
 * @param value
 *
 * @example
 * ```js
 * JSON.parse('"2015-10-12"', convertIfDate) instanceof Date // true
 * ```
 */
export function convertIfDate(key: string, value: unknown): unknown {
	if (Object.isString(value) && value.length >= minDateLength && RegExp.test(isDateStr, value)) {
		const date = Date.create(value);
		return isNaN(date.valueOf()) ? value : date;
	}

	return value;
}

/**
 * Returns a reviver for `JSON.parse`, which interprets JSON as a JS expression in a given context.
 * The expression can be in two forms:
 *
 * 1. `call` invokes a function at a specified path with given arguments.
 *
 *   ```js
 *   // ['b-button', 'b-button_focused_true']
 *   console.log(
 *     JSON.parse('["call", "provide.componentClasses", "b-button", {"focused": true}]', evalWith(myComponent))
 *   );
 *   ```
 *
 * 2. `get` retrieves the value from a defined path.
 *
 *   ```js
 *   // ['b-button']
 *   console.log(JSON.parse('["get", "meta.componentName"]', evalWith(myBButton)));
 *   ```
 *
 * Also, the reviver supports nested expression for the `call` arguments. For example:
 *
 * ```js
 * // ['b-button', 'b-button_focused_true']
 * console.log(
 *   JSON.parse('["call", "provide.componentClasses", "b-button", ["get", "mods"]]', evalWith(myComponent))
 * );
 * ```
 * @param ctx - the context for interpreting JSON
 */
export function evalWith(ctx: object): JSONCb {
	return (key: string, value: unknown) => {
		if (key === '' && Object.isArray(value)) {
			const
				[expr, path, ...args] = value;

			if (!Object.isString(expr) || !Object.isString(path)) {
				return value;
			}

			const
				pathChunks = path.split('.'),
				ref = Object.get(ctx, pathChunks);

			switch (expr) {
				case 'get': return ref;

				case 'call': {
					if (!Object.isFunction(ref)) {
						throw new TypeError(`The value at the specified ${path} path is not a function`);
					}

					const
						refCtx = pathChunks.length === 1 ? ctx : Object.get(ctx, pathChunks.slice(0, -1));

					const revivedArgs = args.map((arg) => {
						if (!Object.isArray(arg) || arg[0] !== 'call' && arg[0] !== 'get') {
							return arg;
						}

						return Object.parse(JSON.stringify(arg), evalWith(ctx));
					});

					return ref.apply(refCtx, revivedArgs);
				}

				default: return value;
			}
		}

		return value;
	};
}
