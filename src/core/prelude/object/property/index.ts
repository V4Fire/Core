/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

import {

	isPlainObject,
	isString,
	isPromiseLike,
	isArray,
	isDictionary,
	isMap,
	isWeakMap,
	isSet,
	isWeakSet,
	cast,
	isSymbol

} from 'core/prelude/types';

/** @see [[ObjectConstructor.get]] */
export const get = extend<typeof Object.get>(Object, 'get', (
	obj: unknown,
	path: ObjectPropertyPath | ObjectGetOptions,
	opts?: ObjectGetOptions
) => {
	if (needCurriedOverload(obj, path)) {
		const
			curriedPath = obj,
			curriedOpts = path;

		return (obj) => get(obj, cast(curriedPath), cast(curriedOpts));
	}

	const
		p = {separator: '.', ...isPlainObject(path) ? path : opts};

	const getFunc = (path) => {
		const
			chunks = isString(path) ? path.split(p.separator) : path;

		let
			res = obj;

		for (let i = 0; i < chunks.length; i++) {
			if (res == null) {
				return;
			}

			const
				key = chunks[i];

			if (isPromiseLike(res) && !(key in res)) {
				res = res.then((val) => {
					if (val == null) {
						return;
					}

					if (isMap(val) || isWeakMap(val)) {
						return val.get(key);
					}

					return (cast<Dictionary>(val))[key];
				});

			} else if (isMap(res) || isWeakMap(res)) {
				res = res.get(key);

			} else {
				res = cast<Dictionary>(res)[key];
			}
		}

		return res;
	};

	if (isArray(path) || isString(path)) {
		return getFunc(path);
	}

	return getFunc;
});

/** @see [[ObjectConstructor.has]] */
export const has = extend<typeof Object.has>(Object, 'has', (
	obj: unknown,
	path: ObjectPropertyPath | ObjectGetOptions,
	opts?: ObjectGetOptions
) => {
	if (needCurriedOverload(obj, path)) {
		const
			curriedPath = obj,
			curriedOpts = path;

		return (obj) => has(obj, cast(curriedPath), cast(curriedOpts));
	}

	const
		p = {separator: '.', ...isPlainObject(path) ? path : opts};

	const hasFunc = (path) => {
		const
			chunks = isString(path) ? path.split(p.separator) : path;

		let
			res = obj,
			i = 0;

		for (; i < chunks.length - 1; i++) {
			if (res == null) {
				return false;
			}

			const
				key = chunks[i];

			if (isMap(res) || isWeakMap(res)) {
				res = res.get(key);

			} else {
				res = cast<Dictionary>(res)[key];
			}
		}

		const
			key = chunks[i];

		if (res == null) {
			return false;
		}

		if (isMap(res) || isSet(res) || isWeakMap(res) || isWeakSet(res)) {
			return res.has(key);
		}

		if (typeof res === 'object') {
			return key in res;
		}

		return cast<Dictionary>(res)[key] !== undefined;
	};

	if (isArray(path) || isString(path)) {
		return hasFunc(path);
	}

	return has;
});

const
	// eslint-disable-next-line @typescript-eslint/unbound-method
	{hasOwnProperty: nativeHasOwnProperty} = Object.prototype;

/** @see [[ObjectConstructor.hasOwnProperty]] */
export const hasOwnProperty = extend<typeof Object.hasOwnProperty>(Object, 'hasOwnProperty', function hasOwnProperty(
	this: unknown,
	obj: unknown,
	key?: string | symbol
): boolean | AnyFunction {
	if (this != null && this !== Object) {
		return nativeHasOwnProperty.call(this, obj);
	}

	if (arguments.length > 1) {
		if (obj == null) {
			return false;
		}

		return nativeHasOwnProperty.call(obj, key);
	}

	if (isString(obj) || isSymbol(obj)) {
		key = obj;
		return (obj) => hasOwnProperty(obj, key);
	}

	return (key) => hasOwnProperty(obj, key);
});

/** @see [[ObjectConstructor.defineSymbol]] */
export const defineSymbol = extend<typeof Object.defineSymbol>(Object, 'defineSymbol', function defineSymbol<T>(obj: T, symbol: symbol, value: unknown): T {
	return Object.defineProperty(obj, symbol, {value, configurable: true, enumerable: false, writable: true});
});

/** @see [[ObjectConstructor.set]] */
export const set = extend<typeof Object.set>(Object, 'set', function set(
	obj: unknown,
	path: ObjectPropertyPath | ObjectGetOptions,
	value: unknown,
	opts?: ObjectSetOptions
): unknown | AnyFunction {
	if (needCurriedOverload(obj, path)) {
		const
			curriedPath = obj,
			curriedOpts = path;

		return function wrapper(obj: unknown, newValue: unknown): unknown {
			const val = arguments.length > 1 ? newValue : value;
			set(obj, cast(curriedPath), val, cast(curriedOpts));
			return obj;
		};
	}

	const p: ObjectSetOptions = {
		separator: '.',
		concat: false,
		...isPlainObject(path) ? path : opts
	};

	if (isArray(path) || isString(path)) {
		if (arguments.length < 2) {
			return (value) => {
				setFunc(path, value);
				return obj;
			};
		}

		return setFunc(path, value);
	}

	return (path, ...args) => {
		setFunc(path, ...args);
		return obj;
	};

	function setFunc(path: ObjectPropertyPath, newValue?: unknown): unknown {
		const
			finalValue = arguments.length > 1 ? newValue : value,
			chunks = isString(path) ? path.split(p.separator!) : path;

		let
			ref = obj,
			cursor;

		for (let i = 0; i < chunks.length; i++) {
			const
				key = chunks[i];

			if (chunks.length === i + 1) {
				cursor = key;
				continue;
			}

			const
				nextChunkIsObj = isNaN(Number(chunks[i + 1]));

			let
				isRefWeakMap;

			if (isMap(ref) || (isRefWeakMap = isWeakMap(ref))) {
				let
					val = ref.get(key);

				if (val == null || typeof val !== 'object') {
					if (isRefWeakMap === true && (key == null || typeof key !== 'object')) {
						return undefined;
					}

					val = nextChunkIsObj ? new Map() : [];

					if (p.setter != null) {
						p.setter(ref, key, val);

					} else {
						ref.set(key, val);
					}
				}

				ref = val;

			} else {
				const
					box = cast<object>(ref);

				let
					val = box[key];

				if (val == null || typeof val !== 'object') {
					val = nextChunkIsObj ? {} : [];

					if (p.setter != null) {
						p.setter(box, key, val);

					} else {
						box[key] = val;
					}
				}

				ref = val;
			}
		}

		let
			isRefWeakMap;

		if (isMap(ref) || (isRefWeakMap = isWeakMap(ref))) {
			if (isRefWeakMap === true && (cursor == null || typeof cursor !== 'object')) {
				return undefined;
			}

			const val = ref.has(cursor) && p.concat ?
				Array.concat([], ref[cursor], finalValue) :
				finalValue;

			if (p.setter != null) {
				p.setter(ref, cursor, val);
				return ref.get(cursor);
			}

			ref.set(cursor, val);
			return val;
		}

		const
			box = cast<object>(ref),
			val = cursor in box && p.concat ? Array.concat([], box[cursor], finalValue) : finalValue;

		if (p.setter != null) {
			p.setter(box, cursor, val);
			return box[cursor];
		}

		box[cursor] = val;
		return val;
	}
});

/** @see [[ObjectConstructor.delete]] */
export const deleteObj = extend<typeof Object.delete>(Object, 'delete', (
	obj: unknown,
	path: ObjectPropertyPath | ObjectGetOptions,
	opts?: ObjectGetOptions
) => {
	if (needCurriedOverload(obj, path)) {
		const
			curriedPath = obj,
			curriedOpts = path;

		return (obj) => deleteObj(obj, cast(curriedPath), cast(curriedOpts));
	}

	const
		p = {separator: '.', ...isPlainObject(path) ? path : opts};

	const del = (path) => {
		const
			chunks = isString(path) ? path.split(p.separator) : path;

		let
			res = obj,
			i = 0;

		for (; i < chunks.length - 1; i++) {
			if (res == null) {
				return false;
			}

			const
				key = chunks[i];

			if (isMap(res) || isWeakMap(res)) {
				res = res.get(key);

			} else {
				res = cast<Dictionary>(res)[key];
			}
		}

		const
			key = chunks[i];

		if (res == null) {
			return false;
		}

		if (isMap(res) || isSet(res) || isWeakMap(res) || isWeakSet(res)) {
			return res.delete(key);
		}

		const
			box = cast<object>(res);

		if (typeof res === 'object' ? key in box : box[key] !== undefined) {
			return delete box[key];
		}

		return false;
	};

	if (isArray(path) || isString(path)) {
		return del(path);
	}

	return del;
});

function needCurriedOverload(obj: unknown, path: unknown): boolean {
	return (isString(obj) || isArray(obj)) && (path == null || isDictionary(path));
}
