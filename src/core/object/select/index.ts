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

import type { SelectParams } from 'core/object/select/interface';

export * from 'core/object/select/interface';

/**
 * Finds an element from an object by the specified parameters
 *
 * @param obj - object to search
 * @param [params] - search parameters
 */
export default function select<T = unknown>(obj: unknown, params: SelectParams = {}): CanUndef<T> {
	const {where, from} = params;

	let
		target = obj,
		res;

	if (from != null) {
		target = Object.get(target, Object.isArray(from) ? from : String(from));

		if (where == null) {
			return Object.cast(target);
		}
	}

	const cantSearch =
		Object.isPrimitive(target) ||
		where == null ||
		Object.isArray(where) && where.length === 0;

	if (cantSearch) {
		return;
	}

	const
		NULL = {};

	where: for (let conditions = Array.toArray(where), i = 0; i < conditions.length; i++) {
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

		if (Object.isIterable(target)) {
			const
				iterator = target[Symbol.iterator]();

			for (let el = iterator.next(); !el.done; el = iterator.next()) {
				if (getMatch(el.value, where) !== NULL) {
					res = el.value;
					break where;
				}
			}
		}
	}

	return res;

	function getMatch(obj: unknown, where: Nullable<Dictionary>): unknown {
		if (where == null || obj === where) {
			return obj;
		}

		if (Object.isPrimitive(obj)) {
			return NULL;
		}

		const
			resolvedObj = <object>obj;

		let
			res = NULL;

		for (let keys = Object.keys(where), i = 0; i < keys.length; i++) {
			const
				key = keys[i],
				val = where[key];

			if (!(key in resolvedObj)) {
				continue;
			}

			if (!Object.fastCompare(val, resolvedObj[key])) {
				res = NULL;
				break;
			}

			res = resolvedObj;
		}

		return res;
	}
}
