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

import { watchTargetLabel } from 'core/object/watch/const';

import * as proxyEngine from 'core/object/watch/engines/proxy';
import * as accEngine from 'core/object/watch/engines/accessors';

import { WatchPath, WatchOptions, WatchHandler, MultipleWatchHandler, Watcher } from 'core/object/watch/interface';

export * from 'core/object/watch/const';
export * from 'core/object/watch/interface';

/**
 * Watches for changes of the specified object
 *
 * @param obj
 * @param handler - callback that is invoked on every mutation hook
 */
export function watch<T extends object>(obj: T, handler: MultipleWatchHandler): Watcher<T>;

/**
 * Watches for changes of the specified object
 *
 * @param obj
 * @param opts - additional options
 * @param handler - callback that is invoked on every mutation hook
 */
export function watch<T extends object>(
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
export function watch<T extends object>(obj: T, opts: WatchOptions, handler: MultipleWatchHandler): Watcher<T>;

/**
 * Watches for changes of the specified object
 *
 * @param obj
 * @param path - path to a property to watch
 * @param handler - callback that is invoked on every mutation hook
 */
export function watch<T extends object>(
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
export function watch<T extends object>(
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
export function watch<T extends object>(
	obj: T,
	path: WatchPath,
	opts: WatchOptions,
	handler: MultipleWatchHandler
): Watcher<T>;

export function watch<T extends object>(
	obj: T,
	pathOptsOrHandler: WatchPath | WatchHandler | MultipleWatchHandler | WatchOptions,
	handlerOrOpts?: WatchHandler | MultipleWatchHandler | WatchOptions,
	optsOrHandler?: WatchOptions | WatchHandler | MultipleWatchHandler
): Watcher<T> {
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

	let
		deps = opts?.dependencies;

	if (deps) {
		deps = deps.slice();

		const
			convert = (dep) => Object.isArray(dep) ? dep : dep.split('.');

		for (let i = 0; i < deps.length; i++) {
			let
				dep = deps[i];

			if (Object.isArray(dep)) {
				dep = deps[i] = dep.slice();

				dep[0] = convert(dep[0]);
				dep[1] = convert(dep[1]);

			} else {
				deps[i] = convert(dep);
			}
		}
	}

	const
		deep = opts?.deep,
		immediate = opts?.immediate,
		collapse = normalizedPath ? opts?.collapse !== false : opts?.collapse;

	const
		pref = opts?.prefixes,
		post = opts?.postfixes;

	const needWrapHandler =
		!deep ||
		!immediate ||

		deps ||
		collapse ||
		normalizedPath;

	if (needWrapHandler) {
		const
			original = handler,
			NULL = {};

		let
			dynamicOldVal = NULL,
			argsQueue = <unknown[][]>[];

		handler = (val, oldVal, p) => {
			let
				dynamic = false;

			if (!deep && p.path.length > 1) {
				return;
			}

			const fireMutationEvent = (tiedPath?) => {
				const getArgs = () => {
					if (dynamic) {
						val = Object.get(obj, collapse ? tiedPath[0] : tiedPath);

						if (original.length < 2) {
							return [val, undefined, p];
						}

						const args = [val, dynamicOldVal === NULL ? undefined : dynamicOldVal, p];
						dynamicOldVal = val;

						return args;
					}

					if (collapse) {
						return [p.isRoot ? val : p.top, p.isRoot ? oldVal : p.top, p];
					}

					return [val, oldVal, p];
				};

				if (immediate) {
					original(...getArgs());

				} else {
					const
						needEventQueue = !tiedPath || !collapse;

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
					path = p.path.length > tiedPath.length ? p.path.slice(0, tiedPath.length) : p.path;

				path: for (let i = 0; i < path.length; i++) {
					const
						pathVal = path[i],
						normalizedPathVal = tiedPath[i];

					if (pathVal === normalizedPathVal) {
						continue;
					}

					if (pref) {
						for (let i = 0; i < pref.length; i++) {
							if (pathVal === pref[i] + normalizedPathVal) {
								dynamic = true;
								continue path;
							}
						}

					} else if (post) {
						for (let i = 0; i < post.length; i++) {
							if (pathVal === normalizedPathVal + post[i]) {
								dynamic = true;
								continue path;
							}
						}
					}

					if (Object.isArray(deps)) {
						deps: for (let i = 0; i < deps.length; i++) {
							const
								depPath = deps[i];

							if (!Object.isArray(depPath)) {
								continue;
							}

							const
								path = p.path.length > depPath.length ? p.path.slice(0, depPath.length) : p.path;

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

				fireMutationEvent(tiedPath);
			};

			if (normalizedPath) {
				checkTiedPath(normalizedPath, deps);
				return;
			}

			fireMutationEvent();

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
		res = (typeof Proxy === 'function' ? proxyEngine : accEngine).watch(obj, undefined, handler, opts),
		proxy = res.proxy;

	if (tiedWith && Object.isSimpleObject(proxy)) {
		tiedWith[watchTargetLabel] = proxy[watchTargetLabel];

		for (let keys = Object.keys(proxy), i = 0; i < keys.length; i++) {
			const
				key = keys[i];

			if (tiedWith.hasOwnProperty(key)) {
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
 */
export function set(obj: object, path: WatchPath, value: unknown): void {
	return (typeof Proxy === 'function' ? proxyEngine : accEngine).set(obj, path, value);
}

/**
 * Unsets a watchable value for an object by the specified path
 *
 * @param obj
 * @param path
 */
export function unset(obj: object, path: WatchPath): void {
	return (typeof Proxy === 'function' ? proxyEngine : accEngine).unset(obj, path);
}
