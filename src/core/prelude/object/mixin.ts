/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { isContainerStructure, canExtendProto, getType, getSameAs } from 'core/prelude/object/helpers';

/** @see ObjectConstructor.mixin */
// tslint:disable-next-line:only-arrow-functions
extend(Object, 'mixin', function mixin(
	opts: ObjectMixinOptions | boolean,
	base: any,
	...objects: any[]
): unknown | AnyFunction {
	if (arguments.length < 3) {
		if (arguments.length === 2) {
			return (...args) => Object.mixin(opts, base, ...args);
		}

		return (base, ...args) => Object.mixin(opts, base, ...args);
	}

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

	if (type === '') {
		for (let i = 0; i < objects.length; i++) {
			type = getType(objects[i]);

			if (type !== '') {
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
		dataIsSimple = simpleTypes[type] != null,
		onlyNew = p.onlyNew != null ? p.traits : p.onlyNew;

	if (
		!p.deep &&
		p.withUndef &&
		dataIsSimple &&
		!p.concatArray &&
		!p.withProto &&
		!p.withDescriptor &&
		!p.withAccessors &&
		!Object.isTruly(onlyNew) &&
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
				if (Object.isTruly(onlyNew) && data.has(key) !== (onlyNew === -1)) {
					return;
				}

				data.set(key, val);
			};

			break;

		case 'weakSet':
		case 'set':
			setVal = (data, key, val) => {
				if (Object.isTruly(onlyNew) && data.has(val) !== (onlyNew === -1)) {
					return;
				}

				data.add(val);
			};

			break;

		default:
			setVal = (data, key, val) => {
				if (Object.isTruly(onlyNew) && key in data !== (onlyNew === -1)) {
					return;
				}

				if (p.withUndef || val !== undefined) {
					data[key] = val;
				}
			};
	}

	const forEachParams = {
		withDescriptor: Object.isTruly(p.withAccessors) || Object.isTruly(p.withDescriptor),
		notOwn: Object.isTruly(p.withProto)
	};

	for (let i = 0; i < objects.length; i++) {
		const
			extObj = objects[i];

		if (extObj == null) {
			continue;
		}

		const
			isSimple = simpleTypes[getType(extObj)] != null;

		Object.forEach(extObj, (el: any, key: any) => {
			if (p.filter && !Object.isTruly(p.filter(el, key, extObj))) {
				return;
			}

			const needExtendsDescriptor = dataIsSimple && isSimple && (
				withDescriptor || p.withAccessors && (el.get != null || el.set != null)
			);

			if (needExtendsDescriptor) {
				if (Object.isTruly(onlyNew) && key in base !== (onlyNew === -1)) {
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
				valIsArray = false,
				struct;

			if (canExtend) {
				valIsArray = Object.isArray(newVal);
				struct = valIsArray ? [] : getSameAs(newVal);
			}

			const
				needDeepExtend = p.deep && canExtend && (valIsArray || struct != null);

			if (needDeepExtend) {
				const
					canExtendSrcProto = p.withProto && dataIsSimple && canExtendProto(oldVal);

				let
					srcIsArray = Object.isArray(oldVal);

				if (canExtendSrcProto && !Object.hasOwnProperty(base, key)) {
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
						srcIsArray = construct != null && Object.isArray(construct);
						isProto = srcIsArray;
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
					clone = isContainerStructure(oldVal) ? oldVal : struct ?? {};
				}

				Object.set(base, [key], Object.mixin(p, clone, newVal));

			} else {
				setVal(base, key, newVal);
			}

		}, forEachParams);
	}

	return base;
});
