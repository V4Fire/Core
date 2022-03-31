/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { Token, TokenValue } from 'core/json/stream/parser';

export interface FilterToken extends Token {
	filterComplete?: boolean;
}

export interface FilterOptions {
	/**
	 * If true the filtration will return all matched filter results, otherwise only the first match will be returned
	 */
	multiple?: boolean;
}

export type FilterStack = Array<
	Nullable<TokenValue>
>;

export interface TokenFilterFn {
	(stack: FilterStack, token: FilterToken): boolean;
}

export type TokenFilter = string | RegExp | TokenFilterFn;
