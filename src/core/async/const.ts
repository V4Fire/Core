/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { Namespaces } from 'core/async/interface';

export { Namespaces };

export const
	namespaces = Object.convertEnumToDict(Namespaces),

	/** @deprecated */
	linkNamesDictionary = namespaces;

export type NamespacesDictionary = typeof namespaces;

export const usedNamespaces = Object.values(Namespaces).filter((val) => Object.isNumber(val)).map(() => false);
