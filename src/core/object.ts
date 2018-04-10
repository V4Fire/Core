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
Object.fastClone = function fastClone<T>(
	obj: T,
	params?: {replacer?: JSONCb; reviver?: JSONCb} | false
): T {
	const
		p = params || {};

	if (Object.isFunction(obj)) {
		return obj;
	}

	if (obj) {
		const
			noJSON = !Object.isFunction((<any>obj).toJSON);

		if (noJSON && obj instanceof Map) {
			const
				map = new Map();

			for (let o = obj.entries(), el = o.next(); !el.done; el = o.next()) {
				const val = el.value;
				map.set(val[0], Object.fastClone(val[1]));
			}

			return <any>map;
		}

		if (noJSON && obj instanceof Set) {
			const
				set = new Set();

			for (let o = obj.values(), el = o.next(); !el.done; el = o.next()) {
				set.add(el.value);
			}

			return <any>set;
		}

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
	}

	return obj;
};

/**
 * Compares two specified objects and returns the result
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
		aIsArr = Object.isArray(a),
		bIsArr = Object.isArray(b);

	if (
		!aIsArr && !Object.isObject(a) && !Object.isDate(a) && !Object.isRegExp(a) ||
		!Object.isFunction(a.toJSON) ||
		!bIsArr && !Object.isObject(b) && !Object.isDate(b) && !Object.isRegExp(b) ||
		!Object.isFunction((<any>b).toJSON)
	) {
		return a === b;
	}

	let
		length1,
		length2;

	if (aIsArr) {
		length1 = a.length;

	} else if (Object.isSet(a) || Object.isMap(a)) {
		length1 = a.size;

	} else {
		length1 = typeof a.length === 'number' ? a.length : Object.keys(a).length;
	}

	if (bIsArr) {
		length2 = (<any>b).length;

	} else if (Object.isSet(b) || Object.isMap(b)) {
		length2 = b.size;

	} else {
		length2 = typeof (<any>b).length === 'number' ? (<any>b).length : Object.keys(b).length;
	}

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
	protoChains = new WeakMap<Function, object[]>();

/**
 * Returns a prototype chain from the specified constructor
 * @param constructor
 */
Object.getPrototypeChain = function getPrototypeChain(constructor: Function): object[] {
	if (protoChains.has(constructor)) {
		return (<object[]>protoChains.get(constructor)).slice();
	}

	const
		chain: object[] = [];

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
Object.isFunction = function isFunction(obj: any): obj is Function {
	return typeof obj === 'function';
};

/** @override */
Object.isString = function isString(obj: any): obj is string {
	return typeof obj === 'string';
};

/** @override */
Object.isNumber = function isNumber(obj: any): obj is number {
	return typeof obj === 'number';
};

/** @override */
Object.isBoolean = function isBoolean(obj: any): obj is boolean {
	return typeof obj === 'boolean';
};

/** @override */
Object.isRegExp = function isRegExp(obj: any): obj is RegExp {
	return obj instanceof RegExp;
};

/** @override */
Object.isDate = function isDate(obj: any): obj is Date {
	return obj instanceof Date;
};

/** @override */
Object.isMap = function isBoolean(obj: any): obj is Map<any, any> {
	return obj instanceof Map;
};

/**
 * Returns true if the specified object is WeakMap
 * @param obj
 */
Object.isWeakMap = function isBoolean(obj: any): obj is WeakMap<any, any> {
	return obj instanceof WeakMap;
};

/** @override */
Object.isSet = function isBoolean(obj: any): obj is Set<any> {
	return obj instanceof Set;
};

/**
 * Returns true if the specified object is WeakSet
 * @param obj
 */
Object.isWeakSet = function isBoolean(obj: any): obj is WeakSet<any> {
	return obj instanceof WeakSet;
};

/**
 * Returns true if the specified object is a hash table
 * @param obj
 */
Object.isTable = function isTable(obj: any): obj is Dictionary {
	return {}.toString.call(obj) === '[object Object]';
};
