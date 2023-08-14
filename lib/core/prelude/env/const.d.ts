/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import { EventEmitter2 as EventEmitter } from 'eventemitter2';
/**
 * Event emitter to broadcast environment events
 */
export declare const emitter: EventEmitter;
/**
 * @deprecated
 * @see [[emitter]]
 */
export declare const event: EventEmitter;
/**
 * Link to the global object
 */
export declare const GLOBAL: any;
/**
 * True if the current runtime has window object
 */
export declare const HAS_WINDOW: boolean;
/**
 * True if the current runtime is looks like Node.js
 */
export declare const IS_NODE: boolean;
