/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { Config } from 'config/interface';
export * from 'config/interface';

const config: Config = {
	/**
	 * The base application name
	 */
	appName: APP_NAME,

	/**
	 * Default system language
	 * (used for internalizing)
	 */
	locale: LOCALE,

	/**
	 * Base API URL: the main domain of a service
	 */
	api: API_URL,

	/**
	 * Options for the online checking module
	 */
	online: {
		/**
		 * The URL which is used for online checking
		 */
		checkURL: '',

		/**
		 * A value in milliseconds after which the online check will be repeated
		 */
		checkInterval: (5).seconds(),

		/**
		 * A value that represents how long the last cache check is relevant
		 * (in milliseconds)
		 */
		cacheTTL: 0.3.second(),

		/**
		 * A timeout value for the single online check
		 * (in milliseconds)
		 */
		checkTimeout: (2).seconds(),

		/**
		 * The number of acceptable retries (if the check was canceled by a timeout)
		 */
		retryCount: 3,

		/**
		 * If true, then the checking results will be periodically saved to a storage.
		 * It can be helpful for realizing how long an application lives without connection.
		 */
		persistence: true,

		/**
		 * A value in milliseconds after which there will be a synchronization of the last online date to the current date
		 */
		lastDateSyncInterval: (1).minute()
	},

	/**
	 * Options for the logging module
	 */
	log: {
		pipelines: [{
				middlewares: ['configurable'],
				engine: 'console',
				engineOptions: {
					default: {
						fontSize: '13px',
						padding: '3px',
						marginBottom: '3px'
					},

					warn: {
						backgroundColor: '#FFCE00',
						color: '#FFF'
					},

					error: {
						backgroundColor: '#FF3B5B',
						color: '#FFF'
					}
				}
			}
		]
	}
};

/**
 * Extends the config object with additional parameters
 * @param args
 */
export function extend<T extends Config>(...args: CanUndef<Dictionary>[]): T {
	return Object.mixin({
		deep: true,
		concatArray: true,
		concatFn: (a: unknown[], b: unknown[]) => a.union(b),
		withUndef: true
	}, config, ...args);
}

export default config;
