/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
/**
 * Returns a clone of the specified object.
 * If the runtime supports Proxy, it will be used to clone.
 *
 * @param obj
 */
export declare function clone<T>(obj: T): T;
/**
 * Returns a clone of the specified object.
 * The function uses a Proxy object to create a clone. The process of cloning is a lazy operation.
 *
 * @param obj
 */
export default function proxyClone<T>(obj: T): T;
