/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type Async from '../../../../core/async';
import type { IdObject, ProxyCb, AsyncOptions, AsyncCbOptions } from '../../../../core/async/modules/base';
export declare type TimerId = number | IdObject;
export interface AsyncWaitOptions extends AsyncOptions {
    /**
     * Delay value in milliseconds
     */
    delay?: number;
}
export interface AsyncIdleOptions extends AsyncOptions {
    /**
     * Timeout value for the native requestIdleCallback function
     */
    timeout?: number;
}
export interface AsyncRequestIdleCallbackOptions<CTX extends object = Async> extends AsyncCbOptions<CTX> {
    /**
     * Timeout value for the native requestIdleCallback function
     */
    timeout?: number;
}
export declare type IdleCb<R = unknown, CTX extends object = Async> = ProxyCb<IdleDeadline, R, CTX>;
