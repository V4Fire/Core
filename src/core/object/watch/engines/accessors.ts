/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { toProxyObject, toOriginalObject, watchOptions, watchHandlers } from 'core/object/watch/const';
import { bindMutationHooks } from 'core/object/watch/wrap';
import { unwrap, proxyType, getProxyValue } from 'core/object/watch/engines/helpers';
import { WatchPath, WatchHandler, WatchHandlersMap, WatchOptions, Watcher } from 'core/object/watch/interface';

/**
 * Watches for changes of the specified object by using accessors
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
 * Watches for changes of the specified object by using accessors
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
	opts: CanUndef<WatchOptions>,
	top: object,
	handlers: WatchHandlersMap
): T;

export function watch<T>(
	obj: T,
	path: CanUndef<unknown[]>,
	cb: Nullable<WatchHandler>,
	opts?: WatchOptions,
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

	const wrapOpts = {
		top,
		path,
		isRoot: path === undefined,
		watchOpts: opts
	};

	if (Object.isArray(unwrappedObj)) {
		const proxy = unwrappedObj[toProxyObject] = unwrappedObj[toProxyObject] || unwrappedObj.slice();
		bindMutationHooks(proxy, wrapOpts, handlers!);

		for (let i = 0; i < proxy.length; i++) {
			proxy[i] = getProxyValue(proxy[i], i, path, handlers!, top, opts);
		}

		proxy[toOriginalObject] = unwrappedObj;
		return returnProxy(unwrappedObj, proxy);
	}

	if (Object.isDictionary(unwrappedObj)) {
		for (let keys = Object.keys(unwrappedObj), i = 0; i < keys.length; i++) {
			proxy = setWatchAccessors(unwrappedObj, keys[i], path, handlers!, top, opts);
		}

		proxy[toOriginalObject] = unwrappedObj;
		return returnProxy(unwrappedObj, proxy);
	}

	bindMutationHooks(unwrappedObj, wrapOpts, handlers!);
	return returnProxy(unwrappedObj, unwrappedObj);
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
		rObj = unwrap(obj);

	if (!rObj) {
		return;
	}

	const
		normalizedPath = Object.isArray(path) ? path : path.split('.'),
		prop = normalizedPath[normalizedPath.length - 1],
		refPath = normalizedPath.slice(0, -1);

	const
		handlers = rObj[watchHandlers],
		ref = Object.get(rObj[toProxyObject] || rObj, refPath);

	if (!Object.isDictionary(ref)) {
		const
			type = proxyType(ref);

		switch (type) {
			case 'array':
				(<unknown[]>ref).splice(Number(prop), 1, value);
				break;

			case 'map':
				(<Map<unknown, unknown>>ref).set(prop, value);
		}

		return;
	}

	const
		key = String(prop),
		top = refPath.length ? ref : undefined;

	if (!handlers) {
		rObj[key] = value;
		return;
	}

	setWatchAccessors(ref, key, top && refPath, handlers, top, {deep: true})[key] = value;
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
		handlers = unwrappedObj[watchHandlers],
		ref = Object.get(unwrappedObj[toProxyObject] || unwrappedObj, refPath);

	if (!Object.isDictionary(ref)) {
		const
			type = proxyType(ref);

		switch (type) {
			case 'array':
				(<unknown[]>ref).splice(Number(prop), 1);
				break;

			case 'map':
			case 'set':
				(<Map<unknown, unknown>>ref).delete(prop);
		}

		return;
	}

	const
		key = String(prop),
		top = refPath.length ? ref : undefined;

	if (!handlers) {
		delete unwrappedObj[key];
		return;
	}

	const proxy = setWatchAccessors(ref, key, top && refPath, handlers, top, {deep: true});
	proxy[key] = undefined;
}

/**
 * Sets a pair of accessors to watch the specified property and returns a proxy object
 *
 * @param obj - object to watch
 * @param key - property key to watch
 * @param path - path to the object to watch from the root object
 * @param handlers - map of registered handlers
 * @param top - link a top property of watching
 * @param [opts] - additional watch options
 */
export function setWatchAccessors(
	obj: object,
	key: string,
	path: CanUndef<unknown[]>,
	handlers: WatchHandlersMap,
	top?: object,
	opts?: WatchOptions
): Dictionary {
	const
		proxy = obj[toProxyObject] = obj[toProxyObject] || Object.create(obj);

	const
		isRoot = path === undefined,
		descriptors = Object.getOwnPropertyDescriptor(obj, key);

	if (!descriptors || descriptors.configurable) {
		Object.defineProperty(proxy, key, {
			enumerable: true,
			configurable: true,

			get(): unknown {
				return getProxyValue(obj[key], key, path, handlers, top, opts);
			},

			set(val: unknown): void {
				const
					oldVal = obj[key];

				if (oldVal !== val) {
					try {
						obj[key] = val;

					} catch {
						return;
					}

					for (let o = handlers.entries(), el = o.next(); !el.done; el = o.next()) {
						const
							[handler, state] = el.value;

						if (state) {
							handler(val, oldVal, {
								obj,
								top,
								isRoot,
								path: (<unknown[]>[]).concat(path ?? [], key)
							});
						}
					}
				}
			}
		});
	}

	return proxy;
}
