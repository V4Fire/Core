/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { toProxyObject, toOriginalObject, watchOptions, watchHandlers, blackList } from 'core/object/watch/const';
import { bindMutationHooks } from 'core/object/watch/wrap';
import { unwrap, proxyType, getProxyValue } from 'core/object/watch/engines/helpers';
import {

	WatchPath,
	WatchHandler,
	WatchHandlersMap,
	WatchOptions,
	InternalWatchOptions,
	Watcher

} from 'core/object/watch/interface';

/**
 * Watches for changes of the specified object by using Proxy objects
 *
 * @param obj
 * @param path - base path to object properties: it is provided to a watch handler with parameters
 * @param cb - callback that is invoked on every mutation hook
 * @param [opts] - additional options
 */
export function watch<T>(
	obj: T,
	path: CanUndef<unknown[]>,
	cb: WatchHandler,
	opts?: WatchOptions
): Watcher<T>;

/**
 * Watches for changes of the specified object by using Proxy objects
 *
 * @param obj
 * @param path - base path to object properties: it is provided to a watch handler with parameters
 * @param cb - callback that is invoked on every mutation hook
 * @param [opts] - additional options
 * @param [top] - link a top property of watching
 * @param [handlers] - map of registered handlers
 */
export function watch<T>(
	obj: T,
	path: CanUndef<unknown[]>,
	cb: Nullable<WatchHandler>,
	opts: CanUndef<InternalWatchOptions>,
	top: object,
	handlers: WatchHandlersMap
): T;

export function watch<T>(
	obj: T,
	path: CanUndef<unknown[]>,
	cb: Nullable<WatchHandler>,
	opts?: InternalWatchOptions,
	top?: object,
	handlers?: WatchHandlersMap
): Watcher<T> | T {
	const
		unwrappedObj = unwrap(obj);

	if (unwrappedObj) {
		handlers = handlers || unwrappedObj[watchHandlers] || new Map();
	}

	const returnProxy = (obj, proxy?) => {
		if (proxy && cb && handlers && (!top || !handlers.has(cb))) {
			handlers.set(cb, true);
		}

		if (top) {
			return proxy || obj;
		}

		return {
			proxy: proxy || obj,
			unwatch(): void {
				if (cb && handlers) {
					handlers.set(cb, false);
				}
			}
		};
	};

	if (!unwrappedObj) {
		return returnProxy(obj);
	}

	if (!top) {
		handlers = unwrappedObj[watchHandlers] = handlers;

		const
			tmpOpts = unwrappedObj[watchOptions] = unwrappedObj[watchOptions] || {...opts};

		if (opts?.deep) {
			tmpOpts.deep = true;
		}

		opts = tmpOpts;
	}

	let
		proxy = unwrappedObj[toProxyObject];

	if (proxy) {
		return returnProxy(unwrappedObj, proxy);
	}

	if (!proxyType(unwrappedObj)) {
		return returnProxy(unwrappedObj);
	}

	const
		isRoot = path === undefined,
		fromProto = Boolean(opts?.fromProto);

	if (!Object.isDictionary(unwrappedObj) && !Object.isArray(unwrappedObj)) {
		const wrapOpts = {
			top,
			path,
			isRoot,
			fromProto,
			watchOpts: opts
		};

		bindMutationHooks(unwrappedObj, wrapOpts, handlers!);
	}

	const
		blackListStore = new Set();

	proxy = new Proxy(unwrappedObj, {
		get: (target, key, receiver) => {
			if (key === toOriginalObject) {
				return target;
			}

			const
				isArray = Object.isArray(target),
				isCustomObj = isArray || Object.isCustomObject(target),
				val = Reflect.get(target, key, isCustomObj ? receiver : target);

			if (Object.isSymbol(key) || blackListStore.has(key)) {
				return val;
			}

			if (isCustomObj) {
				let
					propFromProto = fromProto;

				if (isArray && String(Number(key)) === key) {
					key = Number(key);
				}

				if (propFromProto || !isArray && !Object.hasOwnProperty(target, <string>key)) {
					propFromProto = true;
				}

				return getProxyValue(val, key, path, handlers!, top, {...opts, fromProto: propFromProto});
			}

			return Object.isFunction(val) ? val.bind(target) : val;
		},

		set: (target, key, val, receiver) => {
			if (key === toOriginalObject) {
				return false;
			}

			const
				isArray = Object.isArray(target),
				isCustomObj = isArray || Object.isCustomObject(target),
				set = () => Reflect.set(target, key, val, isCustomObj ? receiver : target);

			if (Object.isSymbol(key) || blackListStore.has(key)) {
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

				for (let o = handlers!.entries(), el = o.next(); !el.done; el = o.next()) {
					const
						[handler, state] = el.value;

					if (state) {
						handler(val, oldVal, {
							obj: unwrappedObj,
							top,
							isRoot,
							fromProto,
							path: (<unknown[]>[]).concat(path ?? [], key)
						});
					}
				}
			}

			return true;
		},

		deleteProperty: (target, key) => {
			if (Reflect.deleteProperty(target, key)) {
				if (Object.isDictionary(target) || Object.isMap(target) || Object.isWeakMap(target)) {
					blackListStore.add(key);
				}

				return true;
			}

			return false;
		}
	});

	unwrappedObj[blackList] = blackListStore;
	unwrappedObj[toProxyObject] = proxy;

	return returnProxy(unwrappedObj, proxy);
}

/**
 * Sets a new watchable value for an object by the specified path
 *
 * @param obj
 * @param path
 * @param value
 */
export function set(obj: object, path: WatchPath, value: unknown): void {
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

	const
		ref = Object.get(unwrappedObj[toProxyObject] || unwrappedObj, refPath),
		blackListStore = (<CanUndef<Set<unknown>>>(<object>ref)[blackList]);

	if (!Object.isDictionary(ref)) {
		const
			type = proxyType(ref);

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
 * Unsets a watchable value for an object by the specified path
 *
 * @param obj
 * @param path
 */
export function unset(obj: object, path: WatchPath): void {
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

	const
		ref = Object.get(unwrappedObj[toProxyObject] || unwrappedObj, refPath),
		blackListStore = (<CanUndef<Set<unknown>>>(<object>ref)[blackList]);

	if (!Object.isDictionary(ref)) {
		const
			type = proxyType(ref);

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
