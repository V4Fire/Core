/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import { ExtraProviderConstructor } from '../../../../core/data';
import type { RequestEngine } from '../../../../core/request/interface';
import type { MethodsMapping } from '../../../../core/request/engines/provider/interface';
export * from '../../../../core/request/engines/composition';
export * from '../../../../core/request/engines/provider/const';
export * from '../../../../core/request/engines/provider/interface';
/**
 * Creates a request engine from the specified data provider
 *
 * @param src - provider constructor, an instance, or the global name
 * @param [methodsMapping] - how to map original provider methods on engine methods
 *   (by default will be used the scheme from the provider options)
 *
 * @example
 * ```js
 * createProviderEngine('MegaSourceOfAllData', {
 *   // Map an HTTP method on the provider method
 *   PUT: 'put',
 *
 *   // Map a method of the "outer" data provider on the source provider method
 *   put: 'post'
 * })
 * ```
 */
export default function createProviderEngine(src: ExtraProviderConstructor, methodsMapping?: MethodsMapping): RequestEngine;
