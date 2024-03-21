/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { AddEmitter } from '../../../../../core/cache/decorators/helpers/add-emitter/interface';
export * from '../../../../../core/cache/decorators/helpers/add-emitter/const';
export * from '../../../../../core/cache/decorators/helpers/add-emitter/interface';
export declare const $$: StrictDictionary<symbol>;
/**
 * Adds an event emitter to the provided cache object and wraps all mutation events to emit events, i.e.,
 * it mutates the original object. The function returns an object with the original unwrapped methods and
 * a method to subscribe to these events.
 *
 * @param cache
 */
declare const addEmitter: AddEmitter;
export default addEmitter;
