/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { JsonToken, JsonTokenValue } from 'core/json/stream/interface';

export type FilterStack = Array<Nullable<JsonTokenValue>>;

export interface FilterOptions {
	/**
	 * If true the filtration will return all matched filter results, otherwise only the first match will be returned
	 */
	multiple?: boolean;
}

export interface TokenProcessor {
	(token: JsonToken): Generator<JsonToken>;
}

export interface TokenFilter {
	(stack: FilterStack, token: JsonToken): boolean;
}
