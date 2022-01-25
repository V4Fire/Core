/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export const
	canParse = /^[[{"]|^(?:true|false|null|(?:0\.)?\d+(?:[eE]\d+)?)$/;

export const
	isInvalidKey = /^__proto__$/;

export const
	funcCache = new WeakMap();
