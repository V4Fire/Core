'use strict';

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

try {
	const fnNameRgxp = /^function\s+([^\s(]+)/;
	Object.defineProperty(Function.prototype, 'name', {
		get(): string {
			try {
				return fnNameRgxp.exec(this.toString())[1];

			} catch (_) {
				return undefined;
			}
		}
	});
} catch (_) {}
