/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

try {
	const
		{camelize, dasherize, underscore} = String.prototype;

	const
		camelizeCache = Object.createDict(),
		dasherizeCache = Object.createDict(),
		underscoreCache = Object.createDict();

	const
		needCamelize = /[_-]|[^\w$]/;

	/** @override */
	String.prototype.camelize = function (this: string, upper?: boolean): string {
		const
			str = this.toString();

		if (str in camelizeCache) {
			return camelizeCache[str];
		}

		if (needCamelize.test(str)) {
			return camelizeCache[str] = camelize.call(str, upper);
		}

		return str;
	};

	const
		needDasherize = /[A-Z-_]|[^\w$]/;

	/** @override */
	String.prototype.dasherize = function (this: string): string {
		const
			str = this.toString();

		if (str in dasherizeCache) {
			return dasherizeCache[str];
		}

		if (needDasherize.test(str)) {
			return dasherizeCache[str] = dasherize.call(str);
		}

		return str;
	};

	const
		needUnderscore = /[A-Z-]|[^\w$]/;

	/** @override */
	String.prototype.underscore = function (this: string): string {
		const
			str = this.toString();

		if (str in underscoreCache) {
			return underscoreCache[str];
		}

		if (needUnderscore.test(str)) {
			return underscoreCache[str] = underscore.call(str);
		}

		return str;
	};

} catch (_) {}
