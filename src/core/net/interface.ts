/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export interface NetEngine {
	isOnline(): CanPromise<Nullable<boolean>>;
}

export interface NetState {
	status?: Nullable<boolean>;
	lastOnline?: Nullable<Date>;
}

export interface NetStatus {
	/**
	 * If true, then a host has a connection to the internet
	 */
	status: boolean;

	/**
	 * Date of last online session
	 */
	lastOnline?: Date;
}

export interface OnlineCheckConfig {
	/**
	 * URL to check online connection
	 * (with the "browser.request" engine can be used only image URL-s)
	 */
	checkURL?: CanUndef<string>;

	/**
	 * How often need to check online connection (ms)
	 */
	checkInterval?: number;

	/**
	 * The timeout of downloading the check URL
	 */
	checkTimeout?: number;

	/**
	 * How often to update the time of the last online connection
	 */
	lastDateSyncInterval?: number;

	/**
	 * The number of retries of downloading the check URL
	 */
	retryCount?: number;

	/**
	 * How long to store the result of checking in the local cache
	 */
	cacheTTL?: number;

	/**
	 * True, if we need to save the time of the last online connection in a local storage
	 */
	persistence?: boolean;
}
