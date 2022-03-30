/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { LogConfig } from 'core/log';
import type { OnlineCheckConfig } from 'core/net';
import type { PerfConfig } from 'core/perf/config';

export interface Config {
	/**
	 * Base application name
	 */
	appName: CanUndef<string>;

	/**
	 * Default system locale
	 * (used for internalizing)
	 */
	locale: CanUndef<string>;

	/**
	 * Base API URL: primary service domain
	 */
	api: CanUndef<string>;

	/**
	 * Options for "core/log" module
	 */
	log: LogConfig;

	/**
	 * Options for "core/perf" module
	 */
	perf: PerfConfig;

	/**
	 * Options for a module that checks online connection
	 */
	online: OnlineCheckConfig;
}
