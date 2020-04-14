/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { structureWrappers } from 'core/object/watch/wrap/const';
import { WatchHandlersSet } from 'core/object/watch/interface';

import { WrapOptions } from 'core/object/watch/wrap/interface';
export * from 'core/object/watch/wrap/interface';

/**
 * Wraps mutation methods of the specified object that they be able to emit events about mutations
 *
 * @param obj
 * @param opts - additional options
 * @param handlers - set of callbacks that are invoked on every mutation hooks
 */
export function bindMutationHooks<T extends object>(obj: T, opts: WrapOptions, handlers: WatchHandlersSet): T;

/**
 * Wraps mutation methods of the specified object that they be able to emit events about mutations
 *
 * @param obj
 * @param handlers - set of callbacks that are invoked on every mutation hooks
 */
export function bindMutationHooks<T extends object>(obj: T, handlers: WatchHandlersSet): T;
export function bindMutationHooks<T extends object>(
	obj: T,
	optsOrHandlers: WatchHandlersSet | WrapOptions,
	handlersOrOpts?: WrapOptions | WatchHandlersSet
): T {
	let
		handlers: WatchHandlersSet,
		opts;

	if (Object.isSet(handlersOrOpts)) {
		handlers = handlersOrOpts;
		opts = Object.isPlainObject(optsOrHandlers) ? optsOrHandlers : {};

	} else {
		handlers = Object.isSet(optsOrHandlers) ? optsOrHandlers : new Set();
		opts = {};
	}

	const wrappedCb = (args) => {
		if (!args) {
			return;
		}

		for (let i = 0; i < args.length; i++) {
			const
				a = args[i];

			for (let o = handlers.values(), el = o.next(); !el.done; el = o.next()) {
				el.value(a[0], a[1], {
					obj,
					root: opts.root,
					top: opts.top,
					fromProto: Boolean(opts.fromProto),
					path: a[2]
				});
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
				methodName = keys[i],
				method = el.methods[methodName],
				original = obj[methodName];

			if (!method) {
				continue;
			}

			Object.defineProperty(obj, methodName, {
				writable: true,
				configurable: true,
				value: (...args) => {
					if (!handlers.size) {
						return original.apply(obj, args);
					}

					const wrapperOpts = {
						...opts,
						handlers,
						original
					};

					if (Object.isFunction(method)) {
						const
							newArgs = method(obj, wrapperOpts, ...args),
							res = original.apply(obj, args);

						wrappedCb(newArgs);
						return res;
					}

					if (method.type === 'get') {
						return method.value(obj, wrapperOpts, ...args);
					}

					return original.apply(obj, args);
				}
			});
		}

		break;
	}

	return obj;
}
