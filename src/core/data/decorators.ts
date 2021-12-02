/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type Provider from '~/core/data/index';
import { providers, namespace } from '~/core/data/const';

/**
 * Registers a data provider class to the global store with the specified namespace:
 * the namespace value is concatenated with a name of the provider class
 *
 * @decorator
 * @param namespace - namespace string
 *
 * @example
 * ```js
 * // The provider is registered as 'user.List'
 * @provider('user')
 * class List extends Provider {}
 * ```
 */
export function provider(namespace: string): (target: Function) => void;

/**
 * Registers a data provider class to the global store by a name of the provider class
 *
 * @decorator
 * @param provider - provider class
 *
 * @example
 * ```js
 * // The provider is registered as 'List'
 * @provider
 * class List extends Provider {}
 * ```
 */
export function provider(provider: Function): void;
export function provider(nmsOrFn: Function | string): CanVoid<Function> {
	if (Object.isString(nmsOrFn)) {
		return (target) => {
			const
				nms = `${nmsOrFn}.${target.name}`;

			target[namespace] = nms;
			providers[nms] = target;
		};
	}

	nmsOrFn[namespace] = nmsOrFn.name;
	providers[nmsOrFn.name] = <typeof Provider>nmsOrFn;
}
