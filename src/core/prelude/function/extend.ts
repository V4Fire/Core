/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

/** @see [[Function.addToPrototype]] */
extend(Function.prototype, 'addToPrototype', function addToPrototype(
	this: AnyFunction,
	methods: Dictionary<Function>
): AnyFunction {
	Object.assign(this.prototype, methods);
	return this;
});
