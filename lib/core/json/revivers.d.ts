/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
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
export declare function convertIfDate(key: string, value: unknown): unknown;
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
export declare function evalWith(ctx: object): JSONCb;
