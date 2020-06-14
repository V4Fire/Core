/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import SyncPromise from 'core/prelude/structures/sync-promise';

export { default as SyncPromise } from 'core/prelude/structures/sync-promise';

export class Option<T = unknown> extends SyncPromise<T> implements Maybe<T> {
	readonly type: Maybe['type'] = 'Maybe';
}

export class Result<T = unknown> extends SyncPromise<T> implements Either<T> {
	readonly type: Either['type'] = 'Either';
}
