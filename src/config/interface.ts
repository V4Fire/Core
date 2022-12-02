/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { LogConfig } from 'core/log';
import type { PerfConfig } from 'core/perf/config';
import type { OnlineCheckConfig } from 'core/net';
import type { Language } from 'lang';

export interface Config {
	/**
	 * Base application name
	 */
	appName: CanUndef<string>;

	/**
	 * Default system locale
	 * (used for internalizing)
	 */
	locale: CanUndef<Language>;

	/**
	 * Base API URL: primary service domain
	 */
	api: CanUndef<string>;

	/**
	 * Options for the "core/log" module
	 */
	log: LogConfig;

	/**
	 * Options for "core/perf" module
	 */
	perf: PerfConfig;

	/**
	 * Options for the "core/net" module
	 */
	online: OnlineCheckConfig;
}
