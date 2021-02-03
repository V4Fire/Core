/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export function createFlagsModifier(method: string): Function {
	return function flagsModifier(rgxp: RegExp | RegExpFlag, ...flags: RegExpFlag[]): Function | RegExp {
		if (Object.isString(rgxp)) {
			const flag = rgxp;
			return (rgxp) => rgxp[method](flag);
		}

		if (arguments.length === 1) {
			return (...flags) => rgxp[method](...flags);
		}

		return rgxp[method](...flags);
	};
}
