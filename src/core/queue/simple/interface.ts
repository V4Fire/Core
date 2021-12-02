/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { InnerQueue as SuperInnerQueue } from '@src/core/queue/interface';

export * from '@src/core/queue/interface';

export interface InnerQueue<T = unknown> extends SuperInnerQueue<T> {
	[i: number]: T;
}
