/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { LogConfig } from 'core/log';

export interface Config {
	appName?: CanUndef<string>;
	api?: CanUndef<string>;
	locale: string;
	log: LogConfig;
	online: {
		checkURL?: CanUndef<string>;
		checkInterval?: number;
		checkTimeout?: number;
		cacheTTL?: number;
		lastDateSyncInterval?: number;
		retryCount?: number;
		persistence?: boolean;
	}
}

const config: Config = {
	/**
	 * Default system language
	 */
	locale: LOCALE,

	/**
	 * Base API URL
	 */
	api: API_URL,

	/**
	 * Base app name
	 */
	appName: APP_NAME,

	/**
	 * Online daemon options
	 */
	online: {
		/**
		 * Online check url
		 */
		checkURL: '',

		/**
		 * Online check interval
		 */
		checkInterval: (5).seconds(),

		/**
		 * Timeout for online check
		 */
		checkTimeout: (2).seconds(),

		/**
		 * TTL for an online cache response
		 */
		cacheTTL: 0.3.second(),

		/**
		 * Allowed count of online status checking errors
		 */
		retryCount: 3,

		/**
		 * Last online date sync interval
		 */
		lastDateSyncInterval: (1).minute(),

		/**
		 * If true, then results of checks will be saved to a local storage
		 */
		persistence: true
	},

	/**
	 * Log preferences
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
 * Extends the config object
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
