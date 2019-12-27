/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

/**
 * Returns true if the specified value is an object
 * @param obj
 */
extend(Object, 'isObject', (obj) => {
	if (!obj || typeof obj !== 'object') {
		return false;
	}

	const constr = obj.constructor;
	return !constr || constr === Object;
});

/**
 * Returns true if the specified value is an array
 * @param obj
 */
extend(Object, 'isArray', Array.isArray);

/**
 * Returns true if the specified value is looks like an array
 * @param obj
 */
extend(Object, 'isArrayLike', (obj) => {
	if (!obj) {
		return false;
	}

	return Array.isArray(obj) || (obj.length > 0 && 0 in obj) || obj.length === 0;
});

/**
 * Returns true if the specified value is a function
 * @param obj
 */
extend(Object, 'isFunction', (obj) => typeof obj === 'function');

/**
 * Returns true if the specified value is a regular expression
 * @param obj
 */
extend(Object, 'isRegExp', (obj) => obj instanceof RegExp);

/**
 * Returns true if the specified value is a date
 * @param obj
 */
extend(Object, 'isDate', (obj) => obj instanceof Date);

/**
 * Returns true if the specified value is a string
 * @param obj
 */
extend(Object, 'isString', (obj) => typeof obj === 'string');

/**
 * Returns true if the specified value is a number
 * @param obj
 */
extend(Object, 'isNumber', (obj) => typeof obj === 'number');

/**
 * Returns true if the specified value is a boolean
 * @param obj
 */
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

const
	toString = Object.prototype.toString;

/**
 * Returns true if the specified value is a hash table object
 * @param obj
 */
extend(Object, 'isSimpleObject', (obj) =>
	toString.call(obj) === '[object Object]');

/**
 * Returns true if the specified value is a promise
 * @param obj
 */
extend(Object, 'isPromise', (obj) => {
	if (obj) {
		const v = <Dictionary>obj;
		return typeof v.then === 'function' && typeof v.catch === 'function';
	}

	return false;
});

/**
 * Returns true if the specified value is looks like a promise
 * @param obj
 */
extend(Object, 'isPromiseLike', (obj) => {
	if (obj) {
		const v = <Dictionary>obj;
		return typeof v.then === 'function';
	}

	return false;
});
