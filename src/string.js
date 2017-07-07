/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

'use strict';

import { GLOBAL, IS_NODE } from './const/links';

try {
	const
		{camelize, dasherize, underscore} = String.prototype;

	const
		cache = !IS_NODE && GLOBAL.FN_CACHE && GLOBAL.FN_CACHE.string || {};

	const saveCache = () => {
		try {
			localStorage.setItem('STRING_CACHE', JSON.stringify(cache));
		} catch (_) {}
	};

	const
		camelizeCache = cache.camelize = cache.camelize || {},
		dasherizeCache = cache.dasherize = cache.dasherize || {},
		underscoreCache = cache.underscore = cache.underscore || {};

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
