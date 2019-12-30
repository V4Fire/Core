/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

const
	hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Extends the specified object by another objects
 *
 * @param params - if true, then properties will be copied recursively
 *   OR additional options for extending:
 *
 *   *) [withUndef = false] - if true, then the original value can be rewritten to undefined
 *   *) [withDescriptor = false] - if true, then the descriptor of a property will be copied too
 *   *) [withAccessors = false] - if true, then the property accessors will be copied too, but not another
 *        descriptor properties
 *
 *   *) [withProto = false] - if true, then properties is copied with their prototypes
 *   *) [concatArray = false] - if true, then for merging two arrays will be used a concatenation strategy
 *
 *   *) [concatFn = Array.prototype.concat] - function that is concatenate arrays
 *   *) [extendFilter] - function that is filter values for deep extending
 *   *) [traits = false] - if true, then is copied only new properties, or if -1, only old
 *   *) [deep = false] - if true, then properties is copied recursively
 *
 * @param base - base object
 * @param objects - objects for extending
 */
extend(Object, 'mixin', (opts: ObjectMixinOptions | boolean, base: any, ...objects: any[]) => {
	const
		p = <ObjectMixinOptions>{};

	if (Object.isBoolean(opts)) {
		p.deep = opts;

	} else {
		Object.assign(p, opts);
	}

	const
		withDescriptor = p.withDescriptor && !p.withAccessors;

	let
		type = getType(base);

	if (!type) {
		for (let i = 0; i < objects.length; i++) {
			type = getType(objects[i]);

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
		return Object.assign(<object>base, ...objects);
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

	for (let i = 0; i < objects.length; i++) {
		const
			arg = objects[i];

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
