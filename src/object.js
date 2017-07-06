'use strict';

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { convertDate } from './json';

const
	$C = require('collection.js'),
	toSource = require('tosource');

/** @see {$C.extend} */
Object.mixin = $C.extend;

Object.defineProperty(Object.prototype, 'toSource', {
	enumerable: false,
	value() {
		return toSource(this);
	}
});

/**
 * Parses the specified value as JSON / JS object and returns the result
 * @param value
 */
Object.parse = function (value: any): any {
	try {
		return new Function(`return ${value}`)();
	} catch (_) {}

	return undefined;
};

/**
 * Clones the specified object using JSON.parse -> JSON.stringify
 *
 * @param obj
 * @param [replacer] - JSON.stringify replacer
 * @param [reviver] - JSON.parse reviver
 */
Object.fastClone = function (
	obj: Object,
	{replacer, reviver}: {
		replacer(key: string, value: any): any,
		reviver(key: string, value: any): any
	} | false = {}

): Object {
	if (typeof obj === 'object') {
		return JSON.parse(JSON.stringify(obj, replacer), arguments[1] !== false ? reviver || convertDate : undefined);
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
Object.fastCompare = function (a: any, b: any): boolean {
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
 * Creates an object {key: value, value: key}
 *
 * @template T
 * @param {T} obj - source object
 * @returns {T}
 */
Object.createMap = function (obj) {
	const
		map = {};

	if (Object.isArray(obj)) {
		for (let i = 0; i < obj.length; i++) {
			const el = obj[i];
			map[i] = el;
			map[el] = i;
		}

	} else {
		const
			keys = Object.keys(obj);

		for (let i = 0; i < keys.length; i++) {
			const
				key = keys[i],
				el = obj[key];

			map[key] = el;
			map[el] = key;
		}
	}

	return map;
};

/**
 * Creates an object from the specified array
 * @param arr
 */
Object.fromArray = function (arr: Array): Object {
	const
		map = {};

	for (let i = 0; i < arr.length; i++) {
		map[arr[i]] = true;
	}

	return map;
};

/**
 * Creates an array of objects {value: element} from the specified object
 * @param obj
 */
Object.mapToValue = function (obj: any): Array<{value: any}> {
	const
		tmp = [].concat(obj),
		arr = [];

	for (let i = 0; i < tmp.length; i++) {
		arr.push({value: tmp[i]});
	}

	return arr;
};

const
	toString = {}.toString;

/**
 * Returns true if the specified object is a hash table
 * @param obj
 */
Object.isTable = function (obj: any): boolean {
	return toString.call(obj) === '[object Object]';
};
