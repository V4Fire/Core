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

/** @see ObjectConstructor.mixin */
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
		dataIsSimple = simpleTypes[type],
		onlyNew = p.onlyNew != null ? p.traits : p.onlyNew;

	if (
		!p.deep &&
		p.withUndef &&
		dataIsSimple &&
		!p.concatArray &&
		!p.withProto &&
		!p.withDescriptor &&
		!p.withAccessors &&
		!onlyNew &&
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
				if (onlyNew && data.has(key) !== (onlyNew === -1)) {
					return;
				}

				data.set(key, val);
			};

			break;

		case 'weakSet':
		case 'set':
			setVal = (data, key, val) => {
				if (onlyNew && data.has(val) !== (onlyNew === -1)) {
					return;
				}

				data.add(val);
			};

			break;

		default:
			setVal = (data, key, val) => {
				if (onlyNew && key in data !== (onlyNew === -1)) {
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
			extObj = objects[i];

		if (!extObj) {
			continue;
		}

		const
			isSimple = simpleTypes[getType(extObj)];

		Object.forEach(extObj, (el: any, key: any) => {
			if (p.filter && !p.filter(el, key, extObj)) {
				return;
			}

			if (dataIsSimple && isSimple && (withDescriptor || p.withAccessors && (el.get || el.set))) {
				if (onlyNew && key in base !== (onlyNew === -1)) {
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
				oldVal = Object.get(base, [key]);

			const
				newVal = isSimple ? extObj[key] : el;

			if (base === newVal || newVal === extObj) {
				return;
			}

			let
				canExtend = Boolean(newVal);

			if (canExtend && p.extendFilter) {
				canExtend = Boolean(p.extendFilter(base, newVal, key));
			}

			let
				valIsArray,
				struct;

			if (canExtend) {
				valIsArray = Object.isArray(newVal);
				struct = valIsArray ? [] : getSameAs(newVal);
			}

			if (p.deep && canExtend && (valIsArray || struct)) {
				const
					canExtendSrcProto = p.withProto && dataIsSimple && canExtendProto(oldVal);

				let
					srcIsArray = Object.isArray(oldVal);

				if (canExtendSrcProto && !hasOwnProperty.call(base, key)) {
					oldVal = srcIsArray ? (<unknown[]>oldVal).slice() : Object.create(<object>oldVal);
					Object.set(base, [key], oldVal);
				}

				let clone;
				if (valIsArray) {
					let
						isProto = false,
						construct;

					if (!srcIsArray && canExtendSrcProto && p.concatArray) {
						construct = Object.getPrototypeOf(oldVal);
						srcIsArray = isProto = construct && Object.isArray(construct);
					}

					if (srcIsArray) {
						if (p.concatArray) {
							const old = isProto ? construct : oldVal;
							base[key] = p.concatFn ? p.concatFn(old, newVal, key) : old.concat(newVal);
							return;
						}

						clone = oldVal;

					} else {
						clone = [];
					}

				} else {
					clone = isStructure(oldVal) ? oldVal : struct || {};
				}

				Object.set(base, [key], Object.mixin(p, clone, newVal));

			} else {
				setVal(base, key, newVal);
			}

		}, forEachParams);
	}

	return base;
});

function isStructure(obj: unknown): boolean {
	if (!obj || typeof obj !== 'object') {
		return false;
	}

	if (Object.isArray(obj) || Object.isPlainObject(obj) || Object.isMap(obj) || Object.isSet(obj)) {
		return true;
	}

	return Object.isCustomObject((<object>obj!).constructor);
}

function canExtendProto(obj: unknown): boolean {
	if (!obj || typeof obj !== 'object') {
		return false;
	}

	if (Object.isArray(obj) || Object.isPlainObject(obj)) {
		return true;
	}

	return Object.isCustomObject((<object>obj!).constructor);
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

	if (Object.isIterator(obj) || Object.isIterable(obj)) {
		return 'iterator';
	}

	return 'object';
}

function getSameAs<T>(obj: T): T | boolean {
	if (!obj || typeof obj !== 'object') {
		return false;
	}

	if (Object.isArray(obj)) {
		return <any>[];
	}

	if (Object.isPlainObject(obj)) {
		return <any>{};
	}

	if (Object.isMap(obj)) {
		return <any>new Map();
	}

	if (Object.isSet(obj)) {
		return <any>new Set();
	}

	if (Object.isCustomObject((<object><unknown>obj!).constructor)) {
		return <any>{};
	}

	return false;
}
