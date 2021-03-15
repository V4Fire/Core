/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { AsyncOptions } from 'core/async/modules/events';

import type { EmitLikeEvents, MethodsToReplace } from 'core/async/modules/wrappers/types';

export const emitLikeEvents: EmitLikeEvents[] = [
	'emit',
	'fire',
	'dispatch',
	'dispatchEvent'
];

export const methodsToReplace: MethodsToReplace[] = ['get', 'peek', 'post', 'add', 'upd', 'del'];

export const asyncParamsKeys: Array<keyof AsyncOptions> = ['group', 'label', 'join'];
