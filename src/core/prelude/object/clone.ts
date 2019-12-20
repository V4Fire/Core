/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { convertIfDate } from 'core/json';

const
	hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Extends the specified object by another objects
 *
 * @param params - if true, then properties will be copied recursively
 *   OR additional parameters for extending:
 *
 *   *) [withUndef = false] - if true, then the original value can be rewritten to undefined
 *   *) [withDescriptor = false] - if true, then the descriptor of a property will be copied too
 *   *) [withAccessors = false] - if true, then property accessors will be copied too, but not another
 *        descriptor properties
 *
 *   *) [withProto = false] - if true, then properties will be copied with prototypes
 *   *) [concatArray = false] - if true, then array properties will be concatenated
 *        (only if extending by an another array)
 *
 *   *) [concatFn = Array.prototype.concat] - function that will be concatenate arrays
 *   *) [extendFilter] - function that will be filtering values for deep extending
 *   *) [traits = false] - if true, then will be copied only new properties, or if -1, only old
 *   *) [deep = false] - if true, then properties will be copied recursively
 *
 * @param base - base object
 * @param objs - objects for extending
 * @return {(!Object|!Promise)}
 */
extend(Object, 'mixin', (params: ObjectMixinOptions | boolean, base: any, ...objs: any[]) => {
	const
		p = <ObjectMixinOptions>{};

	if (Object.isBoolean(params)) {
		p.deep = params;

	} else {
		Object.assign(p, params);
	}

	const
		withDescriptor = p.withDescriptor && !p.withAccessors;

	let
		type = getType(base);

	if (!type) {
		for (let i = 0; i < objs.length; i++) {
			type = getType(objs[i]);

			if (type) {
				break;
			}
		}

		switch (type) {
			case 'object':
				base = {};
				break;

			case 'weakMap':
				base = new WeakMap();
				break;

			case 'weakSet':
				base = new WeakSet();
				break;

			case 'map':
				base = new Map();
				break;

			case 'set':
				base = new Set();
				break;

			default:
				base = [];
		}
	}

	const
		simpleTypes = {object: true, array: true},
		dataIsSimple = simpleTypes[type];

	if (
		!p.deep &&
		p.withUndef &&
		dataIsSimple &&
		!p.concatArray &&
		!p.withProto &&
		!p.withDescriptor &&
		!p.withAccessors &&
		!p.traits &&
		!p.extendFilter &&
		!p.filter
	) {
		return Object.assign(<object>base, ...objs);
	}

	let setVal;
	switch (type) {
		case 'weakMap':
		case 'map':
			setVal = (data, key, val) => {
				if (p.traits && data.has(key) !== (p.traits === -1)) {
					return;
				}

				data.set(key, val);
			};

			break;

		case 'weakSet':
		case 'set':
			setVal = (data, key, val) => {
				if (p.traits && data.has(val) !== (p.traits === -1)) {
					return;
				}

				data.add(val);
			};

			break;

		default:
			setVal = (data, key, val) => {
				if (p.traits && key in data !== (p.traits === -1)) {
					return;
				}

				if (p.withUndef || val !== undefined) {
					data[key] = val;
				}
			};
	}

	const forEachParams = {
		withDescriptor: p.withAccessors || p.withDescriptor,
		notOwn: p.withProto
	};

	for (let i = 0; i < objs.length; i++) {
		const
			arg = objs[i];

		if (!arg) {
			continue;
		}

		const
			isSimple = simpleTypes[getType(arg)];

		Object.forEach(arg, (el: any, key: any) => {
			if (p.filter && !p.filter(el, key, arg)) {
				return;
			}

			if (dataIsSimple && isSimple && (withDescriptor || p.withAccessors && (el.get || el.set))) {
				if (p.traits && key in base !== (p.traits === -1)) {
					return;
				}

				if (p.withAccessors) {
					Object.defineProperty(base, key, {
						configurable: true,
						enumerable: true,
						get: el.get,
						set: el.set
					});

				} else if (!('value' in el) || el.value !== undefined || p.withUndef) {
					Object.defineProperty(base, key, el);
				}

				return;
			}

			let
				src = Object.get(base, [key]);

			const
				val = isSimple ? arg[key] : el;

			if (base === val || val === arg) {
				return;
			}

			let
				canExtend = Boolean(val);

			if (canExtend && p.extendFilter) {
				canExtend = Boolean(p.extendFilter(base, val, key));
			}

			let
				valIsArray,
				struct;

			if (canExtend) {
				valIsArray = Object.isArray(val);
				struct = valIsArray ? [] : getSameAs(val);
			}

			if (p.deep && canExtend && (valIsArray || struct)) {
				const
					isExtProto = p.withProto && dataIsSimple && canExtendProto(src);

				let
					srcIsArray = Object.isArray(src);

				if (isExtProto && !hasOwnProperty.call(base, key)) {
					src = srcIsArray ? (<unknown[]>src).slice() : Object.create(<object>src);
					Object.set(base, [key], src);
				}

				let clone;
				if (valIsArray) {
					let
						isProto = false,
						construct;

					if (!srcIsArray && isExtProto && p.concatArray) {
						construct = Object.getPrototypeOf(src);
						srcIsArray = isProto = construct && Object.isArray(construct);
					}

					if (srcIsArray) {
						if (p.concatArray) {
							const o = isProto ? construct : src;
							base[key] = p.concatFn ? p.concatFn(o, val, key) : o.concat(val);
							return;
						}

						clone = src;

					} else {
						clone = [];
					}

				} else {
					clone = isStructure(src) ? src : struct || {};
				}

				Object.set(base, [key], Object.mixin(p, clone, val));

			} else {
				setVal(base, key, val);
			}

		}, forEachParams);
	}

	return base;
});

/**
 * Clones the specified object using JSON.stringify/parse strategy
 *
 * @param obj
 * @param [params] - additional parameters:
 *   *) [replacer] - JSON.stringify replacer
 *   *) [reviver] - JSON.parse reviver (false for disable defaults)
 *   *) [freezable] - if false the object freeze state wont be copy
 */
extend(Object, 'fastClone', (obj, params?: FastCloneOptions) => {
	if (!obj || typeof obj === 'function') {
		return obj;
	}

	if (typeof obj === 'object') {
		if (obj instanceof Map) {
			const
				map = new Map();

			for (let o = obj.entries(), el = o.next(); !el.done; el = o.next()) {
				const val = el.value;
				map.set(val[0], Object.fastClone(val[1]));
			}

			return map;
		}

		if (obj instanceof Set) {
			const
				set = new Set();

			for (let o = obj.values(), el = o.next(); !el.done; el = o.next()) {
				set.add(Object.fastClone(el.value));
			}

			return set;
		}

		if (Array.isArray(obj)) {
			if (!obj.length) {
				return [];
			}

			if (obj.length < 10) {
				const
					slice = obj.slice();

				let
					isSimple = true;

				for (let i = 0; i < obj.length; i++) {
					const
						el = obj[i];

					if (el && typeof el === 'object') {
						if (el instanceof Date) {
							slice[i] = new Date(el);

						} else {
							isSimple = false;
							break;
						}
					}
				}

				if (isSimple) {
					return slice;
				}
			}
		}

		if (obj instanceof Date) {
			return new Date(obj);
		}

		const
			constr = obj.constructor;

		if ((!constr || constr === Object) && !Object.keys(obj).length) {
			return {};
		}

		const
			p = params || {},
			funcMap = new Map();

		const
			replacer = createReplacer(obj, funcMap, p.replacer),
			reviewer = createReviewer(obj, funcMap, p.reviver);

		const clone = JSON.parse(
			JSON.stringify(obj, replacer),
			reviewer
		);

		if (p.freezable !== false) {
			if (!Object.isExtensible(obj)) {
				Object.preventExtensions(clone);
			}

			if (Object.isSealed(obj)) {
				Object.seal(clone);
			}

			if (Object.isFrozen(obj)) {
				Object.freeze(clone);
			}
		}

		return clone;
	}

	return obj;
});

const
	objRef = '[[OBJ_REF:base]]',
	funcRef = '[[FUNC_REF:';

function createReplacer(
	base: unknown,
	funcMap: Map<Function | string, Function | string>,
	replacer?: JSONCb
): JSONCb {
	let
		init = false;

	return (key, value) => {
		if (init && value === base) {
			return objRef;
		}

		if (!init) {
			init = true;
		}

		if (typeof value === 'function') {
			const key = funcMap.get(value) || `${funcRef}${Math.random()}]]`;
			funcMap.set(value, key);
			funcMap.set(key, value);
			return key;
		}

		if (replacer) {
			return replacer(key, value);
		}

		return value;
	};
}

function createReviewer(
	base: unknown,
	funcMap: Map<Function | string, Function | string>,
	reviewer?: JSONCb | false
): JSONCb {
	return (key, value) => {
		if (value === objRef) {
			return base;
		}

		if (funcMap && typeof value === 'string' && value.slice(0, funcRef.length) === funcRef) {
			const
				fn = funcMap.get(value);

			if (typeof fn === 'function') {
				return fn;
			}
		}

		if (reviewer !== false) {
			value = convertIfDate(key, value);
		}

		if (reviewer) {
			return reviewer(key, value);
		}

		return value;
	};
}

const
	isNative = /\[native code]/;

function isStructure(obj: unknown): boolean {
	if (!obj) {
		return false;
	}

	if (Object.isArray(obj) || Object.isObject(obj) || Object.isMap(obj) || Object.isSet(obj)) {
		return true;
	}

	return Object.isFunction((<object>obj).constructor) && !isNative.test((<object>obj).constructor.toString());
}

function canExtendProto(obj: unknown): boolean {
	if (!obj) {
		return false;
	}

	if (Object.isArray(obj) || Object.isObject(obj)) {
		return true;
	}

	return Object.isFunction((<object>obj).constructor) && !isNative.test((<object>obj).constructor.toString());
}

function getType(obj: unknown): string {
	if (!obj || typeof obj !== 'object') {
		return '';
	}

	if (Object.isMap(obj)) {
		return 'map';
	}

	if (Object.isWeakMap(obj)) {
		return 'weakMap';
	}

	if (Object.isSet(obj)) {
		return 'set';
	}

	if (Object.isWeakSet(obj)) {
		return 'weakSet';
	}

	if (Object.isGenerator(obj)) {
		return 'generator';
	}

	if (Object.isArrayLike(obj)) {
		return 'array';
	}

	if (Object.isIterator(obj)) {
		return 'iterator';
	}

	return 'object';
}

function getSameAs<T = unknown>(obj: T): T | boolean {
	if (!obj) {
		return false;
	}

	if (Object.isArray(obj)) {
		return <any>[];
	}

	if (Object.isObject(obj)) {
		return <any>{};
	}

	if (Object.isMap(obj)) {
		return <any>new Map();
	}

	if (Object.isSet(obj)) {
		return <any>new Set();
	}

	return <any>(
		Object.isFunction((<any>obj).constructor) && !isNative.test((<any>obj).constructor.toString()) ? {} : false
	);
}
