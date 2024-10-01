/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import Super from '../../../core/async/core/core';
import type { ClearOptions } from '../../../core/async/interface';
export default class Async<CTX extends object = Async<any>> extends Super<CTX> {
    /**
     * Clears all asynchronous tasks
     * @param [opts] - additional options for the operation
     */
    clearAll(opts?: ClearOptions): this;
    /**
     * Mutes all asynchronous tasks
     * @param [opts] - additional options for the operation
     */
    muteAll(opts?: ClearOptions): this;
    /**
     * Unmutes all asynchronous tasks
     * @param [opts] - additional options for the operation
     */
    unmuteAll(opts?: ClearOptions): this;
    /**
     * Suspends all asynchronous tasks
     * @param [opts] - additional options for the operation
     */
    suspendAll(opts?: ClearOptions): this;
    /**
     * Unsuspends all asynchronous tasks
     * @param [opts] - additional options for the operation
     */
    unsuspendAll(opts?: ClearOptions): this;
}
