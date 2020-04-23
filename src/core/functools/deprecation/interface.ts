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
	 * Name of an alternative function/method/etc.
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
	 * Name of an expression to wrap
	 */
	name?: string;

	/**
	 * Type of expression to wrap
	 */
	type?: DeprecatedExprType;

	/**
	 * Indicates that a function/method/etc. was renamed, but its interface still actual,
	 * the value contains a name after renaming
	 */
	renamedTo?: string;

	/**
	 * Indicates that a function/method/etc. was moved to a different file, but its interface still actual,
	 * the value contains a source path after moving
	 */
	movedTo?: string;

	/**
	 * Name of a function/method/etc. that should prefer to use instead of the current
	 * or an object with additional options of the alternative
	 */
	alternative?: DeprecatedAlternative;

	/**
	 * Additional notice about deprecation
	 */
	notice?: string;
}

export interface InlineDeprecatedOptions extends DeprecatedOptions {
	/** @see [[DeprecatedOptions.name]] */
	name: string;

	/** @see [[DeprecatedOptions.type]] */
	type: DeprecatedExprType;
}
