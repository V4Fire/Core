/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Validation rules for a name
 */
export const name = {
	pattern: /^\w*$/,
	min: 2,
	max: 50
};

/**
 * Validation rules for a key
 */
export const key = {
	min: 1,
	max: 8
};

/**
 * Validation rules for a description
 */
export const description = {
	max: 200
};

/**
 * Validation rules for a comment
 */
export const comment = {
	max: 1e3
};

/**
 * Validation rules for a password
 */
export const password = {
	pattern: /^\w*$/,
	min: 6,
	max: 18
};
