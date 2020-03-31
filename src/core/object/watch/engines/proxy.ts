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

} from 'core/object/watch/const';

import { bindMutationHooks } from 'core/object/watch/wrap';

import {

	unwrap,
	getProxyType,
	getProxyValue,
	getOrCreateLabelValueByHandlers

} from 'core/object/watch/engines/helpers';

import {

	WatchPath,
	WatchHandler,
	WatchHandlersSet,
	WatchOptions,
	InternalWatchOptions,
	Watcher

} from 'core/object/watch/interface';

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
	handler: Nullable<WatchHandler>,
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
	handler: Nullable<WatchHandler>,
	handlers: WatchHandlersSet,
	opts: CanUndef<InternalWatchOptions>,
	root: object,
	top: object
): T;

export function watch<T extends object>(
	obj: T,
	path: CanUndef<unknown[]>,
	handler: Nullable<WatchHandler>,
	handlers: WatchHandlersSet,
	opts?: InternalWatchOptions,
	root?: object,
	top?: object
): Watcher<T> | T {
	const unwrappedObj = unwrap(obj);
	root = root || unwrappedObj;

	const returnProxy = (obj, proxy?) => {
		if (proxy && handler && handlers && (!top || !handlers.has(handler))) {
			handlers.add(handler);
		}

		if (top) {
			return proxy || obj;
		}

		return {
			proxy: proxy || obj,

			set: (path, value) => {
				if (handlers) {
					set(obj, path, value, handlers);
				}
			},

			delete: (path) => {
				if (handlers) {
					unset(obj, path, handlers);
				}
			},

			unwatch: () => {
				if (handler && handlers) {
					handlers.delete(handler);
				}
			}
		};
	};

	if (!unwrappedObj) {
		return returnProxy(obj);
	}

	if (!top) {
		const tmpOpts = getOrCreateLabelValueByHandlers<InternalWatchOptions>(
			unwrappedObj,
			watchOptions,
			handlers,
			{...opts}
		);

		if (opts?.deep) {
			tmpOpts.deep = true;
		}

		if (opts?.withProto) {
			tmpOpts.withProto = true;
		}

		opts = tmpOpts;
	}

	let
		proxy = getOrCreateLabelValueByHandlers(unwrappedObj, toProxyObject, handlers);

	if (proxy) {
		return returnProxy(unwrappedObj, proxy);
	}

	if (!getProxyType(unwrappedObj)) {
		return returnProxy(unwrappedObj);
	}

	const
		fromProto = Boolean(opts?.fromProto),
		resolvedPath = path || [];

	if (!Object.isDictionary(unwrappedObj) && !Object.isArray(unwrappedObj)) {
		const wrapOpts = {
			root: root!,
			top,
			path: resolvedPath,
			originalPath: resolvedPath,
			fromProto,
			watchOpts: opts
		};

		bindMutationHooks(unwrappedObj, wrapOpts, handlers);
	}

	const
		blackListStore = new Set();

	proxy = new Proxy(unwrappedObj, {
		get: (target, key) => {
			switch (key) {
				case toOriginalObject:
					return target;

				case toRootObject:
					return root;

				case toTopObject:
					return top;

				case watchHandlers:
					return handlers;

				case watchPath:
					return path;
			}

			const
				val = target[key];

			if (Object.isPrimitive(val) || root![muteLabel]) {
				return val;
			}

			if (Object.isSymbol(key) || blackListStore.has(key)) {
				if (Object.isCustomObject(target)) {
					return val;
				}

			} else if (Object.isCustomObject(target)) {
				const
					isArray = Object.isArray(target);

				let
					propFromProto = fromProto;

				if (isArray && String(Number(key)) === key) {
					key = Number(key);
				}

				if (propFromProto || !isArray && !Object.hasOwnProperty(target, <string>key)) {
					propFromProto = true;
				}

				const watchOpts = Object.assign(Object.create(opts!), {fromProto: propFromProto});
				return getProxyValue(val, key, path, handlers, root!, top, watchOpts);
			}

			return Object.isFunction(val) ? val.bind(target) : val;
		},

		set: (target, key, val, receiver) => {
			if (
				// tslint:disable-next-line:prefer-switch
				key === toOriginalObject ||
				key === toRootObject ||
				key === toTopObject ||
				key === watchHandlers ||
				key === watchPath
			) {
				return false;
			}

			const
				isArray = Object.isArray(target),
				isCustomObj = isArray || Object.isCustomObject(target),
				set = () => Reflect.set(target, key, val, isCustomObj ? receiver : target);

			if (Object.isSymbol(key) || root![muteLabel] || blackListStore.has(key)) {
				return set();
			}

			if (isArray && String(Number(key)) === key) {
				key = Number(key);
			}

			const
				oldVal = Reflect.get(target, key, isCustomObj ? receiver : target);

			if (oldVal !== val && set()) {
				if (!opts?.withProto && (fromProto || !isArray && !Object.hasOwnProperty(target, <string>key))) {
					return true;
				}

				for (let o = handlers.values(), el = o.next(); !el.done; el = o.next()) {
					const
						path = resolvedPath.concat(key);

					el.value(val, oldVal, {
						obj: unwrappedObj,
						root: root!,
						top,
						fromProto,
						path
					});
				}
			}

			return true;
		},

		deleteProperty: (target, key) => {
			if (Reflect.deleteProperty(target, key)) {
				if (root![muteLabel]) {
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

	const ref = Object.get(
		getOrCreateLabelValueByHandlers(unwrappedObj, toProxyObject, handlers) || unwrappedObj,
		refPath
	);

	const
		blackListStore = getOrCreateLabelValueByHandlers<Set<unknown>>(unwrappedObj, blackList, handlers);

	if (!Object.isDictionary(ref)) {
		const
			type = getProxyType(ref);

		switch (type) {
			case 'array':
				(<unknown[]>ref).splice(Number(prop), 1, value);
				break;

			case 'map':
				blackListStore?.delete(prop);
				(<Map<unknown, unknown>>ref).set(prop, value);
		}

		return;
	}

	const key = String(prop);
	blackListStore?.delete(key);
	ref[key] = value;
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
		getOrCreateLabelValueByHandlers(unwrappedObj, toProxyObject, handlers) || unwrappedObj,
		refPath
	);

	const
		blackListStore = getOrCreateLabelValueByHandlers<Set<unknown>>(unwrappedObj, blackList, handlers);

	if (!Object.isDictionary(ref)) {
		const
			type = getProxyType(ref);

		switch (type) {
			case 'array':
				(<unknown[]>ref).splice(Number(prop), 1);
				break;

			case 'map':
			case 'set':
				blackListStore?.delete(prop);
				(<Map<unknown, unknown>>ref).delete(prop);
		}

		return;
	}

	const key = String(prop);
	blackListStore?.delete(key);
	ref[key] = undefined;
}
