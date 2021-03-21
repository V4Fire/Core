/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Options for configurable middleware
 */
export interface Options {
	/**
	 * List of regexp that filter log events by their context
	 */
	patterns: RegExp[];
}

/**
 * Options for configurable middleware that could be used for storing
 */
export interface PersistentOptions {
	/**
	 * List of regexp that filter log events by their context
	 */
	patterns: string[];
}
