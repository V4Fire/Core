/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import $C = require('collection.js');
import extend from 'core/prelude/extend';
import { convertIfDate } from 'core/json';

/** @see $C.extend */
extend(Object, 'mixin', $C.extend);

/**
 * Clones the specified object using JSON.parse -> JSON.stringify
 *
 * @param obj
 * @param [params] - additional parameters:
 *   *) [replacer] - JSON.stringify replacer
 *   *) [reviver] - JSON.parse reviver (false for disable defaults)
 *   *) [freezable] - if false the object freeze state wont be copy
 */
extend(Object, 'fastClone', (obj, params?: FastCloneParams) => {
	const
		p = params || {};

	if (Object.isFunction(obj)) {
		return obj;
	}

	if (obj) {
		const
			noJSON = !Object.isFunction((<any>obj).toJSON);

		if (noJSON && obj instanceof Map) {
			const
				map = new Map();

			for (let o = obj.entries(), el = o.next(); !el.done; el = o.next()) {
				const val = el.value;
				map.set(val[0], Object.fastClone(val[1]));
			}

			return map;
		}

		if (noJSON && obj instanceof Set) {
			const
				set = new Set();

			for (let o = obj.values(), el = o.next(); !el.done; el = o.next()) {
				set.add(el.value);
			}

			return set;
		}

		if (typeof obj === 'object') {
			const clone = JSON.parse(
				JSON.stringify(obj, p.replacer), p.reviver !== false ? p.reviver || convertIfDate : undefined
			);

			if (p.freezable !== false) {
				if (!Object.isExtensible(obj)) {
					Object.preventExtensions(clone);
				}

				if (Object.isSealed(obj)) {
					Object.seal(clone);
				}

				if (Object.isFrozen(obj)) {
					Object.freeze(clone);
				}
			}

			return clone;
		}
	}

	return obj;
});
