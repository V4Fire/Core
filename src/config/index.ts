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

import symbolGenerator from '@src/core/symbol';

import { RequestErrorDetailsExtractor } from '@src/core/request/error';
import type { Config } from '@src/config/interface';

export * from '@src/config/interface';

export const
	$$ = symbolGenerator();

const config = <Config>{
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

	set locale(value: CanUndef<string>) {
		this[$$.locale] = value;
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
		withDescriptors: true,
		concatArrays: (a: unknown[], b: unknown[]) => a.union(b)
	}, config, ...objects);
}

export default config;
