/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { CompositionEngineOpts, CompositionRequestEngine, CompositionRequests } from '../../../../core/request/engines/composition/interface';
export * from '../../../../core/request/engines/composition/interface';
/**
 * Creates an engine that allows you to create a composition of requests
 *
 * @param requests
 * @param opts
 */
export declare function compositionEngine(requests: CompositionRequests[], opts?: CompositionEngineOpts): CompositionRequestEngine;
