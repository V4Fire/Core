/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { Namespaces } from '@src/core/async/interface';

export const
	namespaces = Object.convertEnumToDict(Namespaces),

	/** @deprecated */
	linkNamesDictionary = namespaces;

export type NamespacesDictionary = typeof namespaces;
