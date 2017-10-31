/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

try {
	const
		fnNameRgxp = /^function\s+([^\s(]+)/;

	/**
	 * Function.name shim
	 */
	Object.defineProperty(Function.prototype, 'name', {
		get(): string | undefined {
			try {
				const v = fnNameRgxp.exec(this.toString());
				return v && v[1] || undefined;

			} catch (_) {
				return undefined;
			}
		}
	});

} catch (_) {}
