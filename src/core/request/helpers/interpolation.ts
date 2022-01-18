/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { tplRgxp } from 'core/request/helpers/const';

/**
 * Applies a query object for the specified string
 * (used keys are removed from the query)
 *
 * @param str
 * @param [query]
 * @param [rgxp] - template regexp
 */
export function applyQueryForStr(str: string, query?: Dictionary, rgxp: RegExp = tplRgxp): string {
	if (!query) {
		return str;
	}

	return str.replace(rgxp, (str, param, adv = '') => {
		const
			val = query[param];

		if (val != null) {
			Object.defineProperty(query, param, {
				enumerable: false,
				configurable: true,
				writable: true,
				value: query[param]
			});

			return (str.startsWith('/') ? '/' : '') + String(val) + String(Object.isNumber(adv) ? '' : adv);
		}

		return '';
	});
}
