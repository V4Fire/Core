/* eslint-disable @typescript-eslint/strict-boolean-expressions */

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

import { deprecate } from 'core/functools';
import { isNative, toString, nonPrimitiveTypes, READONLY, PROXY } from 'core/prelude/types/const';

/** @see [[ObjectConstructor.cast]] */
export const cast = extend<typeof Object.cast>(Object, 'cast', (value) => value);

/** @see [[ObjectConstructor.isTruly]] */
export const isTruly = extend<typeof Object.isTruly>(Object, 'isTruly', (value) => Boolean(value));

/** @see [[ObjectConstructor.isPrimitive]] */
export const isPrimitive = extend<typeof Object.isPrimitive>(Object, 'isPrimitive', (value) => !value || !nonPrimitiveTypes[typeof value]);

/** @see [[ObjectConstructor.isUndef]] */
export const isUndef = extend<typeof Object.isUndef>(Object, 'isUndef', (value) => value === undefined);

/** @see [[ObjectConstructor.isNull]] */
// eslint-disable-next-line eqeqeq
export const isNull = extend<typeof Object.isNull>(Object, 'isNull', (value) => value === null);

/** @see [[ObjectConstructor.isNullable]] */
export const isNullable = extend<typeof Object.isNullable>(Object, 'isNullable', (value) => value == null);

/** @see [[ObjectConstructor.isString]] */
export const isString = extend<typeof Object.isString>(Object, 'isString', (value): value is typeof Object.isString => typeof value === 'string');

/** @see [[ObjectConstructor.throw]] */
export const objThrow = extend<typeof Object.throw>(Object, 'throw', (err = 'This is a loopback function or method') => {
	if (isString(err)) {
		throw new Error(err);
	}

	throw err;
});

/** @see [[ObjectConstructor.isNumber]] */
export const isNumber = extend<typeof Object.isNumber>(Object, 'isNumber', (value) => typeof value === 'number');

/** @see [[ObjectConstructor.isBoolean]] */
export const isBoolean = extend<typeof Object.isBoolean>(Object, 'isBoolean', (value) => typeof value === 'boolean');

/** @see [[ObjectConstructor.isSymbol]] */
export const isSymbol = extend<typeof Object.isSymbol>(Object, 'isSymbol', (value) => typeof value === 'symbol');

/** @see [[ObjectConstructor.isRegExp]] */
export const isRegExp = extend<typeof Object.isRegExp>(Object, 'isRegExp', (value) => value instanceof RegExp);

/** @see [[ObjectConstructor.isDate]] */
export const isDate = extend<typeof Object.isDate>(Object, 'isDate', (value) => value instanceof Date);

/** @see [[ObjectConstructor.isArray]] */
export const isArray = extend<typeof Object.isArray>(Object, 'isArray', Array.isArray);

/** @see [[ObjectConstructor.isArrayLike]] */
export const isArrayLike = extend<typeof Object.isArrayLike>(Object, 'isArrayLike', (value) => {
	const
		t = typeof value;

	if (value == null || t !== 'object') {
		return t === 'string';
	}

	return Array.isArray(value) || value.length > 0 && 0 in value || value.length === 0;
});

/** @see [[ObjectConstructor.isMap]] */
export const isMap = extend<typeof Object.isMap>(Object, 'isMap', (value) => value instanceof Map);

/** @see [[ObjectConstructor.isWeakMap]] */
export const isWeakMap = extend<typeof Object.isWeakMap>(Object, 'isWeakMap', (value) => value instanceof WeakMap);

/** @see [[ObjectConstructor.isSet]] */
export const isSet = extend<typeof Object.isSet>(Object, 'isSet', (value) => value instanceof Set);

/** @see [[ObjectConstructor.isWeakSet]] */
export const isWeakSet = extend<typeof Object.isWeakSet>(Object, 'isWeakSet', (value) => value instanceof WeakSet);

/** @see [[ObjectConstructor.isDictionary]] */
export const isDictionary = extend<typeof Object.isDictionary>(Object, 'isDictionary', isPlainObjectFunc);

/** @see [[ObjectConstructor.isPlainObject]] */
export const isPlainObject = extend<typeof Object.isPlainObject>(Object, 'isPlainObject', isPlainObjectFunc);

function isPlainObjectFunc(value: unknown): boolean {
	value = Object.unwrapProxy(value);

	if (!value || typeof value !== 'object') {
		return false;
	}

	const constr = value.constructor;
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	return !constr || constr === Object;
}

/** @see [[ObjectConstructor.isCustomObject]] */
export const isCustomObject = extend<typeof Object.isCustomObject>(Object, 'isCustomObject', (value) => {
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

/** @see [[ObjectConstructor.isSimpleObject]] */
export const isSimpleObject = extend(Object, 'isSimpleObject', (value) => {
	if (!value || typeof value !== 'object') {
		return false;
	}

	return toString.call(value) === '[object Object]';
});

/** @see [[ObjectConstructor.isFunction]] */
export const isFunction = extend<typeof Object.isFunction>(Object, 'isFunction', (value) => typeof value === 'function');

/** @see [[ObjectConstructor.isSimpleFunction]] */
export const isSimpleFunction = extend<typeof Object.isSimpleFunction>(Object, 'isSimpleFunction', (value) => typeof value === 'function');

/** @see [[ObjectConstructor.isGenerator]] */
export const isGenerator = extend<typeof Object.isGenerator>(Object, 'isGenerator', (value) => typeof value === 'function' && value.constructor.name === 'GeneratorFunction');

/** @see [[ObjectConstructor.isAsyncGenerator]] */
export const isAsyncGenerator = extend<typeof Object.isAsyncGenerator>(Object, 'isAsyncGenerator', (value) => typeof value === 'function' && value.constructor.name === 'AsyncGeneratorFunction');

/** @see [[ObjectConstructor.isIterator]] */
export const isIterator = extend<typeof Object.isIterator>(Object, 'isIterator', (value) => {
	if (!value || typeof value !== 'object') {
		return false;
	}

	return typeof value.next === 'function';
});

/** @see [[ObjectConstructor.isIterable]] */
export const isIterable = extend<typeof Object.isIterable>(Object, 'isIterable', (value) => {
	if (value == null) {
		return false;
	}

	return Boolean(
		typeof Symbol === 'function' ? value[Symbol.iterator] : typeof value['@@iterator'] === 'function'
	);
});

/** @see [[ObjectConstructor.isAsyncIterable]] */
export const isAsyncIterable = extend<typeof Object.isAsyncIterable>(Object, 'isAsyncIterable', (value) => {
	if (value == null) {
		return false;
	}

	return Boolean(
		typeof Symbol === 'function' ? value[Symbol.asyncIterator] : typeof value['@@asyncIterator'] === 'function'
	);
});

/** @see [[ObjectConstructor.isAsyncIterator]] */
export const isAsyncIterator = extend<typeof Object.isAsyncIterator>(Object, 'isAsyncIterator', (value) =>
	isIterator(value) && isAsyncIterable(value));

/** @see [[ObjectConstructor.isPromise]] */
export const isPromise = extend<typeof Object.isPromise>(Object, 'isPromise', (value) => {
	if (value) {
		return typeof value.then === 'function' && typeof value.catch === 'function';
	}

	return false;
});

/** @see [[ObjectConstructor.isPromiseLike]] */
export const isPromiseLike = extend<typeof Object.isPromiseLike>(Object, 'isPromiseLike', (value) => {
	if (value) {
		return typeof value.then === 'function';
	}

	return false;
});

/** @see [[ObjectConstructor.isProxy]] */
export const isProxy = extend<typeof Object.isProxy>(Object, 'isProxy', (value) => value?.[PROXY] != null);

/** @see [[ObjectConstructor.unwrapProxy]] */
export const unwrapProxy = extend<typeof Object.unwrapProxy>(Object, 'unwrapProxy', (value) => {
	while (value?.[PROXY] && value[PROXY] !== value) {
		value = value[PROXY];
	}

	return value;
});

const {
	isExtensible: originalIsExtensible,
	isSealed: originalIsSealed,
	isFrozen: originalIsFrozen
} = Object;

export const isExtensible = (value: Object | null): boolean => {
	if (value == null || value[READONLY] === true) {
		return false;
	}

	return originalIsExtensible(value);
};

export const isSealed = (value: Object | null): boolean =>
	value == null || originalIsSealed(value) || value[READONLY] === true;

export const isFrozen = (value: Object | null): boolean =>
	value == null || originalIsFrozen(value) || value[READONLY] === true;

//#if standalone/prelude
Object.isExtensible = isExtensible;
Object.isSealed = isSealed;
Object.isFrozen = isFrozen;

/**
 * @deprecated
 * @see [[ObjectConstructor.isDictionary]]
 */
extend(Object, 'isObject', deprecate({
	name: 'isObject',
	renamedTo: 'isDictionary'
}, isPlainObject));
//#endif
