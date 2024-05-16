/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import { EventEmitter2 as EventEmitter } from 'eventemitter2';
import type { Locale, RegionStore } from '../../../core/prelude/i18n/interface';
/**
 * The event emitter to broadcast localization events
 */
export declare const emitter: EventEmitter;
/**
 * @deprecated
 * @see [[emitter]]
 */
export declare const event: EventEmitter;
/**
 * The default application language
 */
export declare const locale: Locale;
/**
 * The default application region
 */
export declare const region: RegionStore;
/**
 * A dictionary to map literal pluralization forms to numbers
 */
export declare const pluralizeMap: Pick<{
    none: number;
    one: number;
    some: number;
    many: number;
}, "some" | "none" | "one" | "many">;
