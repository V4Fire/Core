/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { isContainer, canExtendProto, getType, getSameAs } from 'core/prelude/object/helpers';

import {

	isArray,
	isTruly,
	isFunction,
	cast,
	isBoolean

} from 'core/prelude/types';
import { get, set, hasOwnProperty } from 'core/prelude/object/property';
import { forEach } from 'core/prelude/object/iterators';

/** @see [[ObjectConstructor.mixin]] */
export const mixin = extend(Object, 'mixin', function mixin(
	opts: ObjectMixinOptions | boolean,
	target: unknown,
	...objects: unknown[]
): unknown | AnyFunction {
	if (arguments.length < 3) {
		if (arguments.length === 2) {
			return (...args) => mixin(opts, target, ...args);
		}

		return (base, ...args) => mixin(opts, base, ...args);
	}

	const
		p: ObjectMixinOptions = {};

	if (isBoolean(opts)) {
		p.deep = opts;

	} else {
		Object.assign(p, opts);
	}

	const
		skipUndefs = 'withUndef' in p ? !p.withUndef : p.skipUndefs !== false,
		concatArrays = isTruly(p.concatArrays) || p.concatArray === true,

		// eslint-disable-next-line @typescript-eslint/unbound-method
		concatFn = isFunction(p.concatArrays) ? p.concatArrays : p.concatFn;

	const
		onlyAccessors = p.withDescriptors === 'onlyAccessors' || p.withAccessors === true,
		withDescriptors = (p.withDescriptors === true || p.withDescriptor === true) && !onlyAccessors;

	let
		onlyNew;

	switch (p.propsToCopy) {
		case 'new':
			onlyNew = true;
			break;

		case 'exist':
			onlyNew = -1;
			break;

		case 'all':
			onlyNew = false;
			break;

		default:
			onlyNew = p.onlyNew != null ? p.onlyNew : p.traits;
	}

	let
		resolvedTarget: object,
		targetType = getType(target);

	if (targetType === '') {
		for (let i = 0; i < objects.length; i++) {
			targetType = getType(objects[i]);

			if (targetType !== '') {
				break;
			}
		}

		switch (targetType) {
			case 'object':
				resolvedTarget = {};
				break;

			case 'weakMap':
				resolvedTarget = new WeakMap();
				break;

			case 'weakSet':
				resolvedTarget = new WeakSet();
				break;

			case 'map':
				resolvedTarget = new Map();
				break;

			case 'set':
				resolvedTarget = new Set();
				break;

			default:
				resolvedTarget = [];
		}

	} else {
		resolvedTarget = cast(target);
	}

	const
		simpleObjTypes = {array: true, arrayLike: true, object: true},
		targetIsSimpleObj = simpleObjTypes[targetType] != null;

	const canUseNativeAssign =
		!p.deep &&
		targetIsSimpleObj &&

		!skipUndefs &&
		!concatArrays &&
		!onlyAccessors &&
		!withDescriptors &&
		!isTruly(onlyNew) &&

		!p.withProto &&
		!p.withNonEnumerables &&
		!p.extendFilter &&
		!p.filter;

	if (canUseNativeAssign) {
		return Object.assign(resolvedTarget, ...objects);
	}

	let
		setter;

	switch (targetType) {
		case 'weakMap':
		case 'map':
			setter = (data, key, val) => {
				if (isTruly(onlyNew) && data.has(key) !== (onlyNew === -1)) {
					return;
				}

				data.set(key, val);
			};

			break;

		case 'weakSet':
		case 'set':
			setter = (data, key, val) => {
				if (isTruly(onlyNew) && data.has(val) !== (onlyNew === -1)) {
					return;
				}

				data.add(val);
			};

			break;

		default:
			setter = (data, key, val) => {
				if (isTruly(onlyNew) && key in data !== (onlyNew === -1)) {
					return;
				}

				if (!skipUndefs || val !== undefined) {
					data[key] = val;
				}
			};
	}

	for (let i = 0; i < objects.length; i++) {
		const
			extender = cast<Nullable<object>>(objects[i]);

		if (extender == null) {
			continue;
		}

		const
			extenderType = getType(extender),
			extenderIsSimpleObj = simpleObjTypes[extenderType] != null;

		const
			forEachParams: ObjectForEachOptions = {};

		if (extenderIsSimpleObj) {
			if (extenderType === 'array') {
				forEachParams.passDescriptor = withDescriptors;

			} else {
				forEachParams.passDescriptor = withDescriptors || onlyAccessors;
				forEachParams.withNonEnumerables = p.withNonEnumerables;
				forEachParams.propsToIterate = isTruly(p.deep) ? 'all' : 'own';
			}
		}

		forEach(extender, forEachParams, (el, key: PropertyKey) => {
			if (p.filter && !isTruly(p.filter(el, key, extender))) {
				return;
			}

			const propDesc = withDescriptors || onlyAccessors ?
				cast<PropertyDescriptor>(el) :
				null;

			const needExtendDescriptor = targetIsSimpleObj && extenderIsSimpleObj && (
				withDescriptors ||
				onlyAccessors && propDesc != null && (propDesc.get != null || propDesc.set != null)
			);

			if (needExtendDescriptor && propDesc != null) {
				if (isTruly(onlyNew) && key in resolvedTarget !== (onlyNew === -1)) {
					return;
				}

				if (onlyAccessors) {
					Object.defineProperty(resolvedTarget, key, {
						configurable: true,
						enumerable: true,

						// eslint-disable-next-line @typescript-eslint/unbound-method
						get: propDesc.get,

						// eslint-disable-next-line @typescript-eslint/unbound-method
						set: propDesc.set
					});

					return;
				}

				if (!p.deep || !('value' in propDesc) || !skipUndefs && propDesc.value === undefined) {
					Object.defineProperty(resolvedTarget, key, propDesc);
					return;
				}
			}

			let
				oldVal = get(resolvedTarget, [key]);

			const
				newVal = extenderIsSimpleObj ? extender[key] : el;

			if (newVal === resolvedTarget || newVal === extender) {
				return;
			}

			let
				canDeepExtend = isTruly(newVal);

			if (canDeepExtend && p.extendFilter != null) {
				canDeepExtend = isTruly(p.extendFilter(newVal, key, resolvedTarget));
			}

			let
				newValIsArray = false,
				struct;

			if (canDeepExtend) {
				newValIsArray = isArray(newVal);
				struct = newValIsArray ? [] : getSameAs(newVal);
				canDeepExtend = struct != null;
			}

			if (p.deep && canDeepExtend) {
				const canExtendOldValProto =
					p.withProto &&
					targetIsSimpleObj &&
					canExtendProto(oldVal);

				let
					oldValIsArray = isArray(oldVal);

				if (canExtendOldValProto && !hasOwnProperty(resolvedTarget, key)) {
					if (oldValIsArray) {
						oldVal = Array.from(cast(oldVal));

					} else {
						oldVal = Object.create(cast(oldVal));
					}

					set(resolvedTarget, [key], oldVal);
				}

				let
					clone;

				if (newValIsArray) {
					let
						isProto = false,
						construct;

					if (!oldValIsArray && canExtendOldValProto && concatArrays) {
						construct = Object.getPrototypeOf(oldVal);
						oldValIsArray = construct != null && isArray(construct);
						isProto = oldValIsArray;
					}

					if (oldValIsArray) {
						if (concatArrays) {
							const
								old = isProto ? construct : oldVal;

							const mergedArr = isFunction(concatFn) ?
								concatFn(old, newVal, key) :
								old.concat(newVal);

							if (needExtendDescriptor && propDesc != null) {
								Object.defineProperty(resolvedTarget, key, {
									...propDesc,
									value: mergedArr
								});

							} else {
								resolvedTarget[key] = mergedArr;
							}

							return;
						}

						clone = oldVal;

					} else {
						clone = [];
					}

				} else {
					clone = isContainer(oldVal) ? oldVal : struct ?? {};
				}

				const
					mergedVal = mixin(p, clone, newVal);

				if (needExtendDescriptor && propDesc != null) {
					Object.defineProperty(resolvedTarget, key, {
						...propDesc,
						value: mergedVal
					});

				} else {
					set(resolvedTarget, [key], mergedVal);
				}

			} else {
				setter(resolvedTarget, key, newVal);
			}
		});
	}

	return resolvedTarget;
});
