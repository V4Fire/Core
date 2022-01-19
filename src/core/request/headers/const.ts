/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export const
	requestQuery = Symbol('Request query object');

export const
	NativeHeaders = Object.cast<typeof Headers>(typeof Headers === 'function' ? Headers : Function);
