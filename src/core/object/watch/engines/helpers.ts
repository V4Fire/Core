/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { toOriginalObject } from 'core/object/watch/const';

import * as proxyEngine from 'core/object/watch/engines/proxy';
import * as accEngine from 'core/object/watch/engines/accessors';

import { WatchHandlersSet, InternalWatchOptions } from 'core/object/watch/interface';

/**
 * Unwraps the specified value to watch and returns a raw object to watch
 * @param value
 */
export function unwrap(value: unknown): CanUndef<object> {
	value = value && typeof value === 'object' && value![toOriginalObject] || value;
	return value && typeof value === 'object' && !Object.isFrozen(value) ? value! : undefined;
}

/**
 * Returns a type of data to watch or false
 * @param obj
 */
export function proxyType(obj: unknown): string | false {
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

	return false;
}

/**
 * Returns a value to poxy from the specified raw value
 *
 * @param rawValue
 * @param key - property key for a value
 * @param path - base path to object properties: it is provided to a watch handler with parameters
 * @param handlers - set of registered handlers
 * @param [top] - link a top property of watching
 * @param [opts] - additional options
 */
export function getProxyValue(
	rawValue: unknown,
	key: unknown,
	path: CanUndef<unknown[]>,
	handlers: WatchHandlersSet,
	top?: object,
	opts?: InternalWatchOptions
): unknown {
	if (opts?.fromProto && !opts.withProto) {
		return rawValue;
	}

	if (opts?.deep && proxyType(rawValue)) {
		const fullPath = (<unknown[]>[]).concat(path ?? [], key);
		return (typeof Proxy === 'function' ? proxyEngine : accEngine)
			.watch(<object>rawValue, fullPath, null, handlers, opts, top || <object>rawValue);
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
	const
		box = obj[label] = obj[label] || new WeakMap();

	let
		val = box.get(handlers);

	if (val === undefined && def !== undefined) {
		val = Object.isFunction(def) ? def() : def;
		box.set(handlers, val);
	}

	return val;
}
