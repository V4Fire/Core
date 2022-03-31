/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export interface NetStatus {
	/**
	 * If true, then a host has the Internet connection
	 */
	status: boolean;

	/**
	 * Date of the last online session
	 */
	lastOnline?: Date;
}

export type NetState = {
	[K in keyof NetStatus]?: Nullable<NetStatus[K]>;
};

export interface OnlineCheckConfig {
	/**
	 * URL to check the online connection
	 * (with the "browser.request" engine can be used only image URL-s)
	 */
	checkURL?: CanUndef<string>;

	/**
	 * How often need to check the online connection (ms)
	 */
	checkInterval?: number;

	/**
	 * Timeout of a connection checking request
	 */
	checkTimeout?: number;

	/**
	 * The maximum number of retries to check the online connection
	 */
	retryCount?: number;

	/**
	 * How often to update the last online connection time
	 */
	lastDateSyncInterval?: number;

	/**
	 * True, if we need to save a time of the last online connection in the local cache
	 */
	persistence?: boolean;

	/**
	 * How long to store a checking result in the local cache
	 */
	cacheTTL?: number;
}

export interface NetEngine {
	isOnline(): CanPromise<Nullable<boolean>>;
}
