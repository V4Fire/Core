/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { GLOBAL, IS_NODE } from './const/links';

try {
	const
		{camelize, dasherize, underscore} = String.prototype;

	const
		cache = !IS_NODE && GLOBAL.FN_CACHE && GLOBAL.FN_CACHE.string || Object.create(null);

	const saveCache = () => {
		try {
			localStorage.setItem('STRING_CACHE', JSON.stringify(cache));
		} catch (_) {}
	};

	const
		camelizeCache = cache.camelize = cache.camelize || Object.create(null),
		dasherizeCache = cache.dasherize = cache.dasherize || Object.create(null),
		underscoreCache = cache.underscore = cache.underscore || Object.create(null);

	let timer;

	/** @override */
	String.prototype.camelize = function (upper?: boolean) {
		if (this in camelizeCache) {
			return camelizeCache[this];
		}

		const
			res = camelizeCache[this] = camelize.call(this, upper);

		if (!IS_NODE) {
			cancelIdleCallback(timer);
			timer = requestIdleCallback(saveCache);
		}

		return res;
	};

	/** @override */
	String.prototype.dasherize = function () {
		if (this in dasherizeCache) {
			return dasherizeCache[this];
		}

		const
			res = dasherizeCache[this] = dasherize.call(this);

		if (!IS_NODE) {
			cancelIdleCallback(timer);
			timer = requestIdleCallback(saveCache);
		}

		return res;
	};

	/** @override */
	String.prototype.underscore = function () {
		if (this in underscoreCache) {
			return underscoreCache[this];
		}

		const
			res = underscoreCache[this] = underscore.call(this);

		if (!IS_NODE) {
			cancelIdleCallback(timer);
			timer = requestIdleCallback(saveCache);
		}

		return res;
	};

} catch (_) {}
