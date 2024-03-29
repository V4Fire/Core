/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { getOrCreateLabelValueByHandlers } from 'core/object/watch/engines/helpers';

import { toProxyObject } from 'core/object/watch/const';
import { structureWrappers } from 'core/object/watch/wrap/const';

import type { WatchHandlersSet } from 'core/object/watch/interface';
import type { WrapOptions, WrapResult } from 'core/object/watch/wrap/interface';

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
		rawOpts: Nullable<WrapOptions>;

	if (Object.isSet(handlersOrOpts)) {
		handlers = handlersOrOpts;

		if (Object.isPlainObject(optsOrHandlers)) {
			rawOpts = optsOrHandlers;
		}

	} else {
		if (Object.isSet(optsOrHandlers)) {
			handlers = optsOrHandlers;

		} else {
			handlers = new Set();
		}

		if (Object.isPlainObject(handlersOrOpts)) {
			rawOpts = handlersOrOpts;
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (rawOpts == null) {
		throw new ReferenceError('Options of wrapping are not specified');
	}

	const
		opts = rawOpts;

	const wrappedCb = (args: Nullable<WrapResult>) => {
		if (args == null) {
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

		if (el == null || !el.is(obj, opts)) {
			continue;
		}

		const innerKeys = (<Array<string | symbol>>[]).concat(
			Object.keys(el.methods),
			Object.getOwnPropertySymbols(el.methods)
		);

		for (let i = 0; i < innerKeys.length; i++) {
			const
				methodName = innerKeys[i],
				method = el.methods[methodName],
				original = obj[methodName];

			if (method == null) {
				continue;
			}

			Object.defineProperty(obj, methodName, {
				writable: true,
				configurable: true,
				value: (...args) => {
					if (handlers.size === 0) {
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

						if (res === obj) {
							return getOrCreateLabelValueByHandlers<object>(obj, toProxyObject, handlers);
						}

						return res;
					}

					if (method.type === 'get') {
						return method.value(obj, wrapperOpts, ...args);
					}

					const
						res = original.apply(obj, args);

					if (res === obj) {
						return getOrCreateLabelValueByHandlers<object>(obj, toProxyObject, handlers);
					}

					return res;
				}
			});
		}

		break;
	}

	return obj;
}
