/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

/** @see ObjectConstructor.hasOwnProperty */
extend(Object, 'hasOwnProperty', (obj: any, key?: string) => {
	if (!obj || typeof obj !== 'object') {
		if (key === undefined) {
			return () => false;
		}

		return false;
	}

	if (key === undefined) {
		return (key) => obj.hasOwnProperty(key);
	}

	return obj.hasOwnProperty(key);
});

/** @see ObjectConstructor.get */
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

/** @see ObjectConstructor.has */
extend(Object, 'has', (
	obj: any,
	path?: string | any[] | ObjectGetOptions,
	opts?: ObjectGetOptions
) => {
	const
		p = {separator: '.', ...(Object.isPlainObject(path) ? path : opts)};

	const has = (path) => {
		const
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
	};

	if (Object.isArray(path) || Object.isString(path)) {
		return has(path);
	}

	return has;
});

//#endif

/** @see ObjectConstructor.set */
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
				val = <any>ref[key];

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
