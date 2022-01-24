/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import {

	muteLabel,
	blackList,

	toProxyObject,
	toRootObject,
	toTopObject,
	toOriginalObject,

	watchPath,
	watchOptions,
	watchHandlers

} from '@src/core/object/watch/const';

import { bindMutationHooks } from '@src/core/object/watch/wrap';
import { isValueCanBeArrayIndex } from '@src/core/object/watch/helpers';

import {

	unwrap,
	getProxyType,
	getProxyValue,
	getOrCreateLabelValueByHandlers

} from '@src/core/object/watch/engines/helpers';

import type {

	Watcher,
	WatchPath,

	RawWatchHandler,
	WatchHandlersSet,

	WatchOptions,
	InternalWatchOptions

} from '@src/core/object/watch/interface';

/**
 * Watches for changes of the specified object by using Proxy objects
 *
 * @param obj
 * @param path - base path to object properties: it is provided to a watch handler with parameters
 * @param handler - callback that is invoked on every mutation hook
 * @param handlers - set of registered handlers
 * @param [opts] - additional options
 */
export function watch<T extends object>(
	obj: T,
	path: CanUndef<unknown[]>,
	handler: Nullable<RawWatchHandler>,
	handlers: WatchHandlersSet,
	opts?: WatchOptions
): Watcher<T>;

/**
 * Watches for changes of the specified object by using Proxy objects
 *
 * @param obj
 * @param path - base path to object properties: it is provided to a watch handler with parameters
 * @param handler - callback that is invoked on every mutation hook
 * @param handlers - set of registered handlers
 * @param opts - additional options
 * @param root - link to the root object of watching
 * @param top - link to the top object of watching
 */
export function watch<T extends object>(
	obj: T,
	path: CanUndef<unknown[]>,
	handler: Nullable<RawWatchHandler>,
	handlers: WatchHandlersSet,
	opts: CanUndef<InternalWatchOptions>,
	root: object,
	top: object
): T;

export function watch<T extends object>(
	obj: T,
	path: CanUndef<unknown[]>,
	handler: Nullable<RawWatchHandler>,
	handlers: WatchHandlersSet,
	opts?: InternalWatchOptions,
	root?: object,
	top?: object
): Watcher<T> | T {
	opts ??= {};

	const
		unwrappedObj = unwrap(obj),
		resolvedRoot = root ?? unwrappedObj;

	const returnProxy = (obj, proxy?) => {
		if (proxy != null && handler != null && (!top || !handlers.has(handler))) {
			handlers.add(handler);
		}

		if (top) {
			return proxy ?? obj;
		}

		return {
			proxy: proxy ?? obj,

			set: (path, value) => {
				set(obj, path, value, handlers);
			},

			delete: (path) => {
				unset(obj, path, handlers);
			},

			unwatch: () => {
				if (handler != null) {
					handlers.delete(handler);
				}
			}
		};
	};

	if (unwrappedObj == null || resolvedRoot == null) {
		return returnProxy(obj);
	}

	if (!top) {
		const tmpOpts = getOrCreateLabelValueByHandlers<InternalWatchOptions>(
			unwrappedObj,
			watchOptions,
			handlers,
			{...opts}
		);

		if (opts.deep) {
			tmpOpts.deep = true;
		}

		if (opts.withProto) {
			tmpOpts.withProto = true;
		}

		opts = tmpOpts;
	}

	let
		proxy = getOrCreateLabelValueByHandlers(unwrappedObj, toProxyObject, handlers);

	if (proxy != null) {
		return returnProxy(unwrappedObj, proxy);
	}

	if (getProxyType(unwrappedObj) == null) {
		return returnProxy(unwrappedObj);
	}

	const
		fromProto = Boolean(opts.fromProto),
		resolvedPath = path ?? [];

	if (!Object.isDictionary(unwrappedObj)) {
		const wrapOpts = {
			root: resolvedRoot,
			top,
			path: resolvedPath,
			originalPath: resolvedPath,
			fromProto,
			watchOpts: opts
		};

		bindMutationHooks(unwrappedObj, wrapOpts, handlers);
	}

	const frozenKeys = Object.createDict<Dictionary<boolean>>({
		[toRootObject]: true,
		[toTopObject]: true,
		[toOriginalObject]: true,
		[watchHandlers]: true,
		[watchPath]: true
	});

	const
		blackListStore = new Set();

	let
		lastSetKey;

	proxy = new Proxy(unwrappedObj, {
		get: (target, key) => {
			switch (key) {
				case toRootObject:
					return resolvedRoot;

				case toTopObject:
					return top;

				case toOriginalObject:
					return target;

				case watchHandlers:
					return handlers;

				case watchPath:
					return path;

				default:
					// Do nothing
			}

			const
				val = target[key];

			if (Object.isPrimitive(val) || resolvedRoot[muteLabel] === true) {
				return val;
			}

			const
				isArray = Object.isArray(target),
				isCustomObject = isArray || Object.isCustomObject(target);

			if (isArray && !Reflect.has(target, Symbol.isConcatSpreadable)) {
				target[Symbol.isConcatSpreadable] = true;
			}

			if (Object.isSymbol(key) || blackListStore.has(key)) {
				if (isCustomObject) {
					return val;
				}

			} else if (isCustomObject) {
				let
					propFromProto = fromProto,
					normalizedKey;

				if (isArray && isValueCanBeArrayIndex(key)) {
					normalizedKey = Number(key);

				} else {
					normalizedKey = key;

					const
						desc = Reflect.getOwnPropertyDescriptor(target, key);

					// Readonly non-configurable values can't be wrapped due Proxy API limitations
					if (desc?.writable === false && desc.configurable === false) {
						return val;
					}
				}

				if (propFromProto || !isArray && !Object.hasOwnProperty(target, key)) {
					propFromProto = true;
				}

				const watchOpts = Object.assign(Object.create(opts!), {fromProto: propFromProto});
				return getProxyValue(val, normalizedKey, path, handlers, resolvedRoot, top, watchOpts);
			}

			return Object.isFunction(val) ? val.bind(target) : val;
		},

		set: (target, key, val, receiver) => {
			if (frozenKeys[key]) {
				return false;
			}

			lastSetKey = key;
			val = unwrap(val) ?? val;

			const
				isArray = Object.isArray(target),
				isCustomObj = isArray || Object.isCustomObject(target),
				set = () => Reflect.set(target, key, val, isCustomObj ? receiver : target);

			const canSetWithoutEmit =
				Object.isSymbol(key) ||
				resolvedRoot[muteLabel] === true ||
				blackListStore.has(key);

			if (canSetWithoutEmit) {
				return set();
			}

			let
				normalizedKey;

			if (isArray && isValueCanBeArrayIndex(key)) {
				normalizedKey = Number(key);

			} else {
				normalizedKey = key;
			}

			let oldVal = Reflect.get(target, normalizedKey, isCustomObj ? receiver : target);
			oldVal = unwrap(oldVal) ?? oldVal;

			if (oldVal !== val && set()) {
				if (!opts!.withProto && (fromProto || !isArray && !Object.hasOwnProperty(target, key))) {
					return true;
				}

				for (let o = handlers.values(), el = o.next(); !el.done; el = o.next()) {
					const
						path = resolvedPath.concat(normalizedKey);

					el.value(val, oldVal, {
						obj: unwrappedObj,
						root: resolvedRoot,
						top,
						fromProto,
						path
					});
				}
			}

			return true;
		},

		defineProperty: (target: object, key, desc) => {
			if (frozenKeys[key]) {
				return false;
			}

			const
				define = (desc) => Reflect.defineProperty(target, key, desc);

			if (lastSetKey === key) {
				lastSetKey = undefined;
				return define(desc);
			}

			const canDefineWithoutEmit =
				Object.isSymbol(key) ||
				resolvedRoot[muteLabel] === true ||
				blackListStore.has(key);

			if (canDefineWithoutEmit) {
				return define(desc);
			}

			const {
				configurable,
				writable
			} = desc;

			const
				mergedDesc = {...desc};

			let
				valToDefine;

			const needRedefineValue =
				desc.get == null &&
				desc.set == null &&
				'value' in desc &&
				desc.value !== Reflect.get(target, key, proxy);

			if (needRedefineValue) {
				valToDefine = desc.value;
				mergedDesc.value = undefined;
				mergedDesc.configurable = true;
				mergedDesc.writable = true;
			}

			const
				res = define(mergedDesc);

			if (res) {
				if (valToDefine !== undefined) {
					Object.cast<Dictionary>(proxy)[key] = valToDefine;
					define({configurable, writable});
				}

				return true;
			}

			return false;
		},

		deleteProperty: (target, key) => {
			if (frozenKeys[key]) {
				return false;
			}

			if (Reflect.deleteProperty(target, key)) {
				if (resolvedRoot[muteLabel] === true) {
					return true;
				}

				if (Object.isDictionary(target) || Object.isMap(target) || Object.isWeakMap(target)) {
					blackListStore.add(key);
				}

				return true;
			}

			return false;
		},

		has: (target, key) => {
			if (frozenKeys[key]) {
				return true;
			}

			if (blackListStore.has(key)) {
				return false;
			}

			return Reflect.has(target, key);
		}
	});

	getOrCreateLabelValueByHandlers(unwrappedObj, blackList, handlers, blackListStore);
	getOrCreateLabelValueByHandlers(unwrappedObj, toProxyObject, handlers, proxy);

	return returnProxy(unwrappedObj, proxy);
}

/**
 * Sets a new watchable value for an object by the specified path
 *
 * @param obj
 * @param path
 * @param value
 * @param handlers - set of registered handlers
 */
export function set(obj: object, path: WatchPath, value: unknown, handlers: WatchHandlersSet): void {
	const
		unwrappedObj = unwrap(obj);

	if (!unwrappedObj) {
		return;
	}

	const
		normalizedPath = Object.isArray(path) ? path : path.split('.');

	const
		prop = normalizedPath[normalizedPath.length - 1],
		refPath = normalizedPath.slice(0, -1);

	if (normalizedPath.length > 1 && Object.get(obj, refPath) == null) {
		unwrappedObj[muteLabel] = true;
		Object.set(obj, refPath, {});
		unwrappedObj[muteLabel] = false;
	}

	const ref = Object.get(
		getOrCreateLabelValueByHandlers(unwrappedObj, toProxyObject, handlers) ?? unwrappedObj,
		refPath
	);

	const
		blackListStore = getOrCreateLabelValueByHandlers<Set<unknown>>(unwrappedObj, blackList, handlers),
		type = getProxyType(ref);

	switch (type) {
		case 'set':
			throw new TypeError('Invalid data type to watch');

		case 'array':
			(<unknown[]>ref).splice(Number(prop), 1, value);
			break;

		case 'map':
			blackListStore?.delete(prop);
			(<Map<unknown, unknown>>ref).set(prop, value);
			break;

		default: {
			const
				key = String(prop),
				store = <Dictionary>ref;

			blackListStore?.delete(key);
			store[key] = value;
		}
	}
}

/**
 * Deletes a watchable value for an object by the specified path
 *
 * @param obj
 * @param path
 * @param handlers - set of registered handlers
 */
export function unset(obj: object, path: WatchPath, handlers: WatchHandlersSet): void {
	const
		unwrappedObj = unwrap(obj);

	if (!unwrappedObj) {
		return;
	}

	const
		normalizedPath = Object.isArray(path) ? path : path.split('.');

	const
		prop = normalizedPath[normalizedPath.length - 1],
		refPath = normalizedPath.slice(0, -1);

	const ref = Object.get(
		getOrCreateLabelValueByHandlers(unwrappedObj, toProxyObject, handlers) ?? unwrappedObj,
		refPath
	);

	const
		blackListStore = getOrCreateLabelValueByHandlers<Set<unknown>>(unwrappedObj, blackList, handlers),
		type = getProxyType(ref);

	switch (type) {
		case null:
			return;

		case 'array':
			(<unknown[]>ref).splice(Number(prop), 1);
			break;

		case 'map':
		case 'set':
			blackListStore?.delete(prop);
			(<Map<unknown, unknown>>ref).delete(prop);
			break;

		default: {
			const
				key = String(prop),
				store = <Dictionary>ref;

			blackListStore?.delete(key);
			store[key] = undefined;
			delete store[key];
		}
	}
}
