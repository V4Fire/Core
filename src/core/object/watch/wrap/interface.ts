/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { WatchOptions, WatchHandlersMap } from 'core/object/watch/interface';

export interface WrapOptions {
	/**
	 * Link a top property of watching
	 */
	top?: object;

	/**
	 * Base path to object properties:
	 * it is provided to a watch handler with parameters
	 */
	path?: unknown[];

	/**
	 * True if an object that is wrapped is the root of watching
	 * @default `false`
	 */
	isRoot?: boolean;

	/**
	 * True if the property to watch is taken from a prototype
	 * @default `false`
	 */
	fromProto?: boolean;

	/**
	 * Watch options
	 */
	watchOpts?: WatchOptions;
}

export interface WrapParams extends WrapOptions {
	original: Function;
	handlers: WatchHandlersMap;
}
