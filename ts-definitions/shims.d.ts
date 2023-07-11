/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

declare function setImmediate(fn: AnyFunction): number;
declare function clearImmediate(id: number): void;

declare function structuredClone<T>(obj: T): T;

interface Headers {
	keys(): IterableIterator<string>;
	values(): IterableIterator<string>;
	entries(): IterableIterator<[string, string]>;
	[Symbol.iterator]: IterableIterator<[string, string]>;
}
