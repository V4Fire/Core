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
		if (this in camelizeCache) {
			return camelizeCache[this];
		}

		if (needCamelize.test(this)) {
			return camelizeCache[this] = camelize.call(this, upper);
		}

		return this;
	};

	const
		needDasherize = /[A-Z-_]|[^\w$]/;

	/** @override */
	String.prototype.dasherize = function (this: string): string {
		if (this in dasherizeCache) {
			return dasherizeCache[this];
		}

		if (needDasherize.test(this)) {
			return dasherizeCache[this] = dasherize.call(this);
		}

		return this;
	};

	const
		needUnderscore = /[A-Z-]|[^\w$]/;

	/** @override */
	String.prototype.underscore = function (this: string): string {
		if (this in underscoreCache) {
			return underscoreCache[this];
		}

		if (needUnderscore.test(this)) {
			return underscoreCache[this] = underscore.call(this);
		}

		return this;
	};

} catch (_) {}
