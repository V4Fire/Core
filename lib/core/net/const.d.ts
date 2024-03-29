/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import { EventEmitter2 as EventEmitter } from 'eventemitter2';
import type { NetState } from '../../core/net/interface';
/**
 * Event emitter to broadcast network events
 */
export declare const emitter: EventEmitter;
/**
 * @deprecated
 * @see [[emitter]]
 */
export declare const event: EventEmitter;
export declare const state: NetState;
