/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
/**
 * [[include:core/decorators/README.md]]
 * @packageDocumentation
 */
import * as tools from '../../core/functools';
/**
 * @deprecated
 * @see core/functools
 * @decorator
 */
export declare const once: tools.WarnedFn<[target: object, key: string | symbol, descriptor: PropertyDescriptor], void>;
/**
 * @deprecated
 * @see core/functools
 * @decorator
 */
export declare const debounce: tools.WarnedFn<[delay?: number | undefined], MethodDecorator>;
/**
 * @deprecated
 * @see core/functools
 * @decorator
 */
export declare const throttle: tools.WarnedFn<[delay?: number | undefined], MethodDecorator>;
