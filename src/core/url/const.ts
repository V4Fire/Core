/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export const
	isAbsURL = /^(?:\w+:)?\/\//,
	isStrictAbsURL = /^\w+:\/\//;

export const
	startSlashesRgxp = /^\/+/,
	endSlashesRgxp = /\/+$/;

/**
 * Default function to filter query parameters to serialize with the `toQueryString` method
 * @param value
 */
export function defaultToQueryStringParamsFilter(value: unknown): boolean {
	return !(value == null || value === '' || (Object.isArray(value) && value.length === 0));
}
