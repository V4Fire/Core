/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { WarnOptions, InlineWarnOptions, WarnedFn } from '../../../core/functools/warning/interface';
export * from '../../../core/functools/warning/interface';
/**
 * Marks a function with the specified warning
 *
 * @param opts - additional options
 * @param fn - function to wrap
 */
export declare function warn<T extends Function>(opts: WarnOptions, fn: T): T extends ((...args: infer A) => infer R) ? WarnedFn<A, R> : T;
/**
 * Emits a  warning with the specified parameters
 * @param opts - additional options
 */
export declare function warn(opts: InlineWarnOptions): void;
/**
 * Marks a function as non-recommended to use
 * @param fn - function to wrap
 */
export declare function warn<T extends Function>(fn: T): T extends ((...args: infer A) => infer R) ? WarnedFn<A, R> : T;
/**
 * Decorator for `warn`
 *
 * @decorator
 * @see [[warn]]
 *
 * @example
 * ```js
 * class Foo {
 *   @warned()
 *   bar() {
 *
 *   }
 * }
 * ```
 */
export declare function warned(target: object, key: string | symbol, descriptor: PropertyDescriptor): void;
/**
 * Decorator for `warn`.
 * This overload adds a feature to provide additional options.
 *
 * @see [[warn]]
 * @param [opts] - additional options
 *
 * @example
 * ```js
 * class Foo {
 *   @warned({alternative: 'baz'}})
 *   bar() {
 *
 *   }
 * }
 * ```
 */
export declare function warned(opts?: WarnOptions): Function;
