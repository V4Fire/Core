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
	 * Polyfill for support the name property of a function
	 */
	Object.defineProperty(Function.prototype, 'name', {
		get(): CanUndef<string> {
			const v = fnNameRgxp.exec(this.toString());
			return v?.[1] ?? undefined;
		}
	});

} catch {}
