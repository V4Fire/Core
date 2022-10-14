/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import {

	isTruly,
	isDictionary,
	isSet,
	isMap,
	isArray,
	isCustomObject,
	isWeakMap,
	isWeakSet,
	cast,
	isArrayLike

} from 'core/prelude/types';

import type { GetTypeType } from 'core/prelude/object/interface';

/**
 * Returns true if the specified value is a container structure
 * @param value
 */
export function isContainer(value: unknown): boolean {
	if (!isTruly(value) || typeof value !== 'object') {
		return false;
	}

	if (isArray(value) || isDictionary(value) || isMap(value) || isSet(value)) {
		return true;
	}

	return isCustomObject(value!.constructor);
}

/**
 * Returns true if the specified value has a prototype that can be extended
 * @param value
 */
export function canExtendProto(value: unknown): boolean {
	if (!isTruly(value) || typeof value !== 'object') {
		return false;
	}

	if (isArray(value) || isDictionary(value)) {
		return true;
	}

	return isCustomObject(value!.constructor);
}

/**
 * Returns a type of the specified value
 * @param value
 */
export function getType(value: unknown): GetTypeType {
	if (value == null || typeof value !== 'object') {
		return '';
	}

	if (isArray(value)) {
		return 'array';
	}

	if (isArrayLike(value)) {
		return 'arrayLike';
	}

	if (isMap(value)) {
		return 'map';
	}

	if (isWeakMap(value)) {
		return 'weakMap';
	}

	if (isSet(value)) {
		return 'set';
	}

	if (isWeakSet(value)) {
		return 'weakSet';
	}

	return 'object';
}

/**
 * Returns a new instance of the specified value or null
 * @param value
 */
export function getSameAs<T>(value: T): Nullable<T> {
	let
		res: unknown = null;

	if (value != null && typeof value === 'object') {
		if (isArray(value)) {
			res = [];

		} else if (isDictionary(value)) {
			res = Object.getPrototypeOf(value) == null ? Object.create(null) : {};

		} else if (isMap(value)) {
			res = new Map();

		} else if (isSet(value)) {
			res = new Set();

		} else if (isCustomObject(cast<object>(value).constructor)) {
			res = {};
		}
	}

	return cast(res);
}
