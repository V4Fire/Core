/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import watchEngine from 'core/object/watch/engines';

import { toOriginalObject } from 'core/object/watch/const';
import type { WatchHandlersSet, InternalWatchOptions } from 'core/object/watch/interface';

/**
 * Returns true if the specified value is a watch proxy
 * @param value
 */
export function isProxy(value: unknown): value is object {
	if (value == null || typeof value !== 'object') {
		return false;
	}

	return toOriginalObject in value;
}

/**
 * Unwraps the specified value to watch and returns the raw object
 * @param value
 */
export function unwrap(value: unknown): CanUndef<object> {
	value = value != null && typeof value === 'object' && value[toOriginalObject] || value;
	return value != null && typeof value === 'object' && !Object.isFrozen(value) ? value : undefined;
}

/**
 * Returns a type of data to watch or false
 * @param obj
 */
export function getProxyType(obj: unknown): Nullable<string> {
	if (Object.isDictionary(obj)) {
		return 'dictionary';
	}

	if (Object.isArray(obj)) {
		return 'array';
	}

	if (Object.isMap(obj) || Object.isWeakMap(obj)) {
		return 'map';
	}

	if (Object.isSet(obj) || Object.isWeakSet(obj)) {
		return 'set';
	}

	return null;
}

/**
 * Returns a value to the proxy from the specified raw value
 *
 * @param rawValue
 * @param key - property key for a value
 * @param path - base path to object properties: it is provided to a watch handler with parameters
 * @param handlers - set of registered handlers
 * @param root - link to the root object of watching
 * @param [top] - link to the top object of watching
 * @param [opts] - additional options
 */
export function getProxyValue(
	rawValue: unknown,
	key: unknown,
	path: CanUndef<unknown[]>,
	handlers: WatchHandlersSet,
	root: object,
	top?: object,
	opts?: InternalWatchOptions
): unknown {
	if (opts == null) {
		return rawValue;
	}

	if (Object.isTruly(opts.fromProto) && !opts.withProto) {
		return rawValue;
	}

	if (opts.deep && getProxyType(rawValue) != null) {
		const
			fullPath = Array.toArray(path, key),
			obj = <object>rawValue;

		return (opts.engine ?? watchEngine).watch(obj, fullPath, null, handlers, opts, root, top ?? obj);
	}

	return rawValue;
}

/**
 * Returns a value from an object by the specified label and handlers
 *
 * @param obj
 * @param label
 * @param handlers
 */
export function getOrCreateLabelValueByHandlers<T = unknown>(
	obj: object,
	label: symbol | string,
	handlers: WatchHandlersSet
): CanUndef<T>;

/**
 * Returns a value from an object by the specified label and handlers
 *
 * @param obj
 * @param label
 * @param handlers
 * @param def - default value (can be declared as a function that will be invoked)
 */
export function getOrCreateLabelValueByHandlers<T = unknown>(
	obj: object,
	label: symbol | string,
	handlers: WatchHandlersSet,
	def: unknown
): T;

export function getOrCreateLabelValueByHandlers<T = unknown>(
	obj: object,
	label: symbol | string,
	handlers: WatchHandlersSet,
	def?: unknown
): T {
	let
		box = Object.hasOwnProperty(obj, label) ? obj[label] : null;

	if (box == null) {
		box = new WeakMap();
		Object.defineProperty(obj, label, {
			configurable: true,
			value: box
		});
	}

	let
		val = box.get(handlers);

	if (val === undefined && def !== undefined) {
		val = Object.isFunction(def) ? def() : def;
		box.set(handlers, val);
	}

	return val;
}
