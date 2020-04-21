/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import SyncPromise from 'core/prelude/structures/sync-promise';
export { default as SyncPromise } from 'core/prelude/structures/sync-promise';

export class Result<T = unknown> extends SyncPromise<T> implements Either<T> {

}
