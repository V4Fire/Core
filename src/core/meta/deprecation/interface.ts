/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export type DeprecatedExprType =
	'function' |
	'method' |
	'property' |
	'constant' |
	'accessor';

export interface DeprecatedAlternativeOptions {
	/**
	 * Name of an alternative expression/function
	 */
	name: string;

	/**
	 * Source path of the alternative
	 */
	source?: string;
}

export type DeprecatedAlternative = string | DeprecatedAlternativeOptions;

export interface DeprecatedOptions {
	/**
	 * Name of an expression for wrapping
	 */
	name?: string;

	/**
	 * Type of an expression for wrapping
	 */
	type?: DeprecatedExprType;

	/**
	 * Indicates that an expression/function was renamed, but it interface still actual,
	 * the value contains a name after renaming
	 */
	renamedTo?: string;

	/**
	 * Indicates that an expression/function was moved to a different file, but it interface still actual,
	 * the value contains a source path after moving
	 */
	movedTo?: string;

	/**
	 * Name of an expression/function which should prefer to use instead the current
	 * or an object with additional options:
	 */
	alternative?: DeprecatedAlternative;

	/**
	 * Additional notice about deprecation
	 */
	notice?: string;
}

export interface InlineDeprecatedOptions extends DeprecatedOptions {
	/**
	 * Name of an expression for wrapping
	 */
	name: string;

	/**
	 * Type of an expression for wrapping
	 */
	type: DeprecatedExprType;
}
