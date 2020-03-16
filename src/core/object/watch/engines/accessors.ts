/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { toProxyObject, toOriginalObject, watchOptions, watchHandlers } from 'core/object/watch/const';
import { bindMutationHooks } from 'core/object/watch/wrap';
import { unwrap, proxyType, getProxyValue, getOrCreateLabelValueByHandlers } from 'core/object/watch/engines/helpers';
import {

	WatchPath,
	WatchHandler,
	WatchHandlersSet,
	WatchOptions,
	InternalWatchOptions,
	Watcher

} from 'core/object/watch/interface';

/**
 * Watches for changes of the specified object by using accessors
 *
 * @param obj
 * @param path - base path to object properties: it is provided to a watch handler with parameters
 * @param cb - callback that is invoked on every mutation hook
 * @param handlers - set of registered handlers
 * @param [opts] - additional options
 */
export function watch<T>(
	obj: T,
	path: CanUndef<unknown[]>,
	cb: Nullable<WatchHandler>,
	handlers: WatchHandlersSet,
	opts?: WatchOptions
): Watcher<T>;

/**
 * Watches for changes of the specified object by using accessors
 *
 * @param obj
 * @param path - base path to object properties: it is provided to a watch handler with parameters
 * @param cb - callback that is invoked on every mutation hook
 * @param handlers - set of registered handlers
 * @param [opts] - additional options
 * @param [top] - link a top property of watching
 */
export function watch<T>(
	obj: T,
	path: CanUndef<unknown[]>,
	cb: Nullable<WatchHandler>,
	handlers: WatchHandlersSet,
	opts: CanUndef<InternalWatchOptions>,
	top: object
): T;

export function watch<T>(
	obj: T,
	path: CanUndef<unknown[]>,
	cb: Nullable<WatchHandler>,
	handlers: WatchHandlersSet,
	opts?: InternalWatchOptions,
	top?: object
): Watcher<T> | T {
	const
		unwrappedObj = unwrap(obj);

	const returnProxy = (obj, proxy?) => {
		if (proxy && cb && handlers && (!top || !handlers.has(cb))) {
			handlers.add(cb);
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

			unwatch(): void {
				if (cb && handlers) {
					handlers.delete(cb);
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
		proxy = getOrCreateLabelValueByHandlers<object>(unwrappedObj, toProxyObject, handlers);

	if (proxy) {
		return returnProxy(unwrappedObj, proxy);
	}

	if (!proxyType(unwrappedObj)) {
		return returnProxy(unwrappedObj);
	}

	const
		isRoot = path === undefined,
		fromProto = Boolean(opts?.fromProto);

	const wrapOpts = {
		top,
		path,
		isRoot,
		fromProto,
		watchOpts: opts
	};

	if (Object.isArray(unwrappedObj)) {
		proxy = getOrCreateLabelValueByHandlers<unknown[]>(
			unwrappedObj,
			toProxyObject,
			handlers,
			unwrappedObj.slice()
		);

		bindMutationHooks(proxy, wrapOpts, handlers);

		for (let i = 0; i < (<unknown[]>proxy).length; i++) {
			proxy[i] = getProxyValue(proxy[i], i, path, handlers, top, opts);
		}

	} else if (Object.isDictionary(unwrappedObj)) {
		proxy = getOrCreateLabelValueByHandlers<object>(
			unwrappedObj,
			toProxyObject,
			handlers,
			Object.create(unwrappedObj)
		);

		for (const key in unwrappedObj) {
			let
				propFromProto: boolean | 1 = fromProto;

			if (!Object.hasOwnProperty(unwrappedObj, key)) {
				propFromProto = !propFromProto ? 1 : true;

				if (opts?.fromProto && !opts?.withProto) {
					continue;
				}
			}

			const watchOpts = Object.assign(Object.create(opts!), {fromProto: propFromProto});
			setWatchAccessors(unwrappedObj, key, path, handlers, top, watchOpts);
		}

	} else {
		proxy = bindMutationHooks(unwrappedObj, wrapOpts, handlers);
	}

	proxy[watchHandlers] = handlers;
	proxy[toOriginalObject] = unwrappedObj;

	return returnProxy(unwrappedObj, proxy);
}

/**
 * Sets a new watchable value for an object by the specified path
 *
 * @param obj
 * @param path
 * @param value
 * @param handlers
 */
export function set(obj: object, path: WatchPath, value: unknown, handlers: WatchHandlersSet): void {
	const
		unwrappedObj = unwrap(obj);

	if (!unwrappedObj) {
		return;
	}

	const
		normalizedPath = Object.isArray(path) ? path : path.split('.'),
		prop = normalizedPath[normalizedPath.length - 1],
		refPath = normalizedPath.slice(0, -1);

	const ref = Object.get(
		getOrCreateLabelValueByHandlers(unwrappedObj, toProxyObject, handlers) || unwrappedObj,
		refPath
	);

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
		unwrappedObj[key] = value;
		return;
	}

	const proxy = setWatchAccessors(unwrappedObj, key, top && refPath, handlers, top, {deep: true});
	proxy[key] = value;
}

/**
 * Unsets a watchable value for an object by the specified path
 *
 * @param obj
 * @param path
 * @param handlers
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

	const proxy = setWatchAccessors(unwrappedObj, key, top && refPath, handlers, top, {deep: true});
	proxy[key] = undefined;
}

/**
 * Sets a pair of accessors to watch the specified property and returns a proxy object
 *
 * @param obj - object to watch
 * @param key - property key to watch
 * @param path - path to the object to watch from the root object
 * @param handlers - set of registered handlers
 * @param top - link a top property of watching
 * @param [opts] - additional watch options
 */
export function setWatchAccessors(
	obj: object,
	key: string,
	path: CanUndef<unknown[]>,
	handlers: WatchHandlersSet,
	top?: object,
	opts?: InternalWatchOptions
): Dictionary {
	const proxy = getOrCreateLabelValueByHandlers<Dictionary>(
		obj,
		toProxyObject,
		handlers,
		Object.create(obj)
	);

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
				let
					fromProto = opts?.fromProto || false;

				const
					oldVal = obj[key];

				if (oldVal !== val) {
					try {
						obj[key] = val;

						if (fromProto === 1) {
							fromProto = opts!.fromProto = false;
						}

					} catch {
						return;
					}

					for (let o = handlers.values(), el = o.next(); !el.done; el = o.next()) {
						el.value(val, oldVal, {
							obj,
							top,
							isRoot,
							fromProto,
							path: (<unknown[]>[]).concat(path ?? [], key)
						});
					}
				}
			}
		});
	}

	return proxy;
}
