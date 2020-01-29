/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/meta/deprecation/README.md]]
 * @packageDocumentation
 */

import * as tools from 'core/functools/deprecation';
import { DeprecatedOptions, InlineDeprecatedOptions } from 'core/functools/deprecation/interface';
export * from 'core/functools/deprecation/interface';

/**
 * @deprecated
 * @see core/functools
 * @decorator
 */
export const deprecate = tools.deprecate(
	{
		movedTo: 'core/functools/deprecation'
	},

	function deprecate<T extends Function>(
		fnOrParams: DeprecatedOptions | InlineDeprecatedOptions | T,
		fn?: T
	): T | void {
		return tools.deprecate.apply(this, arguments);
	}
);

/**
 * @deprecated
 * @see core/functools
 * @decorator
 */
export const deprecated = tools.deprecate(
	{
		movedTo: 'core/functools/deprecation'
	},

	function deprecated(
		opts?: DeprecatedOptions | object,
		key?: string | symbol,
		descriptor?: PropertyDescriptor
	): Function | void {
		return tools.deprecated.apply(this, arguments);
	}
);
