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

import { deprecate } from 'core/meta/deprecation';
import * as meta from 'core/meta';

/**
 * @deprecated
 * @see core/meta
 * @decorator
 */
export const once = deprecate(
	{
		movedTo: 'core/meta'
	},

	function once(target: Object, key: string | symbol, descriptor: PropertyDescriptor): void {
		return meta.once(target, key, descriptor);
	}
);

/**
 * @deprecated
 * @see core/meta
 * @decorator
 */
export const debounce = deprecate(
	{
		movedTo: 'core/meta'
	},

	function debounce(delay?: number): MethodDecorator {
		return meta.debounce(delay);
	}
);

/**
 * @deprecated
 * @see core/meta
 * @decorator
 */
export const throttle = deprecate(
	{
		movedTo: 'core/meta'
	},

	function throttle(delay?: number): MethodDecorator {
		return meta.throttle(delay);
	}
);
