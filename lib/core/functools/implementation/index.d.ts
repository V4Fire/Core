/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
/**
 * [[include:core/functools/implementation/README.md]]
 * @packageDocumentation
 */
import { WarnOptions, InlineWarnOptions, WarnedFn } from '../../../core/functools/warning';
export * from '../../../core/functools/warning/interface';
/**
 * Marks the specified function as unimplemented
 *
 * @param opts - additional options
 * @param fn - function to wrap
 */
export declare function unimplement<T extends Function>(opts: WarnOptions, fn: T): T extends ((...args: infer A) => any) ? WarnedFn<A, void> : T;
/**
 * Emits an "unimplemented" warning with the specified parameters
 * @param opts - additional options
 */
export declare function unimplement(opts: InlineWarnOptions): void;
/**
 * Marks the specified function as unimplemented
 * @param fn - function to wrap
 */
export declare function unimplement<T extends Function>(fn: T): T extends ((...args: infer A) => any) ? WarnedFn<A, void> : T;
/**
 * Decorator for `unimplement`
 *
 * @decorator
 * @see [[unimplement]]
 *
 * @example
 * ```js
 * class Foo {
 *   @unimplemented()
 *   bar() {
 *
 *   }
 * }
 * ```
 */
export declare function unimplemented(target: object, key: string | symbol, descriptor: PropertyDescriptor): void;
/**
 * Decorator for `unimplement`.
 * This overload adds a feature to provide additional options.
 *
 * @see [[unimplement]]
 * @param [opts] - additional options
 *
 * @example
 * ```js
 * class Foo {
 *   @unimplemented({alternative: 'baz'}})
 *   bar() {
 *
 *   }
 * }
 * ```
 */
export declare function unimplemented(opts?: WarnOptions): Function;
