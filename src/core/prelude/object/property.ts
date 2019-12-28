/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

/**
 * Returns a value from the object by the specified path
 *
 * @param obj
 * @param path
 * @param [opts] - additional options:
 *   *) [separator] - character for declaring the path
 */
extend(Object, 'get', (
	obj: any,
	path: string | any[],
	opts?: ObjectGetOptions
) => {
	const
		p = {separator: '.', ...opts},
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
 * Returns true if the object has a property by the specified path
 *
 * @param obj
 * @param path
 * @param [opts] - additional options:
 *   *) [separator] - character for declaring the path
 */
extend(Object, 'has', (
	obj: any,
	path: string | any[],
	opts?: ObjectGetOptions
) => {
	const
		p = {separator: '.', ...opts},
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
 * Sets a value to the object by the specified path
 *
 * @param obj
 * @param path
 * @param value
 * @param [opts] - additional options:
 *   *) [separator] - character for declaring the path
 *   *) [concat] - if true, then the new value will be concatenated with an old within an array
 */
extend(Object, 'set', (
	obj: any,
	path: string | any[],
	value: unknown,
	opts?: ObjectSetOptions
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
