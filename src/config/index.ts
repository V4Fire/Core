/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:config/README.md]]
 * @packageDocumentation
 */

import { RequestErrorDetailsExtractor } from 'core/request/error';
import type { Config } from 'config/interface';

export * from 'config/interface';

const config = <Config>{
	appName: typeof APP_NAME !== 'undefined' ? APP_NAME : undefined,
	locale: typeof LOCALE !== 'undefined' ? LOCALE : undefined,
	api: typeof API_URL !== 'undefined' ? API_URL : undefined,

	online: {
		checkURL: '',
		checkInterval: (5).seconds(),
		cacheTTL: 0.3.second(),
		checkTimeout: (2).seconds(),
		retryCount: 3,
		persistence: true,
		lastDateSyncInterval: (1).minute()
	},

	log: {
		pipelines: [
			{
				middlewares: [
					'errorsDeduplicator',
					'configurable',
					['extractor', [new RequestErrorDetailsExtractor()]]
				],

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
	},

	perf: {
		timer: {
			engine: 'console'
		}
	}
};

/**
 * Extends the config object with additional objects
 * @param objects
 */
export function extend<T extends Config>(...objects: Array<CanUndef<Dictionary>>): T {
	return Object.mixin({
		deep: true,
		skipUndefs: false,
		concatArrays: (a: unknown[], b: unknown[]) => a.union(b)
	}, config, ...objects);
}

export default config;
