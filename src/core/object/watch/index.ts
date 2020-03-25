/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/object/watch/README.md]]
 * @packageDocumentation
 */

import { toOriginalObject, watchHandlers } from 'core/object/watch/const';
import { getProxyType, unwrap } from 'core/object/watch/engines/helpers';

import * as proxyEngine from 'core/object/watch/engines/proxy';
import * as accEngine from 'core/object/watch/engines/accessors';

import {

	WatchPath,
	WatchOptions,

	WatchHandler,
	MultipleWatchHandler,

	Watcher,
	WatchHandlersSet

} from 'core/object/watch/interface';

export * from 'core/object/watch/const';
export { unwrap, getProxyType } from 'core/object/watch/engines/helpers';
export * from 'core/object/watch/interface';

/**
 * Watches for changes of the specified object
 *
 * @param obj
 * @param handler - callback that is invoked on every mutation hook
 */
export default function watch<T extends object>(obj: T, handler: MultipleWatchHandler): Watcher<T>;

/**
 * Watches for changes of the specified object
 *
 * @param obj
 * @param opts - additional options
 * @param handler - callback that is invoked on every mutation hook
 */
export default function watch<T extends object>(
	obj: T,
	opts: WatchOptions & ({immediate: true} | {collapse: true}),
	handler: WatchHandler
): Watcher<T>;

/**
 * Watches for changes of the specified object
 *
 * @param obj
 * @param opts - additional options
 * @param handler - callback that is invoked on every mutation hook
 */
export default function watch<T extends object>(obj: T, opts: WatchOptions, handler: MultipleWatchHandler): Watcher<T>;

/**
 * Watches for changes of the specified object
 *
 * @param obj
 * @param path - path to a property to watch
 * @param handler - callback that is invoked on every mutation hook
 */
export default function watch<T extends object>(
	obj: T,
	// tslint:disable-next-line:unified-signatures
	path: WatchPath,
	handler: MultipleWatchHandler
): Watcher<T>;

/**
 * Watches for changes of the specified object
 *
 * @param obj
 * @param path - path to a property to watch
 * @param opts - additional options
 * @param handler - callback that is invoked on every mutation hook
 */
export default function watch<T extends object>(
	obj: T,
	path: WatchPath,
	opts: WatchOptions & ({immediate: true} | {collapse: true}),
	handler: WatchHandler
): Watcher<T>;

/**
 * Watches for changes of the specified object
 *
 * @param obj
 * @param path - path to a property to watch
 * @param opts - additional options
 * @param handler - callback that is invoked on every mutation hook
 */
export default function watch<T extends object>(
	obj: T,
	path: WatchPath,
	opts: WatchOptions,
	handler: MultipleWatchHandler
): Watcher<T>;

export default function watch<T extends object>(
	obj: T,
	pathOptsOrHandler: WatchPath | WatchHandler | MultipleWatchHandler | WatchOptions,
	handlerOrOpts?: WatchHandler | MultipleWatchHandler | WatchOptions,
	optsOrHandler?: WatchOptions | WatchHandler | MultipleWatchHandler
): Watcher<T> {
	const
		unwrappedObj = unwrap(obj);

	let
		handler,
		opts: CanUndef<WatchOptions>;

	let
		timer,
		normalizedPath;

	if (Object.isString(pathOptsOrHandler) || Object.isArray(pathOptsOrHandler)) {
		normalizedPath = Object.isArray(pathOptsOrHandler) ? pathOptsOrHandler : pathOptsOrHandler.split('.');

		if (Object.isFunction(handlerOrOpts)) {
			handler = handlerOrOpts;

		} else {
			opts = handlerOrOpts;
			handler = optsOrHandler;
		}

	} else if (Object.isFunction(pathOptsOrHandler)) {
		handler = pathOptsOrHandler;

	} else {
		opts = pathOptsOrHandler;
		handler = handlerOrOpts;
	}

	const
		rawDeps = opts?.dependencies;

	let
		localDeps: unknown[],
		deps: unknown[][][];

	if (rawDeps && unwrappedObj) {
		const
			convert = (dep) => Object.isArray(dep) ? dep : dep.split('.');

		if (Object.isArray(rawDeps)) {
			localDeps = [];

			if (normalizedPath) {
				for (let i = 0; i < rawDeps.length; i++) {
					localDeps.push(convert(rawDeps[i]));
				}
			}

		} else {
			deps = [];

			const
				map = new Map();

			Object.forEach(rawDeps, (dep, key) => {
				if (!Object.isArray(dep)) {
					throw new TypeError('Invalid format of dependencies');
				}

				let
					localDeps;

				if (Object.isArray(dep)) {
					localDeps = dep.slice();

					for (let i = 0; i < localDeps.length; i++) {
						localDeps[i] = convert(localDeps[i]);
					}

				} else {
					localDeps = [convert(dep)];
				}

				const
					path = convert(key);

				deps.push([path, localDeps]);
				Object.set(map, path, localDeps);
			});

			if (map.size) {
				const expandDeps = (deps) => {
					for (let i = 0; i < deps.length; i++) {
						const
							dep = Object.get(map, deps[i]);

						if (dep) {
							deps.splice(i, 1, ...expandDeps(dep));
						}
					}

					return deps;
				};

				for (let i = 0; i < deps.length; i++) {
					expandDeps(deps[i][1]);
				}

				if (normalizedPath) {
					localDeps = Object.get(map, normalizedPath);
				}
			}
		}
	}

	const
		deep = normalizedPath?.length > 1 || opts?.deep,
		withProto = opts?.withProto,
		immediate = opts?.immediate,
		collapse = normalizedPath ? opts?.collapse !== false : opts?.collapse;

	const
		pref = opts?.prefixes,
		post = opts?.postfixes;

	const needWrapHandler = Boolean(unwrappedObj && (
		!deep ||
		!immediate ||

		rawDeps ||
		collapse ||
		normalizedPath
	));

	if (needWrapHandler) {
		const
			original = handler;

		let
			dynamicValStore,
			argsQueue = <unknown[][]>[];

		handler = (value, oldValue, info) => {
			if (!deep && info.path.length > (Object.isDictionary(info.obj) ? 1 : 2) || !withProto && info.fromProto) {
				return;
			}

			let
				cache;

			const fireMutationEvent = (tiedPath?, needGetVal = false) => {
				let
					resolvedInfo = info;

				if (tiedPath) {
					cache = cache || new Map();

					if (Object.get(cache, tiedPath)) {
						return;
					}

					Object.set(cache, tiedPath, true);
					resolvedInfo = {...info, path: tiedPath, parent: {value, oldValue, info}};
				}

				const getArgs = () => {
					if (needGetVal) {
						const
							dynamicVal = Object.get(unwrappedObj, collapse ? tiedPath[0] : tiedPath);

						if (original.length < 2) {
							return [dynamicVal, undefined, resolvedInfo];
						}

						dynamicValStore = dynamicValStore || new Map();

						const args = [
							dynamicVal,
							Object.get(dynamicValStore, resolvedInfo.path),
							resolvedInfo
						];

						Object.set(dynamicValStore, resolvedInfo.path, dynamicVal);
						return args;
					}

					if (collapse) {
						return [
							resolvedInfo.isRoot ? value : resolvedInfo.top,
							resolvedInfo.isRoot ? oldValue : resolvedInfo.top,
							resolvedInfo
						];
					}

					return [value, oldValue, resolvedInfo];
				};

				if (immediate) {
					original(...getArgs());

				} else {
					const
						needEventQueue = !normalizedPath;

					if (needEventQueue) {
						argsQueue.push(getArgs());

					} else {
						argsQueue = getArgs();
					}

					if (!timer) {
						// tslint:disable-next-line:no-string-literal
						timer = globalThis['setImmediate'](() => {
							timer = undefined;

							try {
								if (needEventQueue) {
									original(argsQueue);

								} else {
									original(...argsQueue);
								}

							} finally {
								argsQueue = [];
							}
						});
					}
				}
			};

			const checkTiedPath = (tiedPath, deps) => {
				const
					path = info.path.length > tiedPath.length ? info.path.slice(0, tiedPath.length) : info.path;

				let
					dynamic = false;

				path: for (let i = 0; i < path.length; i++) {
					const
						pathVal = path[i],
						tiedPathVal = tiedPath[i];

					if (pathVal === tiedPathVal) {
						continue;
					}

					if (Object.isString(pathVal)) {
						if (pref) {
							for (let i = 0; i < pref.length; i++) {
								if (pathVal === pref[i] + tiedPathVal) {
									dynamic = true;
									continue path;
								}
							}
						}

						if (post) {
							for (let i = 0; i < post.length; i++) {
								if (pathVal === tiedPathVal + post[i]) {
									dynamic = true;
									continue path;
								}
							}
						}
					}

					if (deps) {
						deps: for (let i = 0; i < deps.length; i++) {
							const
								depPath = deps[i];

							if (!Object.isArray(depPath)) {
								continue;
							}

							const
								path = info.path.length > depPath.length ? info.path.slice(0, depPath.length) : info.path;

							for (let i = 0; i < path.length; i++) {
								if (path[i] === depPath[i]) {
									dynamic = true;
									continue;
								}

								continue deps;
							}

							break path;
						}
					}

					return;
				}

				fireMutationEvent(tiedPath, dynamic);
			};

			if (normalizedPath) {
				checkTiedPath(normalizedPath, localDeps);
				return;
			}

			fireMutationEvent();

			if (pref || post) {
				const
					tiedPath = <unknown[]>[];

				let
					dynamic = false;

				path: for (let i = 0; i < info.path.length; i++) {
					const
						pathVal = info.path[i];

					if (Object.isString(pathVal)) {
						if (pref) {
							for (let i = 0; i < pref.length; i++) {
								const
									prefVal = pref[i];

								if (pathVal.slice(0, prefVal.length) === prefVal) {
									dynamic = true;
									tiedPath.push(pathVal.slice(prefVal.length));
									continue path;
								}
							}
						}

						if (post) {
							for (let i = 0; i < post.length; i++) {
								const
									postVal = post[i];

								if (pathVal.slice(-postVal.length) === postVal) {
									dynamic = true;
									tiedPath.push(pathVal.slice(0, -postVal.length));
									continue path;
								}
							}
						}

						tiedPath.push(pathVal);
					}
				}

				if (dynamic) {
					fireMutationEvent(tiedPath, true);
				}
			}

			if (deps) {
				for (let i = 0; i < deps.length; i++) {
					const dep = deps[i];
					checkTiedPath(dep[0], dep[1]);
				}
			}
		};
	}

	const
		tiedWith = opts?.tiedWith,
		engine = typeof Proxy === 'function' ? proxyEngine : accEngine;

	const
		res = engine.watch(obj, undefined, handler, obj[watchHandlers] || new Set(), opts),
		proxy = res.proxy;

	if (tiedWith && Object.isSimpleObject(proxy)) {
		tiedWith[watchHandlers] = proxy[watchHandlers];
		tiedWith[toOriginalObject] = proxy[toOriginalObject];

		for (let keys = Object.keys(proxy), i = 0; i < keys.length; i++) {
			const
				key = keys[i];

			if (Object.hasOwnProperty(tiedWith, key)) {
				continue;
			}

			Object.defineProperty(tiedWith, key, {
				enumerable: true,
				configurable: true,

				get(): unknown {
					return proxy[key];
				},

				set(val: unknown): void {
					proxy[key] = val;
				}
			});
		}
	}

	return res;
}

/**
 * Sets a new watchable value for an object by the specified path
 *
 * @param obj
 * @param path
 * @param value
 * @param [handlers] - set of registered handlers
 */
export function set(
	obj: object,
	path: WatchPath,
	value: unknown,
	handlers: WatchHandlersSet = obj[watchHandlers]
): void {
	(typeof Proxy === 'function' ? proxyEngine : accEngine).set(obj, path, value, handlers);
}

/**
 * Deletes a watchable value for an object by the specified path
 *
 * @param obj
 * @param path
 * @param [handlers] - set of registered handlers
 */
export function unset(obj: object, path: WatchPath, handlers: WatchHandlersSet = obj[watchHandlers]): void {
	(typeof Proxy === 'function' ? proxyEngine : accEngine).unset(obj, path, handlers);
}
