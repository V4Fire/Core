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

extend(Object, 'isArray', Array.isArray);
extend(Object, 'isTable', (obj) => toString.call(obj) === '[object Object]');

extend(Object, 'isObject', (obj) => {
	if (!obj || typeof obj !== 'object' || toString.call(obj) !== '[object Object]') {
		return false;
	}

	const proto = Object.getPrototypeOf(obj);
	return proto === null || proto === baseProto;
});

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
