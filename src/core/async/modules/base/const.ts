/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { Namespaces } from 'core/async/interface';

export const
	asyncCounter = Symbol('Async counter id');

export const
	namespaces = Object.convertEnumToDict(Namespaces),

	/** @deprecated */
	linkNamesDictionary = namespaces;

export type NamespacesDictionary = typeof namespaces;

export const
	isZombieGroup = /:zombie\b/;

export const
	isPromisifyNamespace = /Promise$/,

	/** @deprecated */
	isPromisifyLinkName = isPromisifyNamespace;
