/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

const
	hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Iterates over the specified object
 *
 * @param obj - object to iterate
 * @param cb - callback function that is called on each of object elements
 * @param [opts] - additional options:
 *   *) [withDescriptor] - if true, then the first element of the callback function will be an element descriptor
 *   *) [notOwn = false] - iteration type:
 *
 *     1) if false, then the hasOwnProperty test is enabled and all not own properties will be skipped;
 *     2) if true, then the hasOwnProperty test is disabled;
 *     3) if -1, then the hasOwnProperty test is enabled and all own properties will be skipped.
 */
extend(Object, 'forEach', (obj: any, cb: Function, opts?: ObjectForEachOptions) => {
	if (!obj) {
		return;
	}

	if (Object.isArray(obj) || Object.isString(obj)) {
		for (let i = 0; i < obj.length; i++) {
			cb(obj[i], i, obj);
		}

		return;
	}

	if (typeof obj !== 'object') {
		return;
	}

	if (Object.isMap(obj) || Object.isSet(obj)) {
		for (let o = obj.entries(), i = o.next(); !i.done; i = o.next()) {
			const [key, el] = i.value;
			cb(el, key, obj);
		}

		return;
	}

	if (
		Object.isSimpleObject(obj) ||
		!obj[Symbol.iterator] ||
		opts?.notOwn !== undefined ||
		opts?.withDescriptor !== undefined
	) {
		if (opts?.notOwn) {
			for (const key in obj) {
				if (opts?.notOwn === -1 && hasOwnProperty.call(obj, key)) {
					continue;
				}

				cb(opts?.withDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : obj[key], key, obj);
			}

		} else {
			for (let keys = Object.keys(obj), i = 0; i < keys.length; i++) {
				const key = keys[i];
				cb(opts?.withDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : obj[key], key, obj);
			}
		}

		return;
	}

	for (const el of obj) {
		cb(el, null, obj);
	}
});
