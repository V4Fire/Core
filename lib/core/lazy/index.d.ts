/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
/**
 * [[include:core/lazy/README.md]]
 * @packageDocumentation
 */
import type { ObjectScheme, Hooks } from '../../core/lazy/interface';
/**
 * Creates a new function based on the passed function or class and returns it.
 * The new function accumulates all method and properties actions into a queue.
 * The queue will drain after invoking the created function.
 *
 * @param constructor
 * @param [scheme] - additional scheme of the structure to create
 * @param [hooks] - dictionary of hook handlers
 */
export default function makeLazy<T extends ClassConstructor | AnyFunction>(constructor: T, scheme?: ObjectScheme, hooks?: Hooks<T extends ClassConstructor ? InstanceType<T> : T extends (...args: infer A) => infer R ? R : object>): T extends ClassConstructor ? T & InstanceType<T> : T extends (...args: infer A) => infer R ? {
    (...args: A): R;
    new (...args: A): R;
} & R : never;
