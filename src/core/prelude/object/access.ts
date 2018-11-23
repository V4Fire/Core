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
	obj: Dictionary,
	path: string,
	params?: {separator: string}
) => {
	const
		p = {separator: '.', ...params},
		chunks = path.split(p.separator);

	let
		res = obj;

	for (let i = 0; i < chunks.length; i++) {
		if (res == null) {
			return undefined;
		}

		res = <Dictionary>res[chunks[i]];
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
	obj: Dictionary,
	path: string,
	params?: {separator: string}
) => {
	const
		p = {separator: '.', ...params},
		chunks = path.split(p.separator);

	let
		res = obj,
		i = 0;

	for (; i < chunks.length - 1; i++) {
		if (res == null) {
			return false;
		}

		res = <Dictionary>res[chunks[i]];
	}

	return chunks[i] in res;
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
	obj: Dictionary,
	path: string,
	value: unknown,
	opts?: {separator: string; concat: boolean}
) => {
	const
		p = {separator: '.', concat: false, ...opts},
		chunks = path.split(p.separator);

	let
		ref = obj;

	for (let i = 0; i < chunks.length; i++) {
		const
			prop = chunks[i];

		if (chunks.length === i + 1) {
			path = prop;
			continue;
		}

		if (!ref[prop] || typeof ref[prop] !== 'object') {
			ref[prop] = isNaN(Number(chunks[i + 1])) ? {} : [];
		}

		ref = <Dictionary>ref[prop];
	}

	ref[path] = path in ref && p.concat ?
		(<unknown[]>[]).concat(ref[path], value) : value;

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
