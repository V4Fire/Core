/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import $C = require('collection.js');

export interface Config {
	lang: string;
	api?: string | undefined;
	appName?: string | undefined,
	onlineCheckURL?: string | undefined;
	onlineCheckInterval: number;
	onlineCheckTimeout: number;
	onlineCheckCacheTTL: number;
	onlineLastDateSyncInterval: number;
	onlineRetryCount: number;
	log: Dictionary;
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
	 * Online check url
	 */
	onlineCheckURL: 'https://www.google.com/favicon.ico',

	/**
	 * Online check interval
	 */
	onlineCheckInterval: (5).seconds(),

	/**
	 * Timeout for online check
	 */
	onlineCheckTimeout: (2).seconds(),

	/**
	 * TTL for an online cache response
	 */
	onlineCheckCacheTTL: 0.3.second(),

	/**
	 * Allowed count of online status checking errors
	 */
	onlineRetryCount: 3,

	/**
	 * Last online date sync interval
	 */
	onlineLastDateSyncInterval: (1).minute(),

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
	return <any>$C.extend({
		deep: true,
		concatArray: true,
		concatFn: (a: unknown[], b: unknown[]) => a.union(b),
		withUndef: true
	}, config, ...args);
}

export default config;
