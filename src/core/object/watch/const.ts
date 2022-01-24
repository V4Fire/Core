/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { PROXY } from 'core/prelude/types/const';

export const
	toProxyObject = Symbol('Link to a proxy object'),
	toRootObject = Symbol('Link to the root object of watching'),
	toTopObject = Symbol('Link to the top object of watching'),
	toOriginalObject = PROXY;

export const
	muteLabel = Symbol('Watcher mute label'),
	watchPath = Symbol('Watch path'),
	watchOptions = Symbol('Watch options'),
	watchHandlers = Symbol('Watch handlers'),
	blackList = Symbol('Black list to watch');
