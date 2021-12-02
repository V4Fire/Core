/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from '~/core/prelude/extend';
import { isContainer, canExtendProto, getType, getSameAs } from '~/core/prelude/object/helpers';

/** @see [[ObjectConstructor.mixin]] */
extend(Object, 'mixin', function mixin(
	opts: ObjectMixinOptions | boolean,
	target: unknown,
	...objects: unknown[]
): unknown | AnyFunction {
	if (arguments.length < 3) {
		if (arguments.length === 2) {
			return (...args) => Object.mixin(opts, target, ...args);
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
		skipUndefs = 'withUndef' in p ? !p.withUndef : p.skipUndefs !== false,
		concatArrays = Object.isTruly(p.concatArrays) || p.concatArray === true,

		// eslint-disable-next-line @typescript-eslint/unbound-method
		concatFn = Object.isFunction(p.concatArrays) ? p.concatArrays : p.concatFn;

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
		type = getType(target);

	if (type === '') {
		for (let i = 0; i < objects.length; i++) {
			type = getType(objects[i]);

			if (type !== '') {
				break;
			}
		}

		switch (type) {
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
		resolvedTarget = Object.cast(target);
	}

	const
		simpleTypes = {object: true, array: true},
		dataIsSimple = simpleTypes[type] === true;

	const canUseNativeAssign =
		!p.deep &&
		dataIsSimple &&

		!skipUndefs &&
		!concatArrays &&
		!onlyAccessors &&
		!withDescriptors &&
		!Object.isTruly(onlyNew) &&

		!p.withProto &&
		!p.withNonEnumerables &&
		!p.extendFilter &&
		!p.filter;

	if (canUseNativeAssign) {
		return Object.assign(resolvedTarget, ...objects);
	}

	let
		setter;

	switch (type) {
		case 'weakMap':
		case 'map':
			setter = (data, key, val) => {
				if (Object.isTruly(onlyNew) && data.has(key) !== (onlyNew === -1)) {
					return;
				}

				data.set(key, val);
			};

			break;

		case 'weakSet':
		case 'set':
			setter = (data, key, val) => {
				if (Object.isTruly(onlyNew) && data.has(val) !== (onlyNew === -1)) {
					return;
				}

				data.add(val);
			};

			break;

		default:
			setter = (data, key, val) => {
				if (Object.isTruly(onlyNew) && key in data !== (onlyNew === -1)) {
					return;
				}

				if (!skipUndefs || val !== undefined) {
					data[key] = val;
				}
			};
	}

	const forEachParams = <ObjectForEachOptions>{
		passDescriptor: withDescriptors || onlyAccessors,
		withNonEnumerables: p.withNonEnumerables,
		propsToIterate: Object.isTruly(p.deep) ? 'all' : 'own'
	};

	for (let i = 0; i < objects.length; i++) {
		const
			extender = Object.cast<Nullable<object>>(objects[i]);

		if (extender == null) {
			continue;
		}

		const
			isSimple = simpleTypes[getType(extender)] === true;

		Object.forEach(extender, (el, key: DictionaryKey) => {
			if (p.filter && !Object.isTruly(p.filter(el, key, extender))) {
				return;
			}

			const propDesc = withDescriptors || onlyAccessors ?
				Object.cast<PropertyDescriptor>(el) :
				null;

			const needExtendDescriptor = dataIsSimple && isSimple && (
				withDescriptors ||
				onlyAccessors && propDesc != null && (propDesc.get != null || propDesc.set != null)
			);

			if (needExtendDescriptor && propDesc != null) {
				if (Object.isTruly(onlyNew) && key in resolvedTarget !== (onlyNew === -1)) {
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

				} else if (!skipUndefs || !('value' in propDesc) || propDesc.value !== undefined) {
					Object.defineProperty(resolvedTarget, key, propDesc);
				}

				return;
			}

			let
				oldVal = Object.get(resolvedTarget, [key]);

			const
				extVal = isSimple ? extender[key] : el;

			if (extVal === resolvedTarget || extVal === extender) {
				return;
			}

			let
				canDeepExtend = Object.isTruly(extVal);

			if (canDeepExtend && p.extendFilter != null) {
				canDeepExtend = Object.isTruly(p.extendFilter(extVal, key, resolvedTarget));
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

				if (canExtendSrcProto && !Object.hasOwnProperty(resolvedTarget, key)) {
					if (srcIsArray) {
						oldVal = Array.from(Object.cast(oldVal));

					} else {
						oldVal = Object.create(Object.cast(oldVal));
					}

					Object.set(resolvedTarget, [key], oldVal);
				}

				let
					clone;

				if (valIsArray) {
					let
						isProto = false,
						construct;

					if (!srcIsArray && canExtendSrcProto && concatArrays) {
						construct = Object.getPrototypeOf(oldVal);
						srcIsArray = construct != null && Object.isArray(construct);
						isProto = srcIsArray;
					}

					if (srcIsArray) {
						if (concatArrays) {
							const
								old = isProto ? construct : oldVal;

							resolvedTarget[key] = Object.isFunction(concatFn) ?
								concatFn(old, extVal, key) :
								old.concat(extVal);

							return;
						}

						clone = oldVal;

					} else {
						clone = [];
					}

				} else {
					clone = isContainer(oldVal) ? oldVal : struct ?? {};
				}

				Object.set(resolvedTarget, [key], Object.mixin(p, clone, extVal));

			} else {
				setter(resolvedTarget, key, extVal);
			}

		}, forEachParams);
	}

	return resolvedTarget;
});
