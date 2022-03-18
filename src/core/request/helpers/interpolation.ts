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
			value = query[param],
			desc = Object.getOwnPropertyDescriptor(query, param);

		if (value != null && desc != null) {
			if (desc.configurable === true && desc.enumerable === true) {
				Object.defineProperty(query, param, {
					value,
					enumerable: false,
					configurable: true,
					writable: desc.writable ?? true
				});
			}

			return (str.startsWith('/') ? '/' : '') + String(value) + String(Object.isNumber(adv) ? '' : adv);
		}

		return '';
	});
}
