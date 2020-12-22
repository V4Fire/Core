/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Returns true if the specified value is a container structure
 * @param value
 */
export function isContainer(value: unknown): boolean {
	if (!Object.isTruly(value) || typeof value !== 'object') {
		return false;
	}

	if (Object.isArray(value) || Object.isDictionary(value) || Object.isMap(value) || Object.isSet(value)) {
		return true;
	}

	return Object.isCustomObject((<any>value).constructor);
}

/**
 * Returns true if the specified value has a prototype that can be extended
 * @param value
 */
export function canExtendProto(value: unknown): boolean {
	if (!Object.isTruly(value) || typeof value !== 'object') {
		return false;
	}

	if (Object.isArray(value) || Object.isDictionary(value)) {
		return true;
	}

	return Object.isCustomObject((<any>value).constructor);
}

/**
 * Returns a type of the specified value
 * @param value
 */
export function getType(value: unknown): string {
	if (!Object.isTruly(value) || typeof value !== 'object') {
		return '';
	}

	if (Object.isMap(value)) {
		return 'map';
	}

	if (Object.isWeakMap(value)) {
		return 'weakMap';
	}

	if (Object.isSet(value)) {
		return 'set';
	}

	if (Object.isWeakSet(value)) {
		return 'weakSet';
	}

	if (Object.isGenerator(value)) {
		return 'generator';
	}

	if (Object.isArrayLike(value)) {
		return 'array';
	}

	if (Object.isIterator(value) || Object.isIterable(value)) {
		return 'iterator';
	}

	return 'object';
}

/**
 * Returns a new instance of the specified value or null
 * @param value
 */
export function getSameAs<T>(value: T): Nullable<T> {
	let
		res: any = null;

	if (value != null && typeof value === 'object') {
		if (Object.isArray(value)) {
			res = [];

		} else if (Object.isDictionary(value)) {
			if (Object.getPrototypeOf(value) == null) {
				res = Object.create(null);

			} else {
				res = {};
			}

		} else if (Object.isMap(value)) {
			res = new Map();

		} else if (Object.isSet(value)) {
			res = new Set();

		} else if (Object.isCustomObject((<any>value).constructor)) {
			res = {};
		}
	}

	return res;
}
