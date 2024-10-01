/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
export declare enum Namespaces {
    proxy = 0,
    promise = 1,
    iterable = 2,
    request = 3,
    idleCallback = 4,
    timeout = 5,
    interval = 6,
    immediate = 7,
    worker = 8,
    eventListener = 9,
    animationFrame = 10,
    proxyPromise = 11,
    timeoutPromise = 12,
    intervalPromise = 13,
    immediatePromise = 14,
    idleCallbackPromise = 15,
    animationFramePromise = 16,
    eventListenerPromise = 17,
    length = 18
}
export declare const enum PrimitiveNamespaces {
    proxy = 0,
    promise = 1,
    iterable = 2,
    request = 3,
    idleCallback = 4,
    timeout = 5,
    interval = 6,
    immediate = 7,
    worker = 8,
    eventListener = 9,
    animationFrame = 10,
    length = 11
}
export declare const enum PromiseNamespaces {
    first = 10,
    proxyPromise = 11,
    timeoutPromise = 12,
    intervalPromise = 13,
    immediatePromise = 14,
    idleCallbackPromise = 15,
    animationFramePromise = 16,
    eventListenerPromise = 17,
    length = 18
}
export declare const usedNamespaces: any[];
export declare const namespacesCache: any[];
