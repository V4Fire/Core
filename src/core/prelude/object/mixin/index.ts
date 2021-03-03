/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { isContainer, canExtendProto, getType, getSameAs } from 'core/prelude/object/helpers';

/** @see [[ObjectConstructor.mixin]] */
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
		withDescriptor = p.withDescriptor && !p.withAccessors,
		onlyNew = p.onlyNew != null ? p.onlyNew : p.traits;

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
		dataIsSimple = simpleTypes[type] === true;

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
		notOwn: Object.isTruly(p.deep)
	};

	for (let i = 0; i < objects.length; i++) {
		const
			extender = objects[i];

		if (extender == null) {
			continue;
		}

		const
			isSimple = simpleTypes[getType(extender)] === true;

		Object.forEach(extender, (el: any, key: any) => {
			if (p.filter && !Object.isTruly(p.filter(el, key, extender))) {
				return;
			}

			const needExtendDescriptor = dataIsSimple && isSimple && (
				withDescriptor ||
				p.withAccessors && (el.get != null || el.set != null)
			);

			if (needExtendDescriptor) {
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
				extVal = isSimple ? extender[key] : el;

			if (extVal === base || extVal === extender) {
				return;
			}

			let
				canDeepExtend = Boolean(extVal);

			if (canDeepExtend && p.extendFilter != null) {
				canDeepExtend = Boolean(p.extendFilter(extVal, key, base));
			}

			let
				valIsArray = false,
				struct;

			if (canDeepExtend) {
				valIsArray = Object.isArray(extVal);
				struct = valIsArray ? [] : getSameAs(extVal);
				canDeepExtend = struct != null;
			}

			if (p.deep && canDeepExtend) {
				const
					canExtendSrcProto = p.withProto && dataIsSimple && canExtendProto(oldVal);

				let
					srcIsArray = Object.isArray(oldVal);

				if (canExtendSrcProto && !Object.hasOwnProperty(base, key)) {
					oldVal = srcIsArray ? (<unknown[]>oldVal).slice() : Object.create(<object>oldVal);
					Object.set(base, [key], oldVal);
				}

				let
					clone;

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
							base[key] = p.concatFn ? p.concatFn(old, extVal, key) : old.concat(extVal);
							return;
						}

						clone = oldVal;

					} else {
						clone = [];
					}

				} else {
					clone = isContainer(oldVal) ? oldVal : struct ?? {};
				}

				Object.set(base, [key], Object.mixin(p, clone, extVal));

			} else {
				setVal(base, key, extVal);
			}

		}, forEachParams);
	}

	return base;
});
