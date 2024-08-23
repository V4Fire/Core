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

import type {

	Watcher,
	WatchPath,

	RawWatchHandler,
	WatchHandlersSet,

	WatchOptions,
	InternalWatchOptions

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
	handler: Nullable<RawWatchHandler>,
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

			unwatch(): void {
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
		proxy = getOrCreateLabelValueByHandlers<object>(unwrappedObj, toProxyObject, handlers);

	if (proxy) {
		return returnProxy(unwrappedObj, proxy);
	}

	if (getProxyType(unwrappedObj) == null) {
		return returnProxy(unwrappedObj);
	}

	const
		fromProto = Boolean(opts.fromProto),
		resolvedPath = path ?? [];

	const wrapOpts = {
		root: resolvedRoot,
		top,

		path: resolvedPath,
		originalPath: resolvedPath,

		fromProto,
		watchOpts: opts
	};

	if (Object.isArray(unwrappedObj)) {
		bindMutationHooks(unwrappedObj, wrapOpts, handlers);

		const arrayProxy = getOrCreateLabelValueByHandlers<unknown[]>(
			unwrappedObj,

			toProxyObject,
			handlers,

			unwrappedObj
		);

		proxy = arrayProxy;

		for (let i = 0; i < arrayProxy.length; i++) {
			arrayProxy[i] = getProxyValue(arrayProxy[i], i, path, handlers, resolvedRoot, top, opts);
		}

	} else if (Object.isDictionary(unwrappedObj)) {
		proxy = getOrCreateLabelValueByHandlers<object>(
			unwrappedObj,

			toProxyObject,
			handlers,

			() => Object.create(unwrappedObj)
		);

		// eslint-disable-next-line guard-for-in
		for (const key in unwrappedObj) {
			let
				propFromProto: boolean | 1 = fromProto;

			if (!Object.hasOwnProperty(unwrappedObj, key)) {
				propFromProto = !propFromProto ? 1 : true;

				if (Object.isTruly(opts.fromProto) && !opts.withProto) {
					continue;
				}
			}

			const watchOpts = Object.assign(Object.create(opts), {fromProto: propFromProto});
			setWatchAccessors(unwrappedObj, key, path, handlers, resolvedRoot, top, watchOpts);
		}

	} else {
		bindMutationHooks(unwrappedObj, wrapOpts, handlers);
		proxy = getOrCreateLabelValueByHandlers(unwrappedObj, toProxyObject, handlers, unwrappedObj);
	}

	Object.defineProperty(proxy, watchPath, {
		configurable: true,
		value: path
	});

	Object.defineProperty(proxy, watchHandlers, {
		configurable: true,
		value: handlers
	});

	Object.defineProperty(proxy, toRootObject, {
		configurable: true,
		value: resolvedRoot
	});

	Object.defineProperty(proxy, toTopObject, {
		configurable: true,
		value: top
	});

	Object.defineProperty(proxy, toOriginalObject, {
		configurable: true,
		value: unwrappedObj
	});

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

	if (unwrappedObj == null) {
		return;
	}

	const
		normalizedPath = Object.isArray(path) ? path : path.split('.'),
		prop = normalizedPath[normalizedPath.length - 1];

	const
		ctxPath = obj[watchPath] ?? [],
		refPath = Array.toArray(ctxPath.slice(1), normalizedPath.slice(0, -1)),
		fullRefPath = Array.toArray(ctxPath.slice(0, 1), refPath);

	if (normalizedPath.length > 1 && Object.get(unwrappedObj, refPath) == null) {
		Object.set(unwrappedObj, refPath, {}, {
			setter: (ref, key, val) => {
				if (ref == null || typeof ref !== 'object') {
					return;
				}

				ref[muteLabel] = true;
				set(ref, [key], val, handlers);
				ref[muteLabel] = false;
			}
		});
	}

	const
		proxy = getOrCreateLabelValueByHandlers<object>(unwrappedObj, toProxyObject, handlers);

	const
		root = proxy?.[toTopObject] ?? unwrappedObj,
		top = proxy?.[toTopObject] ?? unwrappedObj;

	const
		ref = Object.get<object>(top, refPath);

	if (ref == null) {
		throw new TypeError('Invalid data type to watch');
	}

	switch (getProxyType(ref)) {
		case 'set':
			throw new TypeError('Invalid data type to watch');

		case 'array':
			(<unknown[]>ref).splice(Number(prop), 1, value);
			break;

		case 'map':
			(<Map<unknown, unknown>>ref).set(prop, value);
			break;

		default: {
			const
				key = String(prop),
				hasPath = fullRefPath.length > 0;

			const
				resolvedPath = hasPath ? fullRefPath : undefined,
				resolvedRoot = hasPath ? root : unwrappedObj,
				resolvedTop = hasPath ? top : undefined;

			const
				refProxy = ref[toProxyObject]?.get(handlers) ?? Object.createDict();

			// eslint-disable-next-line @typescript-eslint/unbound-method
			if (!Object.isFunction(Object.getOwnPropertyDescriptor(refProxy, key)?.get)) {
				ref[key] = refProxy[key];
			}

			const resolvedProxy = setWatchAccessors(
				ref,
				key,

				resolvedPath,
				handlers,

				resolvedRoot,
				resolvedTop,

				{deep: true}
			);

			resolvedProxy[key] = value;
		}
	}
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
		ctxPath = obj[watchPath] ?? [],
		refPath = Array.toArray(ctxPath.slice(1), normalizedPath.slice(0, -1)),
		fullRefPath = Array.toArray(ctxPath.slice(0, 1), refPath);

	const
		proxy = getOrCreateLabelValueByHandlers<object>(unwrappedObj, toProxyObject, handlers),
		root = proxy?.[toTopObject] ?? unwrappedObj,
		top = proxy?.[toTopObject] ?? unwrappedObj;

	const
		ref = <object>Object.get(top, refPath),
		type = getProxyType(ref);

	switch (type) {
		case null:
			return;

		case 'array':
			(<unknown[]>ref).splice(Number(prop), 1);
			break;

		case 'map':
		case 'set':
			(<Map<unknown, unknown>>ref).delete(prop);
			break;

		default: {
			const
				key = String(prop);

			const
				hasPath = fullRefPath.length > 0,
				resolvedPath = hasPath ? fullRefPath : undefined,
				resolvedRoot = hasPath ? root : unwrappedObj,
				resolvedTop = hasPath ? top : undefined;

			const resolvedProxy = setWatchAccessors(
				ref,
				key,
				resolvedPath,
				handlers,
				resolvedRoot,
				resolvedTop,
				{deep: true}
			);

			resolvedProxy[key] = undefined;
			delete resolvedProxy[key];
		}
	}
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
			configurable: true,
			enumerable: true,

			get(): unknown {
				const
					val = obj[key];

				if (root[muteLabel] === true) {
					return val;
				}

				return getProxyValue(val, key, path, handlers, root, top, opts);
			},

			set(val: unknown): void {
				let
					fromProto = opts?.fromProto ?? false,
					oldVal = obj[key];

				val = unwrap(val) ?? val;
				oldVal = unwrap(oldVal) ?? oldVal;

				if (oldVal !== val) {
					try {
						obj[key] = val;

						if (root[muteLabel] === true) {
							return;
						}

						if (fromProto === 1) {
							fromProto = false;

							if (opts != null) {
								opts.fromProto = fromProto;
							}
						}

					} catch {
						return;
					}

					handlers.forEach((handler) => {
						const resolvedPath = Array.toArray(path ?? [], key);

						handler(val, oldVal, {
							obj,

							root,
							top,

							path: resolvedPath,
							fromProto: Boolean(fromProto)
						});
					});
				}
			}
		});
	}

	return proxy;
}
