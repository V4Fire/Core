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
	name: string;
	source?: string;
}

export type DeprecatedAlternative = string | DeprecatedAlternativeOptions;

export interface DeprecatedOptions {
	name?: string;
	type?: DeprecatedExprType;
	alternative?: DeprecatedAlternative;
	renamedTo?: string;
	movedTo?: string;
	notice?: string;
}

export interface InlineDeprecatedOptions extends DeprecatedOptions {
	name: string;
	type: DeprecatedExprType;
}
