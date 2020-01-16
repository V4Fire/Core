/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { deprecate } from 'core/meta/deprecation';

/** @see ObjectConstructor.isDictionary */
extend(Object, 'isDictionary', isDictionary);

/** @see ObjectConstructor.isCustomObject */
extend(Object, 'isCustomObject', isCustomObject);

/** @see ObjectConstructor.isArray */
extend(Object, 'isArray', Array.isArray);

/** @see ObjectConstructor.isArrayLike */
extend(Object, 'isArrayLike', (obj) => {
	if (!obj) {
		return false;
	}

	return Array.isArray(obj) || (obj.length > 0 && 0 in obj) || obj.length === 0;
});

/** @see ObjectConstructor.isFunction */
extend(Object, 'isFunction', (obj) => typeof obj === 'function');

/** @see ObjectConstructor.isGenerator */
extend(Object, 'isGenerator', (obj) =>
	typeof obj === 'function' && obj.constructor.name === 'GeneratorFunction');

/** @see ObjectConstructor.isIterator */
extend(Object, 'isIterator', (obj) => {
	if (!obj) {
		return false;
	}

	return typeof Symbol === 'function' ? obj[Symbol.iterator] : typeof obj['@@iterator'] === 'function';
});

/** @see ObjectConstructor.isString */
extend(Object, 'isString', (obj) => typeof obj === 'string');

/** @see ObjectConstructor.isNumber */
extend(Object, 'isNumber', (obj) => typeof obj === 'number');

/** @see ObjectConstructor.isBoolean */
extend(Object, 'isBoolean', (obj) => typeof obj === 'boolean');

/** @see ObjectConstructor.isSymbol */
extend(Object, 'isSymbol', (obj) => typeof obj === 'symbol');

/** @see ObjectConstructor.isRegExp */
extend(Object, 'isRegExp', (obj) => obj instanceof RegExp);

/** @see ObjectConstructor.isDate */
extend(Object, 'isDate', (obj) => obj instanceof Date);

/** @see ObjectConstructor.isPromise */
extend(Object, 'isPromise', (obj) => {
	if (obj) {
		const v = <Dictionary>obj;
		return typeof v.then === 'function' && typeof v.catch === 'function';
	}

	return false;
});

/** @see ObjectConstructor.isPromiseLike */
extend(Object, 'isPromiseLike', (obj) => {
	if (obj) {
		const v = <Dictionary>obj;
		return typeof v.then === 'function';
	}

	return false;
});

/** @see ObjectConstructor.isMap */
extend(Object, 'isMap', (obj) => obj instanceof Map);

/** @see ObjectConstructor.isWeakMap */
extend(Object, 'isWeakMap', (obj) => obj instanceof WeakMap);

/** @see ObjectConstructor.isSet */
extend(Object, 'isSet', (obj) => obj instanceof Set);

/** @see ObjectConstructor.isWeakSet */
extend(Object, 'isWeakSet', (obj) => obj instanceof WeakSet);

/**
 * @deprecated
 * @see ObjectConstructor.isDictionary
 */
extend(Object, 'isPlainObject', deprecate({
	name: 'isPlainObject',
	renamedTo: 'isDictionary'
}, isDictionary));

/**
 * @deprecated
 * @see ObjectConstructor.isDictionary
 */
extend(Object, 'isObject', deprecate({
	name: 'isObject',
	renamedTo: 'isDictionary'
}, isDictionary));

/**
 * @deprecated
 * @see ObjectConstructor.isCustomObject
 */
extend(Object, 'isSimpleObject', deprecate({
	name: 'isSimpleObject',
	renamedTo: 'isCustomObject'
}, isCustomObject));

function isDictionary(obj: unknown): boolean {
	if (!obj || typeof obj !== 'object') {
		return false;
	}

	const constr = obj!.constructor;
	return !constr || constr === Object;
}

const
	toString = Object.prototype.toString;

function isCustomObject(obj: unknown): boolean {
	return toString.call(obj) === '[object Object]';
}
