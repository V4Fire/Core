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
		target = Object.get(target, String(from));
		res = target;
	}

	const
		NULL = {};

	if (where) {
		for (let conditions = Array.concat([], where), i = 0; i < conditions.length; i++) {
			const
				where = conditions[i];

			if (Object.isPlainObject(target)) {
				const
					match = getMatch(target, where);

				if (match !== NULL) {
					res = match;
					break;
				}
			}

			const some = (el) => {
				if (getMatch(el, where) !== NULL) {
					res = el;
					return true;
				}

				return false;
			};

			if (Object.isArray(target) && target.some(some)) {
				break;
			}
		}
	}

	function getMatch(obj: Dictionary | unknown[], where: Nullable<Dictionary>): unknown {
		if (where == null || obj === where) {
			return obj;
		}

		let
			res;

		Object.forEach(where, (v, k) => {
			if (Object.isPlainObject(obj) && !(k in obj)) {
				return;
			}

			if (v !== obj[k]) {
				return;
			}

			res = obj;
		});

		return res;
	}

	return res;
}
