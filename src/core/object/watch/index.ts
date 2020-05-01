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

import watchEngine from 'core/object/watch/engines';

import { muteLabel, toOriginalObject, toRootObject, watchHandlers } from 'core/object/watch/const';
import { getProxyType, unwrap } from 'core/object/watch/engines/helpers';

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
 * @param [handler] - callback that is invoked on every mutation hook
 */
export default function watch<T extends object>(obj: T, handler?: MultipleWatchHandler): Watcher<T>;

/**
 * Watches for changes of the specified object
 *
 * @param obj
 * @param opts - additional options
 * @param [handler] - callback that is invoked on every mutation hook
 */
export default function watch<T extends object>(
	obj: T,
	opts: WatchOptions & {immediate: true},
	handler?: WatchHandler
): Watcher<T>;

/**
 * Watches for changes of the specified object
 *
 * @param obj
 * @param opts - additional options
 * @param [handler] - callback that is invoked on every mutation hook
 */
export default function watch<T extends object>(obj: T, opts: WatchOptions, handler?: MultipleWatchHandler): Watcher<T>;

/**
 * Watches for changes of the specified object
 *
 * @param obj
 * @param path - path to a property to watch
 * @param [handler] - callback that is invoked on every mutation hook
 */
export default function watch<T extends object>(
	obj: T,
	// tslint:disable-next-line:unified-signatures
	path: WatchPath,
	handler?: MultipleWatchHandler
): Watcher<T>;

/**
 * Watches for changes of the specified object
 *
 * @param obj
 * @param path - path to a property to watch
 * @param opts - additional options
 * @param [handler] - callback that is invoked on every mutation hook
 */
export default function watch<T extends object>(
	obj: T,
	path: WatchPath,
	opts: WatchOptions & ({immediate: true} | {collapse: true}),
	handler?: WatchHandler
): Watcher<T>;

/**
 * Watches for changes of the specified object
 *
 * @param obj
 * @param path - path to a property to watch
 * @param opts - additional options
 * @param [handler] - callback that is invoked on every mutation hook
 */
export default function watch<T extends object>(
	obj: T,
	path: WatchPath,
	opts: WatchOptions,
	handler?: MultipleWatchHandler
): Watcher<T>;

export default function watch<T extends object>(
	obj: T,
	pathOptsOrHandler?: WatchPath | WatchHandler | MultipleWatchHandler | WatchOptions,
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

	// Support for overloads of the function
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
		rawDeps = Object.size(opts?.dependencies) ? opts!.dependencies : undefined;

	let
		depsMap: Map<unknown[], unknown[][]>,
		localDeps: unknown[],
		deps: unknown[][][];

	// Normalize dependencies
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
			depsMap = new Map();

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
				Object.set(depsMap, path, localDeps);
			});

			if (depsMap.size) {
				const expandDeps = (deps) => {
					for (let i = 0; i < deps.length; i++) {
						const
							dep = Object.get(depsMap, deps[i]);

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
					localDeps = Object.get(depsMap, normalizedPath);
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

	const
		pathModifier = opts?.pathModifier,
		eventFilter = opts?.eventFilter;

	// If we have a handler and valid object to watch,
	// we need to wrap this handler to provide all features of watching
	if (handler && unwrappedObj) {
		const
			original = handler;

		let
			dynamicValStore,
			argsQueue = <unknown[][]>[];

		handler = (value, oldValue, info) => {
			const
				originalPath = info.path;

			if (pathModifier) {
				info = {...info, path: pathModifier(info.path)};
			}

			info.originalPath = originalPath;

			if (
				// We don't watch deep mutations
				!deep && info.path.length > (Object.isDictionary(info.obj) ? 1 : 2) ||

				// We don't watch prototype mutations
				!withProto && info.fromProto ||

				// The mutation was already fired
				eventFilter && !eventFilter(value, oldValue, info)
			) {
				return;
			}

			let
				cache;

			const fireMutationEvent = (tiedPath?, needGetVal = false) => {
				let
					resolvedInfo = info;

				// If we have a tied property with the property that have a mutation,
				// we need to register it
				if (tiedPath) {
					cache = cache || new Map();

					if (Object.get(cache, tiedPath)) {
						return;
					}

					Object.set(cache, tiedPath, true);
					resolvedInfo = {...info, path: tiedPath, parent: {value, oldValue, info}};
				}

				// Returns a list of attributes to the mutation handler
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
						const
							isRoot = resolvedInfo.obj === resolvedInfo.root;

						return [
							isRoot ? value : resolvedInfo.top,
							isRoot ? oldValue : resolvedInfo.top,
							resolvedInfo
						];
					}

					return [value, oldValue, resolvedInfo];
				};

				if (immediate) {
					original(...getArgs());

				// Deferred events
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

			// Takes a tied path and checks if it matches with the actual path
			const checkTiedPath = (tiedPath, deps) => {
				const
					path = info.path.length > tiedPath.length ? info.path.slice(0, tiedPath.length) : info.path;

				// The flag that indicates that we need to get a real property value from the original object.
				// It makes sense for getters.
				let dynamic = false;

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

							depsPath: for (let i = 0; i < path.length; i++) {
								const
									pathVal = path[i],
									depPathVal = depPath[i];

								if (pathVal === depPathVal) {
									dynamic = true;
									continue;
								}

								if (Object.isString(pathVal)) {
									if (pref) {
										for (let i = 0; i < pref.length; i++) {
											if (pathVal === pref[i] + depPathVal) {
												dynamic = true;
												continue depsPath;
											}
										}
									}

									if (post) {
										for (let i = 0; i < post.length; i++) {
											if (pathVal === depPathVal + post[i]) {
												dynamic = true;
												continue depsPath;
											}
										}
									}
								}

								continue deps;
							}

							break path;
						}
					}

					// The path doesn't match with a tied path
					return;
				}

				fireMutationEvent(tiedPath, dynamic);
			};

			// We watch only the one specified property
			if (normalizedPath) {
				checkTiedPath(normalizedPath, localDeps);
				return;
			}

			fireMutationEvent();

			// Check if the mutation matches by prefixes/postfixes with another properties
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

			// Check if the mutation matches by dependencies with another properties
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
		res = watchEngine.watch(obj, undefined, handler, obj[watchHandlers] || new Set(), opts),
		proxy = res.proxy;

	if (tiedWith && Object.isSimpleObject(unwrappedObj)) {
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
 * Mutes watching of changes from the specified object
 * @param obj
 */
export function mute(obj: object): boolean {
	const
		root = unwrap(obj[toRootObject] || obj);

	if (root) {
		root[muteLabel] = true;
		return true;
	}

	return false;
}

/**
 * Unmutes watching of changes from the specified object
 * @param obj
 */
export function unmute(obj: object): boolean {
	const
		root = unwrap(obj[toRootObject] || obj);

	if (root) {
		root[muteLabel] = false;
		return true;
	}

	return false;
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
	watchEngine.set(obj, path, value, handlers);
}

/**
 * Deletes a watchable value for an object by the specified path
 *
 * @param obj
 * @param path
 * @param [handlers] - set of registered handlers
 */
export function unset(obj: object, path: WatchPath, handlers: WatchHandlersSet = obj[watchHandlers]): void {
	watchEngine.unset(obj, path, handlers);
}
