/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import {

	muteLabel,

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
 * Watches for changes of the specified object by using accessors
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
 * Watches for changes of the specified object by using accessors
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

			unwatch(): void {
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
		proxy = getOrCreateLabelValueByHandlers<object>(unwrappedObj, toProxyObject, handlers);

	if (proxy) {
		return returnProxy(unwrappedObj, proxy);
	}

	if (!getProxyType(unwrappedObj)) {
		return returnProxy(unwrappedObj);
	}

	const
		fromProto = Boolean(opts?.fromProto),
		resolvedPath = path || [];

	const wrapOpts = {
		root: root!,
		top,
		path: resolvedPath,
		originalPath: resolvedPath,
		fromProto,
		watchOpts: opts
	};

	if (Object.isArray(unwrappedObj)) {
		bindMutationHooks(unwrappedObj, wrapOpts, handlers);

		proxy = getOrCreateLabelValueByHandlers<unknown[]>(
			unwrappedObj,
			toProxyObject,
			handlers,
			() => unwrappedObj.slice()
		);

		for (let i = 0; i < (<unknown[]>proxy).length; i++) {
			proxy[i] = getProxyValue(proxy[i], i, path, handlers, root!, top, opts);
		}

	} else if (Object.isDictionary(unwrappedObj)) {
		proxy = getOrCreateLabelValueByHandlers<object>(
			unwrappedObj,
			toProxyObject,
			handlers,
			() => Object.create(unwrappedObj)
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
			setWatchAccessors(unwrappedObj, key, path, handlers, root!, top, watchOpts);
		}

	} else {
		bindMutationHooks(unwrappedObj, wrapOpts, handlers);

		proxy = getOrCreateLabelValueByHandlers<unknown[]>(
			unwrappedObj,
			toProxyObject,
			handlers,
			unwrappedObj
		);
	}

	proxy[watchPath] = path;
	proxy[watchHandlers] = handlers;
	proxy[toRootObject] = root;
	proxy[toTopObject] = top;
	proxy[toOriginalObject] = unwrappedObj;

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
		normalizedPath = <string[]>(Object.isArray(path) ? path : path.split('.')),
		prop = normalizedPath[normalizedPath.length - 1];

	const
		ctxPath = obj[watchPath] || [],
		refPath = Array.concat([], ctxPath.slice(1), normalizedPath.slice(0, -1)),
		fullRefPath = Array.concat([], ctxPath.slice(0, 1), refPath);

	const
		proxy = getOrCreateLabelValueByHandlers<object>(unwrappedObj, toProxyObject, handlers),
		root = proxy?.[toTopObject] || unwrappedObj,
		top = proxy?.[toTopObject] || unwrappedObj;

	const
		ref = Object.get(top, refPath);

	if (!Object.isDictionary(ref)) {
		const
			type = getProxyType(ref);

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
		key = String(prop);

	if (!handlers) {
		unwrappedObj[key] = value;
		return;
	}

	const
		hasPath = fullRefPath.length > 0,
		resolvedPath = hasPath ? fullRefPath : undefined,
		resolvedRoot = hasPath ? root : obj,
		resolvedTop = hasPath ? top : undefined;

	const resolvedProxy = setWatchAccessors(
		unwrappedObj,
		key,
		resolvedPath,
		handlers,
		resolvedRoot,
		resolvedTop,
		{deep: true}
	);

	resolvedProxy[key] = value;
}

/**
 * Unsets a watchable value for an object by the specified path
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
		normalizedPath = <string[]>(Object.isArray(path) ? path : path.split('.')),
		prop = normalizedPath[normalizedPath.length - 1];

	const
		ctxPath = obj[watchPath] || [],
		refPath = Array.concat([], ctxPath.slice(1), normalizedPath.slice(0, -1)),
		fullRefPath = Array.concat([], ctxPath.slice(0, 1), refPath);

	const
		proxy = getOrCreateLabelValueByHandlers<object>(unwrappedObj, toProxyObject, handlers),
		root = proxy?.[toTopObject] || unwrappedObj,
		top = proxy?.[toTopObject] || unwrappedObj;

	const
		ref = Object.get(top, refPath);

	if (!Object.isDictionary(ref)) {
		const
			type = getProxyType(ref);

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
		key = String(prop);

	if (!handlers) {
		delete unwrappedObj[key];
		return;
	}

	const
		hasPath = fullRefPath.length > 0,
		resolvedPath = hasPath ? fullRefPath : undefined,
		resolvedRoot = hasPath ? root : obj,
		resolvedTop = hasPath ? top : undefined;

	const resolvedProxy = setWatchAccessors(
		unwrappedObj,
		key,
		resolvedPath,
		handlers,
		resolvedRoot,
		resolvedTop,
		{deep: true}
	);

	resolvedProxy[key] = undefined;
}

/**
 * Sets a pair of accessors to watch the specified property and returns a proxy object
 *
 * @param obj - object to watch
 * @param key - property key to watch
 * @param path - path to the object to watch from the root object
 * @param handlers - set of registered handlers
 * @param root - link to the root object of watching
 * @param [top] - link to the top object of watching
 * @param [opts] - additional watch options
 */
export function setWatchAccessors(
	obj: object,
	key: string,
	path: CanUndef<unknown[]>,
	handlers: WatchHandlersSet,
	root: object,
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
		descriptors = Object.getOwnPropertyDescriptor(obj, key);

	if (!descriptors || descriptors.configurable) {
			Object.defineProperty(proxy, key, {
			enumerable: true,
			configurable: true,

			get(): unknown {
				const
					val = obj[key];

				if (root[muteLabel]) {
					return val;
				}

				return getProxyValue(val, key, path, handlers, root, top, opts);
			},

			set(val: unknown): void {
				let
					fromProto = opts?.fromProto || false;

				const
					oldVal = obj[key];

				if (oldVal !== val) {
					try {
						obj[key] = val;

						if (root[muteLabel]) {
							return;
						}

						if (fromProto === 1) {
							fromProto = opts!.fromProto = false;
						}

					} catch {
						return;
					}

					for (let o = handlers.values(), el = o.next(); !el.done; el = o.next()) {
						const
							resolvedPath = Array.concat([], path ?? [], key);

						el.value(val, oldVal, {
							obj,
							root,
							top,
							fromProto,
							path: resolvedPath
						});
					}
				}
			}
		});
	}

	return proxy;
}
