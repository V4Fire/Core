/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
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
export declare function provider(namespace: string): (target: Function) => void;
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
export declare function provider(provider: Function): void;
