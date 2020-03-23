/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { toProxyObject, toOriginalObject, watchOptions, watchHandlers, blackList } from 'core/object/watch/const';
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
 * @param cb - callback that is invoked on every mutation hook
 * @param handlers - set of registered handlers
 * @param [opts] - additional options
 */
export function watch<T extends object>(
	obj: T,
	path: CanUndef<unknown[]>,
	cb: Nullable<WatchHandler>,
	handlers: WatchHandlersSet,
	opts?: WatchOptions
): Watcher<T>;

/**
 * Watches for changes of the specified object by using Proxy objects
 *
 * @param obj
 * @param path - base path to object properties: it is provided to a watch handler with parameters
 * @param cb - callback that is invoked on every mutation hook
 * @param handlers - set of registered handlers
 * @param [opts] - additional options
 * @param [top] - link a top property of watching
 */
export function watch<T extends object>(
	obj: T,
	path: CanUndef<unknown[]>,
	cb: Nullable<WatchHandler>,
	handlers: WatchHandlersSet,
	opts: CanUndef<InternalWatchOptions>,
	top: object
): T;

export function watch<T extends object>(
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

			unwatch: () => {
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
		proxy = getOrCreateLabelValueByHandlers(unwrappedObj, toProxyObject, handlers);

	if (proxy) {
		return returnProxy(unwrappedObj, proxy);
	}

	if (!getProxyType(unwrappedObj)) {
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

		bindMutationHooks(unwrappedObj, wrapOpts, handlers);
	}

	const
		blackListStore = new Set();

	proxy = new Proxy(unwrappedObj, {
		get: (target, key, receiver) => {
			if (key === toOriginalObject) {
				return target;
			}

			if (key === watchHandlers) {
				return handlers;
			}

			const
				isArray = Object.isArray(target),
				isCustomObj = isArray || Object.isCustomObject(target),
				val = Reflect.get(target, key, isCustomObj ? receiver : target);

			if (Object.isSymbol(key) || blackListStore.has(key)) {
				if (isCustomObj) {
					return val;
				}

			} else if (isCustomObj) {
				let
					propFromProto = fromProto;

				if (isArray && String(Number(key)) === key) {
					key = Number(key);
				}

				if (propFromProto || !isArray && !Object.hasOwnProperty(target, <string>key)) {
					propFromProto = true;
				}

				const watchOpts = Object.assign(Object.create(opts!), {fromProto: propFromProto});
				return getProxyValue(val, key, path, handlers, top, watchOpts);
			}

			return Object.isFunction(val) ? val.bind(target) : val;
		},

		set: (target, key, val, receiver) => {
			if (key === toOriginalObject || key === watchHandlers) {
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

				for (let o = handlers.values(), el = o.next(); !el.done; el = o.next()) {
					el.value(val, oldVal, {
						obj: unwrappedObj,
						top,
						isRoot,
						fromProto,
						path: (<unknown[]>[]).concat(path ?? [], key)
					});
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
 * @param handlers
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
