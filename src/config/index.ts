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

import symbolGenerator from 'core/symbol';

import { RequestErrorDetailsExtractor } from 'core/request/error';
import type { Config } from 'config/interface';

export * from 'config/interface';

export const
	$$ = symbolGenerator();

const config: Config = {
	get appName() {
		if ($$.appName in this) {
			return this[$$.appName];
		}

		return typeof APP_NAME !== 'undefined' ? APP_NAME : undefined;
	},

	set appName(value: CanUndef<string>) {
		this[$$.appName] = value;
	},

	get locale() {
		if ($$.locale in this) {
			return this[$$.locale];
		}

		return typeof LOCALE !== 'undefined' ? LOCALE : undefined;
	},

	set locale(value: CanUndef<Language>) {
		this[$$.locale] = value;
	},

	get region() {
		if ($$.region in this) {
			return this[$$.region];
		}

		return typeof REGION !== 'undefined' ? REGION : undefined;
	},

	set region(value: CanUndef<Region>) {
		this[$$.region] = value;
	},

	get api() {
		if ($$.api in this) {
			return this[$$.api];
		}

		return typeof API_URL !== 'undefined' ? API_URL : undefined;
	},

	set api(value: CanUndef<string>) {
		this[$$.api] = value;
	},

	online: {
		checkURL: '',
		checkInterval: (30).seconds(),
		checkTimeout: (2).seconds(),
		retryCount: 3,
		lastDateSyncInterval: (1).minute(),
		persistence: true,
		cacheTTL: (1).second()
	},

	kvStorage: {
		nodePath: './tmp/local'
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
		withDescriptors: true,
		concatArrays: (a: unknown[], b: unknown[]) => a.union(b)
	}, config, ...objects);
}

export default config;
