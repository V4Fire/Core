/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { CompositionEngineOpts, CompositionRequestEngine, CompositionRequest } from '../../../../core/request/engines/composition/interface';
export * from '../../../../core/request/engines/composition/const';
export * from '../../../../core/request/engines/composition/interface';
/**
 * Creates a new composition engine to process composition requests.
 *
 * @param compositionRequests - An array of composition requests.
 * @param [engineOptions] - Optional settings for the composition engine.
 */
export declare function compositionEngine(compositionRequests: CompositionRequest[], engineOptions?: CompositionEngineOpts): CompositionRequestEngine;
