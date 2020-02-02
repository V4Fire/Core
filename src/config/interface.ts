/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { LogConfig } from 'core/log';
import { OnlineCheckConfig } from 'core/net/interface';

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
	online: OnlineCheckConfig
}
