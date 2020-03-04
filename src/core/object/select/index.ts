/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/object/select/README.md]]
 * @packageDocumentation
 */

import { SelectParams } from 'core/object/select/interface';
export * from 'core/object/select/interface';

/**
 * Finds an element from an object by the specified parameters
 *
 * @param obj - object to search
 * @param params - search parameters
 */
export default function select<T = unknown>(obj: unknown, params: SelectParams): CanUndef<T> {
	const
		{where, from} = params;

	let
		target = obj,
		res;

	if ((Object.isPlainObject(target) || Object.isArray(target)) && from != null) {
		res = target = Object.get(target, String(from));
	}

	const getMatch = (obj, where) => {
		if (!obj) {
			return false;
		}

		if (!where || obj === where) {
			return obj;
		}

		if (!Object.isPlainObject(where) && !Object.isArray(where)) {
			return false;
		}

		let
			res;

		Object.forEach<string, string>(where, (v, k) => {
			if (Object.isPlainObject(obj) && !(k in obj)) {
				return;
			}

			if (v !== obj[k]) {
				return;
			}

			res = obj;
		});

		return res;
	};

	if (where) {
		for (let obj = (<SelectParams['where'][]>[]).concat(where || []), i = 0; i < obj.length; i++) {
			const
				where = obj[i];

			if (Object.isPlainObject(target)) {
				const
					match = getMatch(target, where);

				if (match) {
					res = match;
					break;
				}
			}

			if (Object.isArray(target) && target.some((el) => (getMatch(el, where) ? (res = el, true) : false))) {
				break;
			}
		}
	}

	return res;
}
