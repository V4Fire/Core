/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { structureWrappers } from 'core/object/watch/wrap/const';
import { WrapOptions, WatchHandler } from 'core/object/watch/interface';

/**
 * Wraps mutation methods of the specified object that they be able to emit events about mutations
 *
 * @param obj
 * @param opts - additional options
 * @param handlers - set of callbacks that are invoked on every mutation hooks
 *
 * @example
 * ```js
 * const arr = bindMutationHooks([], (value, oldValue, path) => {
 *   console.log(value, oldValue, path);
 * });
 *
 * arr.push(1);
 * arr.push(2);
 * arr.push(3);
 * ```
 */
export function bindMutationHooks<T extends object>(obj: T, opts: WrapOptions, handlers: Map<WatchHandler, boolean>): T;

/**
 * Wraps mutation methods of the specified object that they be able to emit events about mutations
 *
 * @param obj
 * @param handlers - set of callbacks that are invoked on every mutation hooks
 */
export function bindMutationHooks<T extends object>(obj: T, handlers: Map<WatchHandler, boolean>): T;
export function bindMutationHooks<T extends object>(
	obj: T,
	optsOrHandlers: Map<WatchHandler, boolean> | WrapOptions,
	handlersOrOpts?: WrapOptions | Map<WatchHandler, boolean>
): T {
	let
		handlers: Map<WatchHandler, boolean>,
		opts;

	if (Object.isMap(handlersOrOpts)) {
		handlers = handlersOrOpts;
		opts = Object.isPlainObject(optsOrHandlers) ? optsOrHandlers : {};

	} else {
		handlers = Object.isMap(optsOrHandlers) ? optsOrHandlers : new Map();
		opts = {};
	}

	const wrappedCb = (args) => {
		if (!args) {
			return;
		}

		for (let i = 0; i < args.length; i++) {
			const
				a = args[i];

			for (let o = handlers.entries(), el = o.next(); !el.done; el = o.next()) {
				const
					[handler, state] = el.value;

				if (state) {
					handler(a[0], a[1], {
						obj,
						top: opts.top,
						isRoot: Boolean(opts.isRoot),
						path: a[2]
					});
				}
			}
		}
	};

	for (let i = 0, keys = Object.keys(structureWrappers); i < keys.length; i++) {
		const
			key = keys[i],
			el = structureWrappers[key];

		if (!el.is(obj)) {
			continue;
		}

		for (let keys = Object.keys(el.methods), i = 0; i < keys.length; i++) {
			const
				method = keys[i],
				getArgs = el.methods[method],
				original = obj[method];

			if (!getArgs) {
				continue;
			}

			Object.defineProperty(obj, method, {
				writable: true,
				configurable: true,
				value: (...args) => {
					wrappedCb(getArgs(obj, opts.path, ...args));
					return original.apply(obj, args);
				}
			});
		}

		break;
	}

	return obj;
}
