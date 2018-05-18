/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export default {
	/**
	 * Default system language
	 */
	lang: 'en',

	/**
	 * Base API URL
	 */
	api: undefined,

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
	 * Last online date sync interval
	 */
	onlineLastDateSyncInterval: (1).minute()
};
