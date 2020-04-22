/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { WatchOptions, WatchHandlersSet } from 'core/object/watch/interface';

export interface WrapOptions {
	/**
	 * Link to the root object of watching
	 */
	root: object;

	/**
	 * Link to the top object of watching
	 * (the first level property of the root)
	 */
	top?: object;

	/**
	 * Base path to object properties
	 */
	path: unknown[];

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
	original: AnyFunction;
	handlers: WatchHandlersSet;
}
