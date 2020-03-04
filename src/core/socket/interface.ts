/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { EventEmitterLike, WorkerLike } from 'core/async';

export type Socket = WorkerLike & EventEmitterLike;
