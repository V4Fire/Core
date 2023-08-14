/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
/**
 * Decorator for `Function.prototype.debounce`
 *
 * @decorator
 * @see [[Function.debounce]]
 * @param [delay] - delay value (in milliseconds)
 */
export declare function debounce(delay?: number): MethodDecorator;
/**
 * Decorator for `Function.prototype.throttle`
 *
 * @decorator
 * @see [[Function.throttle]]
 * @param [delay] - delay value (in milliseconds)
 */
export declare function throttle(delay?: number): MethodDecorator;
