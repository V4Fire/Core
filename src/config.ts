/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export interface Config {
	appName?: CanUndef<string>;
	api?: CanUndef<string>;
	lang: string;
	log: Dictionary;
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
	lang: LANG,

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
		checkURL: 'https://www.google.com/favicon.ico',

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
		styles: {
			default: {
				fontSize: '13px',
				padding: '3px',
				marginBottom: '3px'
			},

			success: {
				backgroundColor: '#27AE61',
				color: '#FFF'
			},

			warning: {
				backgroundColor: '#FFCE00',
				color: '#FFF'
			},

			error: {
				backgroundColor: '#FF3B5B',
				color: '#FFF'
			}
		}
	}
};

/**
 * Extends the config object
 * @param args
 */
export function extend<T extends Config>(...args: Dictionary[]): T {
	return <any>Object.mixin({
		deep: true,
		concatArray: true,
		concatFn: (a: unknown[], b: unknown[]) => a.union(b),
		withUndef: true
	}, config, ...args);
}

export default config;
