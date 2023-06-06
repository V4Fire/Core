/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import extend from 'core/prelude/extend';
import { isNative, toString, nonPrimitiveTypes, READONLY, PROXY } from 'core/prelude/types/const';

/** {@link ObjectConstructor.cast} */
extend(Object, 'cast', (value) => value);

/** {@link ObjectConstructor.throw} */
extend(Object, 'throw', (err = 'This is a loopback function or method') => {
	if (Object.isString(err)) {
		throw new Error(err);
	}

	throw err;
});

/** {@link ObjectConstructor.isTruly} */
extend(Object, 'isTruly', (value) => Boolean(value));

/** {@link ObjectConstructor.isPrimitive} */
extend(Object, 'isPrimitive', (value) => !value || !nonPrimitiveTypes[typeof value]);

/** {@link ObjectConstructor.isUndef} */
extend(Object, 'isUndef', (value) => value === undefined);

/** {@link ObjectConstructor.isNull} */
// eslint-disable-next-line eqeqeq
extend(Object, 'isNull', (value) => value === null);

/** {@link ObjectConstructor.isNullable} */
extend(Object, 'isNullable', (value) => value == null);

/** {@link ObjectConstructor.isString} */
extend(Object, 'isString', (value) => typeof value === 'string');

/** {@link ObjectConstructor.isNumber} */
extend(Object, 'isNumber', (value) => typeof value === 'number');

/** {@link ObjectConstructor.isBoolean} */
extend(Object, 'isBoolean', (value) => typeof value === 'boolean');

/** {@link ObjectConstructor.isSymbol} */
extend(Object, 'isSymbol', (value) => typeof value === 'symbol');

/** {@link ObjectConstructor.isRegExp} */
extend(Object, 'isRegExp', (value) => value instanceof RegExp);

/** {@link ObjectConstructor.isDate} */
extend(Object, 'isDate', (value) => value instanceof Date);

/** {@link ObjectConstructor.isArray} */
extend(Object, 'isArray', Array.isArray);

/** {@link ObjectConstructor.isArrayLike} */
extend(Object, 'isArrayLike', (value) => {
	const
		t = typeof value;

	if (value == null || t !== 'object') {
		return t === 'string';
	}

	return Array.isArray(value) || value.length > 0 && 0 in value || value.length === 0;
});

/** {@link ObjectConstructor.isMap} */
extend(Object, 'isMap', (value) => value instanceof Map);

/** {@link ObjectConstructor.isWeakMap} */
extend(Object, 'isWeakMap', (value) => value instanceof WeakMap);

/** {@link ObjectConstructor.isSet} */
extend(Object, 'isSet', (value) => value instanceof Set);

/** {@link ObjectConstructor.isWeakSet} */
extend(Object, 'isWeakSet', (value) => value instanceof WeakSet);

/** {@link ObjectConstructor.isDictionary} */
extend(Object, 'isDictionary', isPlainObject);

/** {@link ObjectConstructor.isPlainObject} */
extend(Object, 'isPlainObject', isPlainObject);

function isPlainObject(value: unknown): boolean {
	value = Object.unwrapProxy(value);

	if (value == null || typeof value !== 'object') {
		return false;
	}

	const constr = value.constructor;
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	return constr == null || constr === Object || constr.name === 'Object';
}

/** {@link ObjectConstructor.isCustomObject} */
extend(Object, 'isCustomObject', (value) => {
	value = Object.unwrapProxy(value);

	let
		type;

	if (!value || !nonPrimitiveTypes[type = typeof value]) {
		return false;
	}

	if (type === 'function') {
		return !isNative.test(value.toString());
	}

	const constr = value.constructor;
	return !constr || constr === Object || !isNative.test(constr.toString());
});

/** {@link ObjectConstructor.isSimpleObject} */
extend(Object, 'isSimpleObject', (value) => {
	if (!value || typeof value !== 'object') {
		return false;
	}

	return toString.call(value) === '[object Object]';
});

/** {@link ObjectConstructor.isFunction} */
extend(Object, 'isFunction', (value) => typeof value === 'function');

/** {@link ObjectConstructor.isSimpleFunction} */
extend(Object, 'isSimpleFunction', (value) => typeof value === 'function');

/** {@link ObjectConstructor.isGenerator} */
extend(Object, 'isGenerator', (value) => typeof value === 'function' && value.constructor.name === 'GeneratorFunction');

/** {@link ObjectConstructor.isAsyncGenerator} */
extend(Object, 'isAsyncGenerator', (value) => typeof value === 'function' && value.constructor.name === 'AsyncGeneratorFunction');

/** {@link ObjectConstructor.isIterator} */
extend(Object, 'isIterator', (value) => {
	if (value == null || typeof value !== 'object' || !('next' in value)) {
		return false;
	}

	return typeof value.next === 'function';
});

/** {@link ObjectConstructor.isIterableIterator} */
extend(Object, 'isIterableIterator', (value) =>
	Object.isIterator(value) && Object.isIterable(value));

/** {@link ObjectConstructor.isAsyncIterator} */
extend(Object, 'isAsyncIterator', (value) =>
	Object.isIterator(value) && Object.isAsyncIterable(value));

/** {@link ObjectConstructor.isAnyIterator} */
extend(Object, 'isAnyIterator', (value) =>
	Object.isIterator(value) || Object.isAsyncIterator(value));

/** {@link ObjectConstructor.isIterable} */
extend(Object, 'isIterable', (value) => {
	if (value == null) {
		return false;
	}

	return typeof value[Symbol.iterator] === 'function';
});

/** {@link ObjectConstructor.isAsyncIterable} */
extend(Object, 'isAsyncIterable', (value) => {
	if (value == null) {
		return false;
	}

	return typeof value[Symbol.asyncIterator] === 'function';
});

/** {@link ObjectConstructor.isAnyIterable} */
extend(Object, 'isAnyIterable', (value) =>
	Object.isIterable(value) || Object.isAsyncIterable(value));

/** {@link ObjectConstructor.isPromise} */
extend(Object, 'isPromise', (value) => {
	if (value == null || typeof value !== 'object' || !('then' in value) || !('catch' in value)) {
		return false;
	}

	return typeof value.then === 'function' && typeof value.catch === 'function';
});

/** {@link ObjectConstructor.isPromiseLike} */
extend(Object, 'isPromiseLike', (value) => {
	if (value == null || typeof value !== 'object' || !('then' in value)) {
		return false;
	}

	return typeof value.then === 'function';
});

/** {@link ObjectConstructor.isProxy} */
extend(Object, 'isProxy', (value) => value?.[PROXY] != null);

/** {@link ObjectConstructor.unwrapProxy} */
extend(Object, 'unwrapProxy', (value) => {
	while (value?.[PROXY] && value[PROXY] !== value) {
		value = value[PROXY];
	}

	return value;
});

const {
	isExtensible,
	isSealed,
	isFrozen
} = Object;

Object.isExtensible = (value) => {
	if (value == null || value[READONLY] === true) {
		return false;
	}

	return isExtensible(value);
};

Object.isSealed = (value) =>
	value == null || isSealed(value) || value[READONLY] === true;

Object.isFrozen = (value) =>
	value == null || isFrozen(value) || value[READONLY] === true;
