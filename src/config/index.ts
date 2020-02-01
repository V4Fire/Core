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

import { Config } from 'config/interface';
export * from 'config/interface';

const config = <Config>{
	appName: APP_NAME,
	locale: LOCALE,
	api: API_URL,

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
 * Extends the config object with additional objects
 * @param objects
 */
export function extend<T extends Config>(...objects: CanUndef<Dictionary>[]): T {
	return Object.mixin({
		deep: true,
		concatArray: true,
		concatFn: (a: unknown[], b: unknown[]) => a.union(b),
		withUndef: true
	}, config, ...objects);
}

export default config;
