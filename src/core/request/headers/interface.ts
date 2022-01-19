/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type Headers from 'core/request/headers';
import type { NativeHeaders } from 'core/request/headers/const';

export interface HeadersForEachCb {
	(value: string, key: string, parent: Headers): any;
}

export type RawHeaders =
	Headers |
	typeof NativeHeaders |
	Dictionary<CanArray<string>>;
