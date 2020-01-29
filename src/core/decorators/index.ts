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

import { deprecate } from 'core/functools/deprecation';
import * as meta from 'core/functools';

/**
 * @deprecated
 * @see core/functools
 * @decorator
 */
export const once = deprecate(
	{
		movedTo: 'core/functools'
	},

	function once(target: Object, key: string | symbol, descriptor: PropertyDescriptor): void {
		return meta.once.apply(this, arguments);
	}
);

/**
 * @deprecated
 * @see core/functools
 * @decorator
 */
export const debounce = deprecate(
	{
		movedTo: 'core/functools'
	},

	function debounce(delay?: number): MethodDecorator {
		return meta.debounce.apply(this, arguments);
	}
);

/**
 * @deprecated
 * @see core/functools
 * @decorator
 */
export const throttle = deprecate(
	{
		movedTo: 'core/functools'
	},

	function throttle(delay?: number): MethodDecorator {
		return meta.throttle.apply(this, arguments);
	}
);
