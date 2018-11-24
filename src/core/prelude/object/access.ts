/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

/**
 * Returns a value from an object by the specified path
 *
 * @param obj
 * @param path
 * @param [params] - additional parameters
 */
extend(Object, 'get', (
	obj: any,
	path: string | any[],
	params?: {separator: string}
) => {
	const
		p = {separator: '.', ...params},
		chunks = Object.isString(path) ? path.split(p.separator) : path;

	let
		res = obj;

	for (let i = 0; i < chunks.length; i++) {
		if (res == null) {
			return undefined;
		}

		const
			key = chunks[i];

		// tslint:disable:prefer-conditional-expression
		if (Object.isMap(res) || Object.isWeakMap(res)) {
			// @ts-ignore
			res = res.get(key);

		} else {
			res = res[key];
		}
	}

	return res;
});

/**
 * Returns true if an object has a property by the specified path
 *
 * @param obj
 * @param path
 * @param [params] - additional parameters
 */
extend(Object, 'has', (
	obj: any,
	path: string | any[],
	params?: {separator: string}
) => {
	const
		p = {separator: '.', ...params},
		chunks = Object.isString(path) ? path.split(p.separator) : path;

	let
		res = obj,
		i = 0;

	for (; i < chunks.length - 1; i++) {
		if (res == null) {
			return false;
		}

		const
			key = chunks[i];

		// tslint:disable:prefer-conditional-expression
		if (Object.isMap(res) || Object.isWeakMap(res)) {
			// @ts-ignore
			res = res.get(key);

		} else {
			// @ts-ignore
			res = res[key];
		}
	}

	const
		key = chunks[i];

	if (Object.isMap(res) || Object.isWeakMap(res)) {
		// @ts-ignore
		return res.has(key);
	}

	return key in res;
});

/**
 * Sets a value to an object by the specified path
 *
 * @param obj
 * @param path
 * @param value
 * @param [params] - additional parameters
 */
extend(Object, 'set', (
	obj: any,
	path: string | any[],
	value: unknown,
	opts?: {separator: string; concat: boolean}
) => {
	const
		p = {separator: '.', concat: false, ...opts},
		chunks = Object.isString(path) ? path.split(p.separator) : path;

	let
		ref = obj,
		cursor: any;

	for (let i = 0; i < chunks.length; i++) {
		const
			key = chunks[i];

		if (chunks.length === i + 1) {
			cursor = key;
			continue;
		}

		const
			nextChunkIsObj = isNaN(Number(chunks[i + 1]));

		// tslint:disable:prefer-conditional-expression
		if (Object.isMap(ref) || Object.isWeakMap(ref)) {
			let
				// @ts-ignore
				val = ref.get(key);

			if (!val || typeof val !== 'object') {
				// @ts-ignore
				ref.set(key, (val = nextChunkIsObj ? {} : []));
			}

			ref = val;

		} else {
			let
				val = ref[key];

			if (!val || typeof val !== 'object') {
				ref[key] = (val = nextChunkIsObj ? {} : []);
			}

			ref = val;
		}
	}

	// tslint:disable:prefer-conditional-expression
	if (Object.isMap(ref) || Object.isWeakMap(ref)) {
		// @ts-ignore
		if (ref.has(cursor) && p.concat) {
			// @ts-ignore
			ref.set(cursor, (<unknown[]>[]).concat(ref[cursor], value));

		} else {
			// @ts-ignore
			ref.set(cursor, value);
		}

	} else {
		ref[cursor] = cursor in ref && p.concat ?
			(<unknown[]>[]).concat(ref[cursor], value) : value;
	}

	return value;
});

/**
 * Iterates over the specified object
 *
 * @param obj
 * @param cb
 */
extend(Object, 'forEach', (obj: any, cb: Function) => {
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

	if (Object.isTable(obj)) {
		for (let keys = Object.keys(obj), i = 0; i < keys.length; i++) {
			const key = keys[i];
			cb(obj[key], key, obj);
		}
	}

	for (const el of obj) {
		cb(el, null, obj);
	}
});

/**
 * Returns length of the specified object
 * @param obj
 */
extend(Object, 'size', (obj: any) => {
	if (!obj) {
		return 0;
	}

	if (Object.isArray(obj) || Object.isString(obj) || Object.isFunction(obj)) {
		return obj.length;
	}

	if (Object.isNumber(obj)) {
		return obj;
	}

	if (typeof obj !== 'object') {
		return 0;
	}

	if (Object.isMap(obj) || Object.isSet(obj)) {
		return obj.size;
	}

	if (Object.isTable(obj)) {
		return Object.keys(obj).length;
	}

	let
		length = 0;

	for (const _ of obj) {
		length++;
	}

	return length;
});
