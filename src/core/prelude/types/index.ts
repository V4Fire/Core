/* eslint-disable @typescript-eslint/strict-boolean-expressions */

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from '~/core/prelude/extend';

import { deprecate } from '~/core/functools';
import { isNative, toString, nonPrimitiveTypes } from '~/core/prelude/types/const';

/** @see [[ObjectConstructor.isTruly]] */
extend(Object, 'isTruly', (value) => Boolean(value));

/** @see [[ObjectConstructor.isPrimitive]] */
extend(Object, 'isPrimitive', (value) => !value || !nonPrimitiveTypes[typeof value]);

/** @see [[ObjectConstructor.isDictionary]] */
extend(Object, 'isDictionary', isPlainObject);

/** @see [[ObjectConstructor.isPlainObject]] */
extend(Object, 'isPlainObject', isPlainObject);

function isPlainObject(value: unknown): boolean {
	if (!value || typeof value !== 'object') {
		return false;
	}

	const constr = value!.constructor;
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	return !constr || constr === Object;
}

/** @see [[ObjectConstructor.isCustomObject]] */
extend(Object, 'isCustomObject', (value) => {
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
extend(Object, 'isSimpleObject', (value) => {
	if (!value || typeof value !== 'object') {
		return false;
	}

	return toString.call(value) === '[object Object]';
});

/** @see [[ObjectConstructor.isArray]] */
extend(Object, 'isArray', Array.isArray);

/** @see [[ObjectConstructor.isArrayLike]] */
extend(Object, 'isArrayLike', (value) => {
	const
		t = typeof value;

	if (value == null || t !== 'object') {
		return t === 'string';
	}

	return Array.isArray(value) || value.length > 0 && 0 in value || value.length === 0;
});

/** @see [[ObjectConstructor.isFunction]] */
extend(Object, 'isFunction', (value) => typeof value === 'function');

/** @see [[ObjectConstructor.isSimpleFunction]] */
extend(Object, 'isSimpleFunction', (value) => typeof value === 'function');

/** @see [[ObjectConstructor.isGenerator]] */
extend(Object, 'isGenerator', (value) => typeof value === 'function' && value.constructor.name === 'GeneratorFunction');

/** @see [[ObjectConstructor.isIterator]] */
extend(Object, 'isIterator', (value) => {
	if (!value || typeof value !== 'object') {
		return false;
	}

	return typeof value.next === 'function';
});

/** @see [[ObjectConstructor.isIterable]] */
extend(Object, 'isIterable', (value) => {
	if (value == null) {
		return false;
	}

	return Boolean(
		typeof Symbol === 'function' ? value[Symbol.iterator] : typeof value['@@iterator'] === 'function'
	);
});

/** @see [[ObjectConstructor.isString]] */
extend(Object, 'isString', (value) => typeof value === 'string');

/** @see [[ObjectConstructor.isNumber]] */
extend(Object, 'isNumber', (value) => typeof value === 'number');

/** @see [[ObjectConstructor.isBoolean]] */
extend(Object, 'isBoolean', (value) => typeof value === 'boolean');

/** @see [[ObjectConstructor.isSymbol]] */
extend(Object, 'isSymbol', (value) => typeof value === 'symbol');

/** @see [[ObjectConstructor.isRegExp]] */
extend(Object, 'isRegExp', (value) => value instanceof RegExp);

/** @see [[ObjectConstructor.isDate]] */
extend(Object, 'isDate', (value) => value instanceof Date);

/** @see [[ObjectConstructor.isPromise]] */
extend(Object, 'isPromise', (value) => {
	if (value) {
		return typeof value.then === 'function' && typeof value.catch === 'function';
	}

	return false;
});

/** @see [[ObjectConstructor.isPromiseLike]] */
extend(Object, 'isPromiseLike', (value) => {
	if (value) {
		return typeof value.then === 'function';
	}

	return false;
});

/** @see [[ObjectConstructor.isMap]] */
extend(Object, 'isMap', (value) => value instanceof Map);

/** @see [[ObjectConstructor.isWeakMap]] */
extend(Object, 'isWeakMap', (value) => value instanceof WeakMap);

/** @see [[ObjectConstructor.isSet]] */
extend(Object, 'isSet', (value) => value instanceof Set);

/** @see [[ObjectConstructor.isWeakSet]] */
extend(Object, 'isWeakSet', (value) => value instanceof WeakSet);

/**
 * @deprecated
 * @see [[ObjectConstructor.isDictionary]]
 */
extend(Object, 'isObject', deprecate({
	name: 'isObject',
	renamedTo: 'isDictionary'
}, isPlainObject));
