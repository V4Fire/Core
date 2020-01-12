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
	 * Base API URL: the main domain of a service
	 */
	api?: CanUndef<string>;

	/**
	 * Options for the logging module
	 */
	log: LogConfig;

	/**
	 * Options for the online checking module
	 */
	online: {
		/**
		 * URL which is used for online checking
		 */
		checkURL?: CanUndef<string>;

		/**
		 * Value in milliseconds after which the online check will be repeated
		 */
		checkInterval?: number;

		/**
		 * Value that represents how long last cache check is relevant
		 * (in milliseconds)
		 */
		checkTimeout?: number;

		/**
		 * Timeout value for the single online check
		 * (in milliseconds)
		 */
		cacheTTL?: number;

		/**
		 * Number of acceptable retries (if the check was canceled by a timeout)
		 */
		lastDateSyncInterval?: number;

		/**
		 * If true, then the checking results will be periodically saved to a storage.
		 * It can be helpful for realizing how long an application lives without connection.
		 */
		retryCount?: number;

		/**
		 * Value in milliseconds after which there will be a synchronization of last online date to the current date
		 */
		persistence?: boolean;
	}
}
