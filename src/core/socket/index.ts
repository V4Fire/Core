/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/socket/README.md]]
 * @packageDocumentation
 */

import type { Socket } from '@src/core/socket/interface';

export * from '@src/core/socket/const';
export * from '@src/core/socket/interface';

/**
 * Wrapper for a socket library
 * @param [namespace] - connection namespace
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
export default function socket(namespace: string = ''): CanUndef<Socket> {
	return undefined;
}
