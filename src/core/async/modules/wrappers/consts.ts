/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { AsyncOptions } from 'core/async/modules/events';

import type { EmitLikeEvents, DataProviderMethodsToReplace } from 'core/async/modules/wrappers/interface';

export const emitLikeEvents: EmitLikeEvents[] = [
	'emit',
	'fire',
	'dispatch',
	'dispatchEvent'
];

export const dataProviderMethodsToReplace: DataProviderMethodsToReplace[] = ['get', 'peek', 'post', 'add', 'upd', 'del'];

export const asyncOptionsKeys: Array<keyof AsyncOptions> = ['group', 'label', 'join'];
