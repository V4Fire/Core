/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type V4Headers from 'core/request/headers';

export interface HeadersForEachCb {
	(value: string, key: string, parent: V4Headers): any;
}

export type RawHeaders =
	V4Headers |
	Headers |
	string |
	Dictionary<CanArray<unknown>>;
