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

import { WatchHandler, WatchOptions } from 'core/object/watch/interface';

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
 * @param handlers - map of registered handlers
 * @param [top] - link a top property of watching
 * @param [opts] - additional options
 */
export function getProxyValue(
	rawValue: object,
	key: unknown,
	path: CanUndef<unknown[]>,
	handlers: Map<WatchHandler, boolean>,
	top?: object,
	opts?: WatchOptions
): unknown {
	if (opts?.deep && proxyType(rawValue)) {
		const fullPath = (<unknown[]>[]).concat(path ?? [], key);
		return (typeof Proxy === 'function' ? proxyEngine : accEngine)
			.watch(rawValue, fullPath, null, opts, top || rawValue, handlers);
	}

	return rawValue;
}
