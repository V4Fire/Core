/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/socket/README.md]]
 */

import type { Socket } from 'core/socket/interface';

export * from 'core/socket/const';
export * from 'core/socket/interface';

/**
 * Wrapper for a socket library
 * @param [_namespace] - connection namespace
 */
export default function socket(_namespace: string = ''): CanUndef<Socket> {
	return undefined;
}
