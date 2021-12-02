/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { Tasks as SuperTasks } from '~/core/queue/interface';

export * from '~/core/queue/interface';

export interface Tasks<T> extends SuperTasks<T> {
	[i: number]: T;
}
