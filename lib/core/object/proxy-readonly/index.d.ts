/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
/**
 * Returns a read-only view of the specified object.
 * If the runtime supports Proxy, it will be used to create a view.
 *
 * @param obj
 */
export declare function readonly<T>(obj: T): T;
/**
 * Returns a read-only view of the specified object.
 * The function uses a Proxy object to create a view.
 *
 * @param obj
 */
export default function proxyReadonly<T>(obj: T): Readonly<T>;
