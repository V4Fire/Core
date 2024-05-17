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
import type { Socket } from '../../core/socket/interface';
export * from '../../core/socket/const';
export * from '../../core/socket/interface';
/**
 * Wrapper for a socket library
 * @param [namespace] - connection namespace
 */
export default function socket(namespace?: string): CanUndef<Socket>;
