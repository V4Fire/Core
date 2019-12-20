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
	params?: ObjectGetOptions
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
			res = res.get(key);

		} else {
			res = res[key];
		}
	}

	return res;
});

//#if runtime has prelude/object/has

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
	params?: ObjectGetOptions
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
			res = res.get(key);

		} else {
			res = res[key];
		}
	}

	const
		key = chunks[i];

	if (Object.isMap(res) || Object.isWeakMap(res)) {
		return res.has(key);
	}

	return key in res;
});

//#endif

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
	params?: ObjectSetOptions
) => {
	const
		p = {separator: '.', concat: false, ...params},
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
				val = ref.get(key);

			if (!val || typeof val !== 'object') {
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
		if (ref.has(cursor) && p.concat) {
			ref.set(cursor, (<unknown[]>[]).concat(ref[cursor], value));

		} else {
			ref.set(cursor, value);
		}

	} else {
		ref[cursor] = cursor in ref && p.concat ?
			(<unknown[]>[]).concat(ref[cursor], value) : value;
	}

	return value;
});

const
	hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Iterates over the specified object
 *
 * @param obj
 * @param cb
 */
extend(Object, 'forEach', (obj: any, cb: Function, params: ObjectForEachOptions = {}) => {
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

	if (Object.isSimpleObject(obj) || !obj[Symbol.iterator]) {
		if (params.notOwn) {
			for (const key in obj) {
				if (params.notOwn === -1 && hasOwnProperty.call(obj, key)) {
					continue;
				}

				cb(params.withDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : obj[key], key, obj);
			}

		} else {
			for (let keys = Object.keys(obj), i = 0; i < keys.length; i++) {
				const key = keys[i];
				cb(params.withDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : obj[key], key, obj);
			}
		}

		return;
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

	if (Object.isSimpleObject(obj)) {
		return Object.keys(obj).length;
	}

	let
		length = 0;

	for (const _ of obj) {
		length++;
	}

	return length;
});
