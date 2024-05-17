/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import { RequestEngine } from '../../../../../core/request';
import type { CompositionProvider } from '../../../../../core/request/engines/provider/composition/interface';
export * from '../../../../../core/request/engines/provider/composition/interface';
/**
 * Creates an engine that allows you to create a composition of requests
 * @param providers
 */
export declare function providerCompositionEngine(providers: CompositionProvider[]): RequestEngine;
