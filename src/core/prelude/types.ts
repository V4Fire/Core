/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

const defaultMethods = <Array<[string, string | Function]>>[
	['isFunction', 'function'],
	['isString', 'string'],
	['isNumber', 'number'],
	['isBoolean', 'boolean'],
	['isRegExp', RegExp],
	['isDate', Date],
	['isMap', Map],
	['isWeakMap', WeakMap],
	['isSet', Set],
	['isWeakSet', WeakSet]
];

for (let i = 0; i < defaultMethods.length; i++) {
	const
		[nm, test] = defaultMethods[i];

	if (typeof test === 'function') {
		extend(Object, nm, (obj) => obj instanceof test);

	} else {
		extend(Object, nm, (obj) => typeof obj === test);
	}
}

const
	toString = Object.prototype.toString,
	baseProto = Object.prototype;

/** @see Sugar.Object.isArray */
extend(Object, 'isArray', Array.isArray);

/** @see Sugar.Object.isObject */
extend(Object, 'isObject', (obj) => {
	if (!obj || typeof obj !== 'object' || toString.call(obj) !== '[object Object]') {
		return false;
	}

	const proto = Object.getPrototypeOf(obj);
	return proto === null || proto === baseProto;
});

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
