/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export const asyncCounter = Symbol('Async counter id');

export const isZombieGroup = {
	test(group: string): boolean {
		return group.includes(':zombie');
	}
};

export const isPromisifyNamespace = {
	test(namespace: string): boolean {
		return namespace.endsWith('Promise');
	}
};
