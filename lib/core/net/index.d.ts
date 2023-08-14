/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { NetStatus, NetEngine } from '../../core/net/interface';
export * from '../../core/net/const';
export * from '../../core/net/interface';
/**
 * Returns information about the internet connection status
 *
 * @param [engine] - engine to test online connection
 *
 * @emits `online()`
 * @emits `offline(lastOnline: Date)`
 * @emits `status(value:` [[NetStatus]] `)`
 */
export declare function isOnline(engine?: NetEngine): Promise<NetStatus>;
/**
 * Synchronizes the online status with a local storage
 */
export declare function syncStatusWithStorage(): Promise<void>;
/**
 * Updates the online status
 */
export declare function updateStatus(): Promise<void>;
