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
