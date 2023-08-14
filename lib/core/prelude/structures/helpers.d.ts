/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import SyncPromise from '../../../core/prelude/structures/sync-promise';
export declare class Option<T = unknown> extends SyncPromise<T> implements Maybe<T> {
    readonly type: Maybe['type'];
}
export declare class Result<T = unknown> extends SyncPromise<T> implements Either<T> {
    readonly type: Either['type'];
}
