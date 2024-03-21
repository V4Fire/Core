/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
/**
 * [[include:core/functools/deprecation/README.md]]
 * @packageDocumentation
 */
import { WarnOptions, InlineWarnOptions, WarnedFn } from '../../../core/functools/warning';
export * from '../../../core/functools/warning/interface';
/**
 * Marks the specified function as obsolescence
 *
 * @param opts - additional options
 * @param fn - function to wrap
 */
export declare function deprecate<T extends Function>(opts: WarnOptions, fn: T): T extends ((...args: infer A) => infer R) ? WarnedFn<A, R> : T;
/**
 * Emits an obsolescence warning with the specified parameters
 * @param opts - additional options
 */
export declare function deprecate(opts: InlineWarnOptions): void;
/**
 * Marks the specified function as obsolescence
 * @param fn - function to wrap
 */
export declare function deprecate<T extends Function>(fn: T): T extends ((...args: infer A) => infer R) ? WarnedFn<A, R> : T;
/**
 * Decorator for `deprecate`
 *
 * @decorator
 * @see [[deprecate]]
 */
export declare function deprecated(target: object, key: string | symbol, descriptor: PropertyDescriptor): void;
/**
 * Decorator for `deprecate`.
 * This overload adds a feature to provide additional options.
 *
 * @see [[deprecate]]
 * @param [opts] - additional options
 */
export declare function deprecated(opts?: WarnOptions): Function;
