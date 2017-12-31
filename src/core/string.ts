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

	/** @override */
	String.prototype.camelize = function (this: string, upper?: boolean): string {
		if (this in camelizeCache) {
			return camelizeCache[this];
		}

		return camelizeCache[this] = camelize.call(this, upper);
	};

	/** @override */
	String.prototype.dasherize = function (this: string): string {
		if (this in dasherizeCache) {
			return dasherizeCache[this];
		}

		return dasherizeCache[this] = dasherize.call(this);
	};

	/** @override */
	String.prototype.underscore = function (this: string): string {
		if (this in underscoreCache) {
			return underscoreCache[this];
		}

		return underscoreCache[this] = underscore.call(this);
	};

} catch (_) {}
