/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import $C = require('collection.js');
import toSource = require('tosource');
import { convertIfDate } from 'core/json';

/** @see {$C.extend} */
Object.mixin = $C.extend;

/**
 * Object.toSource implementation
 */
Object.defineProperty(Object.prototype, 'toSource', {
	enumerable: false,
	value(this: Object): string {
		return toSource(this);
	}
});

/**
 * Creates a hash table without prototype
 * @param fields
 */
// tslint:disable-next-line
Object.createDict = function (...fields: any[]): Dictionary {
	if (fields.length) {
		return Object.assign(Object.create(null), ...fields);
	}

	return Object.create(null);
};

/**
 * Parses the specified value as a JSON / JS object and returns the result
 * @param value
 */
Object.parse = function parse(value: any): any {
	try {
		return new Function(`return ${value}`)();
	} catch (_) {}

	return undefined;
};

/**
 * Clones the specified object using JSON.parse -> JSON.stringify
 *
 * @param obj
 * @param [params] - additional parameters (or false for disable defaults):
 *   *) [replacer] - JSON.stringify replacer
 *   *) [reviver] - JSON.parse reviver
 */
Object.fastClone = function fastClone<T extends Object>(
	obj: T,
	params?: {replacer?: JSONCb; reviver?: JSONCb} | false
): T {
	const
		p = params || {};

	if (typeof obj === 'object') {
		const clone = JSON.parse(
			JSON.stringify(obj, p.replacer), params !== false ? p.reviver || convertIfDate : undefined
		);

		if (!Object.isExtensible(obj)) {
			Object.preventExtensions(clone);
		}

		if (Object.isSealed(obj)) {
			Object.seal(clone);
		}

		if (Object.isFrozen(obj)) {
			Object.freeze(clone);
		}

		return clone;
	}

	return obj;
};

/**
 * Compares two specified objects and returns the result
 * (only for primitives, arrays and plain objects)
 *
 * @param a
 * @param b
 */
Object.fastCompare = function fastCompare<T>(a: any, b: T): a is T {
	if (a === b) {
		return true;
	}

	if (!a || typeof a !== 'object' || !b || typeof b !== 'object') {
		return a === b;
	}

	const
		length1 = (Object.isArray(a) ? a : Object.keys(a)).length,
		length2 = (Object.isArray(b) ? b : Object.keys(b)).length;

	if (length1 !== length2) {
		return false;
	}

	return JSON.stringify(a) === JSON.stringify(b);
};

/**
 * Creates an object {key: value, value: key} from the specified
 * @param obj
 */
Object.createMap = function createMap<T extends Object>(obj: T): T & Dictionary {
	const
		map = {};

	if (Object.isArray(obj)) {
		for (let i = 0; i < (<any[]>obj).length; i++) {
			const el = obj[i];
			map[i] = el;
			map[<string>el] = i;
		}

	} else {
		const
			keys = Object.keys(obj);

		for (let i = 0; i < keys.length; i++) {
			const
				key = <string>keys[i],
				el = obj[key];

			map[key] = el;
			map[el] = key;
		}
	}

	return <T & Dictionary<any>>map;
};

/**
 * Creates an object from the specified array
 * @param arr
 */
Object.fromArray = function fromArray(arr: any[]): Dictionary<boolean> {
	const
		map = {};

	for (let i = 0; i < arr.length; i++) {
		map[arr[i]] = true;
	}

	return map;
};

const
	protoChains = new WeakMap<Function, Object[]>();

/**
 * Returns a prototype chain from the specified constructor
 * @param constructor
 */
Object.getPrototypeChain = function getPrototypeChain(constructor: Function): Object[] {
	if (protoChains.has(constructor)) {
		return (<Object[]>protoChains.get(constructor)).slice();
	}

	const
		chain: Object[] = [];

	let
		proto = constructor.prototype;

	while (proto && proto.constructor !== Object) {
		chain.push(proto);
		proto = Object.getPrototypeOf(proto);
	}

	protoChains.set(constructor, chain.reverse());
	return chain.slice();
};

/** @override */
Object.isArray = Array.isArray;

/** @override */
// @ts-ignore
Object.isFunction = function isFunction(obj: any): boolean {
	return typeof obj === 'function';
};

/** @override */
// @ts-ignore
Object.isString = function isString(obj: any): boolean {
	return typeof obj === 'string';
};

/** @override */
// @ts-ignore
Object.isNumber = function isNumber(obj: any): boolean {
	return typeof obj === 'number';
};

/** @override */
// @ts-ignore
Object.isBoolean = function isBoolean(obj: any): boolean {
	return typeof obj === 'boolean';
};

/**
 * Returns true if the specified object is a hash table
 * @param obj
 */
Object.isTable = function isTable(obj: any): obj is Dictionary {
	return {}.toString.call(obj) === '[object Object]';
};
