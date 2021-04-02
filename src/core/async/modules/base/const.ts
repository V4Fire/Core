/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export const
	asyncCounter = Symbol('Async counter id');

export const
	isZombieGroup = /:zombie\b/;

export const
	isPromisifyNamespace = /Promise$/,

	/** @deprecated */
	isPromisifyLinkName = isPromisifyNamespace;
