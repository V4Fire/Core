/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { EmitLikeEvents, AsyncOptions } from 'core/async/events';
import type { DataProviderMethodsToReplace } from 'core/async/interface';

export const emitLikeEvents: EmitLikeEvents[] = [
	'emit',
	'fire',
	'dispatch',
	'dispatchEvent'
];

export const dataProviderMethodsToReplace: DataProviderMethodsToReplace[] = [
	'get',
	'peek',
	'post',
	'add',
	'update',
	'delete'
];

export const asyncOptionsKeys: Array<keyof AsyncOptions> = ['group', 'label', 'join'];
