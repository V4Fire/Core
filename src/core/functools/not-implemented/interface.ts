/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export type NotImplementedExprType =
	'function' |
	'method' |
	'accessor';

export interface NotImplementedAlternativeOptions {
	/**
	 * Name of an alternative function/method/etc.
	 */
	name: string;

	/**
	 * Source path of the alternative
	 */
	source?: string;
}

export type NotImplementedAlternative = string | NotImplementedAlternativeOptions;

export interface NotImplementedOptions {
	/**
	 * Name of an expression to wrap
	 */
	name?: string;

	/**
	 * Type of an expression to wrap
	 */
	type?: NotImplementedExprType;

	/**
	 * Name of an function/method/etc. that need to use instead of the current
	 * or an object with additional options of the alternative
	 */
	alternative?: NotImplementedAlternative;

	/**
	 * Additional information
	 */
	notice?: string;
}

export interface InlineNotImplementedOptions extends NotImplementedOptions {
	/** @see [[NotImplementedOptions.name]] */
	name: string;

	/** @see [[NotImplementedOptions.type]] */
	type: NotImplementedExprType;
}
