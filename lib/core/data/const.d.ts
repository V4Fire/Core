/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import { EventEmitter2 as EventEmitter } from 'eventemitter2';
import type { Socket } from '../../core/socket';
import type { RequestResponseObject } from '../../core/request';
import type { Provider, ProviderConstructor } from '../../core/data/interface';
export declare const namespace: unique symbol, providers: Dictionary<ProviderConstructor>;
/**
 * Global event emitter to broadcast provider events
 */
export declare const emitter: EventEmitter;
export declare const instanceCache: Dictionary<Provider>, requestCache: Dictionary<Dictionary<RequestResponseObject>>, connectCache: Dictionary<Promise<Socket>>;
export declare const queryMethods: Pick<{
    GET: boolean;
    HEAD: boolean;
}, "GET" | "HEAD">;
export declare const methodProperties: string[];
export declare const urlProperties: string[];
