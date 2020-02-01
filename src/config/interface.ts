/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { LogConfig } from 'core/log';

export interface Config {
	/**
	 * Base application name
	 */
	appName?: CanUndef<string>;

	/**
	 * Default system language
	 * (used for internalizing)
	 */
	locale: string;

	/**
	 * Base API URL: primary service domain
	 */
	api?: CanUndef<string>;

	/**
	 * Options for "core/log" module
	 */
	log: LogConfig;

	/**
	 * Options for a module that checks online connection
	 */
	online: {
		/**
		 * URL that is used to check online connection
		 */
		checkURL?: CanUndef<string>;

		/**
		 * Value in milliseconds after which the online connection will be checked again
		 */
		checkInterval?: number;

		/**
		 * Value in milliseconds that represents how long last cache check is relevant
		 */
		checkTimeout?: number;

		/**
		 * Value in milliseconds after which there will be a synchronization of last online date to the current date
		 */
		lastDateSyncInterval?: number;

		/**
		 * Number of acceptable retries (if the check was canceled by timeout)
		 */
		retryCount?: number;

		/**
		 * Timeout value in milliseconds for one online check
		 */
		cacheTTL?: number;

		/**
		 * If true, then a check result will be periodically saved to a storage.
		 * It can be helpful to realize how long an application lives without connection.
		 */
		persistence?: boolean;
	}
}
