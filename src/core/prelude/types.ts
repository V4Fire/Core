/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

const
	toString = Object.prototype.toString,
	baseProto = Object.prototype;

/** @see Sugar.Object.isObject */
extend(Object, 'isObject', (obj) => {
	if (!obj || typeof obj !== 'object' || toString.call(obj) !== '[object Object]') {
		return false;
	}

	const proto = Object.getPrototypeOf(obj);
	return proto === null || proto === baseProto;
});

/** @see Sugar.Object.isArray */
extend(Object, 'isArray', Array.isArray);

/** @see Sugar.Object.isFunction */
extend(Object, 'isFunction', (obj) => typeof obj === 'function');

/** @see Sugar.Object.isRegExp */
extend(Object, 'isRegExp', (obj) => obj instanceof RegExp);

/** @see Sugar.Object.isDate */
extend(Object, 'isDate', (obj) => obj instanceof Date);

/** @see Sugar.Object.isString */
extend(Object, 'isString', (obj) => typeof obj === 'string');

/** @see Sugar.Object.isNumber */
extend(Object, 'isNumber', (obj) => typeof obj === 'number');

/** @see Sugar.Object.isBoolean */
extend(Object, 'isBoolean', (obj) => typeof obj === 'boolean');

/**
 * Returns true if the specified value is a symbol
 * @param obj
 */
extend(Object, 'isSymbol', (obj) => typeof obj === 'symbol');

/**
 * Returns true if the specified value is a map
 * @param obj
 */
extend(Object, 'isMap', (obj) => obj instanceof Map);

/**
 * Returns true if the specified value is a weak map
 * @param obj
 */
extend(Object, 'isWeakMap', (obj) => obj instanceof WeakMap);

/**
 * Returns true if the specified value is a set
 * @param obj
 */
extend(Object, 'isSet', (obj) => obj instanceof Set);

/**
 * Returns true if the specified value is a weak set
 * @param obj
 */
extend(Object, 'isWeakSet', (obj) => obj instanceof WeakSet);

/**
 * Returns true if the specified value is an array or like an array
 * @param obj
 */
extend(Object, 'isArrayLike', (obj) => {
	if (!obj) {
		return false;
	}

	return Array.isArray(obj) || (obj.length > 0 && 0 in obj) || obj.length === 0;
});

/**
 * Returns true if the specified value is a generator
 * @param obj
 */
extend(Object, 'isGenerator', (obj) =>
	typeof obj === 'function' && obj.constructor.name === 'GeneratorFunction');

/**
 * Returns true if the specified value is an iterator
 * @param obj
 */
extend(Object, 'isIterator', (obj) => {
	if (!obj) {
		return false;
	}

	return typeof Symbol === 'function' ? obj[Symbol.iterator] : typeof obj['@@iterator'] === 'function';
});

/**
 * Returns true if the specified value is a HashTable object
 * @param obj
 */
extend(Object, 'isTable', (obj) =>
	toString.call(obj) === '[object Object]');

/**
 * Returns true if the specified value is a promise
 * @param obj
 */
extend(Object, 'isPromise', (obj) => {
	if (toString.call(obj) === '[object Promise]') {
		return true;
	}

	if (obj instanceof Object) {
		const v = <Dictionary>obj;
		return Object.isFunction(v.then) && Object.isFunction(v.catch);
	}

	return false;
});
